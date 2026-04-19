"""
Aptitude Service — generates aptitude questions and explanations using AI.

Hybrid approach: base questions from dataset, AI generates new ones on demand.
"""

from services.ai_service import query_ai, query_ai_json

SYSTEM_PROMPT = """You are an expert aptitude test question creator.
You create high-quality placement aptitude questions for Indian engineering students.
Questions should be accurate, well-formatted, and have exactly 4 options with one correct answer.
Always provide clear explanations."""


def generate_questions(category: str = "quantitative", count: int = 5, difficulty: str = "medium") -> dict:
    """
    Generate aptitude questions using AI.

    Categories: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation
    """
    prompt = f"""Generate exactly {count} {difficulty} difficulty {category} aptitude questions for placement preparation.

Return ONLY a JSON object in this exact format:
{{
  "questions": [
    {{
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option text (must match one of the options exactly)",
      "explanation": "Step-by-step explanation of the solution",
      "difficulty": "{difficulty.capitalize()}"
    }}
  ]
}}

Rules:
1. Each question MUST have exactly 4 options
2. correctAnswer MUST exactly match one of the options
3. Explanation must show the solution method
4. Questions should be similar to those asked in TCS, Infosys, Wipro placement tests
5. For quantitative: Include numbers, percentages, ratios, time-work, etc.
6. For logical: Include patterns, sequences, coding-decoding, etc.
7. For verbal: Include grammar, vocabulary, comprehension, etc.
8. For data interpretation: Include tables, charts-based questions"""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "questions" not in result:
        return {"questions": [], "source": "error", "error": result.get("error", "")}

    questions = result.get("questions", [])

    # Validate questions
    valid_questions = []
    for q in questions:
        if (
            q.get("question")
            and isinstance(q.get("options"), list)
            and len(q["options"]) == 4
            and q.get("correctAnswer")
            and q["correctAnswer"] in q["options"]
        ):
            valid_questions.append(q)

    return {"questions": valid_questions, "source": "ai"}


def explain_answer(question: str, correct_answer: str) -> str:
    """Generate a detailed explanation for an aptitude question."""
    prompt = f"""Explain this aptitude question and its correct answer:

Question: {question}
Correct Answer: {correct_answer}

Provide:
1. A clear step-by-step explanation of how to arrive at the answer
2. Any formulas or concepts needed
3. A brief note on why other answers would be incorrect

Keep the explanation educational and easy to understand."""

    result = query_ai(prompt, system_prompt=SYSTEM_PROMPT)

    if result["error"]:
        return "Explanation unavailable. Please try again later."

    return result["text"]
