# PCB Design POC - Beginner-Friendly Interactive UI

A beginner-friendly PCB design tool with ML-powered guidance, following KISS, DRY, YAGNI, SOLID, and clean code principles.

## 🎯 Overview

This project provides a guided, interactive PCB design experience for absolute beginners. It features a 5-step wizard tutorial, ML-powered suggestions, pattern-based error detection, and challenge exercises to help users learn PCB design from scratch.

## 📁 Project Structure

```
pcb-design-poc/
├── backend/              # FastAPI Python backend
│   ├── app/
│   │   ├── api/         # API routes (designs, ml)
│   │   ├── domain/      # Business logic (services, models)
│   │   ├── infra/       # Infrastructure (repositories, ML clients)
│   │   └── main.py      # FastAPI app entry
│   ├── tests/           # Integration tests
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/            # React + TypeScript frontend
│   ├── src/
│   │   ├── app/         # Routes & layout components
│   │   ├── features/    # Feature modules (editor, assistant, onboarding)
│   │   ├── shared/      # Shared UI, hooks, API, state
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── shared-schema/       # Shared data models (DRY)
│   ├── python/          # Pydantic models
│   └── ts/              # TypeScript interfaces
├── SETUP.md            # Detailed setup instructions
├── ARCHITECTURE.md     # Architecture documentation
└── README.md
```

## 🛠 Tech Stack

- **Backend**: FastAPI, Pydantic, Python 3.10+, SQLModel (future)
- **Frontend**: React 18, TypeScript, Vite, Zustand, Konva.js (planned)
- **ML**: Pattern-based heuristics (MVP), extensible for scikit-learn/ML models
- **Testing**: pytest, FastAPI TestClient

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm
- Git

### Backend Setup

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

Backend runs at: http://localhost:8000  
API docs at: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Verify Setup

1. Open http://localhost:5173
2. Click "Start My First Board" or "Explore on My Own"
3. You should see the editor interface

See [SETUP.md](SETUP.md) for detailed instructions.

## ✨ Features

### ✅ Completed (MVP)

- **5-Step Wizard Tutorial**

  - Template selection with explanations
  - Step-by-step guided flow (Place → Wire → Layout → Validate → Export)
  - Progress tracking with visual indicators
  - Tool locking based on tutorial step

- **Onboarding System**

  - Expandable template cards with circuit explanations
  - Always-on help overlay (4-step PCB design overview)
  - Challenge cards for "fix broken design" exercises
  - Beginner-friendly language throughout

- **ML-Powered Assistant**

  - Pattern-based error detection (floating inputs, missing decoupling caps)
  - Contextual suggestions (power/ground nets, LED resistors)
  - Beginner-friendly error explanations with step-by-step fixes
  - Smart next-action suggestions based on design state

- **Design Validation**

  - Human-readable DRC checklist ("Everything connected", "No shorts")
  - Run Check modal with pass/fail status
  - Issue highlighting with ML explanations
  - Export-ready validation

- **User Experience**

  - Toast notification system for feedback
  - Coach marks for UI guidance
  - Tool locking during tutorials
  - Responsive layout with clear visual hierarchy

- **Backend Architecture**
  - Clean architecture (API → Domain → Infrastructure)
  - FastAPI dependency injection
  - Repository pattern for persistence
  - Comprehensive integration tests

### 🚧 Planned

- Konva.js canvas integration for interactive editing
- SQLite/PostgreSQL persistence
- Gerber file export
- Advanced ML models (Random Forest, GNN for placement)
- Multi-layer board support
- Real-time collaboration

## 🏗 Architecture Principles

- **KISS**: Minimal tools, clear workflows, no feature bloat
- **DRY**: Shared schema, reusable components, single source of truth
- **YAGNI**: MVP features only (1-2 layer boards, basic DRC)
- **SOLID**: Layered architecture, separated concerns, interface-based design
- **Clean Code**: Clear naming, small functions, explicit types

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed architecture documentation.

## 📚 Tutorial Flow

1. **Template Selection**: Choose LED blinker, Button+LED, or Sensor+MCU
2. **Place Components**: Drag components onto schematic canvas
3. **Wire Connections**: Connect component pins with nets
4. **Board Layout**: Switch to board view, place footprints, route traces
5. **Validate & Export**: Run DRC check, fix issues, export design

Each step includes:

- Tool locking (only relevant tools enabled)
- Coach marks highlighting UI areas
- ML suggestions for next actions
- Real-time validation feedback

## 🧪 Testing

### Backend Tests

```bash
cd backend
pip install pytest httpx
pytest tests/
```

Tests use FastAPI's `TestClient` with dependency overrides for isolation.

### API Testing

```bash
# Create a design
curl -X POST http://localhost:8000/designs \
  -H "Content-Type: application/json" \
  -d '{"id":"test-1","name":"Test","board":{"outline":[],"components":[],"nets":[],"layers":1}}'

# Validate design
curl -X POST http://localhost:8000/designs/test-1/validate
```

## 📖 Documentation

- [SETUP.md](SETUP.md) - Detailed setup and development workflow
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture overview and design decisions

## 🤝 Contributing

This is a POC project. Contributions welcome! Please follow:

- SOLID principles
- Clean code practices
- Type safety (TypeScript + Pydantic)
- Test coverage for new features

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

Inspired by beginner-friendly PCB design tools and educational resources from:

- KiCad tutorials
- Altium Designer guides
- Industry best practices for PCB design education
