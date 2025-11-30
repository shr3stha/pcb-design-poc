# Fix npm install issues
# Run: .\fix-install.ps1

Write-Host "=== Fixing Frontend Dependencies ===" -ForegroundColor Cyan
Write-Host ""

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null

# Remove node_modules and package-lock if they exist
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json
}

# Try installing react-konva separately first
Write-Host ""
Write-Host "Installing react-konva..." -ForegroundColor Yellow
npm install react-konva@latest 2>&1 | Tee-Object -Variable konvaOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "react-konva installed successfully" -ForegroundColor Green
} else {
    Write-Host "react-konva installation had issues:" -ForegroundColor Yellow
    $konvaOutput | Select-String -Pattern "error|warning" | Select-Object -First 5
}

# Install all dependencies
Write-Host ""
Write-Host "Installing all dependencies..." -ForegroundColor Yellow
npm install 2>&1 | Tee-Object -Variable installOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Installation Complete ===" -ForegroundColor Green
    Write-Host "All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=== Installation Issues ===" -ForegroundColor Red
    $installOutput | Select-String -Pattern "error|ETARGET|notarget" | Select-Object -First 10
    Write-Host ""
    Write-Host "Try manually:" -ForegroundColor Yellow
    Write-Host "  npm install --legacy-peer-deps" -ForegroundColor White
}

