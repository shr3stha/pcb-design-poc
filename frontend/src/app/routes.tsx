import { Routes, Route } from 'react-router-dom'
import HomePage from './routes/HomePage'
import EditorPage from './routes/EditorPage'
import { ChallengeList } from '../features/onboarding'

/**
 * Explicit routing wrapper.
 * KISS: simple mapping from paths to pages.
 */
export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/editor/:designId?" element={<EditorPage />} />
    <Route path="/challenges" element={<ChallengeList />} />
  </Routes>
)

export default AppRoutes


