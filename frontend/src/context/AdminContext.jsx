import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const { user } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0)

  const refresh = useCallback(async () => {
    if (!user?.is_staff) return
    const messages = await api.get('/api/admin/messages/')
    setUnreadMessages(messages.filter((m) => !m.is_read).length)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AdminContext.Provider value={{ unreadMessages, refresh }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider')
  return ctx
}
