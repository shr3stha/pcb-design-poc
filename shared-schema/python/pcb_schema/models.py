"""
Core domain models for PCB design.
Following SOLID: single responsibility, clear contracts.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Literal, Any
from enum import Enum


class IssueSeverity(str, Enum):
    """DRC issue severity levels."""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class ComponentProperty(BaseModel):
    """Component property (e.g., resistance value, package type)."""
    name: str
    value: float | str
    unit: Optional[str] = None


class Component(BaseModel):
    """PCB component (resistor, LED, IC, etc.)."""
    id: str
    type: str  # "resistor", "led", "header", "mcu", etc.
    properties: Dict[str, ComponentProperty] = Field(default_factory=dict)
    position: Optional[List[float]] = None  # [x, y] for schematic/board placement
    rotation: Optional[float] = None  # degrees


class Net(BaseModel):
    """Electrical net (connection between component pins)."""
    id: str
    connection_ids: List[str] = Field(
        default_factory=list,
        description="Format: 'componentId.pinName' (e.g., 'R1.1', 'LED1.anode')"
    )
    name: Optional[str] = None  # Optional net name (e.g., "VCC", "GND")


class Board(BaseModel):
    """PCB board definition."""
    outline: List[List[float]] = Field(
        default_factory=list,
        description="Polygon points: [[x, y], [x, y], ...]"
    )
    components: List[Component] = Field(default_factory=list)
    nets: List[Net] = Field(default_factory=list)
    layers: int = Field(default=1, description="Number of layers (MVP: 1-2)")


class Issue(BaseModel):
    """DRC or validation issue."""
    id: str
    type: Literal[
        "unconnected_net",
        "short_circuit",
        "clearance_violation",
        "board_edge",
        "missing_component",
        "invalid_connection"
    ] = Field(
        default="unconnected_net",
        description="Type of DRC issue"
    )
    severity: IssueSeverity
    message: str
    related_ids: List[str] = Field(
        default_factory=list,
        description="Component/net IDs related to this issue"
    )
    location: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Location info: {'component_id': 'R1', 'pin': '1', 'x': 10.5, 'y': 20.3}"
    )


class Design(BaseModel):
    """Complete PCB design project."""
    id: str
    name: str
    board: Board
    issues: List[Issue] = Field(default_factory=list)
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

