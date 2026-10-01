import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api/client'

export default function MessageList() {
  const [messages, setMessages] = useState(null)

  useEffect(() => {
    api.get('/api/admin/messages/').then(setMessages)
  }, [])

  return (
    <>
      <div className="ap-topbar">
        <div>
          <span className="ap-kicker">Contact</span>
          <h1>Messages reçus</h1>
          {messages && <div className="sub">{messages.length} message{messages.length > 1 ? 's' : ''}</div>}
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th></th><th>Nom</th><th>Sujet</th><th>Email</th><th>Téléphone</th><th>Reçu le</th><th></th></tr></thead>
          <tbody>
            {messages && messages.length === 0 && (
              <tr><td colSpan={7} className="ap-empty">Aucun message pour le moment.</td></tr>
            )}
            {messages && messages.map((m) => (
              <tr key={m.id} style={!m.is_read ? { fontWeight: 600 } : undefined}>
                <td>{!m.is_read && <span className="ap-pill ap-pill-off">non lu</span>}</td>
                <td><Link to={`/gestion/messages/${m.id}`}>{m.name}</Link></td>
                <td>{m.subject || '—'}</td>
                <td>{m.email || '—'}</td>
                <td>{m.phone || '—'}</td>
                <td>{new Date(m.created_at).toLocaleString('fr-FR')}</td>
                <td>
                  <div className="ap-actions">
                    <Link to={`/gestion/messages/${m.id}`}>Voir</Link>
                    <Link to={`/gestion/messages/${m.id}/supprimer`} className="danger">Supprimer</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
