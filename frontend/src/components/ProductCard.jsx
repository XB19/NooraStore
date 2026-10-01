import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useFlash } from '../context/FlashContext'

export default function ProductCard({ product, onFavoriteToggled }) {
  const { user } = useAuth()
  const { refresh: refreshCart } = useCart()
  const { addFlash } = useFlash()
  const location = useLocation()
  const navigate = useNavigate()

  const href = `/produit/${product.slug}`

  async function handleFavorite(e) {
    e.preventDefault()
    if (!user) {
      navigate(`/compte/connexion?next=${encodeURIComponent(location.pathname)}`)
      return
    }
    const data = await api.post(`/api/products/${product.slug}/favorite/`)
    onFavoriteToggled?.(product.id, data.is_favorite)
  }

  async function handleAddToCart(e) {
    e.preventDefault()
    if (!user) {
      navigate(`/compte/connexion?next=${encodeURIComponent(location.pathname)}`)
      return
    }
    await api.post('/api/cart/items/', { slug: product.slug })
    await refreshCart()
    addFlash(`« ${product.name} » ajouté au panier.`, 'success')
  }

  return (
    <div className="pcard">
      <div className="pthumb">
        <Link to={href}>
          {product.main_image && <img src={product.main_image} alt={product.name} />}
        </Link>
        {product.badge && <span className="pbadge">{product.badge}</span>}
        {user && (
          <form className="pfav-form" onSubmit={handleFavorite}>
            <button type="submit" className={`pfav${product.is_favorite ? ' is-active' : ''}`} title="Ajouter aux favoris">
              <svg className="icon" viewBox="0 0 24 24" style={product.is_favorite ? { fill: 'currentColor', stroke: 'none' } : undefined}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
            </button>
          </form>
        )}
      </div>
      <div className="pinfo">
        <div className="pcat">{product.category.name}</div>
        <h4><Link to={href}>{product.name}</Link></h4>
        {product.price_per_meter && <div className="psqm">≈ {product.price_per_meter} F/m</div>}
        <div className="prow">
          <span className="pprice">
            {product.old_price && <span className="pold">{product.old_price} F</span>}
            {product.price} F
          </span>
          <form onSubmit={handleAddToCart}>
            <button type="submit" className="padd" title="Ajouter au panier">
              <svg className="icon" style={{ width: 14, height: 14 }} viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
