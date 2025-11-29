# Quick Start Guide

## Fixed Issues

✅ **PowerShell Script Syntax Errors** - Fixed quote handling in `start-server.ps1`  
✅ **Environment Validation** - Created validation scripts for PowerShell, Git Bash, and WSL  
✅ **Python Path Detection** - Scripts now auto-detect root `.venv` or `backend/venv`  

## Step 1: Validate Environment

### PowerShell
```powershell
cd backend
.\validate-env.ps1
```

### Git Bash
```bash
cd backend
bash validate-env.sh
```

### WSL
```bash
cd backend
bash validate-env.sh
```

## Step 2: Start Server

### PowerShell
```powershell
cd backend
.\start-server.ps1
```

**OR** (simpler test script):
```powershell
cd backend
.\test-start.ps1
```

### Git Bash / WSL
```bash
cd backend
../.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

## Step 3: Verify Server

Open in browser:
- **Health Check**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

### If validation fails:

1. **Python not found:**
   - Install Python 3.10+ from python.org
   - Add to PATH

2. **Virtual environment not found:**
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

3. **Packages missing:**
   ```powershell
   # PowerShell
   ..\.venv\Scripts\pip.exe install -r backend/requirements.txt
   ```

   ```bash
   # Git Bash / WSL
   ../.venv/bin/pip install -r backend/requirements.txt
   ```

4. **Import errors:**
   - Make sure you're in the `backend` directory
   - Check that all files exist (see `validate-env.ps1` output)

## Available Scripts

- `validate-env.ps1` / `validate-env.sh` - Full environment validation
- `start-server.ps1` - Start server with validation
- `test-start.ps1` - Simple server start (minimal checks)

## Next Steps

Once server is running:
1. Start frontend in another terminal
2. Access the application
3. See `README.md` for full documentation
