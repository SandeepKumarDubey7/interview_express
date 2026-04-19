"""
Memory / RAG Service — stores and retrieves conversation history from MongoDB.

Collections:
  - ai_memory: { userId, query, response, timestamp, topic }
"""

import os
import re
from datetime import datetime, timezone

import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from db import get_collection


def store_interaction(user_id: str, query: str, response: str, topic: str = "general"):
    """Store a user-AI interaction in MongoDB for future RAG retrieval."""
    col = get_collection("ai_memory")
    if col is None:
        return

    doc = {
        "userId": user_id,
        "query": query,
        "response": response,
        "topic": topic,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    try:
        col.insert_one(doc)
    except Exception as e:
        print(f"Warning: Could not store AI memory: {e}")


def retrieve_context(user_id: str, query: str, topic: str = None, limit: int = 3) -> list[dict]:
    """
    Retrieve relevant past interactions for RAG context injection.

    Uses keyword matching against stored queries.
    Returns list of { query, response } dicts.
    """
    col = get_collection("ai_memory")
    if col is None:
        return []

    try:
        # Build filter
        match_filter = {"userId": user_id}
        if topic:
            match_filter["topic"] = topic

        # Extract keywords from the current query
        keywords = set(re.findall(r"\b[a-z]{3,}\b", query.lower()))
        stop_words = {
            "the", "and", "for", "are", "but", "not", "you", "all", "can",
            "had", "her", "was", "one", "our", "out", "has", "have", "been",
            "will", "each", "make", "like", "how", "what", "when", "who",
            "why", "where", "which", "this", "that", "with", "from", "your",
            "about", "would", "there", "their", "help", "please", "want",
        }
        keywords -= stop_words

        if not keywords:
            return []

        # Build regex pattern for text search
        keyword_pattern = "|".join(re.escape(k) for k in keywords)
        match_filter["query"] = {"$regex": keyword_pattern, "$options": "i"}

        # Fetch recent matches
        docs = list(
            col.find(match_filter, {"_id": 0, "query": 1, "response": 1})
            .sort("timestamp", -1)
            .limit(limit)
        )

        return [{"query": d["query"], "response": d["response"][:500]} for d in docs]

    except Exception as e:
        print(f"Warning: Could not retrieve AI memory: {e}")
        return []


def build_rag_context(user_id: str, query: str, topic: str = None) -> str:
    """Build a context string from past interactions for prompt injection."""
    past = retrieve_context(user_id, query, topic=topic)
    if not past:
        return ""

    ctx_parts = ["Here are some relevant past interactions for context:"]
    for item in past:
        ctx_parts.append(f"- User asked: {item['query']}")
        ctx_parts.append(f"  AI answered: {item['response'][:300]}")

    return "\n".join(ctx_parts)
