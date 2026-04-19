"""
Study Assistant Service — analyzes user progress and generates personalized study plans.
"""

from services.ai_service import query_ai_json

SYSTEM_PROMPT = """You are an expert study planner and learning coach.
You analyze student performance data and create personalized study plans.
Be specific, practical, and motivating in your recommendations."""


def analyze_and_plan(dsa_progress: dict = None, aptitude_accuracy: dict = None, interview_performance: dict = None) -> dict:
    """
    Analyze user performance data and generate a personalized study plan.

    Returns:
        {
            "weakTopics": [],
            "recommendedResources": [{"title", "link", "type"}],
            "studyPlan": "..."
        }
    """
    # Build context from available data
    context_parts = []

    if dsa_progress:
        solved = dsa_progress.get("problemsSolved", 0)
        easy = dsa_progress.get("easySolved", 0)
        medium = dsa_progress.get("mediumSolved", 0)
        hard = dsa_progress.get("hardSolved", 0)
        context_parts.append(f"DSA Progress: {solved} problems solved ({easy} easy, {medium} medium, {hard} hard)")

        weak_categories = dsa_progress.get("weakCategories", [])
        if weak_categories:
            context_parts.append(f"Weak DSA topics: {', '.join(weak_categories)}")

    if aptitude_accuracy:
        quant = aptitude_accuracy.get("quantitative", 0)
        logical = aptitude_accuracy.get("logical", 0)
        verbal = aptitude_accuracy.get("verbal", 0)
        context_parts.append(f"Aptitude Accuracy: Quantitative {quant}%, Logical {logical}%, Verbal {verbal}%")

    if interview_performance:
        avg_score = interview_performance.get("avgScore", 0)
        total = interview_performance.get("totalInterviews", 0)
        context_parts.append(f"Interview Performance: Average score {avg_score}/10 across {total} interviews")

    if not context_parts:
        context_parts.append("New user with no progress data yet. Provide a beginner-friendly general plan.")

    prompt = f"""Based on this student's performance data, create a personalized study plan:

{chr(10).join(context_parts)}

Return ONLY a JSON object in this exact format:
{{
  "weakTopics": ["topic1", "topic2", "topic3"],
  "recommendedResources": [
    {{
      "title": "Resource title",
      "link": "https://example.com",
      "type": "video" or "article" or "practice" or "course"
    }}
  ],
  "studyPlan": "A detailed 2-3 paragraph study plan with specific weekly goals and milestones"
}}

Rules:
1. Identify 3-5 weak topics based on the data
2. Recommend 4-6 real, accessible resources (YouTube, LeetCode, GeeksforGeeks, etc.)
3. Create a realistic 4-week study plan
4. Focus on the weakest areas first
5. Include practice recommendations"""

    result = query_ai_json(prompt, system_prompt=SYSTEM_PROMPT)

    if "error" in result and "weakTopics" not in result:
        return {
            "weakTopics": ["General DSA", "Problem Solving", "Time Management"],
            "recommendedResources": [
                {"title": "Striver's A2Z DSA Sheet", "link": "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2", "type": "practice"},
                {"title": "NeetCode 150", "link": "https://neetcode.io/practice", "type": "practice"},
                {"title": "GeeksforGeeks Aptitude", "link": "https://www.geeksforgeeks.org/aptitude-gq/", "type": "practice"},
            ],
            "studyPlan": "Start with fundamental DSA topics. Practice 2-3 problems daily. Review aptitude concepts weekly. Take a mock interview every weekend.",
        }

    return {
        "weakTopics": result.get("weakTopics", []),
        "recommendedResources": result.get("recommendedResources", []),
        "studyPlan": result.get("studyPlan", ""),
    }
