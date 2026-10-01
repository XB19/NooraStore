import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children, staffOnly = false }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/compte/connexion?next=${next}`} replace />
  }

  if (staffOnly && !user.is_staff) {
    return <Navigate to="/" replace />
  }

  return children
}
