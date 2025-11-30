# Backend Quick Start Guide

## 🚀 Quick Start (PowerShell)

### Option 1: Simple Test Script (Recommended)
```powershell
cd backend
.\test-start.ps1
```

### Option 2: Full Start Script
```powershell
cd backend
.\start-server.ps1
```

### Option 3: Manual Start
```powershell
cd backend
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

## 🐧 Git Bash / WSL

```bash
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

## ✅ Verify It's Running

Once started, you should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

Then check:
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs

## 🔧 Troubleshooting

### If you get "uvicorn not found":
```powershell
cd backend
..\.venv\Scripts\pip.exe install -r requirements.txt
```

### If you get import errors:
```powershell
cd backend
.\validate-env.ps1
```

### If port 8000 is already in use:
Change the port in the command:
```powershell
..\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001
```

## 📝 What Each Script Does

- **`test-start.ps1`**: Simple script, minimal checks, just starts the server
- **`start-server.ps1`**: Full script with import validation before starting
- **`validate-env.ps1`**: Validates entire environment (Python, packages, imports, files)

## 🎯 Recommended Workflow

1. **First time**: Run `.\validate-env.ps1` to check everything is set up
2. **Daily use**: Run `.\test-start.ps1` to quickly start the server
3. **If issues**: Run `.\validate-env.ps1` to diagnose problems

## 📚 More Information

- Full setup guide: `SETUP.md`
- Environment validation: `ENV-VALIDATION.md`
- Architecture: `../ARCHITECTURE.md`

