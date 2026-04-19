"""
AI Assistant Service — ChatGPT-like mentor for Interview Express.

Features:
- Context-aware conversation (last 5 messages)
- Smart mentor-like answers on coding, DSA, aptitude, interviews, resume, career
- Follow-up suggestions
"""

from services.ai_service import query_ai, extract_json
from services.memory_service import store_interaction, build_rag_context

SYSTEM_PROMPT = """You are Interview Express AI Assistant — a senior mentor who helps students and professionals with:
- Coding and programming questions
- Data Structures and Algorithms (DSA)
- Aptitude and logical reasoning
- Interview preparation (behavioral and technical)
- Resume building and improvement
- Career guidance and planning

Rules:
1. Be clear, structured, and helpful
2. Use examples and code snippets when relevant
3. For coding questions, always show the code
4. Keep answers focused and practical
5. When appropriate, suggest follow-up topics to explore
6. Format your response clearly with sections if needed
7. Do NOT use markdown code fences for non-code content"""


def chat(message: str, history: list = None, user_id: str = None) -> dict:
    """
    Process a chat message with conversation history.

    Args:
        message: Current user message
        history: List of {"role": "user"|"assistant", "content": "..."} (last 5)
        user_id: Optional user ID for memory/RAG

    Returns:
        {"reply": "...", "suggestions": [...]}
    """
    if not message or not message.strip():
        return {"reply": "Please type a message to get started!", "suggestions": []}

    # Build conversation context from history
    context_parts = []

    # Add RAG context from MongoDB
    if user_id:
        rag_context = build_rag_context(user_id, message, topic="assistant")
        if rag_context:
            context_parts.append(rag_context)

    # Add recent conversation history (last 5 messages)
    if history and len(history) > 0:
        recent = history[-10:]  # 5 exchanges = 10 messages
        context_parts.append("Recent conversation:")
        for msg in recent:
            role = "User" if msg.get("role") == "user" else "Assistant"
            context_parts.append(f"{role}: {msg.get('content', '')[:500]}")

    # Build full prompt
    prompt_parts = []
    if context_parts:
        prompt_parts.append("\n".join(context_parts))
        prompt_parts.append("")

    prompt_parts.append(f"User's current question: {message}")
    prompt_parts.append("")
    prompt_parts.append("Provide a helpful, clear, and structured response.")
    prompt_parts.append("After your response, suggest 2-3 follow-up questions the user might want to ask. Format them as a simple list starting with '- '.")

    prompt = "\n".join(prompt_parts)

    result = query_ai(prompt, system_prompt=SYSTEM_PROMPT)

    if result["error"]:
        return {
            "reply": f"I'm having trouble connecting to the AI service. Error: {result['error']}",
            "suggestions": ["Try asking again", "Check if Ollama is running"],
        }

    response_text = result["text"]

    # Extract suggestions from the response
    suggestions = extract_suggestions(response_text)

    # Clean the main reply (remove the suggestions section)
    reply = clean_reply(response_text)

    # Store interaction in memory
    if user_id:
        store_interaction(user_id, message, reply[:500], topic="assistant")

    return {
        "reply": reply,
        "suggestions": suggestions[:3],
    }


def extract_suggestions(text: str) -> list:
    """Extract follow-up suggestions from the AI response."""
    suggestions = []
    lines = text.split("\n")
    in_suggestions = False

    for line in lines:
        stripped = line.strip()
        if any(kw in stripped.lower() for kw in ["follow-up", "follow up", "you might", "you could ask", "suggested questions"]):
            in_suggestions = True
            continue

        if in_suggestions and stripped.startswith("- "):
            suggestion = stripped[2:].strip().rstrip("?") + "?"
            if len(suggestion) > 5:
                suggestions.append(suggestion)

    return suggestions


def clean_reply(text: str) -> str:
    """Remove the follow-up suggestions section from the reply."""
    lines = text.split("\n")
    clean_lines = []
    skip = False

    for line in lines:
        stripped = line.strip().lower()
        if any(kw in stripped for kw in ["follow-up", "follow up", "you might", "you could ask", "suggested questions"]):
            skip = True
            continue
        if skip and line.strip().startswith("- "):
            continue
        if skip and line.strip() == "":
            skip = False
            continue
        if not skip:
            clean_lines.append(line)

    return "\n".join(clean_lines).strip()
