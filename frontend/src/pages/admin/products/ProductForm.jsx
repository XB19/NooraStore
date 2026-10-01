import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { useFlash } from '../../../context/FlashContext'

const EMPTY = {
  name: '', slug: '', category: '', description: '', price: '', old_price: '',
  length_m: '', badge: '', is_active: true, is_featured: false,
}

export default function ProductForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { addFlash } = useFlash()

  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [errors, setErrors] = useState({})
  const [newImage, setNewImage] = useState({ file: null, alt_text: '', order: 0 })
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    api.get('/api/admin/categories/').then(setCategories)
  }, [])

  useEffect(() => {
    if (isNew) return
    api.get(`/api/admin/products/${id}/`).then((p) => {
      setForm({
        name: p.name, slug: p.slug, category: p.category, description: p.description,
        price: p.price, old_price: p.old_price ?? '', length_m: p.length_m ?? '',
        badge: p.badge, is_active: p.is_active, is_featured: p.is_featured,
      })
      setImages(p.images)
      setLoaded(true)
    })
  }, [id, isNew])

  function update(field) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [field]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    const payload = {
      ...form,
      category: form.category || null,
      old_price: form.old_price === '' ? null : form.old_price,
      length_m: form.length_m === '' ? null : form.length_m,
    }
    try {
      if (isNew) {
        const product = await api.post('/api/admin/products/', payload)
        addFlash('Produit créé avec succès.', 'success')
        navigate(`/gestion/produits/${product.id}/modifier`)
      } else {
        await api.patch(`/api/admin/products/${id}/`, payload)
        addFlash('Produit mis à jour.', 'success')
      }
    } catch (err) {
      setErrors(err.data || {})
      addFlash('Merci de corriger les erreurs ci-dessous.', 'error')
    }
  }

  async function handleAddImage(e) {
    e.preventDefault()
    if (!newImage.file) return
    const data = new FormData()
    data.append('image', newImage.file)
    data.append('alt_text', newImage.alt_text)
    data.append('order', newImage.order)
    const img = await api.post(`/api/admin/products/${id}/images/`, data, { isFormData: true })
    setImages((prev) => [...prev, img])
    setNewImage({ file: null, alt_text: '', order: 0 })
    e.target.reset()
  }

  async function handleDeleteImage(imageId) {
    await api.del(`/api/admin/products/${id}/images/${imageId}/`)
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  if (!loaded) return null

  return (
    <>
      <div className="ap-topbar">
        <div>
          <span className="ap-kicker">Produits</span>
          <h1>{isNew ? 'Nouveau produit' : form.name}</h1>
        </div>
        <Link to="/gestion/produits" className="btn btn-outline">← Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ap-panel">
          <h2>Informations générales</h2>
          <div className="ap-form-grid">
            <div className="field">
              <label htmlFor="f_name">Nom</label>
              <input id="f_name" type="text" placeholder="Ex : Wax hollandais 6 yards" value={form.name} onChange={update('name')} required />
              {errors.name && <span className="field-error">{errors.name.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="f_category">Catégorie</label>
              <select id="f_category" value={form.category} onChange={update('category')} required>
                <option value="">—</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} · ${c.name}` : c.name}</option>)}
              </select>
              {errors.category && <span className="field-error">{errors.category.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="f_slug">Slug (URL)</label>
              <input id="f_slug" type="text" placeholder="Laisser vide pour générer automatiquement" value={form.slug} onChange={update('slug')} />
            </div>
            <div className="field">
              <label htmlFor="f_badge">Badge</label>
              <input id="f_badge" type="text" placeholder="Ex : Promo, Nouveau" value={form.badge} onChange={update('badge')} />
            </div>
            <div className="field field-full">
              <label htmlFor="f_description">Description</label>
              <textarea id="f_description" rows={4} value={form.description} onChange={update('description')} />
            </div>
          </div>
        </div>

        <div className="ap-panel">
          <h2>Prix</h2>
          <div className="ap-form-grid">
            <div className="field">
              <label htmlFor="f_price">Prix (FCFA)</label>
              <input id="f_price" type="number" value={form.price} onChange={update('price')} required />
              {errors.price && <span className="field-error">{errors.price.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="f_old_price">Ancien prix — laisser vide si pas de promo (FCFA)</label>
              <input id="f_old_price" type="number" value={form.old_price} onChange={update('old_price')} />
            </div>
            <div className="field">
              <label htmlFor="f_length_m">Longueur (m) — tissus uniquement</label>
              <input id="f_length_m" type="number" step="0.01" value={form.length_m} onChange={update('length_m')} />
            </div>
          </div>
          <div className="ap-checkline">
            <input id="f_is_active" type="checkbox" checked={form.is_active} onChange={update('is_active')} />
            <label htmlFor="f_is_active">Produit actif (visible sur le site)</label>
          </div>
          <div className="ap-checkline">
            <input id="f_is_featured" type="checkbox" checked={form.is_featured} onChange={update('is_featured')} />
            <label htmlFor="f_is_featured">Mis en avant sur la page d'accueil</label>
          </div>
        </div>

        <div className="ap-form-actions">
          <button type="submit" className="btn btn-dark">{isNew ? 'Créer le produit' : 'Enregistrer les modifications'}</button>
          <Link to="/gestion/produits" className="btn btn-outline">Annuler</Link>
        </div>
      </form>

      <div className="ap-panel">
        <h2>Photos</h2>
        {isNew ? (
          <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Créez d'abord le produit pour pouvoir ajouter des photos.</p>
        ) : (
          <>
            {images.map((img) => (
              <div className="ap-imgrow" key={img.id}>
                <img src={img.image} alt="" />
                <div className="ap-imgfields">
                  <span>{img.alt_text || '—'}</span>
                  <span>ordre {img.order}</span>
                  <span></span>
                </div>
                <div className="ap-imgdelete">
                  <button type="button" className="danger" onClick={() => handleDeleteImage(img.id)} style={{ background: 'none', border: 'none', color: 'var(--rust)', cursor: 'pointer', fontSize: 11 }}>Supprimer</button>
                </div>
              </div>
            ))}
            <form onSubmit={handleAddImage} className="ap-imgrow">
              <span className="ap-empty-thumb" style={{ width: 52, height: 52 }}></span>
              <div className="ap-imgfields">
                <input type="file" accept="image/*" onChange={(e) => setNewImage((n) => ({ ...n, file: e.target.files[0] }))} required />
                <input type="text" placeholder="Texte alternatif" value={newImage.alt_text} onChange={(e) => setNewImage((n) => ({ ...n, alt_text: e.target.value }))} />
                <input type="number" placeholder="Ordre" value={newImage.order} onChange={(e) => setNewImage((n) => ({ ...n, order: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-outline" style={{ fontSize: 12 }}>Ajouter</button>
            </form>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Ajoutez une photo via le formulaire, ou supprimez une photo existante.</p>
          </>
        )}
      </div>
    </>
  )
}
