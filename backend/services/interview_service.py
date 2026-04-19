"""
Mock Interview Service — generates questions and evaluates answers using AI.

Supports: DSA, HR, System Design, Behavioral question types.
"""

from services.ai_service import query_ai, query_ai_json
from services.memory_service import store_interaction

SYSTEM_PROMPT = """You are an expert technical interviewer at a top tech company.
You conduct mock interviews for software engineering roles.
Be professional, thorough, and constructive in your feedback.
Always provide actionable advice for improvement."""


def generate_questions(job_title: str, experience: str = "3-5", interview_type: str = "mixed", count: int = 5) -> dict:
    """Generate interview questions using AI."""
    prompt = f"""Generate exactly {count} realistic interview questions for a {job_title} position
with {experience} years of experience. Interview type: {interview_type}.

Return ONLY a JSON object in this exact format:
{{
  "questions": [
    {{
      "question": "The interview question text",
      "type": "{interview_type}",
      "difficulty": "Easy" or "Medium" or "Hard",
      "lookingFor": "What the interviewer expects in a good answer"
    }}
  ]
}}

Make questions specific, practical, and commonly asked in real interviews.
Include a mix of difficulties if type is "mixed".
For technical questions, include coding/system design scenarios.
For behavioral, use STAR-method appropriate questions."""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "questions" not in result:
        # Return fallback questions
        return {
            "questions": get_fallback_questions(interview_type, count),
            "source": "fallback",
        }

    questions = result.get("questions", [])
    if not questions:
        return {
            "questions": get_fallback_questions(interview_type, count),
            "source": "fallback",
        }

    return {"questions": questions, "source": "ai"}


def evaluate_answer(question: str, answer: str, user_id: str = None) -> dict:
    """Evaluate an interview answer using AI."""
    if not answer or not answer.strip():
        return {
            "score": 0,
            "feedback": "No answer provided.",
            "improvementTips": "Please provide an answer to evaluate.",
            "strengths": [],
            "weaknesses": ["No answer given"],
        }

    prompt = f"""Evaluate this interview answer:

Question: {question}

Candidate's Answer: {answer}

Return ONLY a JSON object in this exact format:
{{
  "score": <integer 1-10>,
  "feedback": "<2-3 sentences of specific feedback>",
  "improvementTips": "<1-2 actionable tips for improvement>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"]
}}

Scoring guide:
- 1-3: Poor — misses the point, incorrect, or too vague
- 4-6: Average — partially correct, needs more depth
- 7-8: Good — solid answer with room for improvement
- 9-10: Excellent — comprehensive, well-structured, with examples"""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "score" not in result:
        return {
            "score": 5,
            "feedback": "Could not evaluate with AI. Please try again.",
            "improvementTips": "Ensure your answer is detailed and addresses the question directly.",
            "strengths": [],
            "weaknesses": [],
        }

    # Store interaction for RAG
    if user_id:
        store_interaction(user_id, question, answer[:300], topic="interview")

    return {
        "score": min(10, max(1, int(result.get("score", 5)))),
        "feedback": result.get("feedback", ""),
        "improvementTips": result.get("improvementTips", ""),
        "strengths": result.get("strengths", []),
        "weaknesses": result.get("weaknesses", []),
    }


def generate_follow_up(question: str, answer: str) -> dict:
    """Generate a dynamic follow-up question based on the candidate's answer."""
    prompt = f"""Based on this interview exchange, generate one follow-up question:

Original Question: {question}
Candidate's Answer: {answer}

Return ONLY a JSON object:
{{
  "followUp": "The follow-up question",
  "reason": "Brief explanation of why this follow-up is relevant"
}}

The follow-up should dig deeper into the candidate's answer or test their understanding further."""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "followUp" not in result:
        return {
            "followUp": "Can you elaborate more on your approach and explain the trade-offs you considered?",
            "reason": "To assess deeper understanding",
        }

    return {
        "followUp": result.get("followUp", "Tell me more about your approach."),
        "reason": result.get("reason", ""),
    }


def get_fallback_questions(interview_type: str, count: int) -> list:
    """Return hardcoded fallback questions when AI is unavailable."""
    behavioral = [
        {"question": "Tell me about a time you overcame a significant challenge in a project.", "type": "behavioral", "difficulty": "Medium", "lookingFor": "Problem-solving and resilience"},
        {"question": "Describe a situation where you had to work with a difficult team member.", "type": "behavioral", "difficulty": "Medium", "lookingFor": "Teamwork and conflict resolution"},
        {"question": "Give an example of when you showed leadership.", "type": "behavioral", "difficulty": "Medium", "lookingFor": "Leadership and initiative"},
        {"question": "Tell me about a time you failed. What did you learn?", "type": "behavioral", "difficulty": "Medium", "lookingFor": "Self-awareness and growth mindset"},
        {"question": "How do you handle working under pressure or tight deadlines?", "type": "behavioral", "difficulty": "Easy", "lookingFor": "Stress management"},
    ]
    technical = [
        {"question": "Explain the difference between a stack and a queue. When would you use each?", "type": "technical", "difficulty": "Easy", "lookingFor": "Data structure fundamentals"},
        {"question": "How would you design a URL shortener like bit.ly?", "type": "technical", "difficulty": "Hard", "lookingFor": "System design thinking"},
        {"question": "What is the time complexity of searching in a balanced BST vs a hash map?", "type": "technical", "difficulty": "Medium", "lookingFor": "Algorithm analysis"},
        {"question": "Explain how garbage collection works in your preferred language.", "type": "technical", "difficulty": "Medium", "lookingFor": "Language internals"},
        {"question": "How would you optimize a slow SQL query?", "type": "technical", "difficulty": "Medium", "lookingFor": "Database performance"},
    ]

    if interview_type == "behavioral":
        return behavioral[:count]
    elif interview_type == "technical":
        return technical[:count]
    else:
        combined = behavioral[:3] + technical[:2]
        return combined[:count]
