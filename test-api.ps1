# Quick API Test Script
# Tests the backend API endpoints

Write-Host "=== Testing PCB Design API ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"

# Test 1: Health check
Write-Host "1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   ✓ Health check passed: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Health check failed. Is the backend running?" -ForegroundColor Red
    exit 1
}

# Test 2: Create a design
Write-Host "2. Creating a test design..." -ForegroundColor Yellow
$designPayload = @{
    id = "test-design-1"
    name = "Test LED Blinker"
    board = @{
        outline = @()
        components = @()
        nets = @()
        layers = 1
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/designs" -Method Post -Body $designPayload -ContentType "application/json"
    Write-Host "   ✓ Design created: $($response.name)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed to create design" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

# Test 3: Get the design
Write-Host "3. Retrieving the design..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/designs/test-design-1" -Method Get
    Write-Host "   ✓ Design retrieved: $($response.name)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Failed to retrieve design" -ForegroundColor Red
}

# Test 4: Validate the design
Write-Host "4. Validating the design..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/designs/test-design-1/validate" -Method Post
    $issueCount = $response.issues.Count
    Write-Host "   ✓ Validation complete: $issueCount issue(s) found" -ForegroundColor Green
    if ($issueCount -gt 0) {
        Write-Host "   Issues:" -ForegroundColor Yellow
        $response.issues | ForEach-Object {
            Write-Host "     - $($_.message)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ✗ Failed to validate design" -ForegroundColor Red
}

# Test 5: Get ML suggestions
Write-Host "5. Getting ML suggestions..." -ForegroundColor Yellow
$designForML = @{
    id = "test-design-1"
    name = "Test"
    board = @{
        outline = @()
        components = @()
        nets = @()
        layers = 1
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/ml/suggestions" -Method Post -Body $designForML -ContentType "application/json"
    $suggestionCount = $response.suggestions.Count
    Write-Host "   ✓ ML suggestions retrieved: $suggestionCount suggestion(s)" -ForegroundColor Green
    if ($suggestionCount -gt 0) {
        Write-Host "   Suggestions:" -ForegroundColor Yellow
        $response.suggestions | ForEach-Object {
            Write-Host "     - $($_.message)" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "   ✗ Failed to get ML suggestions" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== API Tests Complete ===" -ForegroundColor Cyan

