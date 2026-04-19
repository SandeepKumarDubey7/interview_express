"""
AI Career Navigator -- Flask ML Backend
POST /predict-career : accepts resume file, returns career predictions.
Trained on: AI-based Career Recommendation System.csv
"""

import os
import re
import pickle
import traceback
from datetime import datetime, timezone
from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
from bson import ObjectId
from db import get_collection

app = Flask(__name__)
CORS(app)


# ── Helper: serialise MongoDB docs ──────────────────────────────────
def serialise(doc):
    """Convert MongoDB document to JSON-serialisable dict."""
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ═══════════════════════════════════════════════════════════════════════
#  AUTH API
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        users = get_collection("users")
        progress = get_collection("user_progress")
        dsa = get_collection("dsa_progress")
        if users is None:
            return jsonify({"error": "Database unavailable. Please try again later."}), 503

        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required"}), 400

        if users.find_one({"email": email}):
            return jsonify({"error": "An account with this email already exists"}), 409

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        user_doc = {
            "name": name,
            "email": email,
            "passwordHash": hashed.decode("utf-8"),
            "createdAt": datetime.now(timezone.utc).isoformat(),
        }
        result = users.insert_one(user_doc)

        user = {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": "user",
        }

        # Create empty progress docs
        if progress is not None:
            progress.insert_one({
                "userId": user["id"],
                "problemsSolved": 0,
                "practiceMinutes": 0,
                "mockInterviews": 0,
                "correctAnswers": 0,
                "totalAnswers": 0,
                "streak": 0,
                "lastActiveDate": "",
                "xp": 0,
                "activities": [],
            })

        if dsa is not None:
            dsa.insert_one({
                "userId": user["id"],
                "questionProgress": [],
                "topicProgress": [],
            })

        return jsonify({"user": user}), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        users = get_collection("users")
        if users is None:
            return jsonify({"error": "Database unavailable. Please try again later."}), 503

        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user_doc = users.find_one({"email": email})
        if not user_doc:
            return jsonify({"error": "No account found with this email"}), 404

        if not bcrypt.checkpw(password.encode("utf-8"), user_doc["passwordHash"].encode("utf-8")):
            return jsonify({"error": "Invalid password"}), 401

        user = {
            "id": str(user_doc["_id"]),
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": "user",
        }
        return jsonify({"user": user}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  USER PROGRESS API
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/progress/<user_id>", methods=["GET"])
def get_progress(user_id):
    try:
        col = get_collection("user_progress")
        if col is None:
            return jsonify({"error": "Database unavailable"}), 503
        doc = col.find_one({"userId": user_id})
        if not doc:
            return jsonify({"error": "Progress not found"}), 404
        return jsonify(serialise(doc)), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/progress/<user_id>", methods=["PUT"])
def update_progress(user_id):
    try:
        col = get_collection("user_progress")
        if col is None:
            return jsonify({"error": "Database unavailable"}), 503
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        data.pop("_id", None)
        data["userId"] = user_id

        col.update_one(
            {"userId": user_id},
            {"$set": data},
            upsert=True,
        )
        return jsonify({"ok": True}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  DSA PROGRESS API
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/dsa-progress/<user_id>", methods=["GET"])
def get_dsa_progress(user_id):
    try:
        col = get_collection("dsa_progress")
        if col is None:
            return jsonify({"error": "Database unavailable"}), 503
        doc = col.find_one({"userId": user_id})
        if not doc:
            return jsonify({"error": "DSA progress not found"}), 404
        return jsonify(serialise(doc)), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/dsa-progress/<user_id>", methods=["PUT"])
def update_dsa_progress(user_id):
    try:
        col = get_collection("dsa_progress")
        if col is None:
            return jsonify({"error": "Database unavailable"}), 503
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        data.pop("_id", None)
        data["userId"] = user_id

        col.update_one(
            {"userId": user_id},
            {"$set": data},
            upsert=True,
        )
        return jsonify({"ok": True}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")

# --- Load or train models on startup ---

def load_models():
    """Load pickled models; train first if they don't exist."""
    if not os.path.exists(os.path.join(MODEL_DIR, "career_classifier.pkl")):
        print("Models not found -- training now...")
        from training_scripts.train_models import train_and_save
        train_and_save(MODEL_DIR)

    with open(os.path.join(MODEL_DIR, "career_classifier.pkl"), "rb") as f:
        clf = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "salary_regressor.pkl"), "rb") as f:
        reg = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
        le = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "skill_universe.pkl"), "rb") as f:
        skill_universe = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "interest_universe.pkl"), "rb") as f:
        interest_universe = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "career_skill_profiles.pkl"), "rb") as f:
        career_skill_profiles = pickle.load(f)

    return clf, reg, le, skill_universe, interest_universe, career_skill_profiles


clf, reg, le, SKILL_UNIVERSE, INTEREST_UNIVERSE, CAREER_SKILL_PROFILES = load_models()


# --- Text extraction helpers ---

def extract_text_pdf(file_storage) -> str:
    from PyPDF2 import PdfReader
    reader = PdfReader(file_storage)
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def extract_text_docx(file_storage) -> str:
    import docx
    doc = docx.Document(file_storage)
    return "\n".join(p.text for p in doc.paragraphs)


def extract_skills(text: str) -> list[str]:
    """Find which skills from our universe appear in the resume text."""
    text_lower = text.lower()
    # Normalise common variations
    text_lower = text_lower.replace("node js", "node.js").replace("nodejs", "node.js")
    text_lower = text_lower.replace("ci / cd", "ci/cd").replace("ci cd", "ci/cd")
    text_lower = text_lower.replace("ui / ux", "ui/ux").replace("uiux", "ui/ux")

    found = []
    for skill in SKILL_UNIVERSE:
        # word-boundary match to avoid partial hits
        pattern = r"(?:^|[\s,;|/\(\)\[\].]){}(?:[\s,;|/\(\)\[\].]|$)".format(
            re.escape(skill)
        )
        if re.search(pattern, text_lower):
            found.append(skill)
    return found


def extract_interests(text: str) -> list[str]:
    """Find which interests from our universe appear in the resume text."""
    text_lower = text.lower()
    found = []
    for interest in INTEREST_UNIVERSE:
        pattern = r"(?:^|[\s,;|/\(\)\[\].]){}(?:[\s,;|/\(\)\[\].]|$)".format(
            re.escape(interest)
        )
        if re.search(pattern, text_lower):
            found.append(interest)
    return found


def guess_education(text: str) -> list[int]:
    """Guess education level from resume text."""
    text_lower = text.lower()
    if any(kw in text_lower for kw in ["phd", "ph.d", "doctorate", "doctoral"]):
        return [0, 0, 1]
    elif any(kw in text_lower for kw in ["master", "m.s.", "m.sc", "mba", "m.tech", "mtech", "m.e."]):
        return [0, 1, 0]
    else:
        return [1, 0, 0]  # Default to bachelor's


def guess_age_norm(text: str) -> float:
    """Try to extract age, otherwise default to 0.5 (25 years normalised)."""
    import re as re_mod
    match = re_mod.search(r"\b(1[8-9]|[2-6][0-9])\s*(?:years?\s*old|yrs?)\b", text.lower())
    if match:
        return float(match.group(1)) / 50.0
    return 0.5


def build_feature_vector(skills: list[str], interests: list[str], edu_vec: list[int], age_norm: float) -> list[float]:
    """Build the same feature vector used during training."""
    skill_vec = [1 if s in skills else 0 for s in SKILL_UNIVERSE]
    interest_vec = [1 if i in interests else 0 for i in INTEREST_UNIVERSE]
    return skill_vec + interest_vec + edu_vec + [age_norm]


# --- Roadmap generator ---

LEARNING_RESOURCES = {
    "python": {"title": "Master Python", "desc": "Complete Python 3 bootcamp with projects", "duration": "4 weeks"},
    "java": {"title": "Java Masterclass", "desc": "OOP, collections, streams, and Spring Boot", "duration": "5 weeks"},
    "javascript": {"title": "JavaScript Mastery", "desc": "Modern ES6+ and async patterns", "duration": "3 weeks"},
    "machine learning": {"title": "Applied Machine Learning", "desc": "Supervised & unsupervised learning", "duration": "8 weeks"},
    "deep learning": {"title": "Deep Learning Specialization", "desc": "CNNs, RNNs, Transformers", "duration": "8 weeks"},
    "data analysis": {"title": "Data Analysis with Python", "desc": "Pandas, NumPy, data wrangling", "duration": "4 weeks"},
    "cloud computing": {"title": "Cloud Computing Fundamentals", "desc": "AWS, Azure, GCP essentials", "duration": "6 weeks"},
    "system design": {"title": "System Design Mastery", "desc": "Scalability, distributed systems", "duration": "6 weeks"},
    "project management": {"title": "Project Management Pro", "desc": "Agile, Scrum, PMP preparation", "duration": "4 weeks"},
    "graphic design": {"title": "Graphic Design Bootcamp", "desc": "Adobe Creative Suite mastery", "duration": "5 weeks"},
    "ui/ux": {"title": "UI/UX Design", "desc": "Figma, user research, prototyping", "duration": "5 weeks"},
    "cybersecurity": {"title": "Cybersecurity Fundamentals", "desc": "Threats, defense, compliance", "duration": "6 weeks"},
    "statistics": {"title": "Statistics for Data Science", "desc": "Probability, hypothesis testing, regression", "duration": "4 weeks"},
    "nlp": {"title": "Natural Language Processing", "desc": "Text analysis, LLMs, transformers", "duration": "6 weeks"},
    "sql": {"title": "SQL & Database Design", "desc": "Queries, optimization, schema design", "duration": "3 weeks"},
    "communication": {"title": "Professional Communication", "desc": "Business writing, presentations", "duration": "2 weeks"},
    "agile": {"title": "Agile Methodology", "desc": "Scrum, Kanban, sprint planning", "duration": "2 weeks"},
    "digital marketing": {"title": "Digital Marketing", "desc": "SEO, SEM, social media strategy", "duration": "4 weeks"},
    "financial analysis": {"title": "Financial Modeling", "desc": "Excel, valuation, forecasting", "duration": "5 weeks"},
    "r": {"title": "R for Statistical Computing", "desc": "Data visualization and analysis in R", "duration": "4 weeks"},
    "tensorflow": {"title": "TensorFlow Deep Learning", "desc": "Build and train neural networks", "duration": "6 weeks"},
    "react": {"title": "React & Next.js", "desc": "Build production React applications", "duration": "5 weeks"},
    "docker": {"title": "Docker & Containers", "desc": "Containerize and deploy applications", "duration": "2 weeks"},
    "kubernetes": {"title": "Kubernetes Orchestration", "desc": "Deploy and scale with K8s", "duration": "3 weeks"},
}


def generate_roadmap(missing_skills: list[str]) -> list[dict]:
    """Create a learning roadmap for the missing skills."""
    roadmap = []
    for i, skill in enumerate(missing_skills[:6]):  # top 6 gaps
        resource = LEARNING_RESOURCES.get(skill, {
            "title": f"Learn {skill.title()}",
            "desc": f"Build proficiency in {skill}",
            "duration": "4 weeks",
        })
        roadmap.append({
            "step": i + 1,
            "skill": skill,
            "title": resource["title"],
            "description": resource["desc"],
            "duration": resource["duration"],
        })
    return roadmap


# --- API endpoint ---

@app.route("/predict-career", methods=["POST"])
def predict_career():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No resume file provided"}), 400

        file = request.files["resume"]
        filename = file.filename.lower() if file.filename else ""

        if filename.endswith(".pdf"):
            text = extract_text_pdf(file)
        elif filename.endswith(".docx"):
            text = extract_text_docx(file)
        else:
            return jsonify({"error": "Unsupported file format. Please upload PDF or DOCX."}), 400

        if len(text.strip()) < 20:
            return jsonify({"error": "Could not extract enough text from the resume."}), 400

        # Extract features from resume text
        skills = extract_skills(text)
        interests = extract_interests(text)
        edu_vec = guess_education(text)
        age_norm = guess_age_norm(text)

        if len(skills) == 0 and len(interests) == 0:
            return jsonify({"error": "No recognisable skills or interests found in resume. Please ensure your resume lists technical skills."}), 400

        # Build feature vector (same shape as training)
        feature_vec = [build_feature_vector(skills, interests, edu_vec, age_norm)]

        # Predict career
        career_idx = clf.predict(feature_vec)[0]
        career_path = le.inverse_transform([career_idx])[0]

        # Confidence
        probabilities = clf.predict_proba(feature_vec)[0]
        confidence = float(round(max(probabilities) * 100, 1))

        # Salary
        salary_raw = reg.predict(feature_vec)[0]
        estimated_salary = int(max(30000, min(250000, salary_raw)))

        # Skill gap analysis
        ideal_skills = CAREER_SKILL_PROFILES.get(career_path, [])
        missing_skills = [s for s in ideal_skills if s not in skills]

        # Roadmap
        roadmap = generate_roadmap(missing_skills)

        # Skill gap detail for UI
        skill_gap_analysis = []
        for s in ideal_skills:
            skill_gap_analysis.append({
                "skill": s,
                "have": s in skills,
                "importance": 100 if s in skills else 0,
            })

        return jsonify({
            "career_path": career_path,
            "estimated_salary": estimated_salary,
            "confidence_score": confidence,
            "detected_skills": skills,
            "detected_interests": interests,
            "missing_skills": missing_skills,
            "skill_gap_analysis": skill_gap_analysis,
            "roadmap": roadmap,
            "total_skills_detected": len(skills),
            "total_skills_missing": len(missing_skills),
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# --- Interview Answer Evaluation endpoint ---

@app.route("/evaluate-answer", methods=["POST"])
def evaluate_answer():
    """Evaluate a user's interview answer against the question.
    Body JSON: { question, answer, ideal_answer? }
    Returns: { score, feedback, improvementTips }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        question = data.get("question", "").strip()
        user_answer = data.get("answer", "").strip()
        ideal_answer = data.get("ideal_answer", "").strip()

        if not question or not user_answer:
            return jsonify({"error": "Both question and answer are required"}), 400

        # ── Scoring logic ──
        score = 0
        feedback_parts = []
        tips = []

        user_lower = user_answer.lower()
        user_words = set(re.findall(r'\b[a-z]{2,}\b', user_lower))
        user_len = len(user_answer.split())

        # 1. Length check (0-2 points)
        if user_len >= 50:
            score += 2
            feedback_parts.append("Your answer is well-detailed and thorough.")
        elif user_len >= 25:
            score += 1.5
            feedback_parts.append("Your answer has good detail.")
        elif user_len >= 10:
            score += 1
            feedback_parts.append("Your answer could be more detailed.")
            tips.append("Try to elaborate more — aim for at least 3-4 sentences with specific examples.")
        else:
            score += 0.5
            feedback_parts.append("Your answer is too short.")
            tips.append("Expand your answer significantly — provide examples, explanations, and demonstrate depth of knowledge.")

        # 2. Relevance to question (0-3 points)
        question_lower = question.lower()
        question_words = set(re.findall(r'\b[a-z]{3,}\b', question_lower))
        # Remove common stop words
        stop_words = {"the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
                      "her", "was", "one", "our", "out", "has", "have", "been", "will", "each",
                      "make", "like", "how", "what", "when", "who", "why", "where", "which",
                      "this", "that", "with", "from", "your", "about", "would", "there", "their",
                      "explain", "describe", "tell", "time", "give", "example"}
        q_keywords = question_words - stop_words
        overlap = user_words & q_keywords
        if len(q_keywords) > 0:
            relevance = len(overlap) / len(q_keywords)
        else:
            relevance = 0.5
        score += min(3, relevance * 4)
        if relevance >= 0.5:
            feedback_parts.append("Your answer is relevant to the question asked.")
        elif relevance >= 0.2:
            feedback_parts.append("Your answer partially addresses the question.")
            tips.append("Focus more directly on what the question is asking.")
        else:
            feedback_parts.append("Your answer doesn't seem to fully address the question.")
            tips.append("Re-read the question carefully and make sure your answer directly addresses each part of it.")

        # 3. Match with ideal answer (0-3 points) — if ideal answer provided
        if ideal_answer:
            ideal_lower = ideal_answer.lower()
            ideal_words = set(re.findall(r'\b[a-z]{3,}\b', ideal_lower)) - stop_words
            if ideal_words:
                ideal_overlap = user_words & ideal_words
                match_ratio = len(ideal_overlap) / len(ideal_words)
                score += min(3, match_ratio * 4)
                if match_ratio >= 0.4:
                    feedback_parts.append("Your answer covers key concepts expected by interviewers.")
                elif match_ratio >= 0.15:
                    feedback_parts.append("You touched on some key points, but missed several important ones.")
                    tips.append("Study the expected answer and incorporate more relevant keywords and concepts.")
                else:
                    feedback_parts.append("Your answer misses most of the key concepts interviewers look for.")
                    tips.append("Research this topic more deeply and practice including technical keywords in your response.")
            else:
                score += 1.5  # Default if no ideal words
        else:
            score += 1.5  # No ideal answer to compare

        # 4. Structure and clarity (0-2 points)
        has_examples = any(w in user_lower for w in ["example", "instance", "such as", "like when", "for example", "specifically"])
        has_structure = any(w in user_lower for w in ["first", "second", "finally", "additionally", "moreover", "however", "because"])

        if has_examples and has_structure:
            score += 2
            feedback_parts.append("Great use of examples and structured reasoning.")
        elif has_examples:
            score += 1.5
            feedback_parts.append("Good use of examples to support your answer.")
            tips.append("Add more structure — use transition words like 'First...', 'Additionally...' to organize your thoughts.")
        elif has_structure:
            score += 1
            feedback_parts.append("Your answer is well-structured.")
            tips.append("Include specific examples from your experience to make your answer more compelling and memorable.")
        else:
            score += 0.5
            tips.append("Use concrete examples and structure your answer with clear points (e.g., 'First... Second... Finally...').")

        # Clamp score 1-10
        score = max(1, min(10, round(score)))

        # Build response
        feedback = " ".join(feedback_parts)
        improvement_tips = " ".join(tips[:2]) if tips else "Keep practicing and focus on providing specific, detailed responses with real-world examples."

        return jsonify({
            "score": score,
            "feedback": feedback,
            "improvementTips": improvement_tips,
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



from question_bank import get_questions

# ═══════════════════════════════════════════════════════════════════════
#  AI SERVICE IMPORTS
# ═══════════════════════════════════════════════════════════════════════

import sys
sys.path.insert(0, os.path.dirname(__file__))

from services.ai_service import check_ai_health
from services import assistant_service
from services import interview_service
from services import resume_service
from services import career_service
from services import aptitude_service
from services import code_service
from services import study_service
from services import memory_service


# ═══════════════════════════════════════════════════════════════════════
#  AI API — CHAT ASSISTANT
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    """AI Assistant — ChatGPT-like conversation."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        message = data.get("message", "").strip()
        history = data.get("history", [])
        user_id = data.get("userId")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        result = assistant_service.chat(message, history=history, user_id=user_id)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/extract-text", methods=["POST"])
def ai_extract_text():
    """Extract text from an uploaded resume/document for AI Chat context."""
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        filename = file.filename.lower() if file.filename else ""

        if filename.endswith(".pdf"):
            text = extract_text_pdf(file)
        elif filename.endswith(".docx"):
            text = extract_text_docx(file)
        elif filename.endswith(".txt"):
            text = file.read().decode("utf-8", errors="ignore")
        else:
            return jsonify({"error": "Unsupported file format. Please upload PDF, DOCX, or TXT."}), 400

        if len(text.strip()) < 5:
            return jsonify({"error": "Could not extract sufficient text from the file."}), 400

        # Limit text length to prevent local LLM context window crashes (e.g. max 10000 chars)
        text = text[:10000]

        return jsonify({"text": text.strip()}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — MOCK INTERVIEW
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/interview/questions", methods=["POST"])
def ai_interview_questions():
    """Generate interview questions using AI."""
    try:
        data = request.get_json() or {}
        job_title = data.get("jobTitle", "Software Engineer")
        experience = data.get("experience", "3-5")
        interview_type = data.get("type", "mixed")
        count = min(10, max(1, int(data.get("count", 5))))

        result = interview_service.generate_questions(job_title, experience, interview_type, count)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/interview/evaluate", methods=["POST"])
def ai_interview_evaluate():
    """Evaluate an interview answer using AI."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()
        user_id = data.get("userId")

        if not question or not answer:
            return jsonify({"error": "Question and answer are required"}), 400

        result = interview_service.evaluate_answer(question, answer, user_id=user_id)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/interview/follow-up", methods=["POST"])
def ai_interview_followup():
    """Generate a follow-up question."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        question = data.get("question", "").strip()
        answer = data.get("answer", "").strip()

        if not question or not answer:
            return jsonify({"error": "Question and answer are required"}), 400

        result = interview_service.generate_follow_up(question, answer)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — RESUME ATS ANALYSIS
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/resume/analyze", methods=["POST"])
def ai_resume_analyze():
    """Analyze resume for ATS compatibility."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        resume_text = data.get("resumeText", "").strip()
        if not resume_text:
            return jsonify({"error": "Resume text is required"}), 400

        result = resume_service.analyze_resume(resume_text)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — CAREER NAVIGATOR
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/career/insight", methods=["POST"])
def ai_career_insight():
    """Generate AI career insight."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        career_path = data.get("careerPath", "")
        detected_skills = data.get("detectedSkills", [])
        missing_skills = data.get("missingSkills", [])

        if not career_path:
            return jsonify({"error": "Career path is required"}), 400

        result = career_service.generate_career_insight(career_path, detected_skills, missing_skills)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — APTITUDE
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/aptitude/generate", methods=["POST"])
def ai_aptitude_generate():
    """Generate aptitude questions using AI."""
    try:
        data = request.get_json() or {}
        category = data.get("category", "quantitative")
        count = min(20, max(1, int(data.get("count", 5))))
        difficulty = data.get("difficulty", "medium")

        result = aptitude_service.generate_questions(category, count, difficulty)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/aptitude/explain", methods=["POST"])
def ai_aptitude_explain():
    """Explain an aptitude answer using AI."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        question = data.get("question", "").strip()
        correct_answer = data.get("correctAnswer", "").strip()

        if not question:
            return jsonify({"error": "Question is required"}), 400

        explanation = aptitude_service.explain_answer(question, correct_answer)
        return jsonify({"explanation": explanation}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — CODE EVALUATION
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/code/evaluate", methods=["POST"])
def ai_code_evaluate():
    """Execute code against test cases and optionally analyze with AI."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        code = data.get("code", "")
        language = data.get("language", "python")
        test_cases = data.get("testCases", [])
        analyze = data.get("analyze", False)

        if not code:
            return jsonify({"error": "Code is required"}), 400

        # Run code against test cases
        exec_result = code_service.evaluate_code(code, language, test_cases)

        # Optionally add AI analysis
        if analyze:
            error_msg = exec_result.get("error") if not exec_result.get("passed") else None
            analysis = code_service.analyze_code_with_ai(code, language, error=error_msg)
            exec_result["analysis"] = analysis

        return jsonify(exec_result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/code/run", methods=["POST"])
def ai_code_run():
    """Run code with custom input (no test case validation)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        code = data.get("code", "")
        language = data.get("language", "python")
        stdin_input = data.get("input", "")

        if not code:
            return jsonify({"error": "Code is required"}), 400

        result = code_service.run_code(code, language, stdin_input=stdin_input)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/api/ai/code/analyze", methods=["POST"])
def ai_code_analyze():
    """Analyze code with AI (time complexity, suggestions)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON body"}), 400

        code = data.get("code", "")
        language = data.get("language", "python")
        error = data.get("error")

        if not code:
            return jsonify({"error": "Code is required"}), 400

        result = code_service.analyze_code_with_ai(code, language, error=error)
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  AI API — STUDY ASSISTANT
# ═══════════════════════════════════════════════════════════════════════

@app.route("/api/ai/study/plan", methods=["POST"])
def ai_study_plan():
    """Generate personalized study plan based on user progress."""
    try:
        data = request.get_json() or {}

        dsa_progress = data.get("dsaProgress")
        aptitude_accuracy = data.get("aptitudeAccuracy")
        interview_performance = data.get("interviewPerformance")

        result = study_service.analyze_and_plan(
            dsa_progress=dsa_progress,
            aptitude_accuracy=aptitude_accuracy,
            interview_performance=interview_performance,
        )
        return jsonify(result), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  INTERVIEW QUESTION BANK (dataset)
# ═══════════════════════════════════════════════════════════════════════

@app.route("/interview-questions", methods=["GET"])
def interview_questions():
    """Return random interview questions from the dataset bank.
    Query params: type, category, difficulty, role, count
    """
    try:
        interview_type = request.args.get("type", "")       # behavioral / technical
        category = request.args.get("category", "")          # e.g. Python, ML
        difficulty = request.args.get("difficulty", "")       # Easy / Medium / Hard
        role = request.args.get("role", "")                  # e.g. Software Engineer
        count = int(request.args.get("count", "5"))
        count = max(1, min(20, count))                       # clamp 1-20

        questions = get_questions(
            interview_type=interview_type,
            category=category,
            difficulty=difficulty,
            role=role,
            count=count,
        )
        return jsonify({"questions": questions, "total": len(questions)})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════

@app.route("/health", methods=["GET"])
def health():
    ai_status = check_ai_health()
    return jsonify({
        "status": "ok",
        "models_loaded": True,
        "ai": ai_status,
    })


if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    port = int(os.getenv("FLASK_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "true").lower() == "true"
    ai_status = check_ai_health()
    print(f"Interview Express backend running on http://localhost:{port}")
    print(f"AI Provider: {ai_status.get('provider', 'unknown')} | Status: {ai_status.get('status', 'unknown')}")
    app.run(debug=debug, port=port)

