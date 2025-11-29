import { useState } from 'react'
import HelpOverlay from '../../shared/ui/HelpOverlay'
import './TopBar.css'

interface TopBarProps {
  designName: string
  viewMode: 'schematic' | 'board'
  onViewModeChange: (mode: 'schematic' | 'board') => void
}

/**
 * Top bar with project info, view toggle, zoom, undo/redo.
 * KISS: Simple toolbar, no complex state.
 */
export default function TopBar({ designName, viewMode, onViewModeChange }: TopBarProps) {
  const [zoom, setZoom] = useState(100)

  return (
    <>
      <div className="top-bar" id="top-bar">
        <div className="top-bar-left">
          <div className="project-name">{designName}</div>
          <div className="view-tabs">
            <button
              className={viewMode === 'schematic' ? 'active' : ''}
              onClick={() => onViewModeChange('schematic')}
            >
              Schematic
            </button>
            <button
              className={viewMode === 'board' ? 'active' : ''}
              onClick={() => onViewModeChange('board')}
            >
              Board
            </button>
          </div>
        </div>

        <div className="top-bar-center">
          <div className="zoom-controls">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))}>−</button>
            <span>{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))}>+</button>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="icon-btn" title="Undo">↶</button>
          <button className="icon-btn" title="Redo">↷</button>
          <HelpOverlay />
          <button className="icon-btn" title="Settings">⚙</button>
        </div>
      </div>
    </>
  )
}

