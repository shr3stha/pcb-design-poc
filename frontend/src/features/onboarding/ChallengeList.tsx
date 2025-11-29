import ChallengeCard from './ChallengeCard'
import './ChallengeList.css'

/**
 * List of challenge cards for "Fix this broken design" exercises.
 * These intentionally flawed circuits help users learn by fixing common mistakes.
 */
export default function ChallengeList() {
  const challenges = [
    {
      id: 'challenge-1',
      title: 'Fix the Unconnected LED',
      description: 'This LED circuit has a broken connection. Find and fix it!',
      difficulty: 'Beginner' as const,
      brokenDesignId: 'broken-led-1',
      objective: 'Connect the LED properly so it lights up when power is applied.',
      hints: [
        'Check if all nets have at least 2 connections',
        'Look for the LED anode and cathode connections',
        'Make sure the resistor is in series with the LED'
      ]
    },
    {
      id: 'challenge-2',
      title: 'Resolve the Short Circuit',
      description: 'Two nets are accidentally touching, causing a short. Can you find it?',
      difficulty: 'Beginner' as const,
      brokenDesignId: 'broken-short-1',
      objective: 'Identify and fix the short circuit between two nets.',
      hints: [
        'Run DRC to see which nets are shorted',
        'Check for pins connected to multiple nets',
        'Look for overlapping traces in the board view'
      ]
    },
    {
      id: 'challenge-3',
      title: 'Add Missing Power Connections',
      description: 'This microcontroller circuit is missing power and ground connections.',
      difficulty: 'Intermediate' as const,
      brokenDesignId: 'broken-mcu-power',
      objective: 'Connect VCC and GND to the microcontroller and all other components.',
      hints: [
        'MCUs need both power (VCC) and ground (GND)',
        'Check the datasheet pinout for power pins',
        'Make sure all components share a common ground'
      ]
    }
  ]

  return (
    <div className="challenge-list">
      <div className="challenge-list-header">
        <h2>Challenge Cards</h2>
        <p className="challenge-list-subtitle">
          Practice by fixing intentionally broken designs. Each challenge teaches you to identify and resolve common PCB design errors.
        </p>
      </div>
      
      <div className="challenge-grid">
        {challenges.map(challenge => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  )
}

