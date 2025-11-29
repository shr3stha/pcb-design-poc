# Environment Validation Script
# Validates setup for PowerShell, Git Bash, and WSL

Write-Host "=== Environment Validation ===" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "1. Checking Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   $pythonVersion" -ForegroundColor Green
    
    # Check if it's 3.10+
    $versionMatch = $pythonVersion -match "Python (\d+)\.(\d+)"
    if ($versionMatch) {
        $major = [int]$matches[1]
        $minor = [int]$matches[2]
        if ($major -gt 3 -or ($major -eq 3 -and $minor -ge 10)) {
            Write-Host "   Python version OK (3.10+)" -ForegroundColor Green
        } else {
            Write-Host "   WARNING: Python 3.10+ recommended" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "   ERROR: Python not found!" -ForegroundColor Red
    exit 1
}

# Check Node.js
Write-Host ""
Write-Host "2. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   WARNING: Node.js not found (needed for frontend)" -ForegroundColor Yellow
}

# Check Virtual Environment
Write-Host ""
Write-Host "3. Checking Virtual Environment..." -ForegroundColor Yellow
$rootVenv = "..\.venv\Scripts\python.exe"
$backendVenv = ".\venv\Scripts\python.exe"

if (Test-Path $rootVenv) {
    Write-Host "   Found root .venv" -ForegroundColor Green
    $pythonExe = $rootVenv
} elseif (Test-Path $backendVenv) {
    Write-Host "   Found backend venv" -ForegroundColor Green
    $pythonExe = $backendVenv
} else {
    Write-Host "   ERROR: No virtual environment found!" -ForegroundColor Red
    Write-Host "   Run: python -m venv venv (or .venv)" -ForegroundColor Yellow
    exit 1
}

# Check Installed Packages
Write-Host ""
Write-Host "4. Checking Installed Packages..." -ForegroundColor Yellow
$packages = @("fastapi", "uvicorn", "pydantic", "httpx", "numpy")
$missing = @()

foreach ($pkg in $packages) {
    $check = & $pythonExe -c "import $pkg" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   $pkg - OK" -ForegroundColor Green
    } else {
        Write-Host "   $pkg - MISSING" -ForegroundColor Red
        $missing += $pkg
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "   Missing packages: $($missing -join ', ')" -ForegroundColor Red
    Write-Host "   Run: .\fix-install.ps1" -ForegroundColor Yellow
    exit 1
}

# Check App Imports
Write-Host ""
Write-Host "5. Checking App Imports..." -ForegroundColor Yellow
$imports = @(
    "app.main",
    "app.api.designs",
    "app.api.ml",
    "app.domain.models",
    "app.domain.services",
    "app.infra.memory_repo"
)

$failedImports = @()
foreach ($module in $imports) {
    $test = & $pythonExe -c "import $module" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   $module - OK" -ForegroundColor Green
    } else {
        Write-Host "   $module - FAILED" -ForegroundColor Red
        Write-Host "      Error: $test" -ForegroundColor Gray
        $failedImports += $module
    }
}

if ($failedImports.Count -gt 0) {
    Write-Host ""
    Write-Host "   Failed imports: $($failedImports -join ', ')" -ForegroundColor Red
    exit 1
}

# Check File Structure
Write-Host ""
Write-Host "6. Checking File Structure..." -ForegroundColor Yellow
$requiredFiles = @(
    "app\main.py",
    "app\api\designs.py",
    "app\api\ml.py",
    "app\domain\models.py",
    "app\domain\services.py",
    "app\infra\memory_repo.py"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   $file - OK" -ForegroundColor Green
    } else {
        Write-Host "   $file - MISSING" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "   Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Validation Complete ===" -ForegroundColor Green
Write-Host "All checks passed! Environment is ready." -ForegroundColor Green
Write-Host ""
Write-Host "Start server with:" -ForegroundColor Cyan
Write-Host "  python -m uvicorn app.main:app --reload --port 8000" -ForegroundColor White

