import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'

function formatDate(iso) {
  const d = new Date(iso)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} à ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function OrderList() {
  const [orders, setOrders] = useState(null)

  useEffect(() => {
    api.get('/api/orders/').then(setOrders)
  }, [])

  if (!orders) return null

  return (
    <>
      <section className="cathead">
        <div className="wrap">
          <div className="crumb"><Link to="/">Accueil</Link><span className="sep">/</span><span>Mes commandes</span></div>
          <h1>Mes commandes</h1>
        </div>
      </section>

      <section className="orderspage">
        <div className="wrap">
          {orders.length > 0 ? (
            <div className="order-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-card-head">
                    <div>
                      <b>Commande #{order.id}</b>
                      <span className="order-date">{formatDate(order.created_at)}</span>
                    </div>
                    <span className={`order-status order-status-${order.status}`}>{order.status_display}</span>
                  </div>
                  <div className="order-card-body">
                    {order.items.map((item) => (
                      <span className="order-item-line" key={item.id}>{item.quantity} × {item.product_name}</span>
                    ))}
                  </div>
                  <div className="order-card-foot">
                    <span>{order.payment_method_display}</span>
                    <span className="cart-total">{order.total} F</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>Vous n'avez pas encore passé de commande.</p>
              <Link to="/catalogue" className="btn btn-dark">Voir le catalogue</Link>
            </>
          )}
        </div>
      </section>
    </>
  )
}
