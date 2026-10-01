import { useEffect, useRef, useState } from 'react'

const QUOTES = [
  {
    avatar: '/img/femme-portrait.jpg',
    text: '« On a commandé un bazin brodé un mardi, payé par Flooz, livré le jeudi. Simple comme discuter sur WhatsApp. »',
    cite: '— Une cliente de Noora Store, Lomé',
  },
  {
    avatar: '/img/testimonial-homme-1.jpg',
    text: '« J\'ai commandé une chemise wax pour un mariage, la coupe était parfaite du premier coup. Le suivi de commande m\'a rassuré jusqu\'à la livraison. »',
    cite: '— Un client de Noora Store, Lomé',
  },
  {
    avatar: '/img/testimonial-femme-1.jpg',
    text: '« Le pagne batik reçu était encore plus beau qu\'en photo. Le paiement par T-Money a pris moins d\'une minute. »',
    cite: '— Une cliente de Noora Store, Kara',
  },
  {
    avatar: '/img/testimonial-homme-2.jpg',
    text: '« Le grand boubou en bazin riche commandé pour la fête de fin d\'année a été livré à temps, avec une broderie soignée. »',
    cite: '— Un client de Noora Store, Sokodé',
  },
  {
    avatar: '/img/testimonial-femme-2.jpg',
    text: '« J\'adore pouvoir suivre ma commande en temps réel. La carte virtuelle Noora rend le paiement encore plus simple. »',
    cite: '— Une cliente de Noora Store, Kpalimé',
  },
]

export default function QuoteSlider() {
  const [idx, setIdx] = useState(0)
  const timerRef = useRef(null)

  function restart() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % QUOTES.length)
    }, 6000)
  }

  useEffect(() => {
    restart()
    return () => clearInterval(timerRef.current)
  }, [])

  function go(i) {
    setIdx((i + QUOTES.length) % QUOTES.length)
    restart()
  }

  return (
    <section className="quote">
      <div className="wrap">
        <div className="quote-slider">
          {QUOTES.map((q, i) => (
            <div key={i} className={`quote-slide${i === idx ? ' is-active' : ''}`}>
              <div className="quote-avatar"><img src={q.avatar} alt="Client·e Noora Store" /></div>
              <blockquote>{q.text}</blockquote>
              <cite>{q.cite}</cite>
            </div>
          ))}

          <div className="quote-nav">
            <button type="button" className="quote-arrow quote-prev" aria-label="Témoignage précédent" onClick={() => go(idx - 1)}>
              <svg className="icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div className="quote-dots">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`quote-dot${i === idx ? ' is-active' : ''}`}
                  aria-label={`Témoignage ${i + 1}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button type="button" className="quote-arrow quote-next" aria-label="Témoignage suivant" onClick={() => go(idx + 1)}>
              <svg className="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
