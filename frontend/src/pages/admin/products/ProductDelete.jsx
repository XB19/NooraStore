import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import ConfirmDelete from '../../../components/admin/ConfirmDelete'

export default function ProductDelete() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    api.get(`/api/admin/products/${id}/`).then(setProduct)
  }, [id])

  if (!product) return null

  return (
    <ConfirmDelete
      kicker="Produits"
      title="Supprimer un produit"
      message={<>Êtes-vous sûr de vouloir supprimer <b>« {product.name} »</b> ? Cette action est définitive et retirera aussi ses photos et son historique de favoris.</>}
      onConfirm={() => api.del(`/api/admin/products/${id}/`)}
      cancelTo="/gestion/produits"
      successMessage={`Produit « ${product.name} » supprimé.`}
    />
  )
}
