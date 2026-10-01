import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(null)
      return null
    }
    try {
      const data = await api.get('/api/cart/')
      setCart(data)
      return data
    } catch {
      setCart(null)
      return null
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const itemCount = cart?.item_count ?? 0

  return (
    <CartContext.Provider value={{ cart, itemCount, refresh }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
