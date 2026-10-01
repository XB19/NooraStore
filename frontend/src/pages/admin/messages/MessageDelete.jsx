import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../../api/client'
import ConfirmDelete from '../../../components/admin/ConfirmDelete'
import { useAdmin } from '../../../context/AdminContext'

export default function MessageDelete() {
  const { id } = useParams()
  const { refresh: refreshAdmin } = useAdmin()
  const [message, setMessage] = useState(null)

  useEffect(() => {
    api.get(`/api/admin/messages/${id}/`).then(setMessage)
  }, [id])

  if (!message) return null

  return (
    <ConfirmDelete
      kicker="Messages"
      title="Supprimer un message"
      message={<>Êtes-vous sûr de vouloir supprimer le message de <b>« {message.name} »</b> ({message.subject || 'sans sujet'}) ? Cette action est définitive.</>}
      onConfirm={async () => {
        await api.del(`/api/admin/messages/${id}/`)
        refreshAdmin()
      }}
      cancelTo="/gestion/messages"
      successMessage={`Message de « ${message.name} » supprimé.`}
    />
  )
}
