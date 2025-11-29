import { Design } from '../../../shared/schema/schema'
import './PropertiesPanel.css'

interface PropertiesPanelProps {
  design: Design
  viewMode: 'schematic' | 'board'
}

/**
 * Properties panel - shows properties of selected component/net.
 * KISS: Simple property display, no complex editing yet.
 */
export default function PropertiesPanel({ design, viewMode }: PropertiesPanelProps) {
  // TODO: Track selected item from canvas
  const hasSelection = false

  if (!hasSelection) {
    return (
      <div className="properties-panel">
        <div className="no-selection">
          <p>No selection</p>
          <p className="hint">Click a component or net to view properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="properties-panel">
      <h3>Properties</h3>
      {/* TODO: Render selected item properties */}
    </div>
  )
}

