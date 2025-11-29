/**
 * Runtime validation for Issue objects.
 * Ensures API responses match expected schema before rendering.
 */

import type { Issue, IssueType, IssueSeverity } from './schema'

const validSeverities: IssueSeverity[] = ['info', 'warning', 'error']
const validTypes: IssueType[] = [
  'unconnected_net',
  'short_circuit',
  'clearance_violation',
  'board_edge',
  'missing_component',
  'invalid_connection',
]

/**
 * Type guard to check if a value is a valid Issue.
 */
export function isIssue(value: unknown): value is Issue {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const v = value as any

  return (
    typeof v.id === 'string' &&
    typeof v.type === 'string' &&
    validTypes.includes(v.type as IssueType) &&
    typeof v.severity === 'string' &&
    validSeverities.includes(v.severity as IssueSeverity) &&
    typeof v.message === 'string' &&
    Array.isArray(v.relatedIds) &&
    v.relatedIds.every((id: unknown) => typeof id === 'string') &&
    (v.location === undefined || typeof v.location === 'object')
  )
}

/**
 * Validate and filter an array of issues.
 * Returns only valid Issue objects, filtering out malformed data.
 */
export function validateIssues(raw: unknown): Issue[] {
  if (!Array.isArray(raw)) {
    return []
  }

  return raw.filter(isIssue)
}

