import AppRoutes from './routes'
import ToastContainer from '../shared/ui/ToastContainer'

/**
 * Main application component.
 * Delegates routing to AppRoutes for clarity.
 */
function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  )
}

export default App


