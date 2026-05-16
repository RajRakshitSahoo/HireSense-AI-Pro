"""
HireSense-AI Pro — FastAPI Backend Entry Point
===============================================
Combines HireSense-AI + ATS Resume Analyzer + ATS-Analyzer
Advanced AI-powered resume analysis with Claude/Gemini/OpenAI support.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from database import create_tables
from routes import auth, resume, advanced
from config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    await create_tables()
    print("✅ Database tables created")
    yield
    print("👋 Shutting down HireSense-AI Pro")


app = FastAPI(
    title="HireSense-AI Pro API",
    description="Advanced AI-powered Resume Analyzer — Claude · Gemini · GPT-4",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth.router,     prefix="/api/auth",     tags=["Authentication"])
app.include_router(resume.router,   prefix="/api/resume",   tags=["Resume"])
app.include_router(advanced.router, prefix="/api/advanced", tags=["Advanced AI"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "service":  "HireSense-AI Pro",
        "status":   "running",
        "version":  "2.0.0",
        "docs":     "/docs",
        "features": [
            "AI Resume Analysis (Claude/Gemini/GPT-4)",
            "ATS Score + Keyword Matching",
            "AI Resume Rewriting",
            "Interview Question Generator",
            "Career Roadmap Suggestions",
            "Multi-language Analysis",
            "Industry-Specific Optimization",
            "LinkedIn Profile Analysis",
            "Resume Template Generator",
            "Real-time Grammar Correction",
        ],
    }


@app.get("/api/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
