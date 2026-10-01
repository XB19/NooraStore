import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', phone: '', password1: '', password2: '' })
  const [errors, setErrors] = useState({})

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setErrors(err.data || {})
    }
  }

  return (
    <section className="authwrap">
      <div className="wrap">
        <div className="authcard">
          <span className="eyebrow">Compte Noora</span>
          <h1>Créer un compte</h1>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="id_username">Nom d'utilisateur</label>
              <input id="id_username" type="text" value={form.username} onChange={update('username')} required />
              {errors.username && <span className="field-error">{errors.username.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_email">Email</label>
              <input id="id_email" type="email" value={form.email} onChange={update('email')} required />
              {errors.email && <span className="field-error">{errors.email.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_phone">Téléphone</label>
              <input id="id_phone" type="text" value={form.phone} onChange={update('phone')} />
            </div>
            <div className="field">
              <label htmlFor="id_password1">Mot de passe</label>
              <input id="id_password1" type="password" value={form.password1} onChange={update('password1')} required />
              {errors.password1 && <span className="field-error">{errors.password1.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_password2">Confirmer le mot de passe</label>
              <input id="id_password2" type="password" value={form.password2} onChange={update('password2')} required />
              {errors.password2 && <span className="field-error">{errors.password2.join(' ')}</span>}
            </div>
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Créer mon compte</button>
          </form>
          <p className="authswitch">Déjà client ? <Link to="/compte/connexion">Se connecter</Link></p>
        </div>
      </div>
    </section>
  )
}
