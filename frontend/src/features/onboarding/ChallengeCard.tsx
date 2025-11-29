import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChallengeCard.css'

interface ChallengeCardProps {
  challenge: {
    id: string
    title: string
    description: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    brokenDesignId: string
    objective: string
    hints: string[]
  }
}

/**
 * Challenge card for "Fix this broken design" exercises.
 * Loads intentionally flawed circuits for users to diagnose and repair.
 */
export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const navigate = useNavigate()
  const [showHints, setShowHints] = useState(false)

  const handleStartChallenge = () => {
    navigate(`/editor/${challenge.brokenDesignId}?challenge=true&tutorial=true&step=1`)
  }

  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <h3>{challenge.title}</h3>
        <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
      </div>
      
      <p className="challenge-description">{challenge.description}</p>
      
      <div className="challenge-objective">
        <strong>Your goal:</strong> {challenge.objective}
      </div>

      <div className="challenge-hints">
        <button 
          className="hints-toggle"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? 'Hide' : 'Show'} Hints ({challenge.hints.length})
        </button>
        
        {showHints && (
          <ul className="hints-list">
            {challenge.hints.map((hint, idx) => (
              <li key={idx}>{hint}</li>
            ))}
          </ul>
        )}
      </div>

      <button 
        className="btn-primary challenge-start"
        onClick={handleStartChallenge}
      >
        Start Challenge
      </button>
    </div>
  )
}

