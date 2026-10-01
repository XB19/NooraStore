import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import { useFlash } from '../../../context/FlashContext'

const EMPTY = { name: '', slug: '', parent: '', order: 0 }

export default function CategoryForm() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const { addFlash } = useFlash()

  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [currentImage, setCurrentImage] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [loaded, setLoaded] = useState(isNew)

  useEffect(() => {
    api.get('/api/admin/categories/').then(setCategories)
  }, [])

  useEffect(() => {
    if (isNew) return
    api.get(`/api/admin/categories/${id}/`).then((c) => {
      setForm({ name: c.name, slug: c.slug, parent: c.parent ?? '', order: c.order })
      setCurrentImage(c.image)
      setLoaded(true)
    })
  }, [id, isNew])

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    const data = new FormData()
    data.append('name', form.name)
    data.append('slug', form.slug)
    if (form.parent) data.append('parent', form.parent)
    data.append('order', form.order)
    if (imageFile) data.append('image', imageFile)

    try {
      if (isNew) {
        await api.post('/api/admin/categories/', data, { isFormData: true })
        addFlash('Catégorie créée.', 'success')
      } else {
        await api.patch(`/api/admin/categories/${id}/`, data, { isFormData: true })
        addFlash('Catégorie mise à jour.', 'success')
      }
      navigate('/gestion/categories')
    } catch (err) {
      setErrors(err.data || {})
    }
  }

  if (!loaded) return null

  const parentOptions = categories.filter((c) => String(c.id) !== id)

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">Catégories</span><h1>{isNew ? 'Nouvelle catégorie' : form.name}</h1></div>
        <Link to="/gestion/categories" className="btn btn-outline">← Retour à la liste</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="ap-panel" style={{ maxWidth: 640 }}>
          <div className="ap-form-grid">
            <div className="field">
              <label htmlFor="c_name">Nom</label>
              <input id="c_name" type="text" placeholder="Ex : Tissus" value={form.name} onChange={update('name')} required />
              {errors.name && <span className="field-error">{errors.name.join(' ')}</span>}
            </div>
            <div className="field">
              <label htmlFor="c_slug">Slug (URL)</label>
              <input id="c_slug" type="text" placeholder="Laisser vide pour générer automatiquement" value={form.slug} onChange={update('slug')} />
            </div>
            <div className="field">
              <label htmlFor="c_parent">Catégorie parente</label>
              <select id="c_parent" value={form.parent} onChange={update('parent')}>
                <option value="">—</option>
                {parentOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="c_order">Ordre d'affichage</label>
              <input id="c_order" type="number" value={form.order} onChange={update('order')} />
            </div>
            <div className="field field-full">
              <label htmlFor="c_image">Image de présentation</label>
              {currentImage && <img src={currentImage} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, marginBottom: 10, display: 'block' }} />}
              <input id="c_image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>
          </div>
        </div>
        <div className="ap-form-actions">
          <button type="submit" className="btn btn-dark">{isNew ? 'Créer la catégorie' : 'Enregistrer'}</button>
          <Link to="/gestion/categories" className="btn btn-outline">Annuler</Link>
        </div>
      </form>
    </>
  )
}
