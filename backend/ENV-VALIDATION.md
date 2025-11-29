# Environment Validation Guide

This guide helps you validate your environment setup for **PowerShell**, **Git Bash**, and **WSL**.

## Quick Validation

### PowerShell
```powershell
cd backend
.\validate-env.ps1
```

### Git Bash / WSL
```bash
cd backend
bash validate-env.sh
```

## Manual Validation Steps

### 1. Check Python Installation

**PowerShell:**
```powershell
python --version
# Should show: Python 3.10.x or higher
```

**Git Bash / WSL:**
```bash
python3 --version
# or
python --version
```

### 2. Check Virtual Environment

**PowerShell:**
```powershell
# Check for root .venv
Test-Path "..\.venv\Scripts\python.exe"
# Should return: True

# Or check backend venv
Test-Path ".\venv\Scripts\python.exe"
```

**Git Bash / WSL:**
```bash
# Check for root .venv
[ -f "../.venv/bin/python" ] && echo "Found root .venv"
# or Windows path
[ -f "../.venv/Scripts/python.exe" ] && echo "Found root .venv"

# Or check backend venv
[ -f "./venv/bin/python" ] && echo "Found backend venv"
```

### 3. Check Installed Packages

**PowerShell:**
```powershell
# Using root .venv
..\.venv\Scripts\python.exe -c "import fastapi, uvicorn, pydantic; print('OK')"

# Or using backend venv
.\venv\Scripts\python.exe -c "import fastapi, uvicorn, pydantic; print('OK')"
```

**Git Bash / WSL:**
```bash
# Using root .venv
../.venv/bin/python -c "import fastapi, uvicorn, pydantic; print('OK')"

# Or using backend venv
./venv/bin/python -c "import fastapi, uvicorn, pydantic; print('OK')"
```

### 4. Check App Imports

**PowerShell:**
```powershell
cd backend
..\.venv\Scripts\python.exe -c "import app.main; print('OK')"
```

**Git Bash / WSL:**
```bash
cd backend
../.venv/bin/python -c "import app.main; print('OK')"
```

### 5. Test Server Start

**PowerShell:**
```powershell
cd backend
.\test-start.ps1
```

**Git Bash / WSL:**
```bash
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

## Common Issues & Fixes

### Issue 1: Python Not Found

**PowerShell:**
```powershell
# Check if Python is in PATH
Get-Command python
# If not found, add Python to PATH or use full path
```

**Git Bash / WSL:**
```bash
# Check if Python is in PATH
which python3
# If not found, install Python or use full path
```

### Issue 2: Virtual Environment Not Found

**Fix:**
```powershell
# PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

```bash
# Git Bash / WSL
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

### Issue 3: Packages Not Installed

**Fix:**
```powershell
# PowerShell - using root .venv
..\.venv\Scripts\pip.exe install -r backend/requirements.txt

# Or using backend venv
cd backend
.\venv\Scripts\pip.exe install -r requirements.txt
```

```bash
# Git Bash / WSL - using root .venv
../.venv/bin/pip install -r backend/requirements.txt

# Or using backend venv
cd backend
./venv/bin/pip install -r requirements.txt
```

### Issue 4: Import Errors

**Check:**
1. Are you in the `backend` directory?
2. Is `PYTHONPATH` set correctly?
3. Are all files present?

**Fix:**
```powershell
# PowerShell
cd backend
$env:PYTHONPATH = (Get-Location).Path
python -c "import app.main"
```

```bash
# Git Bash / WSL
cd backend
export PYTHONPATH=$(pwd)
python -c "import app.main"
```

### Issue 5: Port Already in Use

**Fix:**
```powershell
# PowerShell - find process using port 8000
Get-NetTCPConnection -LocalPort 8000 | Select-Object OwningProcess
# Kill process or use different port
```

```bash
# Git Bash / WSL - find process using port 8000
lsof -i :8000
# Kill process or use different port
```

## Validation Checklist

- [ ] Python 3.10+ installed
- [ ] Virtual environment created and activated
- [ ] All packages installed (fastapi, uvicorn, pydantic, httpx, numpy)
- [ ] App imports work (`import app.main`)
- [ ] Server starts without errors
- [ ] Health endpoint responds (`http://localhost:8000/health`)

## Next Steps

Once validation passes:

1. **Start Backend:**
   ```powershell
   cd backend
   .\test-start.ps1
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access:**
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs
   - Frontend: http://localhost:5173

