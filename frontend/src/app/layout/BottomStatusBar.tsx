import './BottomStatusBar.css'

/**
 * Bottom status bar - coordinates, grid, messages.
 * KISS: Simple status display.
 */
export default function BottomStatusBar() {
  return (
    <div className="bottom-status-bar">
      <div className="status-left">
        <span className="status-item">Grid: 1mm</span>
        <span className="status-item">Units: mm</span>
        <span className="status-item">Layer: Top</span>
      </div>
      <div className="status-center">
        <span className="status-message">Ready</span>
      </div>
      <div className="status-right">
        <span className="status-item">X: 0.00</span>
        <span className="status-item">Y: 0.00</span>
      </div>
    </div>
  )
}

