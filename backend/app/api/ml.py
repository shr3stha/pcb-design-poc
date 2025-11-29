"""
ML-powered assistant API endpoints.
SOLID: Single Responsibility - handles ML suggestions and explanations only.
"""

from fastapi import APIRouter
from app.domain.models import Design
from app.domain.ml_services import MLService
from pydantic import BaseModel
from typing import Dict, List

router = APIRouter(prefix="/ml", tags=["ml"])

ml_service = MLService()


class ExplainErrorRequest(BaseModel):
    """Request to explain an error in beginner-friendly terms."""
    error: str
    context: Dict


class MLSuggestion(BaseModel):
    """ML-generated suggestion for design improvement."""
    id: str
    type: str  # "placement", "routing", "component", "general"
    message: str
    action: Dict | None = None
    related_ids: List[str] = []


@router.post("/suggestions")
async def get_suggestions(design: Design):
    """
    Get ML-powered suggestions for design improvements.
    Returns actionable hints for placement, routing, component selection.
    """
    suggestions = ml_service.get_suggestions(design)
    return {"suggestions": suggestions}


@router.post("/explain-error")
async def explain_error(payload: ExplainErrorRequest):
    """
    Explain a DRC error in beginner-friendly terms.
    Returns explanation and step-by-step fix instructions.
    """
    explanation = ml_service.explain_error(payload.error, payload.context)
    return explanation


@router.post("/next-action")
async def suggest_next_action(design: Design):
    """
    Suggest the next logical action based on current design state.
    Used for wizard flow and smart coaching.
    """
    suggestion = ml_service.suggest_next_action(design)
    return suggestion

