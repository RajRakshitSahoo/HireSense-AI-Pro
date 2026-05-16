"""
HireSense-AI Pro — Configuration
Supports Claude (Anthropic), Gemini (Google), and OpenAI.
Copy .env.example → .env and fill in your keys.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── AI Provider ───────────────────────────────────────────────────────────
    # Choose: "anthropic" (Claude), "gemini" (Google), or "openai" (GPT-4)
    AI_PROVIDER: str = "anthropic"

    # Anthropic (Claude) — recommended
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-sonnet-4-20250514"

    # Google Gemini
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./hiresense_pro.db"

    # ── Auth ──────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # ── CORS ──────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # ── File Uploads ──────────────────────────────────────────────────────────
    MAX_FILE_SIZE_MB: int = 10

    class Config:
        env_file = ".env"


settings = Settings()
