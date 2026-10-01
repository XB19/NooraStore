import { useState } from 'react'
import { api } from '../api/client'
import { useFlash } from '../context/FlashContext'

const EMPTY = { name: '', email: '', phone: '', subject: '', message: '' }

export default function ContactForm() {
  const { addFlash } = useFlash()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrors({})
    try {
      const res = await api.post('/api/contact/', form)
      addFlash(res.detail, 'success')
      setForm(EMPTY)
    } catch (err) {
      addFlash('Merci de corriger les champs signalés ci-dessous.', 'error')
      setErrors(err.data || {})
    }
  }

  return (
    <div className="contact-form-card">
      <span className="eyebrow">Écrivez-nous</span>
      <h3>Envoyer un message</h3>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="id_name">Nom</label>
          <input id="id_name" type="text" value={form.name} onChange={update('name')} required />
          {errors.name && <span className="field-error">{errors.name.join(' ')}</span>}
        </div>
        <div className="field">
          <label htmlFor="id_email">Email</label>
          <input id="id_email" type="email" value={form.email} onChange={update('email')} />
          {errors.email && <span className="field-error">{errors.email.join(' ')}</span>}
        </div>
        <div className="field">
          <label htmlFor="id_phone">Téléphone</label>
          <input id="id_phone" type="text" value={form.phone} onChange={update('phone')} />
        </div>
        <div className="field">
          <label htmlFor="id_subject">Sujet</label>
          <input id="id_subject" type="text" value={form.subject} onChange={update('subject')} />
        </div>
        <div className="field">
          <label htmlFor="id_message">Message</label>
          <textarea id="id_message" rows={5} value={form.message} onChange={update('message')} required />
          {errors.message && <span className="field-error">{errors.message.join(' ')}</span>}
        </div>
        <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>Envoyer le message</button>
      </form>
    </div>
  )
}
