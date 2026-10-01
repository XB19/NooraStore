import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { useFlash } from '../../../context/FlashContext'

const STATUS_CHOICES = [
  { value: 'en_attente', label: 'En attente de paiement' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'expediee', label: 'Expédiée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
]

function waLink(phone) {
  return `https://wa.me/${phone.replaceAll('+', '').replaceAll(' ', '')}`
}

export default function OrderDetail() {
  const { id } = useParams()
  const { addFlash } = useFlash()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.get(`/api/admin/orders/${id}/`).then((o) => {
      setOrder(o)
      setStatus(o.status)
    })
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    const updated = await api.patch(`/api/admin/orders/${id}/`, { status })
    setOrder(updated)
    addFlash(`Statut de la commande #${order.id} mis à jour.`, 'success')
  }

  if (!order) return null

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">Commandes</span><h1>Commande #{order.id}</h1></div>
        <Link to="/gestion/commandes" className="btn btn-outline">← Retour à la liste</Link>
      </div>

      <div className="ap-detail-grid">
        <div className="ap-panel">
          <h2>Articles commandés</h2>
          <div className="ap-table-wrap" style={{ marginBottom: 0 }}>
            <table className="ap-table">
              <thead><tr><th>Produit</th><th>Prix unitaire</th><th>Qté</th><th>Sous-total</th></tr></thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.product_name}</td>
                    <td>{item.unit_price} F</td>
                    <td>{item.quantity}</td>
                    <td>{item.subtotal} F</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, fontSize: 16, fontWeight: 700 }}>
            Total : {order.total} F
          </div>
        </div>

        <div>
          <div className="ap-panel">
            <h2>Client</h2>
            <div className="ap-kv"><span>Nom</span><span>{order.full_name}</span></div>
            <div className="ap-kv"><span>Téléphone</span><span>{order.phone}</span></div>
            <div className="ap-kv"><span>Adresse</span><span>{order.address}</span></div>
            <div className="ap-kv"><span>Compte</span><span>{order.username}</span></div>
            <div className="ap-kv"><span>Paiement</span><span>{order.payment_method_display}</span></div>
            <div className="ap-kv"><span>Passée le</span><span>{new Date(order.created_at).toLocaleString('fr-FR')}</span></div>
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <a href={`tel:${order.phone}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5, padding: 9 }}>Appeler</a>
              <a href={waLink(order.phone)} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', fontSize: 12.5, padding: 9 }}>WhatsApp</a>
            </div>
          </div>

          <div className="ap-panel">
            <h2>Statut</h2>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="status">Statut de la commande</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUS_CHOICES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Mettre à jour</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
