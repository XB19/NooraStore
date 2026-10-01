import { createContext, useCallback, useContext, useState } from 'react'

const FlashContext = createContext(null)

let nextId = 1

export function FlashProvider({ children }) {
  const [flashes, setFlashes] = useState([])

  const addFlash = useCallback((message, tag = 'info') => {
    const id = nextId++
    setFlashes((prev) => [...prev, { id, message, tag }])
    setTimeout(() => {
      setFlashes((prev) => prev.filter((f) => f.id !== id))
    }, 6000)
  }, [])

  const dismissFlash = useCallback((id) => {
    setFlashes((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return (
    <FlashContext.Provider value={{ flashes, addFlash, dismissFlash }}>
      {children}
    </FlashContext.Provider>
  )
}

export function useFlash() {
  const ctx = useContext(FlashContext)
  if (!ctx) throw new Error('useFlash must be used within FlashProvider')
  return ctx
}
