import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import ConfirmDelete from '../../../components/admin/ConfirmDelete'

export default function CategoryDelete() {
  const { id } = useParams()
  const [category, setCategory] = useState(null)

  useEffect(() => {
    api.get(`/api/admin/categories/${id}/`).then(setCategory)
  }, [id])

  if (!category) return null

  return (
    <ConfirmDelete
      kicker="Catégories"
      title="Supprimer une catégorie"
      message={<>Êtes-vous sûr de vouloir supprimer <b>« {category.name} »</b> ? Ses éventuelles sous-catégories seront supprimées avec elle.</>}
      onConfirm={() => api.del(`/api/admin/categories/${id}/`)}
      cancelTo="/gestion/categories"
      successMessage={`Catégorie « ${category.name} » supprimée.`}
    />
  )
}
