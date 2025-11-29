/**
 * Hook for managing tool locking during tutorial steps.
 * KISS: Simple step-based tool availability logic.
 */

import { useSearchParams } from 'react-router-dom'

export type ToolId = 'select' | 'place' | 'wire' | 'delete' | 'route' | 'measure'

interface TutorialLockConfig {
  allowedTools: ToolId[]
  lockedMessage?: string
}

const STEP_TOOL_CONFIG: Record<number, TutorialLockConfig> = {
  1: {
    allowedTools: ['select'],
    lockedMessage: 'First, choose a template to get started'
  },
  2: {
    allowedTools: ['select', 'place'],
    lockedMessage: 'Place components on the canvas. Use the component library on the left.'
  },
  3: {
    allowedTools: ['select', 'place', 'wire'],
    lockedMessage: 'Now connect your components! Use the Wire tool to draw connections.'
  },
  4: {
    allowedTools: ['select', 'place', 'route'],
    lockedMessage: 'Switch to Board view and route traces between component pads.'
  },
  5: {
    allowedTools: ['select', 'place', 'wire', 'route', 'delete'],
    lockedMessage: 'Final step: Run validation and export your design!'
  }
}

/**
 * Returns whether a tool is available in the current tutorial step.
 */
export function useTutorialLock() {
  const [searchParams] = useSearchParams()
  const isTutorial = searchParams.get('tutorial') === 'true'
  const step = parseInt(searchParams.get('step') || '0', 10)

  const isToolLocked = (toolId: ToolId): boolean => {
    if (!isTutorial || step === 0) {
      return false // No locking outside tutorial
    }

    const config = STEP_TOOL_CONFIG[step]
    if (!config) {
      return false // Unknown step, allow all
    }

    return !config.allowedTools.includes(toolId)
  }

  const getLockedMessage = (): string | null => {
    if (!isTutorial || step === 0) {
      return null
    }

    const config = STEP_TOOL_CONFIG[step]
    return config?.lockedMessage || null
  }

  return {
    isToolLocked,
    getLockedMessage,
    isTutorial,
    currentStep: step
  }
}

