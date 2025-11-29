"""
FastAPI application entry point.
Clean architecture: thin controllers, rich domain.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import designs, ml

app = FastAPI(
    title="PCB Design API",
    description="Beginner-friendly PCB design backend with ML guidance",
    version="0.1.0"
)

# CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite/React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(designs.router)
app.include_router(ml.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "PCB Design API",
        "version": "0.1.0",
        "status": "healthy"
    }


@app.get("/health")
async def health():
    """Health check for monitoring."""
    return {"status": "ok"}

