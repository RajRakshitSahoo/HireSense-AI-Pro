"""
HireSense-AI Pro — Advanced AI Features Routes
POST /api/advanced/rewrite        — AI resume rewriting
POST /api/advanced/template       — Resume template generator
POST /api/advanced/linkedin       — LinkedIn profile analysis
POST /api/advanced/interview-prep — Interview question generator
POST /api/advanced/rank           — Resume ranking system
POST /api/advanced/career-roadmap — Career roadmap suggestions
GET  /api/advanced/grammar/{id}   — Real-time grammar check
"""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List

from database import get_db
from models.user import User
from models.analysis import ResumeAnalysis
from models.schemas import RewriteRequest, LinkedInRequest, RankingRequest
from utils.auth_utils import get_current_user
from utils.ai_analyzer import (
    rewrite_resume_with_ai,
    generate_interview_questions,
    analyze_linkedin_profile,
    generate_career_roadmap,
    rank_resumes,
    generate_template,
)

router = APIRouter()


@router.post("/rewrite")
async def rewrite_resume(
    body: RewriteRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate an AI-rewritten, ATS-optimized version of the resume."""
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == body.analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    rewritten = await rewrite_resume_with_ai(
        record.resume_text,
        record.job_role,
        body.target_role,
    )

    # Save rewritten version
    record.rewritten_resume = rewritten
    await db.commit()

    return {"rewritten_resume": rewritten, "analysis_id": body.analysis_id}


@router.post("/template")
async def get_resume_template(
    job_role: str = Body(..., embed=True),
    level: str = Body(default="mid", embed=True),
    current_user: User = Depends(get_current_user),
):
    """Generate a professional resume template for a given role and level."""
    template = await generate_template(job_role, level)
    return {"template": template, "job_role": job_role, "level": level}


@router.post("/linkedin")
async def linkedin_analysis(
    body: LinkedInRequest,
    current_user: User = Depends(get_current_user),
):
    """Analyze a LinkedIn profile and provide optimization suggestions."""
    if len(body.linkedin_text) < 50:
        raise HTTPException(status_code=400, detail="LinkedIn text too short")

    result = await analyze_linkedin_profile(body.linkedin_text, body.target_role)
    return result


@router.post("/interview-prep")
async def interview_prep(
    analysis_id: int = Body(..., embed=True),
    count: int = Body(default=15, embed=True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate tailored interview questions based on the resume."""
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    questions = await generate_interview_questions(
        record.resume_text,
        record.job_role,
        count=count,
    )

    # Update stored questions
    record.interview_questions = questions
    await db.commit()

    return {"interview_questions": questions, "job_role": record.job_role}


@router.post("/rank")
async def rank_resumes_endpoint(
    body: RankingRequest,
    current_user: User = Depends(get_current_user),
):
    """Rank multiple resumes against a job description."""
    if len(body.resumes) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 resumes to rank")
    if len(body.resumes) > 20:
        raise HTTPException(status_code=400, detail="Maximum 20 resumes per ranking request")

    resumes = [{"filename": r.filename, "resume_text": r.resume_text} for r in body.resumes]
    ranked = await rank_resumes(resumes, body.job_description)
    return {"ranked_resumes": ranked, "total": len(ranked)}


@router.post("/career-roadmap")
async def career_roadmap(
    analysis_id: int = Body(..., embed=True),
    target_role: Optional[str] = Body(default=None, embed=True),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate a personalized career roadmap."""
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    roadmap = await generate_career_roadmap(
        record.resume_text,
        record.job_role,
        target_role,
    )

    record.career_roadmap = roadmap
    await db.commit()

    return roadmap


@router.get("/grammar/{analysis_id}")
async def grammar_check(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return grammar issues for a specific analysis."""
    result = await db.execute(
        select(ResumeAnalysis).where(
            ResumeAnalysis.id == analysis_id,
            ResumeAnalysis.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return {
        "grammar_issues": record.grammar_issues or [],
        "total_issues": len(record.grammar_issues or []),
    }
