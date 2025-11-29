import { useState } from 'react'
import './HelpOverlay.css'

/**
 * Always-on help overlay explaining "How PCB design works".
 * Accessible via question mark icon in top bar.
 */
export default function HelpOverlay() {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button 
        className="help-icon-btn"
        onClick={() => setIsOpen(true)}
        title="How PCB design works"
      >
        ?
      </button>
    )
  }

  return (
    <div className="help-overlay" onClick={() => setIsOpen(false)}>
      <div className="help-content" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>How PCB Design Works</h2>
          <button className="help-close" onClick={() => setIsOpen(false)}>×</button>
        </div>
        <div className="help-body">
          <div className="help-step">
            <div className="help-step-number">1</div>
            <div className="help-step-content">
              <h3>Schematic</h3>
              <p>Draw your circuit using symbols. Connect components with wires (nets) to show how electricity flows.</p>
            </div>
          </div>
          <div className="help-step">
            <div className="help-step-number">2</div>
            <div className="help-step-content">
              <h3>Layout</h3>
              <p>Place component footprints on a board and route copper traces between them. This is your actual PCB!</p>
            </div>
          </div>
          <div className="help-step">
            <div className="help-step-number">3</div>
            <div className="help-step-content">
              <h3>Validation</h3>
              <p>Run Design Rule Checks (DRC) to find errors like unconnected wires or components too close together.</p>
            </div>
          </div>
          <div className="help-step">
            <div className="help-step-number">4</div>
            <div className="help-step-content">
              <h3>Manufacturing</h3>
              <p>Export Gerber files and send to a PCB manufacturer. They'll print your design on a real board!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

