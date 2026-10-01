import { useFlash } from '../context/FlashContext'

export default function FlashMessages({ wrapped = true }) {
  const { flashes, dismissFlash } = useFlash()

  if (flashes.length === 0) return null

  return (
    <div className={wrapped ? 'wrap flash-wrap' : 'flash-wrap'} style={wrapped ? undefined : { marginBottom: 20 }}>
      {flashes.map((f) => (
        <div key={f.id} className={`flash flash-${f.tag}`} onClick={() => dismissFlash(f.id)}>
          {f.message}
        </div>
      ))}
    </div>
  )
}
