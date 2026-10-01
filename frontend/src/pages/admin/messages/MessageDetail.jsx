import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { useAdmin } from '../../../context/AdminContext'
import { useFlash } from '../../../context/FlashContext'

function waLink(phone) {
  return `https://wa.me/${phone.replaceAll('+', '').replaceAll(' ', '')}`
}

export default function MessageDetail() {
  const { id } = useParams()
  const { refresh: refreshAdmin } = useAdmin()
  const { addFlash } = useFlash()
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get(`/api/admin/messages/${id}/`).then((m) => {
      setMessage(m)
      refreshAdmin()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleToggleRead(e) {
    e.preventDefault()
    const updated = await api.patch(`/api/admin/messages/${id}/`, { is_read: !message.is_read })
    setMessage(updated)
    addFlash('Message mis à jour.', 'success')
    refreshAdmin()
  }

  if (!message) return null

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">Messages</span><h1>{message.subject || 'Sans sujet'}</h1></div>
        <Link to="/gestion/messages" className="btn btn-outline">← Retour à la liste</Link>
      </div>

      <div className="ap-detail-grid">
        <div className="ap-panel">
          <h2>Message</h2>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>{message.message}</p>
        </div>

        <div>
          <div className="ap-panel">
            <h2>Expéditeur</h2>
            <div className="ap-kv"><span>Nom</span><span>{message.name}</span></div>
            <div className="ap-kv"><span>Email</span><span>{message.email || '—'}</span></div>
            <div className="ap-kv"><span>Téléphone</span><span>{message.phone || '—'}</span></div>
            <div className="ap-kv"><span>Reçu le</span><span>{new Date(message.created_at).toLocaleString('fr-FR')}</span></div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {message.email && <a href={`mailto:${message.email}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5, padding: 9 }}>Répondre par email</a>}
              {message.phone && <a href={waLink(message.phone)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5, padding: 9 }}>WhatsApp</a>}
            </div>
          </div>

          <div className="ap-panel">
            <form onSubmit={handleToggleRead} style={{ marginBottom: 10 }}>
              <button type="submit" className="btn btn-outline" style={{ width: '100%' }}>
                {message.is_read ? 'Marquer comme non lu' : 'Marquer comme lu'}
              </button>
            </form>
            <Link to={`/gestion/messages/${message.id}/supprimer`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', color: 'var(--rust)', borderColor: 'var(--rust)' }}>
              Supprimer le message
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
