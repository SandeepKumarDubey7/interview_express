# 🚀 Interview Express — Complete Interview Preparation Platform

Interview Express is a fully-featured, AI-powered web application encompassing a modern UI and an advanced full-stack architecture. It is designed to prepare users for technical interviews by combining persistent **MongoDB Atlas** tracking, **Flask ML backend** predictions, and a **Hybrid AI Architecture** using both local **Ollama models (qwen2.5:3b)** and cloud **Groq API models (LLaMA-3.3-70b)** for dynamic, performant AI interactions.

---

## 📖 Table of Contents

1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [How to Run](#-how-to-run)
5. [Hybrid AI Integration](#-hybrid-ai-integration)
6. [Architecture Overview](#-architecture-overview)

---

## 🏆 Key Features

- **Hybrid AI Pipeline:** Dynamically switches between Groq (Cloud/Production) and Ollama (Local/Development) for optimized latency and zero-cost local execution during development.
- **DSA Practice & Code Evaluator:** An integrated **Monaco code editor** allows users to write algorithms in multiple languages. Using AI-driven mental execution, test cases are automatically validated.
- **Interactive Mock Interviews:** Simulates real interview environments with **Web Speech API** voice-to-text dictation and real-time AI scoring and feedback.
- **Career Navigator (ML-Driven):** Upload a resume (PDF/DOCX) to get instant scikit-learn ML predictions on optimal career paths, alongside AI-generated learning roadmaps.
- **Aptitude Practice:** Take logical, quantitative, and verbal reasoning tests with AI explaining the "why" behind correct answers.
- **Progress Tracking:** Persistent XP, streaks, badges, and user statistics tracked and stored securely via MongoDB.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI components and Single Page Application routing |
| **Bundler** | Vite | Fast development server and optimized build tool |
| **Styling** | Tailwind CSS + shadcn/ui | Modern, responsive, and accessible UI components |
| **Code Editor** | Monaco Editor | VS Code-like coding environment for DSA |
| **Backend** | Flask (Python) | REST API and ML predictions |
| **Database** | MongoDB Atlas | Persistent NoSQL user data and metrics storage |
| **AI Subsystem**| Groq API & Ollama | LLM provider for code eval, mock interviews, and resume analysis |
| **ML Engine** | scikit-learn | AI-based Career Recommendation modeling |

---

## 📁 Project Structure

The project strictly separates the React frontend and the Python backend for scalable deployments.

```text
Interview-Express-main/
│
├── .env                          # Global environment variables
├── .gitignore                    # Ignored files
├── README.md                     # Project documentation
│
├── frontend/                     # React / Vite Application
│   ├── package.json              # Frontend npm dependencies
│   ├── vite.config.ts            # Vite bundler config (dynamically reads root .env)
│   ├── tailwind.config.ts        # Tailwind CSS styling config
│   ├── index.html                # Entry HTML point
│   ├── public/                   # Static icons and assets
│   └── src/                      # Source code
│       ├── contexts/             # Global state (Auth, Progress, Theme)
│       ├── services/             # API queries and Code Execution
│       ├── pages/                # Route definitions (DSA, Career, Dashboard, etc.)
│       └── components/           # Reusable UI modules
│
└── backend/                      # Python / Flask Application
    ├── requirements.txt          # Python packages (Flask, scikit-learn, pymongo, etc.)
    ├── app.py                    # Main Flask server and API definitions
    ├── db.py                     # MongoDB connection pool
    ├── train_models.py           # Training pipeline for ML models
    ├── services/                 # Centralized AI router (auto-toggles Groq / Ollama)
    └── models/                   # Pickled ML models
```

---

## ⚡ How to Run

### Prerequisites
- [Node.js](https://nodejs.org/en/) 18+
- [Python](https://www.python.org/) 3.10+
- [Ollama](https://ollama.com/) installed locally to run AI offline via `qwen2.5:3b`.
- MongoDB Atlas account (Waitlist/Free tier works)

### 1. Setup Environment
Ensure your `.env` file exists at the root of the project with the necessary configurations:
```env
# ─── Ollama AI (Local / Development) ───
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:3b
OLLAMA_TIMEOUT=300

# ─── Groq AI (Cloud / Production) ───
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# ─── MongoDB ───
MONGODB_URI=your_mongo_connection_string
MONGODB_DB_NAME=interview_express

# ─── Backend & Frontend Configurations ───
FLASK_PORT=5000
FLASK_DEBUG=true
VITE_BACKEND_URL=http://localhost:5000
```

### 2. Start the Backend (Flask API)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
> The backend runs by default on `http://localhost:5000`

### 3. Start the Frontend (React SPA)
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The frontend runs by default on `http://localhost:8080` (or the port specified by Vite).

---

## 🤖 Hybrid AI Integration

Interview Express employs a highly advanced **Hybrid AI Architecture**. 

**The Challenge:** Standard cloud LLMs run securely online, but strict rate limits exist, and evaluating dozens of local code tests is inherently slower over a network.
**The Solution:** The backend integrates a unified AI router.
- When working offline or resolving real-time iterative problems (like executing logic within the Monaco Editor test cases), the backend taps into **Ollama (qwen2.5:3b)**.
- For heavier natural language extraction, conversational context, and production deployment, the backend shifts to the lightning-fast **Groq API**.

This dual-nature implementation enables offline-ready development, drastically reduces latency for coding validations, and prevents API rate limit exhaustion.

---

## 🏗 Architecture Overview

```text
┌──────────────────────────────────────────────────────────┐
│                    BROWSER (User)                         │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                   │  │
│  │                                                     │  │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────────┐     │  │
│  │  │ AuthCtx  │  │ProgressCtx │  │ DSAProgressCtx│    │  │
│  │  │(MongoDB) │  │ (MongoDB)  │  │  (MongoDB)    │    │  │
│  │  └────┬─────┘  └─────┬──────┘  └──────┬───────┘    │  │
│  │       │               │               │             │  │
│  │       └───────────────┼───────────────┘             │  │
│  │                       │                              │  │
│  │              ┌────────┴────────┐                     │  │
│  │              │  apiClient.ts   │                     │  │
│  │              │ (fetch wrapper) │                     │  │
│  │              └────────┬────────┘                     │  │
│  └───────────────────────┼─────────────────────────────┘  │
│                          │                                │
└──────────────────────────┼────────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          │                │                 │
          ▼                ▼                 ▼
    ┌──────────┐   ┌──────────────┐   ┌────────────┐
    │  Flask   │──▶│ Groq API /   │   │  MongoDB   │
    │ Backend  │   │ Ollama LLM   │   │   Atlas    │
    │:5000     │◀──│ (Router)     │   │  (Cloud)   │
    ├──────────┤   ├──────────────┤   ├────────────┤
    │/api/auth │   │ Code Analysis│   │ users      │
    │/api/prog │   │ Mock Interv. │   │ progress   │
    │/predict  │   │ Career Tips  │   │ dsa_prog   │
    └──────────┘   └──────────────┘   └────────────┘
```

---

## 📝 License

This project is intended as a technical portfolio project showcasing Modern LLM Application Design and Full-Stack capability.
