"""
Resume ATS Analysis Service — uses AI to analyze resumes for ATS compatibility.
"""

from services.ai_service import query_ai, query_ai_json

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) analyzer and resume reviewer.
You help job seekers optimize their resumes for better ATS compatibility and interview callbacks.
Be specific, actionable, and constructive in your feedback."""


def analyze_resume(resume_text: str) -> dict:
    """
    Analyze a resume for ATS compatibility using AI.

    Returns:
        {
            "atsScore": 0-100,
            "missingKeywords": [],
            "suggestions": [],
            "formattingIssues": [],
            "improvements": [],
            "analysis": ""
        }
    """
    if not resume_text or len(resume_text.strip()) < 20:
        return {
            "atsScore": 0,
            "missingKeywords": [],
            "suggestions": ["Please provide a complete resume for analysis."],
            "formattingIssues": [],
            "improvements": [],
            "analysis": "Not enough content to analyze.",
        }

    prompt = f"""Analyze this resume for ATS (Applicant Tracking System) compatibility.

RESUME:
{resume_text[:3000]}

Return ONLY a JSON object in this exact format:
{{
  "atsScore": <integer 0-100>,
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ],
  "formattingIssues": [
    "Issue 1 if any",
    "Issue 2 if any"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2",
    "Improvement 3"
  ],
  "analysis": "A brief 2-3 sentence overall assessment of the resume"
}}

Scoring criteria:
- 0-30: Poor — major issues, unlikely to pass ATS
- 31-60: Average — some issues, needs improvement
- 61-80: Good — solid resume with minor improvements needed
- 81-100: Excellent — well-optimized for ATS

Consider: keyword density, action verbs, quantified achievements, section structure,
skills listing, professional summary, contact info, and formatting."""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "atsScore" not in result:
        return {
            "atsScore": 0,
            "missingKeywords": [],
            "suggestions": ["AI analysis unavailable. Please try again later."],
            "formattingIssues": [],
            "improvements": [],
            "analysis": result.get("error", "Could not analyze resume."),
        }

    return {
        "atsScore": min(100, max(0, int(result.get("atsScore", 50)))),
        "missingKeywords": result.get("missingKeywords", []),
        "suggestions": result.get("suggestions", []),
        "formattingIssues": result.get("formattingIssues", []),
        "improvements": result.get("improvements", []),
        "analysis": result.get("analysis", ""),
    }
