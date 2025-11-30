# Restart dev server with cache clear
# Run: .\restart-dev.ps1

Write-Host "=== Restarting Dev Server ===" -ForegroundColor Cyan
Write-Host ""

# Clear Vite cache
if (Test-Path "node_modules\.vite") {
    Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Cache cleared" -ForegroundColor Green
}

# Verify mlApi.ts exists
$mlApiPath = Join-Path (Get-Location) "src\shared\api\mlApi.ts"
if (Test-Path $mlApiPath) {
    Write-Host "✓ mlApi.ts exists" -ForegroundColor Green
} else {
    Write-Host "✗ mlApi.ts NOT FOUND at: $mlApiPath" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Checking if file exists elsewhere..." -ForegroundColor Yellow
    $found = Get-ChildItem -Recurse -Filter "mlApi.ts" -ErrorAction SilentlyContinue
    if ($found) {
        Write-Host "Found at: $($found.FullName)" -ForegroundColor Green
    } else {
        Write-Host "File not found anywhere. Creating it..." -ForegroundColor Yellow
        $apiDir = Join-Path (Get-Location) "src\shared\api"
        if (-not (Test-Path $apiDir)) {
            New-Item -ItemType Directory -Path $apiDir -Force | Out-Null
        }
        # File will be created by the write tool if needed
    }
}

Write-Host ""
Write-Host "Starting dev server..." -ForegroundColor Cyan
Write-Host ""

# Check if vite is available
if (Test-Path "node_modules\.bin\vite.cmd") {
    Write-Host "✓ Vite found, starting server..." -ForegroundColor Green
    Write-Host ""
    npm run dev
} else {
    Write-Host "✗ Vite not found in node_modules/.bin" -ForegroundColor Red
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
    Write-Host "Starting server..." -ForegroundColor Cyan
    npm run dev
}

