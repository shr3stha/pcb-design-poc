# Test Setup Script for PCB Design POC
# This script checks dependencies and starts both backend and frontend

Write-Host "=== PCB Design POC - Test Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Backend Setup ===" -ForegroundColor Cyan

# Check backend dependencies
if (Test-Path "backend\venv") {
    Write-Host "✓ Virtual environment exists" -ForegroundColor Green
} else {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    cd backend
    python -m venv venv
    cd ..
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

# Activate venv and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
cd backend
& .\venv\Scripts\Activate.ps1
pip install -q -r requirements.txt
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
cd ..

Write-Host ""
Write-Host "=== Frontend Setup ===" -ForegroundColor Cyan

# Check frontend dependencies
if (Test-Path "frontend\node_modules") {
    Write-Host "✓ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Starting Servers ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend will start at: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in background
Write-Host "Starting backend server..." -ForegroundColor Yellow
cd backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& .\venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"
cd ..

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend server..." -ForegroundColor Yellow
cd frontend
npm run dev

