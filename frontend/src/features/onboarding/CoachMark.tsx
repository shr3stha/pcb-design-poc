import { useEffect, useRef } from 'react'
import './CoachMark.css'

interface CoachMarkProps {
  active: boolean
  targetId: string
  message: string
}

/**
 * Coach mark overlay to highlight UI areas and provide guidance.
 * Positions itself near the target element when active.
 */
export default function CoachMark({ active, targetId, message }: CoachMarkProps) {
  const coachMarkRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !coachMarkRef.current) return

    const targetElement = document.getElementById(targetId)
    if (!targetElement) return

    const rect = targetElement.getBoundingClientRect()
    const coachMark = coachMarkRef.current

    // Position coach mark near the target (bottom-right by default)
    coachMark.style.position = 'fixed'
    coachMark.style.top = `${rect.bottom + 10}px`
    coachMark.style.left = `${rect.left}px`
    coachMark.style.zIndex = '1000'
  }, [active, targetId])

  if (!active) return null

  return (
    <div ref={coachMarkRef} className="coachmark">
      <div className="coachmark-content">
        <p className="coachmark-message">{message}</p>
      </div>
      <div className="coachmark-arrow" />
    </div>
  )
}


