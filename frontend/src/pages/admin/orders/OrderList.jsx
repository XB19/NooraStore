import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../../api/client'

function waLink(phone) {
  return `https://wa.me/${phone.replaceAll('+', '').replaceAll(' ', '')}`
}

export default function OrderList() {
  const [searchParams] = useSearchParams()
  const currentStatus = searchParams.get('statut') || ''
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)
    const params = currentStatus ? `?statut=${currentStatus}` : ''
    api.get(`/api/admin/orders/${params}`).then(setData)
  }, [currentStatus])

  async function handleStatusChange(orderId, newStatus) {
    await api.patch(`/api/admin/orders/${orderId}/`, { status: newStatus })
    setData((d) => ({
      ...d,
      orders: d.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus, status_display: d.status_choices.find((s) => s.value === newStatus)?.label } : o)),
    }))
  }

  return (
    <>
      <div className="ap-topbar">
        <div>
          <span className="ap-kicker">Ventes</span>
          <h1>Commandes</h1>
          {data && <div className="sub">{data.orders.length} commande{data.orders.length > 1 ? 's' : ''}</div>}
        </div>
      </div>

      {data && (
        <div className="ap-toolbar">
          <div className="ap-filters">
            <Link to="/gestion/commandes" className={!currentStatus ? 'is-active' : undefined}>Toutes</Link>
            {data.status_choices.map((s) => (
              <Link key={s.value} to={`/gestion/commandes?statut=${s.value}`} className={currentStatus === s.value ? 'is-active' : undefined}>{s.label}</Link>
            ))}
          </div>
        </div>
      )}

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Commande</th><th>Client</th><th>Téléphone</th><th>Paiement</th><th>Statut</th><th>Total</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {data && data.orders.length === 0 && (
              <tr><td colSpan={8} className="ap-empty">Aucune commande pour le moment.</td></tr>
            )}
            {data && data.orders.map((order) => (
              <tr key={order.id}>
                <td><Link to={`/gestion/commandes/${order.id}`} style={{ fontWeight: 600 }}>#{order.id}</Link></td>
                <td>{order.full_name}</td>
                <td>{order.phone}</td>
                <td>{order.payment_method_display}</td>
                <td>
                  <select
                    className={`order-status order-status-${order.status}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {data.status_choices.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td>{order.total} F</td>
                <td>{new Date(order.created_at).toLocaleString('fr-FR')}</td>
                <td>
                  <div className="ap-actions">
                    <Link to={`/gestion/commandes/${order.id}`}>Voir</Link>
                    <a href={waLink(order.phone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
