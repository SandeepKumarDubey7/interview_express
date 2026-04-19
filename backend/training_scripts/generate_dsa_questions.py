"""
Convert leetcode_dataset CSV into generatedDSAQuestions.ts

Parses each row to extract:
- id, title, description, difficulty
- category (first related topic)
- examples (parsed from description text)
- constraints (parsed from description text)
- starter code (auto-generated for js, python, java)
"""

import os
import re
import json
import pandas as pd

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "dsa question", "leetcode_dataset - lc.csv")
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "data", "generatedDSAQuestions.ts")


def make_id(title: str) -> str:
    """Convert title to kebab-case id."""
    return re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')


def make_fn_name(title: str) -> str:
    """Convert title to camelCase function name."""
    words = re.findall(r'[a-zA-Z0-9]+', title)
    if not words:
        return "solution"
    return words[0].lower() + ''.join(w.capitalize() for w in words[1:])


def parse_examples(desc: str) -> list[dict]:
    """Extract examples from LeetCode description text."""
    examples = []
    # Match "Example N:" blocks
    parts = re.split(r'Example\s+\d+\s*:', desc)
    for part in parts[1:]:  # skip text before first example
        inp_match = re.search(r'Input\s*:\s*(.+?)(?:Output|$)', part, re.DOTALL)
        out_match = re.search(r'Output\s*:\s*(.+?)(?:Explanation|Example|\n\n|Constraints|$)', part, re.DOTALL)
        exp_match = re.search(r'Explanation\s*:\s*(.+?)(?:Example|\n\n|Constraints|$)', part, re.DOTALL)

        if inp_match and out_match:
            ex = {
                "input": inp_match.group(1).strip()[:200],
                "output": out_match.group(1).strip()[:200],
            }
            if exp_match:
                ex["explanation"] = exp_match.group(1).strip()[:300]
            examples.append(ex)

    # If no examples parsed, create a placeholder
    if not examples:
        examples.append({"input": "See problem description", "output": "See problem description"})

    return examples[:3]  # Max 3 examples


def parse_constraints(desc: str) -> list[str]:
    """Extract constraints from description."""
    constraints = []
    # Look for "Constraints:" section
    match = re.search(r'Constraints?\s*:\s*\n(.+?)(?:\n\n|Follow[\s-]?up|$)', desc, re.DOTALL)
    if match:
        lines = match.group(1).strip().split('\n')
        for line in lines:
            line = line.strip().lstrip('- •*')
            if line and len(line) > 3:
                constraints.append(line[:150])
    return constraints[:5] if constraints else ["See problem description for constraints"]


def get_category(related_topics: str) -> str:
    """Get primary category from related_topics."""
    if not related_topics or pd.isna(related_topics):
        return "General"

    # Map common LeetCode tags to cleaner categories
    tag_map = {
        "Array": "Arrays & Hashing",
        "Hash Table": "Arrays & Hashing",
        "Two Pointers": "Two Pointers",
        "Sliding Window": "Sliding Window",
        "String": "String",
        "Linked List": "Linked List",
        "Stack": "Stack",
        "Queue": "Queue",
        "Binary Search": "Binary Search",
        "Tree": "Trees",
        "Binary Tree": "Trees",
        "Binary Search Tree": "Trees",
        "Depth-First Search": "Graph",
        "Breadth-First Search": "Graph",
        "Graph": "Graph",
        "Dynamic Programming": "Dynamic Programming",
        "Greedy": "Greedy",
        "Backtracking": "Backtracking",
        "Sorting": "Sorting",
        "Heap (Priority Queue)": "Heap",
        "Bit Manipulation": "Bit Manipulation",
        "Math": "Math",
        "Recursion": "Recursion",
        "Trie": "Trie",
        "Union Find": "Union Find",
        "Design": "Design",
        "Matrix": "Matrix",
        "Divide and Conquer": "Divide and Conquer",
    }

    topics = [t.strip() for t in related_topics.split(",")]
    for topic in topics:
        if topic in tag_map:
            return tag_map[topic]

    return topics[0] if topics else "General"


def generate_starter_code(title: str, fn_name: str) -> dict:
    return {
        "javascript": f"function {fn_name}() {{\n  // Write your code here\n}};",
        "python": f"def {fn_name}():\n    # Write your code here\n    pass",
        "java": f"class Solution {{\n    public void {fn_name}() {{\n        // Write your code here\n    }}\n}}",
    }


def escape_ts(s: str) -> str:
    """Escape string for TypeScript template literal or string."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def main():
    print(f"Reading CSV from: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH, encoding='utf-8')
    print(f"Total rows: {len(df)}")

    # Filter out premium questions and those with empty descriptions
    df = df[df['is_premium'] != True]
    df = df[df['description'].notna() & (df['description'].str.len() > 30)]
    print(f"After filtering: {len(df)} questions")

    questions = []
    seen_ids = set()

    for _, row in df.iterrows():
        title = str(row['title']).strip()
        qid = make_id(title)
        if qid in seen_ids:
            continue
        seen_ids.add(qid)

        desc = str(row['description']).strip()
        difficulty = str(row['difficulty']).strip()
        if difficulty not in ('Easy', 'Medium', 'Hard'):
            difficulty = 'Medium'

        category = get_category(row.get('related_topics', ''))
        fn_name = make_fn_name(title)
        examples = parse_examples(desc)
        constraints = parse_constraints(desc)
        starter_code = generate_starter_code(title, fn_name)

        # Clean description — remove examples and constraints section for display
        clean_desc = re.split(r'Example\s+1\s*:', desc)[0].strip()
        if len(clean_desc) < 20:
            clean_desc = desc[:500]
        # Limit description length 
        clean_desc = clean_desc[:600]

        url = str(row.get('url', '')).strip()
        acceptance = row.get('acceptance_rate', 0)
        companies = str(row.get('companies', '')).strip() if pd.notna(row.get('companies', '')) else ''
        faang = bool(row.get('asked_by_faang', False))
        lc_id = int(row['id']) if pd.notna(row['id']) else 0

        questions.append({
            "id": qid,
            "lc_id": lc_id,
            "title": title,
            "difficulty": difficulty,
            "category": category,
            "description": clean_desc,
            "examples": examples,
            "constraints": constraints,
            "starterCode": starter_code,
            "url": url,
            "acceptance": float(acceptance) if pd.notna(acceptance) else 0,
            "companies": companies,
            "faang": faang,
        })

    print(f"Generated {len(questions)} questions")

    # Build the TS file
    ts_lines = []
    ts_lines.append("import { DSAQuestion } from './dsaQuestions';")
    ts_lines.append("")
    ts_lines.append("// Auto-generated from leetcode_dataset - lc.csv")
    ts_lines.append(f"// Total: {len(questions)} LeetCode questions")
    ts_lines.append("")
    ts_lines.append("export interface LeetCodeMeta {")
    ts_lines.append("  url?: string;")
    ts_lines.append("  acceptance?: number;")
    ts_lines.append("  companies?: string;")
    ts_lines.append("  faang?: boolean;")
    ts_lines.append("  lc_id?: number;")
    ts_lines.append("}")
    ts_lines.append("")
    ts_lines.append("export type LeetCodeQuestion = DSAQuestion & LeetCodeMeta;")
    ts_lines.append("")
    ts_lines.append("export const generatedDSAQuestions: LeetCodeQuestion[] = ")

    # Serialize using json
    ts_lines.append(json.dumps(questions, indent=2, ensure_ascii=False))
    ts_lines.append(";")
    ts_lines.append("")
    ts_lines.append("// Helper function to get random questions from the generated questions")
    ts_lines.append('export function getRandomGeneratedQuestions(difficulty?: "Easy" | "Medium" | "Hard", count = 5): LeetCodeQuestion[] {')
    ts_lines.append("  let filteredQuestions = generatedDSAQuestions;")
    ts_lines.append("")
    ts_lines.append("  if (difficulty) {")
    ts_lines.append("    filteredQuestions = generatedDSAQuestions.filter(q => q.difficulty === difficulty);")
    ts_lines.append("  }")
    ts_lines.append("")
    ts_lines.append("  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());")
    ts_lines.append("  return shuffled.slice(0, Math.min(count, shuffled.length));")
    ts_lines.append("}")
    ts_lines.append("")

    ts_content = "\n".join(ts_lines)
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"Written to: {OUT_PATH}")
    print(f"File size: {len(ts_content):,} bytes")


if __name__ == "__main__":
    main()
