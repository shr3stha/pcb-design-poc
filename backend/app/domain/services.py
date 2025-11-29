"""
Domain services - business logic for design operations.
SOLID: Single Responsibility - each service handles one concern.
"""

from typing import List

from app.domain.models import Design, Issue, IssueSeverity
from app.infra.memory_repo import DesignRepository, design_repository


class DesignService:
    """
    Service for design operations (CRUD, export, etc.).

    Depends on a DesignRepository (injected) to persist designs.
    """

    def __init__(self, repo: DesignRepository | None = None) -> None:
        # Default to global in-memory repo for MVP
        self._repo = repo or design_repository

    def create_design(self, design: Design) -> Design:
        """Create a new design."""
        self._repo.save(design)
        return design

    def get_design(self, design_id: str) -> Design:
        """Get a design or raise ValueError if not found."""
        design = self._repo.get(design_id)
        if design is None:
            raise ValueError("Design not found")
        return design

    def update_design(self, design: Design) -> Design:
        """Update an existing design."""
        self._repo.save(design)
        return design

    def delete_design(self, design_id: str) -> None:
        """Delete a design."""
        self._repo.delete(design_id)

    def list_designs(self) -> List[Design]:
        """List all designs."""
        return self._repo.list_all()

    def export_gerber(self, design: Design) -> bytes:
        """Export design to Gerber format (placeholder for MVP)."""
        # TODO: Implement Gerber export
        raise NotImplementedError("Gerber export coming soon")


class DRCService:
    """
    Design Rule Check service.
    SOLID: Single Responsibility - only handles validation rules.
    """

    def check_design(self, design: Design) -> List[Issue]:
        """
        Run DRC checks on design.
        Returns list of issues (errors, warnings, info).
        """
        issues: List[Issue] = []

        # Check 1: Unconnected nets
        issues.extend(self._check_unconnected_nets(design))

        # Check 2: Short circuits (nets with overlapping connections)
        issues.extend(self._check_short_circuits(design))

        # Check 3: Missing board outline
        if not design.board.outline:
            issues.append(
                Issue(
                    id=f"issue_{len(issues)}",
                    type="board_edge",
                    severity=IssueSeverity.ERROR,
                    message="Board outline is missing. Define board boundaries first.",
                    related_ids=[],
                )
            )

        # Check 4: Components outside board outline (if outline exists)
        if design.board.outline:
            issues.extend(self._check_components_in_bounds(design))

        return issues

    def _check_unconnected_nets(self, design: Design) -> List[Issue]:
        """Check for nets with less than 2 connections."""
        issues: List[Issue] = []

        for net in design.board.nets:
            if len(net.connection_ids) < 2:
                issues.append(
                    Issue(
                        id=f"unconnected_{net.id}",
                        type="unconnected_net",
                        severity=IssueSeverity.ERROR,
                        message=(
                            f"Net '{net.name or net.id}' is not connected properly. "
                            f"Each net needs at least 2 connections."
                        ),
                        related_ids=[net.id],
                        location={"net_id": net.id},
                    )
                )

        return issues

    def _check_short_circuits(self, design: Design) -> List[Issue]:
        """Check for nets that share connections (potential shorts)."""
        issues: List[Issue] = []

        # Build connection map: component.pin -> net_id
        pin_to_net: dict[str, str] = {}

        for net in design.board.nets:
            for conn_id in net.connection_ids:
                if conn_id in pin_to_net:
                    # Found a pin connected to multiple nets - potential short
                    other_net = pin_to_net[conn_id]
                    issues.append(
                        Issue(
                            id=f"short_{net.id}_{other_net}",
                            type="short_circuit",
                            severity=IssueSeverity.ERROR,
                            message=(
                                "Potential short circuit: pin "
                                f"'{conn_id}' is connected to multiple nets "
                                f"('{net.id}' and '{other_net}')."
                            ),
                            related_ids=[net.id, other_net, conn_id],
                            location={"pin": conn_id, "net1": net.id, "net2": other_net},
                        )
                    )
                else:
                    pin_to_net[conn_id] = net.id

        return issues

    def _check_components_in_bounds(self, design: Design) -> List[Issue]:
        """Check if components are within board outline (simplified check)."""
        issues: List[Issue] = []

        # Simplified: just check if components have positions
        # Full implementation would check polygon containment
        for component in design.board.components:
            if component.position is None:
                issues.append(
                    Issue(
                        id=f"no_position_{component.id}",
                        severity=IssueSeverity.WARNING,
                        message=f"Component '{component.id}' has no position defined.",
                        related_ids=[component.id],
                    )
                )

        return issues

