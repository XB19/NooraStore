import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <p className="foot-tagline">« Noora » — un fil qui relie le tissu, le geste et la personne qui le porte.</p>
        <div className="foot-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <img src="/img/noora-logo.png" alt="Noora Store" className="brand-logo brand-logo-footer" />
            </div>
            <p style={{ fontSize: 13, maxWidth: 260, opacity: 0.8 }}>
              Boutique de tissus, vêtements (homme, femme, enfants) et accessoires, en ligne et à Lomé.
            </p>
            <div className="foot-mm">
              <span className="mm-pill">Flooz</span>
              <span className="mm-pill">T-Money</span>
              <span className="mm-pill">Carte virtuelle</span>
            </div>
          </div>
          <div>
            <h5>Boutique</h5>
            <ul>
              <li><Link to="/tissus">Tissus</Link></li>
              <li><Link to="/vetements-homme">Vêtements homme</Link></li>
              <li><Link to="/vetements-femme">Vêtements femme</Link></li>
              <li><Link to="/vetements-enfants">Vêtements enfants</Link></li>
              <li><Link to="/accessoires">Accessoires</Link></li>
            </ul>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><Link to="/mes-commandes">Suivi de commande</Link></li>
              <li><Link to="/panier">Panier</Link></li>
              <li><Link to="/favoris">Favoris</Link></li>
              <li><Link to="/#cardapp">Carte virtuelle</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+22892027395">+228 92 02 73 95</a></li>
              <li><a href="https://wa.me/22892027395" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="mailto:contact@noorastore.tg">contact@noorastore.tg</a></li>
              <li>Lomé, Togo</li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Noora Store — Tous droits réservés.</span>
          <span>Maquette générée à titre d'exemple</span>
        </div>
      </div>
    </footer>
  )
}
