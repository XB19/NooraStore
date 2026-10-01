import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../api/client'

export default function Confirmation() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    api.get(`/api/orders/${orderId}/`).then(setOrder)
  }, [orderId])

  if (!order) return null

  return (
    <section className="confirmpage">
      <div className="wrap">
        <div className="authcard" style={{ maxWidth: 520, textAlign: 'center' }}>
          <span className="eyebrow">Commande #{order.id}</span>
          <h1>Merci, {order.full_name} !</h1>
          <p style={{ color: 'var(--ink-soft)', margin: '14px 0 22px' }}>
            Votre commande de <b>{order.total} F</b> est enregistrée, statut « {order.status_display} ».
            Nous vous contactons au {order.phone} par téléphone ou WhatsApp pour confirmer le paiement {order.payment_method_display} et organiser la livraison.
          </p>
          <div className="checkout-summary" style={{ textAlign: 'left', marginBottom: 22 }}>
            {order.items.map((item) => (
              <div className="checkout-line" key={item.id}>
                <span>{item.quantity} × {item.product_name}</span>
                <span>{item.subtotal} F</span>
              </div>
            ))}
            <div className="checkout-line checkout-total">
              <span>Total</span>
              <span>{order.total} F</span>
            </div>
          </div>
          <Link to="/" className="btn btn-dark">Retour à l'accueil</Link>
          <Link to="/mes-commandes" className="btn btn-outline" style={{ marginTop: 10 }}>Voir mes commandes</Link>
        </div>
      </div>
    </section>
  )
}
