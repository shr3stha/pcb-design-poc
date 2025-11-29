# Testing Guide

Quick guide to test the PCB Design POC application.

## Quick Start Testing

### Option 1: Automated Setup Script

```powershell
# Run the setup and start script
.\test-setup.ps1
```

This will:
- Check Python and Node.js versions
- Create virtual environment if needed
- Install backend dependencies
- Install frontend dependencies
- Start both servers

### Option 2: Manual Testing

#### 1. Start Backend

```powershell
# Terminal 1
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend should be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

#### 2. Start Frontend

```powershell
# Terminal 2
cd frontend
npm install
npm run dev
```

Frontend should be available at: http://localhost:5173

#### 3. Test API

```powershell
# Terminal 3
.\test-api.ps1
```

Or manually test with curl:

```bash
# Health check
curl http://localhost:8000/health

# Create a design
curl -X POST http://localhost:8000/designs \
  -H "Content-Type: application/json" \
  -d '{"id":"test-1","name":"Test Design","board":{"outline":[],"components":[],"nets":[],"layers":1}}'

# Validate design
curl -X POST http://localhost:8000/designs/test-1/validate
```

## Testing the UI

1. **Home Page**
   - Open http://localhost:5173
   - Should see welcome screen with "Start My First Board" button
   - Click on template cards to see explanations
   - Click "?" icon to see help overlay

2. **Tutorial Flow**
   - Click "Start My First Board" or select a template
   - Should see wizard header with step 1/5
   - Try clicking locked tools - should show toast notification
   - Use "Next" button to progress through steps
   - Coach marks should appear highlighting UI areas

3. **Editor Features**
   - Place components (when step 2+)
   - Wire connections (when step 3+)
   - Switch to Board view (step 4+)
   - Run validation (step 5)
   - Check Run Check modal for human-readable checklist

4. **ML Assistant**
   - Open Assistant tab in right panel
   - Ask questions or click "What's next?"
   - Check Tips panel for suggestions
   - Check Errors panel after validation

5. **Challenges**
   - Navigate to http://localhost:5173/challenges
   - Should see challenge cards
   - Click "Start Challenge" to begin

## Expected Behavior

### Backend API
- ✅ Health endpoint returns `{"status": "ok"}`
- ✅ Create design returns design object
- ✅ Validate design returns issues array
- ✅ ML suggestions returns suggestions array
- ✅ All endpoints have proper error handling

### Frontend UI
- ✅ Home page loads with templates
- ✅ Tutorial wizard shows progress
- ✅ Tools lock/unlock based on step
- ✅ Toast notifications appear
- ✅ Help overlay opens/closes
- ✅ Run Check modal shows checklist
- ✅ Challenge cards display correctly

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.10+)
- Check if port 8000 is in use
- Verify virtual environment is activated
- Check requirements are installed: `pip list`

### Frontend won't start
- Check Node.js version: `node --version` (need 18+)
- Check if port 5173 is in use
- Verify dependencies: `npm list`
- Clear cache: `rm -rf node_modules .vite && npm install`

### API calls fail
- Verify backend is running on port 8000
- Check CORS settings in `backend/app/main.py`
- Check browser console for errors
- Verify API proxy in `frontend/vite.config.ts`

### UI issues
- Check browser console for errors
- Verify all components are imported correctly
- Check React DevTools for component state
- Verify Zustand store is working

## Integration Tests

Run backend tests:

```powershell
cd backend
pip install pytest httpx
pytest tests/ -v
```

Expected test results:
- ✅ Create design test passes
- ✅ Get design test passes
- ✅ Validate design test passes
- ✅ Unconnected net detection works
- ✅ Short circuit detection works

## Performance Testing

### Backend
- API response time < 100ms for simple operations
- Validation completes in < 500ms for small designs
- ML suggestions return in < 200ms

### Frontend
- Initial page load < 2s
- Component interactions feel instant
- No console errors or warnings

## Next Steps

After basic testing passes:
1. Test with real PCB designs
2. Test ML suggestions with various design states
3. Test tutorial flow end-to-end
4. Test challenge cards with broken designs
5. Performance testing with larger designs

