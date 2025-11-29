# Start server script with proper path handling
# Run: .\start-server.ps1

Write-Host "=== Starting PCB Design Backend ===" -ForegroundColor Cyan
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

# Set PYTHONPATH to current directory so app module can be found
$env:PYTHONPATH = (Get-Location).Path

# Test import first
Write-Host "Testing imports..." -ForegroundColor Yellow
$importTest = & $pythonExe -c "import app.main" 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "All imports successful" -ForegroundColor Green
} else {
    Write-Host "Import failed:" -ForegroundColor Red
    Write-Host $importTest
    Write-Host ""
    Write-Host "Run validation: .\validate-env.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Yellow
Write-Host "Server will be at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API docs at: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
& $pythonExe -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1

