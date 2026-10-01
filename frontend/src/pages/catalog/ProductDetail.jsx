import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/client'
import Breadcrumb from '../../components/Breadcrumb'
import ProductCard from '../../components/ProductCard'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useFlash } from '../../context/FlashContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const { user } = useAuth()
  const { refresh: refreshCart } = useCart()
  const { addFlash } = useFlash()
  const navigate = useNavigate()

  const [data, setData] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    setData(null)
    setActiveImage(0)
    api.get(`/api/products/${slug}/`).then((d) => {
      setData(d)
      setIsFavorite(d.product.is_favorite)
    })
  }, [slug])

  if (!data) return null

  const { product, related, crumb } = data
  const images = product.images
  const mainImage = images[activeImage]?.image || product.main_image

  async function handleAddToCart(e) {
    e.preventDefault()
    if (!user) {
      navigate(`/compte/connexion?next=${encodeURIComponent(`/produit/${slug}`)}`)
      return
    }
    await api.post('/api/cart/items/', { slug: product.slug })
    await refreshCart()
    addFlash(`« ${product.name} » ajouté au panier.`, 'success')
  }

  async function handleToggleFavorite(e) {
    e.preventDefault()
    const res = await api.post(`/api/products/${product.slug}/favorite/`)
    setIsFavorite(res.is_favorite)
  }

  return (
    <>
      <section className="cathead">
        <div className="wrap">
          <Breadcrumb crumb={crumb} />
        </div>
      </section>

      <section className="pdetail">
        <div className="wrap pd-grid">
          <div className="pd-gallery">
            <div className="pd-main">
              {mainImage && <img id="pd-main-img" src={mainImage} alt={product.name} />}
              {product.badge && <span className="pbadge">{product.badge}</span>}
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    className={`pd-thumb${i === activeImage ? ' is-active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img.image} alt={img.alt_text || product.name} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <div className="pcat">{product.category.name}</div>
            <h1>{product.name}</h1>
            <div className="pd-price">
              {product.old_price && <span className="pold">{product.old_price} F</span>}
              {product.price} F
            </div>
            {product.price_per_meter && (
              <div className="pd-sqm">Soit environ {product.price_per_meter} F/m · pièce de {product.length_m} m</div>
            )}
            {product.description && <p className="pd-desc">{product.description}</p>}

            <form onSubmit={handleAddToCart} className="pd-actions">
              <button type="submit" className="btn btn-dark">Ajouter au panier</button>
            </form>

            {user ? (
              <form onSubmit={handleToggleFavorite} className="pd-actions">
                <button type="submit" className="btn btn-outline">
                  {isFavorite ? '♥ Retirer des favoris' : '♡ Ajouter aux favoris'}
                </button>
              </form>
            ) : (
              <Link to={`/compte/connexion?next=${encodeURIComponent(`/produit/${slug}`)}`} className="btn btn-outline">
                Se connecter pour ajouter aux favoris
              </Link>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="products">
          <div className="wrap">
            <div className="shead">
              <div><span className="kicker">Vous aimerez aussi</span><h2>Produits similaires</h2></div>
            </div>
            <div className="pgrid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
