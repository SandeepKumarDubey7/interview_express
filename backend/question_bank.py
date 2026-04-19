"""
Interview Question Bank — loads and serves questions from dataset files.
Used by the /interview-questions endpoint in app.py.

Data sources (in 'ai mock inter' folder):
  - python_interview_questions_500.csv  (500 Q&A, rich metadata)
  - Software Questions.csv              (200 Q&A, category + difficulty)
  - deeplearning_questions.csv          (111 question topics)
  - ml_interview_questions.json         (42 ML Q&A)
  - hr_interview_questions_dataset.json (2.5M behavioral Q&A — sampled)
  - dataset.csv                         (166 general Q&A)

NOTE: programming_questions_solutions.csv is excluded — it contains
placeholder questions like "Problem 67: Solve a Data Structures challenge"
with dummy answers like "def solution(): pass".
"""

import os
import json
import random
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ai mock inter")

# ── Normalised question format ──
# { question, answer, category, difficulty, type }

_question_bank: list[dict] = []
_loaded = False


def _safe_str(val) -> str:
    """Safely convert to string, handling NaN."""
    if pd.isna(val):
        return ""
    return str(val).strip()


def _load_python_questions():
    """python_interview_questions_500.csv — richest dataset."""
    path = os.path.join(DATA_DIR, "python_interview_questions_500.csv")
    if not os.path.exists(path):
        return []
    df = pd.read_csv(path, encoding="utf-8")
    questions = []
    for _, row in df.iterrows():
        q = _safe_str(row.get("question"))
        a = _safe_str(row.get("answer"))
        if not q or len(q) < 15:
            continue
        questions.append({
            "question": q,
            "answer": a,
            "category": _safe_str(row.get("topic")) or "Python",
            "difficulty": _safe_str(row.get("difficulty")) or "Medium",
            "type": "technical",
            "tags": _safe_str(row.get("tags")),
            "code_example": _safe_str(row.get("code_example")),
        })
    return questions


def _load_software_questions():
    """Software Questions.csv — general programming."""
    path = os.path.join(DATA_DIR, "Software Questions.csv")
    if not os.path.exists(path):
        return []
    df = pd.read_csv(path, encoding="latin1")
    questions = []
    for _, row in df.iterrows():
        q = _safe_str(row.get("Question"))
        a = _safe_str(row.get("Answer"))
        if not q or len(q) < 15:
            continue
        questions.append({
            "question": q,
            "answer": a,
            "category": _safe_str(row.get("Category")) or "Software Engineering",
            "difficulty": _safe_str(row.get("Difficulty")) or "Medium",
            "type": "technical",
        })
    return questions


def _load_deeplearning_questions():
    """deeplearning_questions.csv — DL questions (short topic prompts).
    Convert short topics to full questions."""
    path = os.path.join(DATA_DIR, "deeplearning_questions.csv")
    if not os.path.exists(path):
        return []
    df = pd.read_csv(path, encoding="utf-8")
    questions = []
    for _, row in df.iterrows():
        topic = _safe_str(row.get("DESCRIPTION"))
        if not topic or len(topic) < 3:
            continue
        # Convert short topics to full questions
        if "?" not in topic:
            q = f"Explain the concept of {topic} in deep learning. What is it, why is it important, and how is it used?"
        else:
            q = topic
        questions.append({
            "question": q,
            "answer": "",
            "category": "Deep Learning",
            "difficulty": "Medium",
            "type": "technical",
        })
    return questions


def _load_ml_questions():
    """ml_interview_questions.json — ML Q&A with categories."""
    path = os.path.join(DATA_DIR, "ml_interview_questions.json")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    questions = []
    for item in data:
        q = item.get("question", "").strip()
        a = item.get("answer", "").strip()
        if not q or len(q) < 10:
            continue
        # Clean up numbered prefixes like "1. What Are..."
        import re
        q = re.sub(r"^\d+\.\s*", "", q)
        questions.append({
            "question": q,
            "answer": a,
            "category": item.get("category", "Machine Learning"),
            "difficulty": "Medium",
            "type": "technical",
        })
    return questions


def _load_general_questions():
    """dataset.csv — general interview Q&A."""
    path = os.path.join(DATA_DIR, "dataset.csv")
    if not os.path.exists(path):
        return []
    df = pd.read_csv(path, encoding="utf-8")
    questions = []
    for _, row in df.iterrows():
        q = _safe_str(row.get("question"))
        a = _safe_str(row.get("answer"))
        if not q or len(q) < 15:
            continue
        questions.append({
            "question": q,
            "answer": a,
            "category": "General",
            "difficulty": "Medium",
            "type": "behavioral",
        })
    return questions


def _load_hr_questions(sample_size: int = 2000):
    """hr_interview_questions_dataset.json — 2.5M behavioral questions (sampled)."""
    path = os.path.join(DATA_DIR, "hr_interview_questions_dataset.json")
    if not os.path.exists(path):
        return []
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)

        # Sample to avoid memory issues
        if len(data) > sample_size:
            data = random.sample(data, sample_size)

        questions = []
        for item in data:
            q = item.get("question", "").strip()
            a = item.get("ideal_answer", "").strip()
            if not q or len(q) < 15:
                continue
            questions.append({
                "question": q,
                "answer": a,
                "category": item.get("category", "Behavioral"),
                "difficulty": item.get("difficulty", "Medium"),
                "type": "behavioral",
                "role": item.get("role", ""),
                "experience": item.get("experience", ""),
                "keywords": item.get("keywords", []),
            })
        return questions
    except Exception as e:
        print(f"Warning: Could not load HR questions: {e}")
        return []


def load_all_questions() -> list[dict]:
    """Load all question datasets once."""
    global _question_bank, _loaded
    if _loaded:
        return _question_bank

    print("Loading interview question bank...")
    loaders = [
        ("Python Questions", _load_python_questions),
        ("Software Questions", _load_software_questions),
        ("Deep Learning Questions", _load_deeplearning_questions),
        ("ML Questions", _load_ml_questions),
        ("General Questions", _load_general_questions),
        ("HR/Behavioral Questions", _load_hr_questions),
    ]

    for name, loader in loaders:
        try:
            qs = loader()
            print(f"  Loaded {len(qs)} {name}")
            _question_bank.extend(qs)
        except Exception as e:
            print(f"  Failed to load {name}: {e}")

    _loaded = True
    print(f"Total question bank: {len(_question_bank)} questions")
    return _question_bank


def get_questions(
    interview_type: str = "",
    category: str = "",
    difficulty: str = "",
    role: str = "",
    count: int = 5,
) -> list[dict]:
    """Get random questions filtered by type/category/difficulty/role."""
    bank = load_all_questions()
    filtered = bank

    # Filter by interview type (behavioral / technical)
    if interview_type:
        t = interview_type.lower()
        filtered = [q for q in filtered if q.get("type", "").lower() == t]

    # Filter by category keyword
    if category:
        cat_lower = category.lower()
        filtered = [q for q in filtered if cat_lower in q.get("category", "").lower()]

    # Filter by difficulty
    if difficulty:
        diff_lower = difficulty.lower()
        filtered = [q for q in filtered if q.get("difficulty", "").lower() == diff_lower]

    # Filter by role (for HR questions)
    if role:
        role_lower = role.lower()
        role_filtered = [q for q in filtered if role_lower in q.get("role", "").lower()]
        # If role filter matches some, use those; otherwise fallback to all filtered
        if role_filtered:
            filtered = role_filtered

    # If no matches, fallback to full bank
    if not filtered:
        filtered = bank

    # Random sample
    count = min(count, len(filtered))
    return random.sample(filtered, count)
