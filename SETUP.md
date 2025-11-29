# Setup Guide

## Prerequisites

- Python 3.10+ 
- Node.js 18+ and npm
- Git

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### (Optional) Poetry-based setup

If you prefer Poetry for dependency management:

```bash
cd backend
pip install poetry  # if not installed
poetry install
poetry run uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: http://localhost:5173

### 3. Verify Setup

1. Open http://localhost:5173
2. Click "Start Guided Tutorial" or "Explore on My Own"
3. You should see the editor interface

## Project Structure

```
pcb-design-poc/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes (designs, ml)
│   │   ├── domain/      # Business logic (services, models)
│   │   ├── infra/       # Infrastructure (persistence, ML clients)
│   │   └── main.py      # FastAPI app
│   └── requirements.txt
├── frontend/            # React + TypeScript
│   ├── src/
│   │   ├── app/         # Routes & layout
│   │   ├── features/    # Feature modules (editor, assistant)
│   │   └── shared/      # Shared utilities (API, state, schema)
│   └── package.json
└── shared-schema/       # Shared data models
    ├── python/          # Pydantic models
    └── ts/              # TypeScript interfaces
```

## Development Workflow

### Backend Development

- **API endpoints**: `backend/app/api/` - Thin controllers using FastAPI dependency injection
- **Business logic**: `backend/app/domain/services.py` - `DesignService`, `DRCService`
- **ML services**: `backend/app/domain/ml_services.py` - ML-powered suggestions
- **Models**: `shared-schema/python/pcb_schema/models.py` - Pydantic domain models
- **Infrastructure**: `backend/app/infra/memory_repo.py` - Repository pattern for persistence

#### How Dependency Injection Works

Services and repositories are wired via FastAPI dependencies in `app/api/designs.py`:

```python
def get_design_service(repo: DesignRepository = Depends(get_repo)) -> DesignService:
    return DesignService(repo)

@router.post("")
async def create_design(service: DesignService = Depends(get_design_service)):
    return service.create_design(design)
```

For **testing**, override dependencies with in-memory implementations:

```python
from fastapi.testclient import TestClient
app.dependency_overrides[get_design_service] = get_test_design_service
```

This allows swapping `DesignRepository` implementations (in-memory → SQLite → PostgreSQL) without changing service code.

### Frontend Development

- **Routes**: `frontend/src/app/routes/` - Page components (`HomePage`, `EditorPage`)
- **Layout**: `frontend/src/app/layout/` - Reusable shell components (`TopBar`, `LeftToolbox`, etc.)
- **Features**: `frontend/src/features/` - Feature modules (`editor/`, `assistant/`, `onboarding/`)
- **API calls**: `frontend/src/shared/api/` - Typed API clients with runtime validation

#### How the Tutorial System Works

The 5-step tutorial is driven by URL query parameters:

- `tutorial=true` enables guided mode
- `step=1..5` controls the current wizard step
- `Wizard` and `CoachMark` components are rendered inside `EditorPage` based on these params

**To test the tutorial flow**:
1. Open `/editor/new?tutorial=true&step=1`
2. Use the "Next" button in the wizard header to progress through steps
3. Each step shows a coach mark highlighting the relevant UI area

**Step progression**:
- Step 1: Choose project template
- Step 2: Place components (coach mark on left toolbox)
- Step 3: Wire connections (coach mark on canvas)
- Step 4: Board layout (coach mark on top bar for view switch)
- Step 5: Check & export (coach mark on right panel)

## Testing the API

```bash
# Create a design
curl -X POST http://localhost:8000/designs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "name": "Test Design",
    "board": {
      "outline": [],
      "components": [],
      "nets": [],
      "layers": 1
    }
  }'

# Validate design
curl -X POST http://localhost:8000/designs/test-1/validate

# Get ML suggestions
curl -X POST http://localhost:8000/ml/suggestions \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-1",
    "name": "Test",
    "board": {"outline": [], "components": [], "nets": [], "layers": 1}
  }'
```

## Running Tests

### Backend Integration Tests

```bash
cd backend
# Install test dependencies
pip install pytest httpx

# Run tests
pytest tests/
```

Tests use FastAPI's `TestClient` with dependency overrides to inject fresh in-memory repositories per test, ensuring isolation.

## Next Steps

1. **Implement Canvas**: Add Konva.js integration for interactive schematic/board editing
2. **Tutorial System**: ✅ Wizard flow with coach marks is implemented - wire to actual canvas interactions
3. **ML Integration**: Connect real ML models for suggestions (currently rule-based heuristics)
4. **Persistence**: Switch `DesignRepository` from in-memory to SQLite by:
   - Creating `infra/sql_repository.py` with SQLModel
   - Updating `deps.py` to use SQL repository
   - Configuring `sqlite:///./pcb.db` connection string
5. **Export**: Implement Gerber file generation in `DesignService.export_gerber()`

## Architecture Principles

- **KISS**: Minimal tools, clear workflows
- **DRY**: Shared schema, reusable components
- **YAGNI**: MVP features only (1-2 layer boards)
- **SOLID**: Layered architecture, separated concerns
- **Clean Code**: Clear naming, small functions, explicit types

