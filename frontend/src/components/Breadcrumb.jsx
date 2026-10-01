import { Link } from 'react-router-dom'

export default function Breadcrumb({ crumb }) {
  return (
    <div className="crumb">
      <Link to="/">Accueil</Link>
      {crumb.map((c, i) => (
        <span key={i}>
          <span className="sep">/</span>
          {c.slug ? <Link to={`/${c.slug}`}>{c.label}</Link> : <span>{c.label}</span>}
        </span>
      ))}
    </div>
  )
}
