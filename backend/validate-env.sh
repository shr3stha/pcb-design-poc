#!/bin/bash
# Environment Validation Script for Git Bash / WSL
# Usage: bash validate-env.sh

echo "=== Environment Validation ==="
echo ""

# Check Python
echo "1. Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1)
    echo "   ✓ $PYTHON_VERSION"
    
    # Check version
    MAJOR=$(python3 -c "import sys; print(sys.version_info.major)")
    MINOR=$(python3 -c "import sys; print(sys.version_info.minor)")
    if [ "$MAJOR" -gt 3 ] || ([ "$MAJOR" -eq 3 ] && [ "$MINOR" -ge 10 ]); then
        echo "   ✓ Python version OK (3.10+)"
    else
        echo "   ⚠ WARNING: Python 3.10+ recommended"
    fi
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    echo "   ✓ $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    echo "   ✗ ERROR: Python not found!"
    exit 1
fi

# Check Node.js
echo ""
echo "2. Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "   ✓ Node.js $NODE_VERSION"
else
    echo "   ⚠ WARNING: Node.js not found (needed for frontend)"
fi

# Check Virtual Environment
echo ""
echo "3. Checking Virtual Environment..."
if [ -f "../.venv/bin/python" ] || [ -f "../.venv/Scripts/python.exe" ]; then
    echo "   ✓ Found root .venv"
    if [ -f "../.venv/bin/python" ]; then
        PYTHON_EXE="../.venv/bin/python"
    else
        PYTHON_EXE="../.venv/Scripts/python.exe"
    fi
elif [ -f "./venv/bin/python" ] || [ -f "./venv/Scripts/python.exe" ]; then
    echo "   ✓ Found backend venv"
    if [ -f "./venv/bin/python" ]; then
        PYTHON_EXE="./venv/bin/python"
    else
        PYTHON_EXE="./venv/Scripts/python.exe"
    fi
else
    echo "   ✗ ERROR: No virtual environment found!"
    echo "   Run: $PYTHON_CMD -m venv venv (or .venv)"
    exit 1
fi

# Check Installed Packages
echo ""
echo "4. Checking Installed Packages..."
PACKAGES=("fastapi" "uvicorn" "pydantic" "httpx" "numpy")
MISSING=()

for pkg in "${PACKAGES[@]}"; do
    if $PYTHON_EXE -c "import $pkg" 2>/dev/null; then
        echo "   ✓ $pkg - OK"
    else
        echo "   ✗ $pkg - MISSING"
        MISSING+=("$pkg")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    echo ""
    echo "   Missing packages: ${MISSING[*]}"
    echo "   Run: $PYTHON_EXE -m pip install -r requirements.txt"
    exit 1
fi

# Check App Imports
echo ""
echo "5. Checking App Imports..."
IMPORTS=("app.main" "app.api.designs" "app.api.ml" "app.domain.models" "app.domain.services" "app.infra.memory_repo")
FAILED=()

for module in "${IMPORTS[@]}"; do
    if $PYTHON_EXE -c "import $module" 2>/dev/null; then
        echo "   ✓ $module - OK"
    else
        echo "   ✗ $module - FAILED"
        FAILED+=("$module")
    fi
done

if [ ${#FAILED[@]} -gt 0 ]; then
    echo ""
    echo "   Failed imports: ${FAILED[*]}"
    exit 1
fi

# Check File Structure
echo ""
echo "6. Checking File Structure..."
REQUIRED_FILES=("app/main.py" "app/api/designs.py" "app/api/ml.py" "app/domain/models.py" "app/domain/services.py" "app/infra/memory_repo.py")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file - OK"
    else
        echo "   ✗ $file - MISSING"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo "   Missing files: ${MISSING_FILES[*]}"
    exit 1
fi

echo ""
echo "=== Validation Complete ==="
echo "✓ All checks passed! Environment is ready."
echo ""
echo "Start server with:"
echo "  $PYTHON_EXE -m uvicorn app.main:app --reload --port 8000"

