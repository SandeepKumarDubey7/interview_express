"""
Core AI Service — Automatic Hybrid Provider (Ollama / Groq).

Environment-based switching:
  - NODE_ENV !== "production" → Ollama (local LLM)
  - NODE_ENV === "production" → Groq Cloud API

All AI features funnel through `query_ai()` and `query_ai_json()`.
"""

import os
import time
import json
import re
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

# ── Environment Detection ────────────────────────────────────────────────
IS_PRODUCTION = os.getenv("NODE_ENV", "").strip().lower() == "production"

# ── Ollama Config (Local / Development) ──────────────────────────────────
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen3.5:4b")
OLLAMA_TIMEOUT = int(os.getenv("OLLAMA_TIMEOUT", "120"))

# ── Groq Config (Cloud / Production) ─────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_TIMEOUT = 60

MAX_RETRIES = 3

# ── Log which provider is active on import ────────────────────────────────
_provider = "Groq (cloud)" if IS_PRODUCTION else "Ollama (local)"
print(f"[AI Service] Provider: {_provider} | Production: {IS_PRODUCTION}")


# ═══════════════════════════════════════════════════════════════════════════
#  PUBLIC API — every service calls these two functions
# ═══════════════════════════════════════════════════════════════════════════

def query_ai(prompt: str, system_prompt: str = None, temperature: float = 0.7) -> dict:
    """
    Send a prompt to the active AI provider and return the response.

    Returns:
        {"text": "...", "error": None}  on success
        {"text": "",   "error": "..."}  on failure
    """
    if IS_PRODUCTION:
        return _query_groq(prompt, system_prompt=system_prompt, temperature=temperature)
    else:
        return _query_ollama(prompt, system_prompt=system_prompt, temperature=temperature)


def query_ai_json(prompt: str, system_prompt: str = None, temperature: float = 0.3) -> dict:
    """
    Query the active AI provider and extract a JSON object from the response.
    Uses lower temperature for deterministic structured output.

    Returns:
        Parsed dict on success, or {"error": "..."} on failure.
    """
    result = query_ai(prompt, system_prompt=system_prompt, temperature=temperature)

    if result["error"]:
        return {"error": result["error"]}

    parsed = extract_json(result["text"])
    if parsed is not None:
        return parsed

    return {"error": "Could not parse JSON from AI response", "raw": result["text"]}


# ═══════════════════════════════════════════════════════════════════════════
#  OLLAMA PROVIDER (Local / Development)
# ═══════════════════════════════════════════════════════════════════════════

def _query_ollama(prompt: str, system_prompt: str = None, temperature: float = 0.7) -> dict:
    """Send a prompt to Ollama (local LLM)."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
        },
    }

    if system_prompt:
        payload["system"] = system_prompt

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(
                f"{OLLAMA_URL}/api/generate",
                json=payload,
                timeout=OLLAMA_TIMEOUT,
            )

            if response.status_code == 200:
                data = response.json()
                text = data.get("response", "").strip()
                return {"text": text, "error": None}

            # Retry on server errors
            if response.status_code >= 500:
                wait = (2 ** attempt) * 2
                print(f"Ollama server error {response.status_code}, retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                time.sleep(wait)
                continue

            # Client error — don't retry
            error_msg = f"Ollama API error {response.status_code}: {response.text[:200]}"
            print(error_msg)
            return {"text": "", "error": error_msg}

        except requests.exceptions.Timeout:
            wait = (2 ** attempt) * 2
            print(f"Ollama timeout (attempt {attempt + 1}/{MAX_RETRIES}), retrying in {wait}s...")
            time.sleep(wait)
            continue

        except requests.exceptions.ConnectionError:
            return {
                "text": "",
                "error": "Cannot connect to Ollama. Make sure Ollama is running (ollama serve) at " + OLLAMA_URL,
            }

        except Exception as e:
            print(f"Unexpected error querying Ollama: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
                continue
            return {"text": "", "error": str(e)}

    return {"text": "", "error": "Failed after multiple retries"}


# ═══════════════════════════════════════════════════════════════════════════
#  GROQ PROVIDER (Cloud / Production)
# ═══════════════════════════════════════════════════════════════════════════

def _query_groq(prompt: str, system_prompt: str = None, temperature: float = 0.7) -> dict:
    """Send a prompt to Groq Cloud API (OpenAI-compatible)."""
    if not GROQ_API_KEY:
        return {
            "text": "",
            "error": "GROQ_API_KEY is not set. Add it to your environment variables.",
        }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": 4096,
    }

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.post(
                GROQ_API_URL,
                json=payload,
                headers=headers,
                timeout=GROQ_TIMEOUT,
            )

            if response.status_code == 200:
                data = response.json()
                text = data["choices"][0]["message"]["content"].strip()
                return {"text": text, "error": None}

            # Rate limit — wait and retry
            if response.status_code == 429:
                retry_after = int(response.headers.get("retry-after", (2 ** attempt) * 3))
                print(f"Groq rate limited, waiting {retry_after}s (attempt {attempt + 1}/{MAX_RETRIES})")
                time.sleep(retry_after)
                continue

            # Server error — retry
            if response.status_code >= 500:
                wait = (2 ** attempt) * 2
                print(f"Groq server error {response.status_code}, retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                time.sleep(wait)
                continue

            # Client error — don't retry
            error_msg = f"Groq API error {response.status_code}: {response.text[:300]}"
            print(error_msg)
            return {"text": "", "error": error_msg}

        except requests.exceptions.Timeout:
            wait = (2 ** attempt) * 2
            print(f"Groq timeout (attempt {attempt + 1}/{MAX_RETRIES}), retrying in {wait}s...")
            time.sleep(wait)
            continue

        except requests.exceptions.ConnectionError:
            return {
                "text": "",
                "error": "Cannot connect to Groq API. Check your internet connection.",
            }

        except Exception as e:
            print(f"Unexpected error querying Groq: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(2)
                continue
            return {"text": "", "error": str(e)}

    return {"text": "", "error": "Failed after multiple retries"}


# ═══════════════════════════════════════════════════════════════════════════
#  UTILITIES
# ═══════════════════════════════════════════════════════════════════════════

def extract_json(text: str):
    """Extract the first JSON object or array from a text string."""
    # Try to find JSON block in markdown code fence
    code_match = re.search(r"```(?:json)?\s*\n?([\s\S]*?)```", text)
    if code_match:
        try:
            return json.loads(code_match.group(1).strip())
        except json.JSONDecodeError:
            pass

    # Try to find raw JSON object
    for pattern in [r"\{[\s\S]*\}", r"\[[\s\S]*\]"]:
        match = re.search(pattern, text)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                continue

    # Last resort: try the whole text
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        return None


def check_ai_health() -> dict:
    """Check the health of the active AI provider."""
    provider = "groq" if IS_PRODUCTION else "ollama"

    if IS_PRODUCTION:
        # Groq health check — verify API key is set and API is reachable
        if not GROQ_API_KEY:
            return {
                "provider": "groq",
                "status": "error",
                "message": "GROQ_API_KEY is not configured",
            }
        try:
            resp = requests.get(
                "https://api.groq.com/openai/v1/models",
                headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                timeout=10,
            )
            if resp.status_code == 200:
                models = [m["id"] for m in resp.json().get("data", [])]
                model_available = GROQ_MODEL in models
                return {
                    "provider": "groq",
                    "status": "connected",
                    "model": GROQ_MODEL,
                    "model_available": model_available,
                }
            return {
                "provider": "groq",
                "status": "error",
                "message": f"Groq API returned {resp.status_code}",
            }
        except requests.exceptions.ConnectionError:
            return {"provider": "groq", "status": "disconnected", "message": "Cannot reach Groq API"}
        except Exception as e:
            return {"provider": "groq", "status": "error", "message": str(e)}

    else:
        # Ollama health check (original logic)
        try:
            resp = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
            if resp.status_code == 200:
                models = [m["name"] for m in resp.json().get("models", [])]
                model_available = any(OLLAMA_MODEL in m for m in models)
                return {
                    "provider": "ollama",
                    "status": "connected",
                    "model": OLLAMA_MODEL,
                    "model_available": model_available,
                    "available_models": models,
                }
            return {"provider": "ollama", "status": "error", "message": f"Ollama returned {resp.status_code}"}
        except requests.exceptions.ConnectionError:
            return {"provider": "ollama", "status": "disconnected", "message": "Ollama is not running"}
        except Exception as e:
            return {"provider": "ollama", "status": "error", "message": str(e)}


# Backward compatibility alias
check_ollama_health = check_ai_health
