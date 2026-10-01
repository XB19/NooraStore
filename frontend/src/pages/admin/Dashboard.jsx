import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/admin/dashboard/').then(setData)
  }, [])

  if (!data) return null

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">Aperçu</span><h1>Tableau de bord</h1></div>
      </div>

      <div className="ap-stats">
        <div className="ap-stat"><div className="num">{data.total_orders}</div><div className="lab">Commandes au total</div></div>
        <div className="ap-stat"><div className="num">{data.pending_orders}</div><div className="lab">En attente de paiement</div></div>
        <div className="ap-stat"><div className="num">{data.revenue} F</div><div className="lab">Chiffre d'affaires (hors annulées)</div></div>
        <div className="ap-stat"><div className="num">{data.active_products}</div><div className="lab">Produits actifs</div></div>
      </div>

      <div className="ap-detail-grid">
        <div className="ap-panel">
          <h2>Dernières commandes</h2>
          {data.recent_orders.length > 0 ? (
            <div className="ap-table-wrap">
              <table className="ap-table">
                <thead><tr><th>Commande</th><th>Client</th><th>Statut</th><th>Total</th></tr></thead>
                <tbody>
                  {data.recent_orders.map((order) => (
                    <tr key={order.id}>
                      <td><Link to={`/gestion/commandes/${order.id}`}>#{order.id}</Link></td>
                      <td>{order.full_name}</td>
                      <td><span className={`order-status order-status-${order.status}`}>{order.status_display}</span></td>
                      <td>{order.total} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="ap-empty">Aucune commande pour le moment.</p>
          )}
        </div>

        <div className="ap-panel">
          <h2>Messages reçus {data.unread_messages > 0 && <span className="ap-pill ap-pill-off">{data.unread_messages} non lu{data.unread_messages > 1 ? 's' : ''}</span>}</h2>
          {data.recent_messages.length > 0 ? (
            data.recent_messages.map((m) => (
              <Link key={m.id} to={`/gestion/messages/${m.id}`} style={{ display: 'block', padding: '10px 0', borderBottom: '1px dashed var(--line)' }}>
                <b style={{ fontSize: 13 }}>{m.name}</b>
                {!m.is_read && <span className="ap-pill ap-pill-off" style={{ marginLeft: 4 }}>non lu</span>}
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                  {m.subject || 'Sans sujet'} · {new Date(m.created_at).toLocaleDateString('fr-FR')}
                </div>
              </Link>
            ))
          ) : (
            <p className="ap-empty">Aucun message pour le moment.</p>
          )}
        </div>
      </div>
    </>
  )
}
