"""
Career Service — generates AI-powered career insights and roadmaps.
"""

from services.ai_service import query_ai, query_ai_json

SYSTEM_PROMPT = """You are a career advisor powered by AI.
You provide personalized career guidance based on resume analysis results.
Be motivating, professional, specific, and actionable in your advice."""


def generate_career_insight(career_path: str, detected_skills: list, missing_skills: list) -> dict:
    """
    Generate personalized career insight using AI.

    Returns:
        {
            "careerPath": "...",
            "insight": "...",
            "missingSkills": [...],
            "roadmap": [...],
            "salaryEstimate": "..."
        }
    """
    prompt = f"""Based on these ML career prediction results, provide a personalized career analysis:

Predicted Career Path: {career_path}
Detected Skills: {", ".join(detected_skills[:20])}
Missing Skills: {", ".join(missing_skills[:15])}

Return ONLY a JSON object in this exact format:
{{
  "careerPath": "{career_path}",
  "insight": "<4-6 sentence personalized career insight paragraph covering why this path fits, industry trends, and specific advice>",
  "missingSkills": {str(missing_skills[:10])},
  "roadmap": [
    {{
      "step": 1,
      "title": "Step title",
      "description": "What to learn/do",
      "duration": "X weeks"
    }}
  ],
  "salaryEstimate": "<salary range estimate for this role in USD>"
}}

Write the insight in a motivating, professional tone. Be specific and actionable.
Include 3-5 roadmap steps focused on the missing skills."""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "insight" not in result:
        # Fallback: return a basic text insight
        text_result = query_ai(
            f"Provide a 4-6 sentence career insight for someone pursuing {career_path} who has {', '.join(detected_skills[:10])} but needs {', '.join(missing_skills[:5])}. Be motivating and specific.",
            system_prompt=SYSTEM_PROMPT,
        )
        return {
            "careerPath": career_path,
            "insight": text_result.get("text", "Unable to generate career insight at this time."),
            "missingSkills": missing_skills,
            "roadmap": [],
            "salaryEstimate": "Varies by location and experience",
        }

    return {
        "careerPath": result.get("careerPath", career_path),
        "insight": result.get("insight", ""),
        "missingSkills": result.get("missingSkills", missing_skills),
        "roadmap": result.get("roadmap", []),
        "salaryEstimate": result.get("salaryEstimate", ""),
    }
