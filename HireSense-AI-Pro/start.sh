#!/bin/bash
# ══════════════════════════════════════════════════════════
#  HireSense-AI Pro — Quick Start Script
#  Usage: bash start.sh
# ══════════════════════════════════════════════════════════

set -e

echo ""
echo "🧠  HireSense-AI Pro — Starting..."
echo "══════════════════════════════════════════"

# ── Backend ───────────────────────────────────────────────
echo ""
echo "📦  Setting up backend..."
cd backend

# Create virtualenv if it doesn't exist
if [ ! -d "venv" ]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

# Activate
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

# Install dependencies
pip install -r requirements.txt -q

# Copy .env if missing
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo ""
  echo "  ⚠️  Created backend/.env from example."
  echo "  ⚠️  Please add your AI API key to backend/.env before continuing!"
  echo ""
fi

# Start backend in background
echo "  🚀 Starting FastAPI backend on http://localhost:8000..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

cd ..

# ── Frontend ──────────────────────────────────────────────
echo ""
echo "📦  Setting up frontend..."
cd frontend

# Install node deps
if [ ! -d "node_modules" ]; then
  echo "  Installing npm packages..."
  npm install
fi

# Copy .env if missing
if [ ! -f ".env" ]; then
  cp .env.example .env
fi

echo "  🚀 Starting React frontend on http://localhost:5173..."
npm run dev &
FRONTEND_PID=$!

cd ..

# ── Done ──────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "✅  HireSense-AI Pro is running!"
echo ""
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/docs"
echo ""
echo "  Press Ctrl+C to stop all servers."
echo "══════════════════════════════════════════"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
