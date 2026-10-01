import { Link, useNavigate } from 'react-router-dom'
import { useFlash } from '../../context/FlashContext'

export default function ConfirmDelete({ kicker, title, message, onConfirm, cancelTo, successMessage }) {
  const navigate = useNavigate()
  const { addFlash } = useFlash()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await onConfirm()
      addFlash(successMessage, 'success')
      navigate(cancelTo)
    } catch (err) {
      addFlash(err.data?.detail || "Suppression impossible.", 'error')
      navigate(cancelTo)
    }
  }

  return (
    <>
      <div className="ap-topbar">
        <div><span className="ap-kicker">{kicker}</span><h1>{title}</h1></div>
      </div>
      <div className="ap-panel" style={{ maxWidth: 520 }}>
        <p style={{ marginBottom: 20 }}>{message}</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-dark" style={{ background: 'var(--rust)' }}>Supprimer définitivement</button>
          <Link to={cancelTo} className="btn btn-outline">Annuler</Link>
        </form>
      </div>
    </>
  )
}
