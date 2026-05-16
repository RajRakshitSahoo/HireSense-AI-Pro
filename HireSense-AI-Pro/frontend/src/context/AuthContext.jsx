/**
 * HireSense-AI — Auth Context
 * Manages user authentication state globally.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('hs_token'))
  const [loading, setLoading] = useState(true)

  // Validate token on mount
  useEffect(() => {
    if (token) {
      api.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('hs_token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (tokenStr, userData) => {
    localStorage.setItem('hs_token', tokenStr)
    setToken(tokenStr)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('hs_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
