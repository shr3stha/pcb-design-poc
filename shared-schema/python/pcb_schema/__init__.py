"""
Shared PCB design schema - Python (Pydantic) models.
Single source of truth for design data structures.
"""

from .models import (
    Component,
    ComponentProperty,
    Net,
    Board,
    Issue,
    IssueSeverity,
    Design,
)

__all__ = [
    "Component",
    "ComponentProperty",
    "Net",
    "Board",
    "Issue",
    "IssueSeverity",
    "Design",
]
