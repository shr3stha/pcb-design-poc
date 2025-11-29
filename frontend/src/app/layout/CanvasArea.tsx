import { Design } from '../../../shared/schema/schema'
import SchematicCanvas from '../../features/editor/SchematicCanvas'
import BoardCanvas from '../../features/editor/BoardCanvas'
import './CanvasArea.css'

interface CanvasAreaProps {
  design: Design
  viewMode: 'schematic' | 'board'
  isTutorial?: boolean
}

/**
 * Canvas area - switches between schematic and board views.
 * SOLID: Single Responsibility - just renders appropriate canvas.
 */
export default function CanvasArea({ design, viewMode, isTutorial }: CanvasAreaProps) {
  return (
    <div className="canvas-area">
      {viewMode === 'schematic' ? (
        <SchematicCanvas design={design} isTutorial={isTutorial} />
      ) : (
        <BoardCanvas design={design} isTutorial={isTutorial} />
      )}
    </div>
  )
}

