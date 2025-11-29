import { useTutorialLock } from '../../shared/hooks/useTutorialLock'
import { useToastStore } from '../../shared/ui/ToastContainer'
import './LeftToolbox.css'

interface LeftToolboxProps {
  viewMode: 'schematic' | 'board'
}

/**
 * Left toolbox - components and tools.
 * KISS: Essential tools only, beginner-friendly.
 * Supports tool locking during tutorial steps.
 */
export default function LeftToolbox({ viewMode }: LeftToolboxProps) {
  const { isToolLocked, getLockedMessage } = useTutorialLock()
  const { showToast } = useToastStore()
  const components = [
    { id: 'resistor', name: 'Resistor', icon: '⚡' },
    { id: 'led', name: 'LED', icon: '💡' },
    { id: 'button', name: 'Button', icon: '🔘' },
    { id: 'battery', name: 'Battery', icon: '🔋' },
    { id: 'header', name: 'Header', icon: '📌' },
    { id: 'mcu', name: 'MCU', icon: '💻' },
  ]

  const tools = viewMode === 'schematic' 
    ? [
        { id: 'select' as const, name: 'Select', icon: '👆' },
        { id: 'place' as const, name: 'Place Component', icon: '➕' },
        { id: 'wire' as const, name: 'Wire', icon: '🔌' },
        { id: 'delete' as const, name: 'Delete', icon: '🗑️' },
      ]
    : [
        { id: 'select' as const, name: 'Select', icon: '👆' },
        { id: 'place' as const, name: 'Place Footprint', icon: '📍' },
        { id: 'route' as const, name: 'Route', icon: '🛤️' },
        { id: 'measure' as const, name: 'Measure', icon: '📏' },
      ]

  const handleToolClick = (toolId: string) => {
    if (isToolLocked(toolId as any)) {
      const message = getLockedMessage()
      showToast(message || 'This tool is locked in the current tutorial step', 'info')
      return
    }
    // TODO: Implement tool selection logic
  }

  return (
    <div className="left-toolbox" id="left-toolbox">
      <div className="toolbox-section">
        <h3>Tools</h3>
        <div className="tool-list">
          {tools.map(tool => {
            const locked = isToolLocked(tool.id)
            return (
              <button 
                key={tool.id} 
                className={`tool-btn ${locked ? 'locked' : ''}`}
                title={locked ? getLockedMessage() || 'Locked' : tool.name}
                onClick={() => handleToolClick(tool.id)}
                disabled={locked}
              >
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
                {locked && <span className="lock-indicator">🔒</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="toolbox-section">
        <h3>Components</h3>
        <div className="component-search">
          <input type="text" placeholder="Search components..." />
        </div>
        <div className="component-list">
          {components.map(comp => (
            <button key={comp.id} className="component-btn" title={comp.name}>
              <span className="component-icon">{comp.icon}</span>
              <span className="component-name">{comp.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

