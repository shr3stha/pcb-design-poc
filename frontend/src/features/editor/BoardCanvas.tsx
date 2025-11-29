import { Design } from '../../../shared/schema/schema'
import './BoardCanvas.css'

interface BoardCanvasProps {
  design: Design
  isTutorial?: boolean
}

/**
 * Board canvas - footprint placement and trace routing.
 * TODO: Implement with Konva.js for interactive canvas.
 */
export default function BoardCanvas({ design, isTutorial }: BoardCanvasProps) {
  return (
    <div className="board-canvas">
      <div className="canvas-placeholder">
        <p>Board Layout Canvas</p>
        <p className="placeholder-hint">
          {isTutorial ? 'Tutorial mode: Place footprints and route traces' : 'Place components and route traces'}
        </p>
        <p className="placeholder-stats">
          Components: {design.board.components.length} | 
          Board Outline: {design.board.outline.length > 0 ? 'Defined' : 'Not defined'}
        </p>
      </div>
    </div>
  )
}

