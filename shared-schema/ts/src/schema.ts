/**
 * Shared PCB design schema - TypeScript interfaces.
 * Single source of truth for frontend-backend data exchange.
 */

export type IssueSeverity = 'info' | 'warning' | 'error';

export type IssueType =
  | 'unconnected_net'
  | 'short_circuit'
  | 'clearance_violation'
  | 'board_edge'
  | 'missing_component'
  | 'invalid_connection';

export interface ComponentProperty {
  name: string;
  value: number | string;
  unit?: string;
}

export interface Component {
  id: string;
  type: string; // "resistor", "led", "header", "mcu", etc.
  properties: Record<string, ComponentProperty>;
  position?: [number, number]; // [x, y] for schematic/board placement
  rotation?: number; // degrees
}

export interface Net {
  id: string;
  connectionIds: string[]; // Format: "componentId.pinName" (e.g., "R1.1", "LED1.anode")
  name?: string; // Optional net name (e.g., "VCC", "GND")
}

export interface Board {
  outline: [number, number][]; // Polygon points: [[x, y], [x, y], ...]
  components: Component[];
  nets: Net[];
  layers: number; // Number of layers (MVP: 1-2)
}

export interface Issue {
  id: string;
  type: IssueType;
  severity: IssueSeverity;
  message: string;
  relatedIds: string[]; // Component/net IDs related to this issue
  location?: Record<string, any>; // {"component_id": "R1", "pin": "1", "x": 10.5, "y": 20.3}
}

export interface Design {
  id: string;
  name: string;
  board: Board;
  issues: Issue[];
  createdAt?: string;
  updatedAt?: string;
}

// API Request/Response types
export interface ValidateDesignResponse {
  issues: Issue[];
}

export interface MLSuggestion {
  id: string;
  type: 'placement' | 'routing' | 'component' | 'general';
  message: string;
  action?: {
    type: string;
    params: Record<string, any>;
  };
  relatedIds: string[];
}

export interface MLSuggestionsResponse {
  suggestions: MLSuggestion[];
}

export interface ExplainErrorRequest {
  error: string;
  context: Record<string, any>;
}

export interface ExplainErrorResponse {
  explanation: string;
  steps?: string[]; // Step-by-step fix instructions
}

