import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './Wizard.css'

interface WizardProps {
  step: number
  totalSteps?: number
  designId?: string
}

/**
 * 5-step wizard header for onboarding with navigation.
 * Drives tutorial flow via URL query params.
 */
export default function Wizard({ step, totalSteps = 5, designId }: WizardProps) {
  const navigate = useNavigate()
  const params = useParams()
  const [searchParams] = useSearchParams()

  const labels: Record<number, string> = {
    1: 'Choose project',
    2: 'Place components',
    3: 'Wire connections',
    4: 'Board layout',
    5: 'Check & export',
  }

  const goToStep = (nextStep: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('step', String(nextStep))
    newParams.set('tutorial', 'true')
    const id = designId || params.designId || 'new'
    navigate(`/editor/${id}?${newParams.toString()}`)
  }

  return (
    <div className="wizard-header">
      <div className="wizard-info">
        <div className="wizard-step">
          Step {step}/{totalSteps}
        </div>
        <div className="wizard-label">{labels[step] ?? 'Guided tutorial'}</div>
      </div>
      <div className="wizard-progress">
        <div
          className="wizard-progress-bar"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
      <div className="wizard-actions">
        <button
          className="wizard-btn"
          disabled={step <= 1}
          onClick={() => goToStep(step - 1)}
        >
          Back
        </button>
        <button
          className="wizard-btn wizard-btn-primary"
          disabled={step >= totalSteps}
          onClick={() => goToStep(step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}


