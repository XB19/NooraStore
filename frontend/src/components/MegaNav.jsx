import { Link } from 'react-router-dom'

export default function MegaNav() {
  return (
    <nav className="catnav">
      <ul className="top">
        <li>
          <Link to="/tissus">Tissus</Link>
          <div className="mega">
            <div className="mega-col">
              <h5>Familles</h5>
              <ul>
                <li>Wax hollandais</li>
                <li>Bazin riche</li>
                <li>Kenté tissé</li>
                <li>Indigo &amp; batik</li>
              </ul>
            </div>
            <div className="mega-col">
              <h5>Par usage</h5>
              <ul>
                <li>Cérémonie</li>
                <li>Tenue de bureau</li>
                <li>Broderie sur-mesure</li>
                <li>Le rouleau (6 yards)</li>
              </ul>
            </div>
          </div>
        </li>
        <li>
          <Link to="/vetements">Vêtements</Link>
          <div className="mega">
            <div className="mega-col">
              <h5><Link to="/vetements-femme">Femme</Link></h5>
              <ul>
                <li>Robes</li>
                <li>Ensembles</li>
                <li>Tenues tradi-couture</li>
              </ul>
            </div>
            <div className="mega-col">
              <h5><Link to="/vetements-homme">Homme</Link></h5>
              <ul>
                <li>Chemises &amp; boubous</li>
                <li>Costumes</li>
                <li>Sur-mesure atelier</li>
              </ul>
            </div>
            <div className="mega-col">
              <h5><Link to="/vetements-enfants">Enfants</Link></h5>
              <ul>
                <li>Ensembles garçon</li>
                <li>Robes fillette</li>
                <li>Tenues cérémonie</li>
              </ul>
            </div>
          </div>
        </li>
        <li>
          <Link to="/accessoires">Accessoires</Link>
          <div className="mega">
            <div className="mega-col">
              <h5>Porter</h5>
              <ul>
                <li>Sacs</li>
                <li>Bijoux</li>
                <li>Foulards</li>
              </ul>
            </div>
            <div className="mega-col">
              <h5>Maison</h5>
              <ul>
                <li>Coussins</li>
                <li>Chutes de tissu</li>
              </ul>
            </div>
          </div>
        </li>
        <li><a href="#promos" style={{ color: 'var(--rust-2)' }}>Promotions</a></li>
        <li><Link to="/mes-commandes">Suivi de commande</Link></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  )
}
