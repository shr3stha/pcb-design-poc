import axios from 'axios'

/**
 * API client - centralized HTTP client.
 * DRY: Single axios instance, consistent error handling.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (for auth, etc.)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 404) {
      console.error('Resource not found')
    } else if (error.response?.status >= 500) {
      console.error('Server error')
    }
    return Promise.reject(error)
  }
)

