"""
Design management API endpoints.
SOLID: Single Responsibility - handles design CRUD and validation only.
Now uses repository + services via FastAPI dependency injection.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException

from app.domain.models import Design
from app.domain.services import DesignService, DRCService
from app.infra.memory_repo import DesignRepository, design_repository

router = APIRouter(prefix="/designs", tags=["designs"])


def get_repo() -> DesignRepository:
    """Provide the design repository (in-memory for MVP)."""
    return design_repository


def get_design_service(repo: DesignRepository = Depends(get_repo)) -> DesignService:
    """Provide a DesignService with injected repository."""
    return DesignService(repo)


def get_drc_service() -> DRCService:
    """Provide a DRCService instance."""
    return DRCService()


@router.post("", response_model=Design)
async def create_design(
    design: Design,
    service: DesignService = Depends(get_design_service),
) -> Design:
    """Create a new design."""
    return service.create_design(design)


@router.get("/{design_id}", response_model=Design)
async def get_design(
    design_id: str,
    service: DesignService = Depends(get_design_service),
) -> Design:
    """Get design by ID."""
    try:
        return service.get_design(design_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Design not found")


@router.put("/{design_id}", response_model=Design)
async def update_design(
    design_id: str,
    design: Design,
    service: DesignService = Depends(get_design_service),
) -> Design:
    """Update existing design."""
    # Ensure path and body IDs match for safety
    if design.id != design_id:
        raise HTTPException(status_code=400, detail="Design ID mismatch")
    return service.update_design(design)


@router.delete("/{design_id}")
async def delete_design(
    design_id: str,
    service: DesignService = Depends(get_design_service),
) -> dict:
    """Delete design."""
    try:
        # Ensure it exists
        service.get_design(design_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Design not found")

    service.delete_design(design_id)
    return {"message": "Design deleted"}


@router.get("", response_model=List[Design])
async def list_designs(
    service: DesignService = Depends(get_design_service),
) -> List[Design]:
    """List all designs."""
    return service.list_designs()


@router.post("/{design_id}/validate")
async def validate_design(
    design_id: str,
    service: DesignService = Depends(get_design_service),
    drc_service: DRCService = Depends(get_drc_service),
):
    """
    Run DRC (Design Rule Check) on design.
    Returns list of issues (errors, warnings, info).
    """
    try:
        design = service.get_design(design_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Design not found")

    issues = drc_service.check_design(design)

    # Update design with issues
    design.issues = issues
    service.update_design(design)

    return {"issues": issues}

