import { Design } from '../../../shared/schema/schema'
import './SchematicCanvas.css'

interface SchematicCanvasProps {
  design: Design
  isTutorial?: boolean
}

/**
 * Schematic canvas - component placement and wiring.
 * TODO: Implement with Konva.js for interactive canvas.
 */
export default function SchematicCanvas({ design, isTutorial }: SchematicCanvasProps) {
  return (
    <div className="schematic-canvas">
      <div className="canvas-placeholder">
        <p>Schematic Canvas</p>
        <p className="placeholder-hint">
          {isTutorial ? 'Tutorial mode: Follow the guided steps' : 'Place components and wire connections'}
        </p>
        <p className="placeholder-stats">
          Components: {design.board.components.length} | 
          Nets: {design.board.nets.length}
        </p>
      </div>
    </div>
  )
}

