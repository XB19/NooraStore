import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await api.get('/api/auth/me/')
    setUser(data)
    return data
  }, [])

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [refresh])

  const login = useCallback(async (username, password) => {
    const data = await api.post('/api/auth/login/', { username, password })
    setUser(data)
    return data
  }, [])

  const register = useCallback(async (payload) => {
    const data = await api.post('/api/auth/register/', payload)
    setUser(data)
    return data
  }, [])

  const logout = useCallback(async () => {
    await api.post('/api/auth/logout/')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
