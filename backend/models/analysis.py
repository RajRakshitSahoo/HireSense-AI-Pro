"""
HireSense-AI Pro — ResumeAnalysis ORM Model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id"), nullable=False)

    # File info
    filename         = Column(String(200))
    job_role         = Column(String(100))
    language         = Column(String(50), default="English")

    # Core scores
    ats_score        = Column(Float, default=0)
    keyword_score    = Column(Float, default=0)
    format_score     = Column(Float, default=0)
    readability_score = Column(Float, default=0)
    experience_score = Column(Float, default=0)

    # Analysis data (JSON fields)
    missing_keywords  = Column(JSON, default=list)
    found_keywords    = Column(JSON, default=list)
    weak_verbs        = Column(JSON, default=list)
    suggestions       = Column(JSON, default=list)
    section_analysis  = Column(JSON, default=dict)
    strengths         = Column(JSON, default=list)
    critical_issues   = Column(JSON, default=list)
    skills_to_add     = Column(JSON, default=list)
    grammar_issues    = Column(JSON, default=list)
    score_breakdown   = Column(JSON, default=dict)
    industry_tips     = Column(JSON, default=list)
    interview_questions = Column(JSON, default=list)
    career_roadmap    = Column(JSON, default=dict)

    # Text fields
    overall_assessment = Column(Text, default="")
    improved_summary   = Column(Text, default="")
    rewritten_resume   = Column(Text, default="")
    resume_text        = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analyses")
