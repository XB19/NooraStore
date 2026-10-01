import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState([])

  const refresh = useCallback(async () => {
    if (!user) {
      setFavoriteIds([])
      return []
    }
    try {
      const data = await api.get('/api/favorites/')
      const ids = (data ?? []).map((f) => f.product?.id ?? f.id)
      setFavoriteIds(ids)
      return ids
    } catch {
      setFavoriteIds([])
      return []
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <FavoritesContext.Provider value={{ favoriteIds, count: favoriteIds.length, refresh }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
