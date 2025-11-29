"""
Issue-related types for DRC and validation.

Re-exports Issue and IssueSeverity from models to provide a clear semantic boundary
for DRC/validation concerns.
"""

from .models import Issue, IssueSeverity as Severity
from typing import Literal

# Issue type constants for type safety
IssueType = Literal[
    "unconnected_net",
    "short_circuit",
    "clearance_violation",
    "board_edge",
    "missing_component",
    "invalid_connection"
]

__all__ = ["Issue", "Severity", "IssueType"]


