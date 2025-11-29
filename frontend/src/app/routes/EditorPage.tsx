import { useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import TopBar from '../layout/TopBar'
import LeftToolbox from '../layout/LeftToolbox'
import RightPanel from '../layout/RightPanel'
import CanvasArea from '../layout/CanvasArea'
import BottomStatusBar from '../layout/BottomStatusBar'
import { useDesignStore } from '../../shared/state/designStore'
import { Wizard, CoachMark } from '../../features/onboarding'
import './EditorPage.css'

/**
 * Main editor page - schematic and board views.
 * KISS: Composes layout components, delegates logic to features.
 * Supports tutorial mode via query params: ?tutorial=true&step=1..5
 */
export default function EditorPage() {
  const { designId } = useParams<{ designId: string }>()
  const [searchParams] = useSearchParams()
  const isTutorial = searchParams.get('tutorial') === 'true'
  const step = parseInt(searchParams.get('step') || '0', 10)
  const templateId = searchParams.get('template')
  
  const { currentDesign, loadDesign, createNewDesign } = useDesignStore()
  const [viewMode, setViewMode] = useState<'schematic' | 'board'>('schematic')

  useEffect(() => {
    if (designId === 'new') {
      createNewDesign(templateId || undefined)
    } else if (designId) {
      loadDesign(designId)
    }
  }, [designId, templateId, loadDesign, createNewDesign])

  if (!currentDesign) {
    return <div>Loading...</div>
  }

  // Determine coach mark message and target based on step
  const getCoachMarkConfig = () => {
    if (step === 1) {
      return {
        message: 'Choose a template to get started.',
        targetId: 'canvas-area',
      }
    } else if (step === 2) {
      return {
        message: 'Drag components from the left toolbox onto the canvas.',
        targetId: 'left-toolbox',
      }
    } else if (step === 3) {
      return {
        message: 'Connect components by drawing wires between pins.',
        targetId: 'canvas-area',
      }
    } else if (step === 4) {
      return {
        message: 'Switch to Board view to place footprints and route traces.',
        targetId: 'top-bar',
      }
    } else if (step === 5) {
      return {
        message: 'Run validation and export your design!',
        targetId: 'right-panel',
      }
    }
    return null
  }

  const coachMarkConfig = getCoachMarkConfig()

  return (
    <div className="editor-page">
      {isTutorial && step > 0 && (
        <Wizard step={step} designId={designId || 'new'} />
      )}
      
      <TopBar 
        designName={currentDesign.name}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <div className="editor-content">
        <LeftToolbox viewMode={viewMode} />
        
        <div id="canvas-area" className="canvas-wrapper">
          <CanvasArea 
            design={currentDesign}
            viewMode={viewMode}
            isTutorial={isTutorial}
          />
        </div>
        
        <div id="right-panel">
          <RightPanel 
            design={currentDesign}
            viewMode={viewMode}
            isTutorial={isTutorial}
          />
        </div>
      </div>
      
      {isTutorial && step > 0 && coachMarkConfig && (
        <CoachMark
          active={true}
          targetId={coachMarkConfig.targetId}
          message={coachMarkConfig.message}
        />
      )}
      
      <BottomStatusBar />
    </div>
  )
}

