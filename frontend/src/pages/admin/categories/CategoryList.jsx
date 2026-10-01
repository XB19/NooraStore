import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../api/client'

export default function CategoryList() {
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    api.get('/api/admin/categories/').then(setCategories)
  }, [])

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">Catalogue</span><h1>Catégories</h1></div>
        <Link to="/gestion/categories/nouvelle" className="btn btn-dark">+ Nouvelle catégorie</Link>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead><tr><th>Catégorie</th><th>Parente</th><th>Slug</th><th>Articles</th><th></th></tr></thead>
          <tbody>
            {categories && categories.length === 0 && (
              <tr><td colSpan={5} className="ap-empty">Aucune catégorie pour le moment.</td></tr>
            )}
            {categories && categories.map((c) => (
              <tr key={c.id}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {c.image ? <img className="ap-thumb" src={c.image} alt="" /> : <span className="ap-empty-thumb"></span>}
                  <b>{c.name}</b>
                </td>
                <td>{c.parent_name || '—'}</td>
                <td><span className="ap-pill">{c.slug}</span></td>
                <td>{c.product_count}</td>
                <td>
                  <div className="ap-actions">
                    <Link to={`/gestion/categories/${c.id}/modifier`}>Modifier</Link>
                    <Link to={`/gestion/categories/${c.id}/supprimer`} className="danger">Supprimer</Link>
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
