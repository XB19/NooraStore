import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { cart, refresh } = useCart()
  const [quantities, setQuantities] = useState({})

  if (!cart) return null

  function quantityFor(item) {
    return quantities[item.id] ?? item.quantity
  }

  async function handleUpdate(item, e) {
    e.preventDefault()
    await api.patch(`/api/cart/items/${item.id}/`, { quantity: Number(quantityFor(item)) })
    await refresh()
  }

  async function handleRemove(item, e) {
    e.preventDefault()
    await api.del(`/api/cart/items/${item.id}/`)
    await refresh()
  }

  return (
    <>
      <section className="cathead">
        <div className="wrap">
          <div className="crumb"><Link to="/">Accueil</Link><span className="sep">/</span><span>Mon panier</span></div>
          <h1>Mon panier</h1>
          <span className="count">{cart.item_count} article{cart.item_count > 1 ? 's' : ''}</span>
        </div>
      </section>

      <section className="cartpage">
        <div className="wrap">
          {cart.items.length > 0 ? (
            <>
              <div className="cart-list">
                {cart.items.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <Link to={`/produit/${item.slug}`} className="cart-thumb">
                      {item.image && <img src={item.image} alt={item.name} />}
                    </Link>
                    <div className="cart-row-info">
                      <Link to={`/produit/${item.slug}`} className="cart-row-name">{item.name}</Link>
                      <span className="cart-row-cat">{item.category}</span>
                    </div>
                    <form className="cart-qty" onSubmit={(e) => handleUpdate(item, e)}>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={quantityFor(item)}
                        onChange={(e) => setQuantities((q) => ({ ...q, [item.id]: e.target.value }))}
                      />
                      <button type="submit" className="btn btn-outline">Mettre à jour</button>
                    </form>
                    <span className="cart-row-price">{item.subtotal} F</span>
                    <form onSubmit={(e) => handleRemove(item, e)}>
                      <button type="submit" className="cart-remove" title="Retirer">
                        <svg className="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    </form>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <span>Total</span>
                <span className="cart-total">{cart.total} F</span>
              </div>
              <div className="cart-actions">
                <Link to="/catalogue" className="btn btn-outline">Continuer mes achats</Link>
                <Link to="/commander" className="btn btn-dark">Passer la commande</Link>
              </div>
            </>
          ) : (
            <>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>Votre panier est vide pour le moment.</p>
              <Link to="/catalogue" className="btn btn-dark">Voir le catalogue</Link>
            </>
          )}
        </div>
      </section>
    </>
  )
}
