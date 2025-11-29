# Run backend server using uv
# Usage: .\run-server.ps1

Write-Host "Starting PCB Design Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Option 1: Use uv run (recommended - uv manages the environment)
Write-Host "Using uv run..." -ForegroundColor Yellow
uv run uvicorn app.main:app --reload --port 8000

# Alternative Option 2: If you prefer to use uv pip sync first
# uv pip sync requirements.txt
# uv run python -m uvicorn app.main:app --reload --port 8000

