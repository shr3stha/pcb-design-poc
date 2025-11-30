import { Design } from '../../../shared/schema/schema'
import { mlApi } from '@shared/api/mlApi'
import { useState } from 'react'
import './ErrorList.css'

interface ErrorListProps {
  design: Design
}

/**
 * Error list - displays DRC issues with ML explanations.
 * Beginner-friendly: plain language, actionable fixes.
 */
export default function ErrorList({ design }: ErrorListProps) {
  const [expandedError, setExpandedError] = useState<string | null>(null)
  const [explanations, setExplanations] = useState<Record<string, string>>({})

  const handleExplainError = async (issueId: string, message: string) => {
    if (explanations[issueId]) {
      setExpandedError(expandedError === issueId ? null : issueId)
      return
    }

    try {
      const explanation = await mlApi.explainError(message, {
        designId: design.id,
        issueId,
      })
      setExplanations(prev => ({
        ...prev,
        [issueId]: explanation.explanation,
      }))
      setExpandedError(issueId)
    } catch (error) {
      console.error('Failed to explain error:', error)
    }
  }

  if (design.issues.length === 0) {
    return (
      <div className="error-list">
        <div className="no-errors">
          <p>✅ No errors found!</p>
          <p className="hint">Your design looks good. Run validation to check again.</p>
        </div>
      </div>
    )
  }

  const errors = design.issues.filter(i => i.severity === 'error')
  const warnings = design.issues.filter(i => i.severity === 'warning')
  const info = design.issues.filter(i => i.severity === 'info')

  return (
    <div className="error-list">
      <div className="error-summary">
        <div className="summary-item error">
          <span className="count">{errors.length}</span>
          <span>Errors</span>
        </div>
        <div className="summary-item warning">
          <span className="count">{warnings.length}</span>
          <span>Warnings</span>
        </div>
        <div className="summary-item info">
          <span className="count">{info.length}</span>
          <span>Info</span>
        </div>
      </div>

      <div className="error-items">
        {design.issues.map(issue => (
          <div key={issue.id} className={`error-item ${issue.severity}`}>
            <div className="error-header">
              <span className="error-icon">
                {issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span className="error-message">{issue.message}</span>
              <button
                className="explain-btn"
                onClick={() => handleExplainError(issue.id, issue.message)}
              >
                {expandedError === issue.id ? 'Hide' : 'Explain'}
              </button>
            </div>
            {expandedError === issue.id && explanations[issue.id] && (
              <div className="error-explanation">
                <p className="explanation-text">{explanations[issue.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

