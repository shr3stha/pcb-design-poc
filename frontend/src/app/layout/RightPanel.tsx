import { useState } from 'react'
import { Design } from '../../../shared/schema/schema'
import AssistantPanel from '../../features/assistant/AssistantPanel'
import ErrorList from '../../features/assistant/ErrorList'
import TipsPanel from '../../features/assistant/TipsPanel'
import PropertiesPanel from '../../features/editor/PropertiesPanel'
import './RightPanel.css'

interface RightPanelProps {
  design: Design
  viewMode: 'schematic' | 'board'
  isTutorial?: boolean
}

/**
 * Right panel - Properties, Assistant, Errors, Tips.
 * DRY: Reusable tabbed panel structure.
 */
export default function RightPanel({ design, viewMode, isTutorial }: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<'properties' | 'assistant' | 'errors' | 'tips'>('properties')

  const tabs = [
    { id: 'properties', label: 'Properties', icon: '⚙️' },
    { id: 'assistant', label: 'Assistant', icon: '🤖' },
    { id: 'errors', label: 'Errors', icon: '⚠️' },
    { id: 'tips', label: 'Tips', icon: '💡' },
  ]

  return (
    <div className="right-panel">
      <div className="panel-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
            title={tab.label}
          >
            <span>{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="panel-content">
        {activeTab === 'properties' && <PropertiesPanel design={design} viewMode={viewMode} />}
        {activeTab === 'assistant' && <AssistantPanel design={design} isTutorial={isTutorial} />}
        {activeTab === 'errors' && <ErrorList design={design} />}
        {activeTab === 'tips' && <TipsPanel design={design} />}
      </div>
    </div>
  )
}

