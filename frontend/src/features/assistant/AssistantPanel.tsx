import { useState, useEffect } from 'react'
import { Design } from '../../../shared/schema/schema'
import { mlApi } from '../../../shared/api/mlApi'
import './AssistantPanel.css'

interface AssistantPanelProps {
  design: Design
  isTutorial?: boolean
}

/**
 * ML Assistant panel - chat-like interface for guidance.
 * Integrates with ML backend for suggestions and explanations.
 */
export default function AssistantPanel({ design, isTutorial }: AssistantPanelProps) {
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'assistant', text: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get initial suggestion on mount
    loadNextAction()
  }, [design.id])

  const loadNextAction = async () => {
    try {
      setLoading(true)
      const suggestion = await mlApi.suggestNextAction(design)
      setMessages([{
        type: 'assistant',
        text: suggestion.message || 'Ready to help! What would you like to do?'
      }])
    } catch (error) {
      console.error('Failed to load suggestion:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { type: 'user' as const, text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Simple keyword-based routing (MVP)
      // Later: use proper NLP/ML model
      if (input.toLowerCase().includes('error') || input.toLowerCase().includes('wrong')) {
        // Explain errors
        const explanation = await mlApi.explainError(
          'Check design for errors',
          { designId: design.id }
        )
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: explanation.explanation
        }])
      } else {
        // Get general suggestions
        const suggestions = await mlApi.getSuggestions(design)
        if (suggestions.suggestions.length > 0) {
          setMessages(prev => [...prev, {
            type: 'assistant',
            text: suggestions.suggestions[0].message
          }])
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant-panel">
      <div className="assistant-header">
        <h3>🤖 Design Assistant</h3>
        {isTutorial && <span className="tutorial-badge">Tutorial Mode</span>}
      </div>

      <div className="assistant-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-content">Thinking...</div>
          </div>
        )}
      </div>

      <div className="assistant-input">
        <input
          type="text"
          placeholder="Ask for help..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={loading}>Send</button>
      </div>

      <div className="assistant-quick-actions">
        <button onClick={loadNextAction} className="quick-action-btn">
          What's next?
        </button>
        <button onClick={() => mlApi.getSuggestions(design)} className="quick-action-btn">
          Get suggestions
        </button>
      </div>
    </div>
  )
}

