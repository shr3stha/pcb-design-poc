/**
 * Shared schema - re-export from shared-schema package.
 * DRY: Single source of truth.
 */

// In production, import from shared-schema package
// For now, define here (should match backend models exactly)

export type IssueSeverity = 'info' | 'warning' | 'error'

export interface ComponentProperty {
  name: string
  value: number | string
  unit?: string
}

export interface Component {
  id: string
  type: string
  properties: Record<string, ComponentProperty>
  position?: [number, number]
  rotation?: number
}

export interface Net {
  id: string
  connectionIds: string[]
  name?: string
}

export interface Board {
  outline: [number, number][]
  components: Component[]
  nets: Net[]
  layers: number
}

export interface Issue {
  id: string
  severity: IssueSeverity
  message: string
  relatedIds: string[]
  location?: [number, number]
}

export interface Design {
  id: string
  name: string
  board: Board
  issues: Issue[]
  createdAt?: string
  updatedAt?: string
}

// API types
export interface ValidateDesignResponse {
  issues: Issue[]
}

export interface MLSuggestion {
  id: string
  type: 'placement' | 'routing' | 'component' | 'general'
  message: string
  action?: {
    type: string
    params: Record<string, any>
  }
  relatedIds: string[]
}

export interface MLSuggestionsResponse {
  suggestions: MLSuggestion[]
}

export interface ExplainErrorRequest {
  error: string
  context: Record<string, any>
}

export interface ExplainErrorResponse {
  explanation: string
  steps?: string[]
}

