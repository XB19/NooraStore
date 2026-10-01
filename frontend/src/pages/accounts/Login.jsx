import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  const next = new URLSearchParams(location.search).get('next') || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(false)
    try {
      await login(username, password)
      navigate(next)
    } catch {
      setError(true)
    }
  }

  return (
    <section className="authwrap">
      <div className="wrap">
        <div className="authcard">
          <span className="eyebrow">Compte Noora</span>
          <h1>Connexion</h1>
          {error && <p className="flash flash-error">Identifiants incorrects. Réessayez.</p>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="id_username">Nom d'utilisateur</label>
              <input id="id_username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="id_password">Mot de passe</label>
              <input id="id_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Se connecter</button>
          </form>
          <p className="authswitch">Pas encore de compte ? <Link to="/compte/inscription">Créer un compte</Link></p>
        </div>
      </div>
    </section>
  )
}
