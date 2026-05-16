"""
HireSense-AI Pro — Pydantic Request/Response Schemas
"""
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]


class AnalysisResponse(BaseModel):
    id: int
    filename: str
    job_role: str
    language: Optional[str] = "English"
    ats_score: float
    keyword_score: float
    format_score: float
    readability_score: float
    experience_score: Optional[float] = 0
    missing_keywords: List[str]
    found_keywords: List[str]
    weak_verbs: List[Dict]
    suggestions: List[str]
    section_analysis: Dict[str, Any]
    improved_summary: Optional[str]
    rewritten_resume: Optional[str] = ""
    skills_to_add: List[str]
    strengths: Optional[List[str]] = []
    critical_issues: Optional[List[str]] = []
    grammar_issues: Optional[List[Dict]] = []
    score_breakdown: Optional[Dict] = {}
    industry_tips: Optional[List[str]] = []
    interview_questions: Optional[List[str]] = []
    career_roadmap: Optional[Dict] = {}
    overall_assessment: Optional[str] = ""
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryItem(BaseModel):
    id: int
    filename: str
    job_role: str
    ats_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class RewriteRequest(BaseModel):
    analysis_id: int
    target_role: Optional[str] = None


class LinkedInRequest(BaseModel):
    linkedin_text: str
    target_role: str


class RankingItem(BaseModel):
    filename: str
    resume_text: str


class RankingRequest(BaseModel):
    resumes: List[RankingItem]
    job_description: str
