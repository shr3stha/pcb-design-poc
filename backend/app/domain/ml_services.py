"""
ML services for intelligent design assistance.
SOLID: Single Responsibility - handles ML-powered suggestions only.
"""

from typing import List, Dict
from app.domain.models import Design, Issue, IssueSeverity


class MLSuggestion:
    """ML-generated suggestion."""
    def __init__(
        self,
        id: str,
        type: str,  # "placement", "routing", "component", "general"
        message: str,
        action: Dict | None = None,
        related_ids: List[str] = None
    ):
        self.id = id
        self.type = type
        self.message = message
        self.action = action or {}
        self.related_ids = related_ids or []


class MLService:
    """
    ML-powered design assistant service.
    In MVP: uses rule-based heuristics with pattern detection.
    Later: integrate trained ML models (Random Forest, GNN for placement).
    
    Pattern-based hinting detects common beginner errors:
    - Missing power/ground connections
    - LEDs without current-limiting resistors
    - Floating inputs
    - Missing decoupling capacitors
    """
    
    def get_suggestions(self, design: Design) -> List[Dict]:
        """
        Get ML-powered suggestions for design improvements.
        Returns actionable hints for placement, routing, component selection.
        Uses pattern-based detection for common beginner errors.
        """
        suggestions: List[Dict] = []
        
        # Pattern 1: Check for floating inputs (unconnected IC inputs)
        suggestions.extend(self._detect_floating_inputs(design))
        
        # Pattern 2: Missing decoupling capacitors near ICs
        suggestions.extend(self._detect_missing_decoupling(design))
        
        # Pattern 3: Power/ground net width issues
        suggestions.extend(self._check_power_ground_widths(design))
        
        # Suggestion 1: Check if power/ground nets exist
        power_nets = [n for n in design.board.nets if n.name and n.name.upper() in ["VCC", "VDD", "POWER"]]
        ground_nets = [n for n in design.board.nets if n.name and n.name.upper() in ["GND", "GROUND"]]
        
        if not power_nets:
            suggestions.append({
                "id": "suggest_power_net",
                "type": "component",
                "message": "Consider adding a power net (VCC/VDD) for your circuit. Most components need power to work.",
                "action": {
                    "type": "add_net",
                    "params": {"name": "VCC"}
                },
                "related_ids": []
            })
        
        if not ground_nets:
            suggestions.append({
                "id": "suggest_ground_net",
                "type": "component",
                "message": "Consider adding a ground net (GND). All circuits need a common ground reference.",
                "action": {
                    "type": "add_net",
                    "params": {"name": "GND"}
                },
                "related_ids": []
            })
        
        # Suggestion 2: Check for LED without current-limiting resistor
        leds = [c for c in design.board.components if c.type.lower() == "led"]
        resistors = [c for c in design.board.components if c.type.lower() == "resistor"]
        
        if leds and not resistors:
            suggestions.append({
                "id": "suggest_led_resistor",
                "type": "component",
                "message": "LEDs need a current-limiting resistor to prevent damage. Add a resistor in series with your LED.",
                "action": {
                    "type": "add_component",
                    "params": {"type": "resistor", "value": "220Ω"}
                },
                "related_ids": [led.id for led in leds]
            })
        
        # Suggestion 3: Placement optimization (if components have positions)
        positioned_components = [c for c in design.board.components if c.position]
        if len(positioned_components) > 1:
            # Suggest grouping related components
            suggestions.append({
                "id": "suggest_placement",
                "type": "placement",
                "message": "Group related components together for shorter traces and better layout.",
                "action": None,
                "related_ids": []
            })
        
        return suggestions
    
    def explain_error(self, error: str, context: Dict) -> Dict:
        """
        Explain a DRC error in beginner-friendly terms.
        Returns explanation and step-by-step fix instructions.
        """
        error_lower = error.lower()
        
        # Rule-based explanations (MVP)
        # Later: use NLP/ML model for more sophisticated explanations
        
        if "unconnected" in error_lower or "not connected" in error_lower:
            return {
                "explanation": "This net (connection) isn't properly wired. Every net needs at least 2 connections - "
                              "one component pin connected to another. Think of it like a wire that needs to connect "
                              "two points.",
                "steps": [
                    "1. Find the net mentioned in the error",
                    "2. Check which component pins should be connected",
                    "3. Draw a wire (connection) between those pins",
                    "4. Run validation again to confirm it's fixed"
                ]
            }
        
        if "short" in error_lower or "short circuit" in error_lower:
            return {
                "explanation": "A short circuit means two different nets (connections) are accidentally touching. "
                              "This can damage components. Think of it like two wires that shouldn't touch but do.",
                "steps": [
                    "1. Find the pin or connection mentioned in the error",
                    "2. Check if it's connected to multiple nets",
                    "3. Remove the incorrect connection",
                    "4. Make sure each pin connects to only one net"
                ]
            }
        
        if "outline" in error_lower or "boundary" in error_lower:
            return {
                "explanation": "Your board needs a defined shape (outline) before you can place components. "
                              "The outline is like the edges of your PCB - everything must fit inside it.",
                "steps": [
                    "1. Switch to Board view",
                    "2. Use the 'Draw Board Outline' tool",
                    "3. Draw a rectangle or custom shape for your board",
                    "4. Make sure all components fit inside this outline"
                ]
            }
        
        # Default explanation
        return {
            "explanation": f"This error means: {error}. Check the related components or connections mentioned "
                          f"in the error message and fix them according to the design rules.",
            "steps": [
                "1. Read the error message carefully",
                "2. Find the components or connections mentioned",
                "3. Fix the issue based on the error description",
                "4. Run validation again"
            ]
        }
    
    def suggest_next_action(self, design: Design) -> Dict:
        """
        Suggest the next logical action based on current design state.
        Used for wizard flow and smart coaching.
        """
        # Check design state and suggest next step
        
        # If no components, suggest placing components
        if not design.board.components:
            return {
                "action": "place_components",
                "message": "Start by placing components on your schematic. Click 'Add Component' to get started.",
                "step": 1
            }
        
        # If components but no nets, suggest wiring
        if design.board.components and not design.board.nets:
            return {
                "action": "wire_components",
                "message": "Now connect your components! Use the Wire tool to draw connections between component pins.",
                "step": 2
            }
        
        # If nets exist but no board outline, suggest switching to board view
        if design.board.nets and not design.board.outline:
            return {
                "action": "create_board",
                "message": "Great! Your schematic is complete. Switch to Board view to place components and route traces.",
                "step": 3
            }
        
        # If board outline exists but components not placed, suggest placement
        positioned = [c for c in design.board.components if c.position]
        if design.board.outline and len(positioned) < len(design.board.components):
            return {
                "action": "place_footprints",
                "message": "Place your component footprints on the board. Drag them to good positions.",
                "step": 4
            }
        
        # If everything placed, suggest routing
        return {
            "action": "route_traces",
            "message": "Now route the traces! Connect the pads according to your schematic connections.",
            "step": 5
        }
    
    def _detect_floating_inputs(self, design: Design) -> List[Dict]:
        """Detect unconnected IC input pins (common beginner error)."""
        suggestions: List[Dict] = []
        
        # Find IC components (MCU, logic gates, etc.)
        ics = [c for c in design.board.components if c.type.lower() in ['mcu', 'ic', 'microcontroller', 'gate']]
        
        for ic in ics:
            # Check if IC has unconnected pins (simplified: if net count < expected)
            ic_nets = [n for n in design.board.nets if any(ic.id in conn for conn in n.connection_ids)]
            if len(ic_nets) < 2:  # ICs typically need power, ground, and signals
                suggestions.append({
                    "id": f"floating_input_{ic.id}",
                    "type": "component",
                    "message": f"Component '{ic.id}' may have unconnected input pins. Make sure all required pins are connected (power, ground, and signal pins).",
                    "action": {
                        "type": "highlight_component",
                        "params": {"component_id": ic.id}
                    },
                    "related_ids": [ic.id]
                })
        
        return suggestions
    
    def _detect_missing_decoupling(self, design: Design) -> List[Dict]:
        """Detect missing decoupling capacitors near ICs."""
        suggestions: List[Dict] = []
        
        ics = [c for c in design.board.components if c.type.lower() in ['mcu', 'ic', 'microcontroller']]
        capacitors = [c for c in design.board.components if 'cap' in c.type.lower() or 'capacitor' in c.type.lower()]
        
        for ic in ics:
            # Check if there's a capacitor near this IC (simplified check)
            if len(capacitors) == 0:
                suggestions.append({
                    "id": f"decoupling_{ic.id}",
                    "type": "component",
                    "message": f"Consider adding a decoupling capacitor (0.1µF) near '{ic.id}' to filter power supply noise. This is a best practice for stable operation.",
                    "action": {
                        "type": "add_component",
                        "params": {"type": "capacitor", "value": "0.1µF", "near": ic.id}
                    },
                    "related_ids": [ic.id]
                })
        
        return suggestions
    
    def _check_power_ground_widths(self, design: Design) -> List[Dict]:
        """Check if power/ground nets are wide enough (layout concern)."""
        suggestions: List[Dict] = []
        
        power_nets = [n for n in design.board.nets if n.name and n.name.upper() in ['VCC', 'VDD', 'POWER', 'GND', 'GROUND']]
        
        if len(power_nets) > 0:
            suggestions.append({
                "id": "power_width_hint",
                "type": "routing",
                "message": "Power and ground traces should be wider than signal traces (typically 0.5mm or more) to handle higher current. Make sure to set appropriate trace widths in Board view.",
                "action": None,
                "related_ids": [n.id for n in power_nets]
            })
        
        return suggestions

