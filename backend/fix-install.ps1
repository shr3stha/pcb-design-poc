# Fix installation script
# Works with both backend/venv and root .venv

Write-Host "=== Fixing Backend Installation ===" -ForegroundColor Cyan
Write-Host ""

# Check for venv locations
$rootVenv = "..\.venv\Scripts\python.exe"
$backendVenv = ".\venv\Scripts\python.exe"

if (Test-Path $rootVenv) {
    Write-Host "Found root .venv, using that..." -ForegroundColor Yellow
    $pythonExe = $rootVenv
} elseif (Test-Path $backendVenv) {
    Write-Host "Found backend venv, using that..." -ForegroundColor Yellow
    $pythonExe = $backendVenv
} else {
    Write-Host "No virtual environment found!" -ForegroundColor Red
    Write-Host "Creating venv in backend..." -ForegroundColor Yellow
    python -m venv venv
    $pythonExe = $backendVenv
    Write-Host "Virtual environment created" -ForegroundColor Green
}

Write-Host "Installing packages..." -ForegroundColor Yellow
& $pythonExe -m pip install --upgrade pip
& $pythonExe -m pip install "uvicorn[standard]" fastapi pydantic httpx numpy python-multipart

Write-Host ""
Write-Host "Verifying installation..." -ForegroundColor Yellow
& $pythonExe -c "import uvicorn, fastapi, pydantic; print('All packages installed!')"

Write-Host ""
Write-Host "=== Installation Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Now start the server:" -ForegroundColor Cyan
$cmd = "python -m uvicorn app.main:app --reload --port 8000"
Write-Host "  $cmd" -ForegroundColor White
