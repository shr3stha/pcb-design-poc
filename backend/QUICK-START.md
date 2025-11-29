# Quick Start Guide

## Start the Backend Server

**In your terminal where you see `(venv)`:**

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

**You should see:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Verify It's Working

**Option 1: PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/health"
```

**Option 2: Browser**
- Open: http://localhost:8000/docs
- Or: http://localhost:8000/health

## Troubleshooting

### "No module named uvicorn"
```powershell
pip install -r requirements.txt
```

### "Module not found" errors
```powershell
# Make sure you're in the backend directory
cd backend

# Activate venv
.\venv\Scripts\Activate.ps1

# Install packages
pip install -r requirements.txt
```

### Port 8000 already in use
```powershell
# Use a different port
python -m uvicorn app.main:app --reload --port 8001
```

### Import errors
Check that all files are in place:
- `app/main.py` exists
- `app/api/designs.py` exists
- `app/api/ml.py` exists
- `app/domain/` folder exists

## Next: Start Frontend

Once backend is running, open a **new terminal**:

```powershell
cd frontend
npm run dev
```

Then open: http://localhost:5173

