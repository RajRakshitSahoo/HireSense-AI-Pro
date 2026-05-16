<div align="center">

# 🧠 HireSense-AI Pro

### Advanced AI-Powered Resume Analyzer & Career Coach

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Claude](https://img.shields.io/badge/Claude-claude--sonnet--4-CC785C?style=flat-square)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Make your resume ATS-ready in seconds. Get AI-powered analysis, keyword matching, interview prep, and a personalized career roadmap — all in one platform.**

[🚀 Live Demo](#demo) · [📖 Docs](#installation) · [🐛 Issues](https://github.com/your-username/hiresense-ai-pro/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Setup](#api-setup)
- [Folder Structure](#folder-structure)
- [Demo](#demo)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)
- [License](#license)

---

## 🌟 Overview

**HireSense-AI Pro** is a full-stack, AI-powered resume analyzer that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). It combines three powerful analyzers into one unified platform, using state-of-the-art language models (Claude, Gemini, or GPT-4) alongside a fast local NLP engine for instant scoring — with no API cost.

Whether you're a fresh graduate or a senior engineer, HireSense-AI Pro gives you the edge to land more interviews.

---

## ✨ Features

### Core Analysis
- **🎯 ATS Score** — Real-time ATS compatibility scoring (0-100) with detailed breakdown
- **🔑 Keyword Detection** — Find missing and present keywords vs. job descriptions
- **📊 Section Analysis** — Individual scoring for Contact, Summary, Experience, Education, Skills, Projects
- **💪 Action Verb Enhancer** — Detect weak verbs and suggest powerful alternatives
- **📝 Grammar Checker** — Real-time grammar and style issue detection

### Advanced AI Features
- **🤖 AI Resume Rewriter** — Full AI-powered resume rewrite optimized for your target role
- **💼 LinkedIn Profile Analyzer** — Score and optimize your LinkedIn presence
- **🎤 Interview Question Generator** — 15 tailored interview questions based on your resume
- **🗺️ Career Roadmap** — Personalized 4-phase career growth plan with timelines
- **🏆 Resume Ranking System** — Compare and rank multiple resumes against a JD
- **🌐 Multi-language Analysis** — Detect and analyze resumes in 10+ languages
- **🏭 Industry-Specific Optimization** — Role-specific keyword banks for 10 job categories
- **📋 Resume Template Generator** — Professional templates for any role and level

### Platform
- **🔐 JWT Authentication** — Secure login/register with token-based auth
- **📜 Analysis History** — Save, view, and delete all past analyses
- **🌙 Dark Mode** — Sleek dark-first design with light mode support
- **📱 Fully Responsive** — Mobile-first design that works on all devices
- **⚡ Fast & Free Local Scoring** — Inline NLP engine runs without any API calls

---

## 📸 Screenshots

### Home Page
> Hero section with animated gradient, feature cards, and role ticker

### Upload & Analysis
> Drag-and-drop upload, role selection, and analysis loading animation

### Report Dashboard
> Score rings, radar charts, keyword badges, section analysis, and AI suggestions

### Advanced AI Features
> Feature hub with resume rewriter, interview prep, career roadmap, and more

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite | Build tool & dev server |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations |
| Recharts | Data visualization (radar/bar charts) |
| Axios | HTTP client with JWT interceptor |
| React Router v6 | Client-side routing |
| React Dropzone | File upload UX |
| Lucide React | Icon system |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | Async Python web framework |
| SQLAlchemy 2 (async) | ORM with async support |
| aiosqlite | SQLite async driver (default) |
| pdfplumber | PDF text extraction |
| python-docx | DOCX text extraction |
| python-jose | JWT token handling |
| passlib/bcrypt | Password hashing |
| pydantic-settings | Environment configuration |

### AI Providers
| Provider | Model | Set `AI_PROVIDER=` |
|---------|-------|------------------|
| **Anthropic Claude** ⭐ | claude-sonnet-4-20250514 | `anthropic` |
| Google Gemini | gemini-1.5-flash | `gemini` |
| OpenAI GPT-4 | gpt-4o | `openai` |

---

## 🚀 Installation

### Prerequisites
- **Python 3.11+**
- **Node.js 18+**
- An API key from at least one AI provider (see [API Setup](#api-setup))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hiresense-ai-pro.git
cd hiresense-ai-pro
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\Activate.ps1       # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env and add your API key (see API Setup below)

# Start the backend server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment (optional — defaults to localhost:8000)
cp .env.example .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## 🔑 API Setup

You need **at least one** AI provider API key. Claude is recommended for best quality.

### Option A: Anthropic Claude (Recommended)

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account and go to **API Keys**
3. Create a new key
4. Add to `backend/.env`:
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Option B: Google Gemini

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API key
3. Add to `backend/.env`:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=AIza-your-key-here
```
Also uncomment `google-generativeai` in `requirements.txt`.

### Option C: OpenAI GPT-4

1. Visit [platform.openai.com](https://platform.openai.com)
2. Go to **API Keys** → Create new secret key
3. Add to `backend/.env`:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```
Also uncomment `openai` in `requirements.txt`.

> **💡 Tip:** The platform works in fallback mode without any API key — it uses the built-in NLP scoring engine for ATS analysis (no AI deep analysis).

---

## 📁 Folder Structure

```
hiresense-ai-pro/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Settings (AI provider, DB, auth)
│   ├── database.py              # Async SQLAlchemy setup
│   ├── requirements.txt
│   ├── .env.example
│   ├── models/
│   │   ├── user.py              # User ORM model
│   │   ├── analysis.py          # ResumeAnalysis ORM model
│   │   └── schemas.py           # Pydantic request/response schemas
│   ├── routes/
│   │   ├── auth.py              # Register, Login, Me endpoints
│   │   ├── resume.py            # Upload, History, Report, Delete
│   │   └── advanced.py          # Rewrite, LinkedIn, Interview, Roadmap, Rank
│   └── utils/
│       ├── ai_analyzer.py       # Unified AI analyzer (Claude/Gemini/GPT + local NLP)
│       ├── resume_parser.py     # PDF & DOCX text extraction
│       └── auth_utils.py        # JWT + password hashing
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── App.jsx              # Root app with routing
│       ├── main.jsx             # React entry point
│       ├── index.css            # Global styles + Tailwind
│       ├── components/
│       │   ├── Navbar.jsx       # Sticky navigation with auth state
│       │   ├── Footer.jsx       # Footer with links
│       │   ├── DropZone.jsx     # Drag-and-drop file upload
│       │   ├── ScoreRing.jsx    # Animated circular score indicator
│       │   ├── ScoreBar.jsx     # Score progress bar
│       │   ├── SectionCard.jsx  # Per-section analysis card
│       │   ├── KeywordBadge.jsx # Found/missing keyword badges
│       │   └── AnalysisLoader.jsx # Loading animation
│       ├── pages/
│       │   ├── Home.jsx         # Landing page with features
│       │   ├── Upload.jsx       # Resume upload + role selection
│       │   ├── Report.jsx       # Full analysis report dashboard
│       │   ├── History.jsx      # Past analyses list
│       │   ├── AdvancedFeatures.jsx # AI tools hub
│       │   ├── About.jsx        # About page
│       │   ├── Contact.jsx      # Contact form
│       │   ├── Login.jsx        # Authentication
│       │   └── Register.jsx     # Account creation
│       ├── context/
│       │   ├── AuthContext.jsx  # Global auth state
│       │   └── ThemeContext.jsx # Dark/light mode toggle
│       └── utils/
│           ├── api.js           # Axios instance with JWT interceptor
│           └── helpers.js       # Score colors, labels, date formatting
│
└── README.md
```

---

## 🎬 Demo

### Quick Start Demo

```bash
# 1. Clone & install
git clone https://github.com/your-username/hiresense-ai-pro.git
cd hiresense-ai-pro

# 2. Add your API key
echo "ANTHROPIC_API_KEY=your-key" >> backend/.env
echo "AI_PROVIDER=anthropic" >> backend/.env

# 3. Start backend
cd backend && pip install -r requirements.txt && uvicorn main:app --reload &

# 4. Start frontend
cd ../frontend && npm install && npm run dev
```

Then open `http://localhost:5173`, register an account, and upload your resume!

### API Demo (cURL)

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"secret123"}'

# Upload & analyze resume
curl -X POST http://localhost:8000/api/resume/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf" \
  -F "job_role=Software Developer"
```

---

## 🔮 Future Improvements

- [ ] **Voice-Based Resume Review** — Upload audio, transcribe and analyze with Whisper
- [ ] **Resume Comparison Mode** — Side-by-side compare two versions of a resume
- [ ] **Job Board Integration** — Auto-fetch job descriptions from LinkedIn/Indeed
- [ ] **Browser Extension** — Analyze resumes directly from job listing pages
- [ ] **PDF Export** — Download full analysis report as a formatted PDF
- [ ] **Team/Enterprise Mode** — Multi-user workspaces for career coaches
- [ ] **Real-time Collaboration** — Share and co-edit resumes with mentors
- [ ] **ATS Simulation** — Simulate how specific ATS software would parse the resume
- [ ] **Salary Insights** — AI-powered salary range recommendations by role/location
- [ ] **Portfolio Analyzer** — Analyze GitHub, Behance, or Dribbble portfolios

---

## 👥 Contributors

| Name | Role |
|------|------|
| Raj Rakshit Sahoo | Web Developer |

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) and open a pull request.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for job seekers everywhere**

[⭐ Star this repo](https://github.com/your-username/hiresense-ai-pro) · [🐛 Report a bug](https://github.com/your-username/hiresense-ai-pro/issues) · [💡 Request a feature](https://github.com/your-username/hiresense-ai-pro/issues)

</div>
