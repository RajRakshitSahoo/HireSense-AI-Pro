/**
 * HireSense-AI — Axios API Instance
 * Pre-configured with base URL and auth interceptor.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000, // 60s for AI analysis
})

// Attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hs_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
