import { Design, Issue } from '../../../shared/schema/schema'
import './RunCheckModal.css'

interface RunCheckModalProps {
  design: Design
  isOpen: boolean
  onClose: () => void
  onExport?: () => void
}

/**
 * Modal for running DRC check with human-readable checklist.
 * Shows "Everything connected", "No shorts", etc. in beginner-friendly language.
 */
export default function RunCheckModal({ design, isOpen, onClose, onExport }: RunCheckModalProps) {
  if (!isOpen) return null

  const errors = design.issues.filter(i => i.severity === 'error')
  const warnings = design.issues.filter(i => i.severity === 'warning')
  const info = design.issues.filter(i => i.severity === 'info')

  const checks = [
    {
      id: 'connected',
      label: 'Everything connected',
      status: errors.filter(i => i.type === 'unconnected_net').length === 0 ? 'pass' : 'fail',
      description: 'All components are properly wired together'
    },
    {
      id: 'no-shorts',
      label: 'No short circuits',
      status: errors.filter(i => i.type === 'short_circuit').length === 0 ? 'pass' : 'fail',
      description: 'No wires are accidentally touching where they shouldn\'t'
    },
    {
      id: 'board-outline',
      label: 'Board outline defined',
      status: design.board.outline.length > 0 ? 'pass' : 'fail',
      description: 'Your PCB has a defined shape and size'
    },
    {
      id: 'components-placed',
      label: 'Components placed',
      status: design.board.components.length > 0 ? 'pass' : 'fail',
      description: 'All components have positions on the board'
    }
  ]

  const allPassed = checks.every(c => c.status === 'pass') && errors.length === 0

  return (
    <div className="run-check-modal-overlay" onClick={onClose}>
      <div className="run-check-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Design Check Results</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="check-summary">
            <div className={`summary-badge ${allPassed ? 'success' : 'warning'}`}>
              {allPassed ? '✓ All checks passed!' : `${errors.length} error${errors.length !== 1 ? 's' : ''} found`}
            </div>
          </div>

          <div className="checklist">
            {checks.map(check => (
              <div key={check.id} className={`check-item ${check.status}`}>
                <div className="check-icon">
                  {check.status === 'pass' ? '✓' : '✕'}
                </div>
                <div className="check-content">
                  <div className="check-label">{check.label}</div>
                  <div className="check-description">{check.description}</div>
                </div>
              </div>
            ))}
          </div>

          {errors.length > 0 && (
            <div className="errors-section">
              <h3>Issues to Fix</h3>
              <ul className="errors-list">
                {errors.map(issue => (
                  <li key={issue.id} className="error-item">
                    <strong>{issue.type.replace('_', ' ')}:</strong> {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {warnings.length > 0 && (
            <div className="warnings-section">
              <h3>Warnings</h3>
              <ul className="warnings-list">
                {warnings.map(issue => (
                  <li key={issue.id} className="warning-item">
                    {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {allPassed && onExport && (
            <button className="btn-primary" onClick={onExport}>
              Export & What's Next?
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

