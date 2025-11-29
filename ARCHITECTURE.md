# Architecture Overview

## System Design

This PCB design tool follows **clean architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Routes  │  │ Features │  │  Shared  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│       │             │             │                     │
│       └─────────────┴─────────────┘                     │
│                    │ HTTP/REST                           │
└────────────────────┼─────────────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────────────┐
│                    │         Backend (FastAPI)            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   API    │  │  Domain  │  │   Infra  │             │
│  │  Routes  │  │ Services │  │   Layer  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
                     │
┌────────────────────┼─────────────────────────────────────┐
│              Shared Schema (DRY)                          │
│  ┌──────────┐              ┌──────────┐                 │
│  │ Python   │              │TypeScript│                 │
│  │ Pydantic │              │Interface │                 │
│  └──────────┘              └──────────┘                 │
└──────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Frontend Layers

1. **Routes** (`app/routes/`)
   - Page-level components
   - Route configuration
   - High-level state orchestration

2. **Layout** (`app/layout/`)
   - Reusable layout components
   - TopBar, LeftToolbox, RightPanel, BottomStatusBar
   - CanvasArea (switches between views)

3. **Features** (`features/`)
   - Feature-specific modules
   - `editor/`: SchematicCanvas, BoardCanvas, PropertiesPanel
   - `assistant/`: AssistantPanel, ErrorList, TipsPanel
   - `onboarding/`: Tutorial system (TODO)

4. **Shared** (`shared/`)
   - API clients (`api/`)
   - State management (`state/`)
   - Schema definitions (`schema/`)
   - UI components (`ui/`) - TODO

### Backend Layers

1. **API** (`app/api/`)
   - HTTP endpoints
   - Request/response handling
   - Input validation
   - **SOLID**: Single Responsibility - each router handles one concern

2. **Domain** (`app/domain/`)
   - Business logic
   - Domain models (re-exported from shared-schema)
   - Services: `DesignService`, `DRCService`, `MLService`
   - **SOLID**: Domain logic independent of infrastructure

3. **Infrastructure** (`app/infra/`)
   - Persistence (database, file storage)
   - External services (ML APIs, export services)
   - **SOLID**: Can be swapped without changing domain

## Data Flow

### Design Creation Flow

```
User clicks "New Design"
    ↓
Frontend: createNewDesign()
    ↓
API: POST /designs
    ↓
Backend: DesignService.create_design()
    ↓
Store in memory (MVP) / Database (later)
    ↓
Return Design object
    ↓
Frontend: Update Zustand store
    ↓
UI re-renders with new design
```

### Validation Flow

```
User clicks "Validate"
    ↓
Frontend: validateDesign(designId)
    ↓
API: POST /designs/{id}/validate
    ↓
Backend: DRCService.check_design()
    ↓
Run DRC rules:
  - Unconnected nets
  - Short circuits
  - Board outline checks
  - Component bounds
    ↓
Return Issue[]
    ↓
Frontend: Update design.issues
    ↓
ErrorList component displays issues
```

### ML Suggestion Flow

```
User asks "What's next?" or hovers error
    ↓
Frontend: mlApi.getSuggestions() or explainError()
    ↓
API: POST /ml/suggestions or /ml/explain-error
    ↓
Backend: MLService.get_suggestions() or explain_error()
    ↓
Rule-based heuristics (MVP) / ML model (later)
    ↓
Return MLSuggestion[] or ExplainErrorResponse
    ↓
Frontend: Display in AssistantPanel or ErrorList
```

## SOLID Principles in Practice

### Single Responsibility Principle (SRP)

- `DRCService`: Only handles design rule checking
- `MLService`: Only handles ML-powered suggestions
- `DesignService`: Only handles design CRUD operations
- Each API router: Only handles one resource type

### Open/Closed Principle (OCP)

- DRC rules: Add new rules by extending `DRCService` without modifying existing code
- ML models: Swap rule-based → ML models without changing service interface
- Export formats: Add Gerber, PDF, etc. by extending `DesignService.export_*()`

### Liskov Substitution Principle (LSP)

- All services implement clear interfaces
- Can swap implementations (e.g., in-memory → database) without breaking clients

### Interface Segregation Principle (ISP)

- Frontend sees focused API responses (Design DTOs, Issue lists, Suggestion DTOs)
- Not exposed to internal domain objects or database models

### Dependency Inversion Principle (DIP)

- API layer depends on domain abstractions (services), not implementations
- Domain layer doesn't depend on infrastructure
- Infrastructure implements domain interfaces

## DRY (Don't Repeat Yourself)

1. **Shared Schema**: Single source of truth for `Design`, `Component`, `Net`, etc.
   - Python: `shared-schema/python/pcb_schema/models.py`
   - TypeScript: `shared-schema/ts/src/schema.ts`
   - Frontend: `frontend/src/shared/schema/schema.ts` (re-export)

2. **Reusable Components**: 
   - `Panel`, `Button`, `Tabs` (TODO: create shared UI library)
   - Layout components used across pages

3. **API Client**: Single axios instance with consistent error handling

## KISS (Keep It Simple, Stupid)

1. **MVP Features Only**:
   - 1-2 layer boards (not multi-layer)
   - Basic DRC (not advanced rules)
   - In-memory storage (not database yet)
   - Rule-based ML (not trained models yet)

2. **Simple UI**:
   - Essential tools only (place, wire, route)
   - Clear labels, no jargon
   - Beginner-friendly language

3. **Straightforward Architecture**:
   - No over-engineering
   - No premature optimization
   - Clear, readable code

## YAGNI (You Aren't Gonna Need It)

**Not implemented (yet)**:
- Multi-layer boards
- Advanced DRC rules
- 3D view
- Simulation
- Version control
- Collaboration features
- Plugin system
- Advanced routing algorithms

**Implemented (MVP)**:
- Basic schematic editing
- Basic board layout
- Simple DRC
- ML suggestions (rule-based)
- Tutorial system (structure ready)

## Clean Code Practices

1. **Naming**: Clear, descriptive names
   - `validateDesign()` not `vd()`
   - `check_unconnected_nets()` not `chk_net()`

2. **Functions**: Small, focused functions
   - Each function does one thing
   - Easy to test and understand

3. **Types**: Explicit types everywhere
   - Pydantic models for backend
   - TypeScript interfaces for frontend
   - No `any` types (where possible)

4. **Comments**: Explain "why", not "what"
   - Code should be self-documenting
   - Comments for business logic, not obvious code

## Extension Points

### Adding New DRC Rules

```python
# In DRCService
def _check_new_rule(self, design: Design) -> List[Issue]:
    issues = []
    # Your rule logic
    return issues

# Add to check_design()
issues.extend(self._check_new_rule(design))
```

### Adding New ML Models

```python
# In MLService
def get_suggestions(self, design: Design) -> List[Dict]:
    # Swap rule-based → ML model
    if self.use_ml_model:
        return self.ml_model.predict(design)
    else:
        return self._rule_based_suggestions(design)
```

### Adding New Export Formats

```python
# In DesignService
def export_pdf(self, design: Design) -> bytes:
    # PDF export logic
    pass
```

## Testing Strategy (Future)

1. **Unit Tests**: Domain services, DRC rules
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Full user flows (Playwright/Cypress)
4. **ML Tests**: Suggestion quality, error explanations

## Performance Considerations

1. **Frontend**: 
   - Canvas rendering: Use Konva.js efficiently
   - State updates: Debounce API calls
   - Large designs: Virtual scrolling for component lists

2. **Backend**:
   - DRC: Optimize for large designs (parallel checks)
   - ML: Cache suggestions, batch requests
   - API: Add pagination for design lists

## Security (Future)

1. **Authentication**: JWT tokens
2. **Authorization**: User-based design access
3. **Input Validation**: Pydantic models handle this
4. **CORS**: Configured for development, restrict in production

