import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '@paper/shared'
import { api } from '../utils/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (sessionId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId')
    if (sessionId) {
      api.setAuth(sessionId)
      api.get('/auth/me')
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('sessionId'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = (sessionId: string) => {
    localStorage.setItem('sessionId', sessionId)
    api.setAuth(sessionId)
    api.get('/auth/me').then(({ user }) => setUser(user))
  }

  const logout = () => {
    api.post('/auth/logout').finally(() => {
      localStorage.removeItem('sessionId')
      api.setAuth(null)
      setUser(null)
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}