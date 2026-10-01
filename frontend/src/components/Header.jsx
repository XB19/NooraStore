import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFavorites } from '../context/FavoritesContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { itemCount } = useCart()
  const { count: favoritesCount } = useFavorites()
  const location = useLocation()
  const navigate = useNavigate()

  const initialQ = location.pathname === '/catalogue' ? new URLSearchParams(location.search).get('q') || '' : ''
  const [q, setQ] = useState(initialQ)

  function handleSearch(e) {
    e.preventDefault()
    navigate(`/catalogue${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header>
      <div className="inner wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="brand">
          <Link to="/" className="brand-logo-link">
            <img src="/img/noora-logo.png" alt="Noora Store" className="brand-logo" />
          </Link>
        </div>
        <form className="searchbar" onSubmit={handleSearch}>
          <svg className="icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un tissu, une tenue, un accessoire…"
          />
        </form>
        <div className="head-actions">
          <Link to="/favoris">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
            Favoris{favoritesCount > 0 && <span className="head-count">{favoritesCount}</span>}
          </Link>
          <Link to="/panier">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Panier{itemCount > 0 && <span className="head-count">{itemCount}</span>}
          </Link>
          {user ? (
            <>
              {user.is_staff && <Link to="/gestion">Gestion</Link>}
              <Link to="/mes-commandes">Bonjour, {user.first_name || user.username}</Link>
              <form onSubmit={(e) => { e.preventDefault(); handleLogout() }} className="logout-form">
                <button type="submit">Déconnexion</button>
              </form>
            </>
          ) : (
            <Link to="/compte/connexion">Connexion</Link>
          )}
          <Link to="/catalogue" className="btn btn-dark">Commander</Link>
        </div>
      </div>
    </header>
  )
}
