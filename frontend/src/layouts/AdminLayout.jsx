import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import FlashMessages from '../components/FlashMessages'
import { AdminProvider, useAdmin } from '../context/AdminContext'
import { useAuth } from '../context/AuthContext'

function SidebarContent() {
  const { logout } = useAuth()
  const { unreadMessages } = useAdmin()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => (isActive ? 'is-active' : undefined)

  return (
    <aside className="ap-sidebar">
      <div className="brand">
        <NavLink to="/gestion" end className="brand-logo-link">
          <img src="/img/noora-logo.png" alt="Noora Store" className="brand-logo ap-brand-logo" />
        </NavLink>
        <small>Espace gestion</small>
      </div>
      <nav className="ap-nav">
        <NavLink to="/gestion" end className={linkClass}>
          <svg className="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
          Tableau de bord
        </NavLink>
        <NavLink to="/gestion/produits" className={linkClass}>
          <svg className="icon" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
          Produits
        </NavLink>
        <NavLink to="/gestion/categories" className={linkClass}>
          <svg className="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Catégories
        </NavLink>
        <NavLink to="/gestion/commandes" className={linkClass}>
          <svg className="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          Commandes
        </NavLink>
        <NavLink to="/gestion/messages" className={linkClass}>
          <svg className="icon" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" /></svg>
          Messages
          {unreadMessages > 0 && <span className="ap-count">{unreadMessages}</span>}
        </NavLink>
      </nav>
      <div className="ap-sidebar-foot">
        <NavLink to="/">← Retour au site</NavLink>
        <form onSubmit={(e) => { e.preventDefault(); handleLogout() }}>
          <button type="submit">Déconnexion</button>
        </form>
      </div>
    </aside>
  )
}

export default function AdminLayout() {
  return (
    <AdminProvider>
      <div className="ap-shell">
        <SidebarContent />
        <main className="ap-main">
          <FlashMessages wrapped={false} />
          <Outlet />
        </main>
      </div>
    </AdminProvider>
  )
}
