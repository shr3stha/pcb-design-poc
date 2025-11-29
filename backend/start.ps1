# Simple startup script for backend
# Run: .\start.ps1

Write-Host "Starting PCB Design Backend..." -ForegroundColor Cyan
Write-Host ""

# Use python -m uvicorn (works even if uvicorn.exe isn't in PATH)
$pythonPath = ".\venv\Scripts\python.exe"

if (Test-Path $pythonPath) {
    Write-Host "Server starting at: http://localhost:8000" -ForegroundColor Yellow
    Write-Host "API docs at: http://localhost:8000/docs" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop`n" -ForegroundColor Gray
    & $pythonPath -m uvicorn app.main:app --reload --port 8000
} else {
    Write-Host "Error: Virtual environment not found!" -ForegroundColor Red
    Write-Host "Run: python -m venv venv" -ForegroundColor Yellow
    Write-Host "Then: .\venv\Scripts\Activate.ps1" -ForegroundColor Yellow
    Write-Host "Then: pip install -r requirements.txt" -ForegroundColor Yellow
    exit 1
}

