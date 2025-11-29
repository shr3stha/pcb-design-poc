"""
Domain models - re-export shared schema models.
DRY: Single source of truth from shared-schema.
"""

# For development: import from shared-schema
# In production, use proper package structure or copy models here
import sys
from pathlib import Path

# Add shared-schema to path for development
project_root = Path(__file__).parent.parent.parent.parent
shared_schema_path = project_root / "shared-schema" / "python"
if str(shared_schema_path) not in sys.path:
    sys.path.insert(0, str(shared_schema_path))

try:
    from pcb_schema.models import (
        Component,
        ComponentProperty,
        Net,
        Board,
        Issue,
        IssueSeverity,
        Design,
    )
except ImportError:
    # Fallback: define models here if shared-schema not available
    from pydantic import BaseModel, Field
    from typing import List, Dict, Optional, Any, Literal
    from enum import Enum

    class IssueSeverity(str, Enum):
        INFO = "info"
        WARNING = "warning"
        ERROR = "error"

    class ComponentProperty(BaseModel):
        name: str
        value: float | str
        unit: Optional[str] = None

    class Component(BaseModel):
        id: str
        type: str
        properties: Dict[str, ComponentProperty] = Field(default_factory=dict)
        position: Optional[List[float]] = None
        rotation: Optional[float] = None

    class Net(BaseModel):
        id: str
        connection_ids: List[str] = Field(default_factory=list)
        name: Optional[str] = None

    class Board(BaseModel):
        outline: List[List[float]] = Field(default_factory=list)
        components: List[Component] = Field(default_factory=list)
        nets: List[Net] = Field(default_factory=list)
        layers: int = Field(default=1)

    class Issue(BaseModel):
        id: str
        type: str = Field(default="unconnected_net")
        severity: IssueSeverity
        message: str
        related_ids: List[str] = Field(default_factory=list)
        location: Optional[Dict[str, Any]] = None

    class Design(BaseModel):
        id: str
        name: str
        board: Board
        issues: List[Issue] = Field(default_factory=list)
        created_at: Optional[str] = None
        updated_at: Optional[str] = None

__all__ = [
    "Component",
    "ComponentProperty",
    "Net",
    "Board",
    "Issue",
    "IssueSeverity",
    "Design",
]
