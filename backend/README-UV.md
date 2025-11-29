# Using UV for Backend Development

This project supports `uv` (fast Python package installer) as an alternative to traditional pip/venv.

## Quick Start with UV

### Install Dependencies

```powershell
cd backend
uv pip install -r requirements.txt
```

Or if you want uv to manage everything:

```powershell
cd backend
uv run pip install -r requirements.txt
```

### Run the Server

**Option 1: Direct run (recommended)**
```powershell
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

**Option 2: Using the script**
```powershell
cd backend
.\run-server.ps1
```

**Option 3: Install and run separately**
```powershell
cd backend
uv pip install -r requirements.txt
uv run python -m uvicorn app.main:app --reload --port 8000
```

## UV Benefits

- **Faster**: Much faster than pip for dependency resolution
- **Automatic venv**: UV can manage virtual environments automatically
- **Better caching**: Efficient package caching
- **Cross-platform**: Works the same on Windows, Mac, Linux

## Troubleshooting

If `uv run` doesn't find packages:
1. Make sure dependencies are installed: `uv pip install -r requirements.txt`
2. Check if uv created a venv: `uv venv` (if needed)
3. Use explicit path: `uv run --python python app.main:app`

## Traditional Method (Alternative)

If you prefer traditional pip/venv:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

