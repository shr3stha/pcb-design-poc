import { useEffect, useState } from 'react'
import { Design } from '../../../shared/schema/schema'
import { mlApi } from '@shared/api/mlApi'
import './TipsPanel.css'

interface TipsPanelProps {
  design: Design
}

/**
 * Tips panel - ML-powered design suggestions.
 * Shows actionable hints for improving the design.
 */
export default function TipsPanel({ design }: TipsPanelProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSuggestions()
  }, [design.id])

  const loadSuggestions = async () => {
    try {
      setLoading(true)
      const response = await mlApi.getSuggestions(design)
      setSuggestions(response.suggestions)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="tips-panel">
        <p>Loading suggestions...</p>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="tips-panel">
        <div className="no-tips">
          <p>✨ No suggestions at the moment</p>
          <p className="hint">Your design looks good! Keep going.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="tips-panel">
      <div className="tips-header">
        <h3>💡 Design Tips</h3>
        <button onClick={loadSuggestions} className="refresh-btn">Refresh</button>
      </div>

      <div className="tips-list">
        {suggestions.map(suggestion => (
          <div key={suggestion.id} className="tip-item">
            <div className="tip-icon">
              {suggestion.type === 'placement' ? '📍' :
               suggestion.type === 'routing' ? '🛤️' :
               suggestion.type === 'component' ? '⚡' : '💡'}
            </div>
            <div className="tip-content">
              <p className="tip-message">{suggestion.message}</p>
              {suggestion.action && (
                <button className="apply-btn">Apply suggestion</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

