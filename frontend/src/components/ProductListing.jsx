import { useEffect, useState } from 'react'
import Breadcrumb from './Breadcrumb'
import ProductCard from './ProductCard'

export default function ProductListing({ title, crumb, products }) {
  const [items, setItems] = useState(products)

  useEffect(() => {
    setItems(products)
  }, [products])

  function handleFavoriteToggled(productId, isFavorite) {
    setItems((prev) => prev.map((p) => (p.id === productId ? { ...p, is_favorite: isFavorite } : p)))
  }

  return (
    <>
      <section className="cathead">
        <div className="wrap">
          <Breadcrumb crumb={crumb} />
          <h1>{title}</h1>
          <span className="count">{items.length} article{items.length > 1 ? 's' : ''}</span>
        </div>
      </section>

      <section className="products">
        <div className="wrap">
          {items.length > 0 ? (
            <div className="pgrid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} onFavoriteToggled={handleFavoriteToggled} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-soft)' }}>Aucun article ici pour le moment.</p>
          )}
        </div>
      </section>
    </>
  )
}
