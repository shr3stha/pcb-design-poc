"""
In-memory repository for Design entities.
Infra layer: persistence implementation (MVP uses in-memory store).
"""

from typing import Dict, Optional, List

from app.domain.models import Design


class DesignRepository:
    """Repository for Design objects (in-memory implementation)."""

    def __init__(self) -> None:
        self._designs: Dict[str, Design] = {}

    def save(self, design: Design) -> None:
        """Create or update a design."""
        self._designs[design.id] = design

    def get(self, design_id: str) -> Optional[Design]:
        """Get a design by ID, or None if not found."""
        return self._designs.get(design_id)

    def delete(self, design_id: str) -> None:
        """Delete a design if it exists."""
        self._designs.pop(design_id, None)

    def list_all(self) -> List[Design]:
        """Return all designs."""
        return list(self._designs.values())


# Singleton repository instance for MVP
design_repository = DesignRepository()


