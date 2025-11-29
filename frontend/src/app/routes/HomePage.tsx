import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './HomePage.css'

/**
 * Home / Onboarding page.
 * Welcome screen with guided tutorial CTA and template selection.
 */
export default function HomePage() {
  const navigate = useNavigate()

  const handleStartTutorial = () => {
    // Create a new design and start tutorial
    navigate('/editor/new?tutorial=true')
  }

  const handleExplore = () => {
    navigate('/editor/new')
  }

  const templates = [
    {
      id: 'led-blinker',
      name: 'LED Blinker',
      difficulty: 'Beginner',
      description: 'Simple LED circuit with resistor',
      explanation: 'Learn the fundamentals by creating a basic LED circuit. This project teaches you how to place components, connect them with wires, and understand the flow of current through a simple circuit. Perfect for your first PCB!',
      image: '💡',
      components: ['Battery', 'Resistor', 'LED']
    },
    {
      id: 'button-led',
      name: 'Button + LED',
      difficulty: 'Beginner',
      description: 'Control LED with push button',
      explanation: 'Add interactivity to your circuit! This project introduces switches and shows how to control components. You\'ll learn about series connections and how buttons work in electronic circuits.',
      image: '🔘',
      components: ['Battery', 'Resistor', 'LED', 'Push Button']
    },
    {
      id: 'sensor-mcu',
      name: 'Sensor + MCU',
      difficulty: 'Intermediate',
      description: 'Connect sensor to microcontroller',
      explanation: 'Take the next step with a real-world project. Connect a sensor to a microcontroller, learning about power, ground, and signal connections. This introduces you to headers, labeled nets, and more complex circuit design.',
      image: '📡',
      components: ['MCU', 'Sensor', 'Headers', 'Resistors']
    }
  ]

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  return (
    <div className="home-page">
      <div className="home-top-bar">
        <div className="logo">PCB Design</div>
        <div className="top-bar-actions">
          <button className="btn-secondary">Settings</button>
        </div>
      </div>

      <div className="home-main">
        <div className="welcome-section">
          <h1>Design your first PCB step-by-step, with guidance</h1>
          <p className="subtitle">
            Learn PCB design from scratch with interactive tutorials and ML-powered assistance
          </p>

          <div className="cta-buttons">
            <button className="btn-primary btn-large" onClick={handleStartTutorial}>
              Start My First Board
            </button>
            <button className="btn-secondary btn-large" onClick={handleExplore}>
              Explore on My Own
            </button>
          </div>
        </div>

        <div className="templates-section">
          <h2>Starter Projects</h2>
          <div className="template-grid">
            {templates.map(template => (
              <div 
                key={template.id} 
                className={`template-card ${selectedTemplate === template.id ? 'expanded' : ''}`}
                onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
              >
                <div className="template-icon">{template.image}</div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <span className="difficulty-badge">{template.difficulty}</span>
                  {selectedTemplate === template.id && (
                    <div className="template-explanation">
                      <p className="explanation-text">{template.explanation}</p>
                      <div className="template-components">
                        <strong>Components:</strong> {template.components.join(', ')}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="btn-primary btn-small"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/editor/new?template=${template.id}&tutorial=true&step=1`)
                  }}
                >
                  Start
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="home-footer">
        <div className="footer-links">
          <a href="#help">Help</a>
          <a href="#docs">Documentation</a>
          <a href="#challenges">Challenges</a>
        </div>
        <div className="footer-badges">
          <span>🎯 Your first PCB awaits!</span>
        </div>
      </div>
    </div>
  )
}

