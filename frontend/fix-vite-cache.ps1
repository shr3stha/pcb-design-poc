# Fix Vite cache issues
# Run: .\fix-vite-cache.ps1

Write-Host "=== Fixing Vite Cache Issues ===" -ForegroundColor Cyan
Write-Host ""

# Remove Vite cache
if (Test-Path "node_modules\.vite") {
    Write-Host "Removing Vite cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✓ Vite cache cleared" -ForegroundColor Green
} else {
    Write-Host "No Vite cache found" -ForegroundColor Gray
}

# Verify mlApi.ts exists
if (Test-Path "src\shared\api\mlApi.ts") {
    Write-Host "✓ mlApi.ts exists" -ForegroundColor Green
} else {
    Write-Host "✗ mlApi.ts NOT FOUND!" -ForegroundColor Red
    exit 1
}

# Check file content
$content = Get-Content "src\shared\api\mlApi.ts" -Raw
if ($content -match "export const mlApi") {
    Write-Host "✓ mlApi.ts has correct export" -ForegroundColor Green
} else {
    Write-Host "✗ mlApi.ts missing export!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Cache Cleared ===" -ForegroundColor Green
Write-Host "Now restart the dev server:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White

