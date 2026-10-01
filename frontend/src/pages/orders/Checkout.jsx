import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFlash } from '../../context/FlashContext'

const PAYMENT_METHODS = [
  { value: 'flooz', label: 'Flooz' },
  { value: 'tmoney', label: 'T-Money' },
  { value: 'carte', label: 'Carte virtuelle Noora' },
]

export default function Checkout() {
  const { user } = useAuth()
  const { cart, refresh } = useCart()
  const { addFlash } = useFlash()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    full_name: user?.first_name || user?.username || '',
    phone: user?.phone || '',
    address: user?.address || '',
    payment_method: 'flooz',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cart && cart.items.length === 0) {
      addFlash('Votre panier est vide.', 'info')
      navigate('/panier')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    try {
      const order = await api.post('/api/orders/checkout/', form)
      await refresh()
      navigate(`/commande/${order.id}/confirmation`)
    } catch (err) {
      setErrors(err.data || {})
    }
  }

  if (!cart) return null

  return (
    <>
      <section className="cathead">
        <div className="wrap">
          <div className="crumb">
            <Link to="/">Accueil</Link><span className="sep">/</span>
            <Link to="/panier">Mon panier</Link><span className="sep">/</span>
            <span>Commander</span>
          </div>
          <h1>Passer la commande</h1>
        </div>
      </section>

      <section className="checkoutpage">
        <div className="wrap checkout-grid">
          <form onSubmit={handleSubmit} className="authcard">
            <div className="field">
              <label htmlFor="id_full_name">Nom complet</label>
              <input id="id_full_name" type="text" placeholder="Nom complet" value={form.full_name} onChange={update('full_name')} required />
              {errors.full_name && <span className="field-error">{errors.full_name.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_phone">Téléphone</label>
              <input id="id_phone" type="text" placeholder="+228 90 00 00 00" value={form.phone} onChange={update('phone')} required />
              {errors.phone && <span className="field-error">{errors.phone.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_address">Adresse de livraison</label>
              <input id="id_address" type="text" placeholder="Quartier, rue, ville" value={form.address} onChange={update('address')} required />
              {errors.address && <span className="field-error">{errors.address.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="id_payment_method">Mode de paiement</label>
              <select id="id_payment_method" value={form.payment_method} onChange={update('payment_method')}>
                {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 18 }}>
              Aucun paiement n'est prélevé en ligne. Nous vous contactons par téléphone ou WhatsApp pour confirmer le règlement Flooz, T-Money ou carte virtuelle.
            </p>
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Valider ma commande</button>
          </form>

          <div className="checkout-summary">
            <h3>Récapitulatif</h3>
            {cart.items.map((item) => (
              <div className="checkout-line" key={item.id}>
                <span>{item.quantity} × {item.name}</span>
                <span>{item.subtotal} F</span>
              </div>
            ))}
            <div className="checkout-line checkout-total">
              <span>Total</span>
              <span>{cart.total} F</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
