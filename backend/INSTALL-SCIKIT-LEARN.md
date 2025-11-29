# Installing scikit-learn (Optional)

scikit-learn requires Microsoft Visual C++ Build Tools to compile from source on Windows.

## Option 1: Install Pre-built Wheel (Recommended)

Try installing a pre-built wheel first (no compilation needed):

```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install scikit-learn
```

If this works, you're done! ✅

## Option 2: Install Visual C++ Build Tools

If pre-built wheels aren't available for your Python version:

1. Download and install **Microsoft C++ Build Tools**:
   - https://visualstudio.microsoft.com/visual-cpp-build-tools/
   - Or search "Microsoft C++ Build Tools" in your browser

2. During installation, select:
   - "Desktop development with C++" workload
   - This includes the MSVC compiler

3. After installation, restart your terminal and try:
   ```powershell
   pip install scikit-learn
   ```

## Option 3: Skip for Now (Current Setup)

For the MVP, scikit-learn is **optional**. The ML service uses rule-based heuristics that don't require scikit-learn. You can:

- Continue development without it
- Add it later when you implement actual ML models
- Use it only when you need trained models (Random Forest, etc.)

## Current Status

✅ **Essential packages installed:**
- fastapi
- uvicorn
- pydantic
- httpx
- numpy

⏭️ **Optional (can add later):**
- scikit-learn (for ML models)

The backend will work fine without scikit-learn for now!

