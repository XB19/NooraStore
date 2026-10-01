import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../../api/client'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentCategory = searchParams.get('categorie') || ''
  const query = searchParams.get('q') || ''

  const [products, setProducts] = useState(null)
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState(query)

  useEffect(() => {
    api.get('/api/admin/categories/').then(setCategories)
  }, [])

  useEffect(() => {
    setProducts(null)
    const params = new URLSearchParams()
    if (currentCategory) params.set('categorie', currentCategory)
    if (query) params.set('q', query)
    api.get(`/api/admin/products/?${params.toString()}`).then(setProducts)
  }, [currentCategory, query])

  function handleSearch(e) {
    e.preventDefault()
    const params = {}
    if (currentCategory) params.categorie = currentCategory
    if (q) params.q = q
    setSearchParams(params)
  }

  return (
    <>
      <div className="ap-topbar">
        <div>
          <span className="ap-kicker">Catalogue</span>
          <h1>Produits</h1>
          {products && <div className="sub">{products.length} article{products.length > 1 ? 's' : ''}</div>}
        </div>
        <Link to="/gestion/produits/nouveau" className="btn btn-dark">+ Nouveau produit</Link>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filters">
          <Link to="/gestion/produits" className={!currentCategory ? 'is-active' : undefined}>Toutes</Link>
          {categories.map((c) => (
            <Link key={c.id} to={`/gestion/produits?categorie=${c.slug}`} className={currentCategory === c.slug ? 'is-active' : undefined}>{c.name}</Link>
          ))}
        </div>
        <form onSubmit={handleSearch} className="searchbar" style={{ maxWidth: 280 }}>
          <svg className="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un produit…" />
        </form>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th>Mis en avant</th><th></th></tr>
          </thead>
          <tbody>
            {products && products.length === 0 && (
              <tr><td colSpan={6} className="ap-empty">Aucun produit ne correspond à cette recherche.</td></tr>
            )}
            {products && products.map((p) => (
              <tr key={p.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {p.main_image ? <img className="ap-thumb" src={p.main_image} alt="" /> : <span className="ap-empty-thumb"></span>}
                  <Link to={`/gestion/produits/${p.id}/modifier`} style={{ fontWeight: 600 }}>{p.name}</Link>
                </td>
                <td>{p.category_name}</td>
                <td>{p.price} F{p.price_per_meter && <span style={{ color: 'var(--ink-soft)', fontSize: 11.5 }}> ({p.price_per_meter} F/m)</span>}</td>
                <td>{p.is_active ? <span className="ap-pill ap-pill-on">Actif</span> : <span className="ap-pill ap-pill-off">Inactif</span>}</td>
                <td>{p.is_featured && <span className="ap-pill ap-pill-featured">Accueil</span>}</td>
                <td>
                  <div className="ap-actions">
                    <Link to={`/gestion/produits/${p.id}/modifier`}>Modifier</Link>
                    <Link to={`/gestion/produits/${p.id}/supprimer`} className="danger">Supprimer</Link>
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
