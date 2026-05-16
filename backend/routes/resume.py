"""
HireSense-AI Pro — Resume Analysis Routes
POST /api/resume/upload   — upload + analyze resume
GET  /api/resume/history  — list user's analyses
GET  /api/resume/report/{id} — get a specific report
DELETE /api/resume/history/{id} — delete a report
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from database import get_db
from models.user import User
from models.analysis import ResumeAnalysis
from models.schemas import HistoryItem
from utils.auth_utils import get_current_user
from utils.resume_parser import extract_resume_text
from utils.ai_analyzer import analyze_resume_with_ai, detect_language
from config import settings

router = APIRouter()

ALLOWED_ROLES = [
    "Software Developer", "Frontend Developer", "Backend Developer",
    "Data Analyst", "Data Scientist", "UI/UX Designer",
    "Product Manager", "DevOps Engineer", "Marketing Specialist",
    "Business Analyst", "General",
]

MAX_FILE_SIZE = settings.MAX_FILE_SIZE_MB * 1024 * 1024


@router.post("/upload")
async def upload_and_analyze(
    file: UploadFile = File(...),
    job_role: str = Form(default="General"),
    job_description: str = Form(default=""),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload a PDF/DOCX resume, extract text, run full AI analysis, save to DB."""
    if job_role not in ALLOWED_ROLES:
        job_role = "General"

    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files supported.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large (max {settings.MAX_FILE_SIZE_MB}MB).")

    try:
        resume_text = extract_resume_text(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    if len(resume_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Could not extract sufficient text. Use a text-based PDF.")

    # Detect language
    language = await detect_language(resume_text)

    # Run AI analysis
    analysis = await analyze_resume_with_ai(resume_text, job_role, job_description, language)

    # Save to database
    record = ResumeAnalysis(
        user_id=current_user.id,
        filename=file.filename,
        job_role=job_role,
        language=language,
        ats_score=analysis.get("ats_score", 0),
        keyword_score=analysis.get("keyword_score", 0),
        format_score=analysis.get("format_score", 0),
        readability_score=analysis.get("readability_score", 0),
        experience_score=analysis.get("experience_score", 0),
        missing_keywords=analysis.get("missing_keywords", []),
        found_keywords=analysis.get("found_keywords", []),
        weak_verbs=analysis.get("weak_verbs", []),
        suggestions=analysis.get("suggestions", []),
        section_analysis=analysis.get("section_analysis", {}),
        improved_summary=analysis.get("improved_summary", ""),
        skills_to_add=analysis.get("skills_to_add", []),
        strengths=analysis.get("strengths", []),
        critical_issues=analysis.get("critical_issues", []),
        grammar_issues=analysis.get("grammar_issues", []),
        score_breakdown=analysis.get("score_breakdown", {}),
        industry_tips=analysis.get("industry_tips", []),
        interview_questions=analysis.get("interview_questions", []),
        career_roadmap=analysis.get("career_roadmap", {}),
        overall_assessment=analysis.get("overall_assessment", ""),
        resume_text=resume_text[:6000],
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)

    return {
        "id": record.id,
        "filename": record.filename,
        "job_role": record.job_role,
        "language": record.language,
        "ats_score": record.ats_score,
        "keyword_score": record.keyword_score,
        "format_score": record.format_score,
        "readability_score": record.readability_score,
        "experience_score": record.experience_score,
        "missing_keywords": record.missing_keywords,
        "found_keywords": record.found_keywords,
        "weak_verbs": record.weak_verbs,
        "suggestions": record.suggestions,
        "section_analysis": record.section_analysis,
        "improved_summary": record.improved_summary,
        "skills_to_add": record.skills_to_add,
        "strengths": record.strengths,
        "critical_issues": record.critical_issues,
        "grammar_issues": record.grammar_issues,
        "score_breakdown": record.score_breakdown,
        "industry_tips": record.industry_tips,
        "interview_questions": record.interview_questions,
        "career_roadmap": record.career_roadmap,
        "overall_assessment": record.overall_assessment,
        "created_at": record.created_at,
    }


@router.get("/history", response_model=List[HistoryItem])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ResumeAnalysis)
        .where(ResumeAnalysis.user_id == current_user.id)
        .order_by(ResumeAnalysis.created_at.desc())
    )
    return result.scalars().all()


@router.get("/report/{analysis_id}")
async def get_report(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    return record


@router.delete("/history/{analysis_id}")
async def delete_report(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Report not found")
    await db.delete(record)
    await db.commit()
    return {"message": "Report deleted"}
