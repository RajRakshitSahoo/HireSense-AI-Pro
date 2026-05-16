"""
HireSense-AI Pro — Authentication Routes
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.user import User
from models.schemas import RegisterRequest, LoginRequest, TokenResponse
from utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
async def register(body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(name=body.name, email=body.email, hashed_password=hash_password(body.password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user={"id": user.id, "name": user.name, "email": user.email})


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(access_token=token, user={"id": user.id, "name": user.name, "email": user.email})


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "created_at": current_user.created_at}
