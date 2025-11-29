# Simple test script to start server
# Fixes: No special characters in strings, simple error handling

Write-Host "=== Testing Server Start ===" -ForegroundColor Cyan
Write-Host ""

# Find Python executable
$pythonExe = $null
if (Test-Path "..\.venv\Scripts\python.exe") {
    $pythonExe = "..\.venv\Scripts\python.exe"
    Write-Host "Using root .venv" -ForegroundColor Gray
} elseif (Test-Path ".\venv\Scripts\python.exe") {
    $pythonExe = ".\venv\Scripts\python.exe"
    Write-Host "Using backend venv" -ForegroundColor Gray
} else {
    $pythonExe = "python"
    Write-Host "Using system Python" -ForegroundColor Yellow
}

# Test import
Write-Host "Testing imports..." -ForegroundColor Yellow
$result = & $pythonExe -c "import app.main" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Imports OK" -ForegroundColor Green
} else {
    Write-Host "Import failed:" -ForegroundColor Red
    Write-Host $result
    exit 1
}

# Start server
Write-Host ""
Write-Host "Starting server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

& $pythonExe -m uvicorn app.main:app --reload --port 8000

