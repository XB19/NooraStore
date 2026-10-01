import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import ContactForm from '../../components/ContactForm'
import ProductCard from '../../components/ProductCard'
import QuoteSlider from '../../components/QuoteSlider'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/api/home/').then(setData)
  }, [])

  if (!data) return null

  const { top_categories: topCategories, vetements_subcategories: vetementsSubcategories, featured_products: featuredProducts } = data

  return (
    <>
      {/* hero */}
      <section className="hero">
        <div className="hero-texture"></div>
        <div className="wrap grid">
          <div className="hero-copy">
            <span className="kicker">— Boutique &amp; atelier — Lomé, Togo</span>
            <h1>Des tissus qui <i>portent</i><br />une histoire.</h1>
            <p>Wax, bazin et kenté choisis à la main, tenues homme, femme et enfants sur-mesure, et accessoires. Commandez en ligne, réglez par Flooz, T-Money ou carte virtuelle, et faites-vous livrer.</p>
            <div className="hero-ctas">
              <Link to="/catalogue" className="btn btn-cream">Voir la boutique</Link>
              <a href="#cardapp" className="btn btn-line">Télécharger l'app</a>
            </div>
          </div>
          <div className="hero-visual">
            <Link className="fold fold-1" to="/tissus"><img src="/img/wax-premium.jpg" alt="Tissu wax coloré" /><span>Wax Premium</span></Link>
            <Link className="fold fold-2" to="/vetements-homme"><img src="/img/homme-imprime.jpg" alt="Tenue homme imprimée" /><span>Collection Homme</span></Link>
            <Link className="fold fold-3" to="/vetements-femme"><img src="/img/femmes-ceremonie.jpg" alt="Femmes en tenues colorées" /><span>Collection Femme</span></Link>
          </div>
        </div>
      </section>

      {/* triad */}
      <section className="triad">
        <div className="wrap">
          <div className="triad-item"><span className="num">01</span><div><h4>Choisir</h4><p>Des centaines de tissus et tenues, en boutique ou sur l'app.</p></div></div>
          <div className="triad-item"><span className="num">02</span><div><h4>Payer</h4><p>Flooz, T-Money ou carte virtuelle Noora — sans détour.</p></div></div>
          <div className="triad-item"><span className="num">03</span><div><h4>Recevoir</h4><p>Livraison suivie, chez vous ou en atelier.</p></div></div>
        </div>
      </section>

      {/* trust */}
      <section className="trust">
        <div className="wrap">
          <div className="trust-item">
            <span className="trust-ic"><svg className="icon" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg></span>
            <div className="trust-txt"><b>Livraison sous 24h</b><span>à Lomé et environs</span></div>
          </div>
          <div className="trust-item">
            <span className="trust-ic"><svg className="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg></span>
            <div className="trust-txt"><b>Paiement sécurisé</b><span>Flooz, T-Money, carte virtuelle</span></div>
          </div>
          <div className="trust-item">
            <span className="trust-ic trust-ic-gold"><svg className="icon" viewBox="0 0 24 24" style={{ fill: 'currentColor', stroke: 'none' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg></span>
            <div className="trust-txt"><b>4,8/5</b><span>sur nos dernières commandes</span></div>
          </div>
        </div>
      </section>

      {/* categories */}
      <section className="cats" id="tissus">
        <div className="wrap">
          <div className="shead"><div><span className="kicker">Nos univers</span><h2>Trois familles, un seul atelier</h2></div></div>
          <div className="cat-grid">
            {topCategories.map((category) => (
              <Link className="cat-card" id={category.slug} key={category.id} to={`/${category.slug}`}>
                {category.image && <img src={category.image} alt={category.name} />}
                <div className="shade"></div>
                <div className="content"><h3>{category.name}</h3><span className="count">{category.product_count} article{category.product_count > 1 ? 's' : ''}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* subcategories */}
      <section className="subcats">
        <div className="wrap">
          <div className="shead"><div><span className="kicker">Vêtements</span><h2>Par catégorie</h2></div></div>
          <div className="subcat-grid">
            {vetementsSubcategories.map((sub) => (
              <Link className="subcat-card" key={sub.id} to={`/${sub.slug}`}>
                {sub.image && <img src={sub.image} alt={sub.name} />}
                <div className="shade"></div>
                <div className="content">
                  <h4>{sub.name}</h4>
                  <span className="arrow"><svg className="icon" style={{ width: 14, height: 14, color: '#fff' }} viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* trending */}
      <section className="trend" id="promos">
        <div className="wrap">
          <div className="shead">
            <div><span className="kicker">En ce moment</span><h2>Tendances &amp; promotions</h2></div>
            <Link to="/catalogue" className="more">Tout voir <svg className="icon" style={{ width: 14, height: 14 }} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
          </div>
          <div className="trend-row">
            <Link className="trend-card" to="/tissus"><img src="/img/wax-premium.jpg" alt="Tissu wax en promotion" /><div className="shade"></div><div className="content"><h4>-20% Wax Premium</h4><p>Jusqu'au 31 juillet</p></div></Link>
            <Link className="trend-card" to="/vetements-homme"><img src="/img/homme-imprime.jpg" alt="Nouveautés mode homme" /><div className="shade"></div><div className="content"><h4>Nouveautés homme</h4><p>Arrivage de la semaine</p></div></Link>
            <Link className="trend-card" to="/vetements-femme"><img src="/img/femmes-ceremonie.jpg" alt="Tenues femme cérémonie" /><div className="shade"></div><div className="content"><h4>Femme &amp; cérémonie</h4><p>Pièces tissées à la main</p></div></Link>
            <Link className="feature-card" to="/#contact">
              <div className="fc-top"><svg className="icon" viewBox="0 0 24 24"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg></div>
              <div><h4>Sur-mesure atelier</h4><p>Confiez-nous vos mesures, on s'occupe du reste.</p></div>
            </Link>
            <Link className="trend-card" to="/accessoires"><img src="/img/sac-kente.jpg" alt="Accessoires et bijoux" /><div className="shade"></div><div className="content"><h4>Accessoires</h4><p>Sacs, bijoux, foulards</p></div></Link>
          </div>
        </div>
      </section>

      {/* commitments */}
      <section className="commit">
        <div className="wrap commit-grid">
          <div className="commit-card">
            <span className="eyebrow">Pour vous</span>
            <h3>Acheter chez Noora, en toute confiance.</h3>
            <ul>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Suivi de commande en temps réel, du panier à la livraison</li>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Paiement Flooz, T-Money ou carte virtuelle, sans frais cachés</li>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Facture automatique envoyée par email ou WhatsApp</li>
            </ul>
            <a href="#tissus" className="btn btn-outline">Découvrir la boutique</a>
          </div>
          <div className="commit-card dark">
            <span className="eyebrow">Côté atelier</span>
            <h3>Une boutique pilotée comme un vrai commerce.</h3>
            <ul>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Stocks de tissus, tailles et coloris suivis en temps réel</li>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Facturation générée à chaque vente, en ligne ou en boutique</li>
              <li><svg className="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg> Livraison organisée et suivie jusqu'à la porte du client</li>
            </ul>
            <a href="#contact" className="btn btn-cream">Nous contacter</a>
          </div>
        </div>
      </section>

      {/* products */}
      <section className="products">
        <div className="wrap">
          <div className="shead">
            <div><span className="kicker">Catalogue</span><h2>Nos meilleures ventes</h2></div>
            <Link to="/catalogue" className="more">Tout le catalogue <svg className="icon" style={{ width: 14, height: 14 }} viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="pgrid">
              {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p style={{ color: 'var(--ink-soft)' }}>Le catalogue est en cours de préparation, revenez bientôt.</p>
          )}
        </div>
      </section>

      {/* how it works */}
      <section className="how" id="how">
        <div className="wrap">
          <div className="shead" style={{ marginBottom: 44 }}><div><span className="kicker">Étape par étape</span><h2>De la boutique à votre porte</h2></div></div>
          <div className="how-grid">
            <div className="how-item">
              <div className="idx"><svg className="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
              <h4>Choisissez</h4>
              <p>Parcourez tissus, vêtements et accessoires en boutique ou via l'app.</p>
            </div>
            <div className="how-item">
              <div className="idx"><svg className="icon" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg></div>
              <h4>Commandez</h4>
              <p>Ajoutez au panier, validez votre commande en ligne.</p>
            </div>
            <div className="how-item">
              <div className="idx"><svg className="icon" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg></div>
              <h4>Payez</h4>
              <p>Flooz, T-Money ou carte virtuelle Noora.<span className="paypills"><span className="paypill">Flooz</span><span className="paypill">T-Money</span><span className="paypill">Carte</span></span></p>
            </div>
            <div className="how-item">
              <div className="idx"><svg className="icon" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg></div>
              <h4>Recevez</h4>
              <p>Livraison à domicile avec suivi en direct du livreur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* card + app */}
      <section className="cardapp" id="cardapp">
        <div className="wrap ca-grid">
          <div className="vcard">
            <div className="row1"><div className="chip"></div><span className="mono" style={{ fontSize: 11, opacity: 0.85 }}>VIRTUELLE</span></div>
            <div className="num">•••• •••• •••• 4821</div>
            <div className="row2"><div><div className="holder">A. KOFFI</div><div className="holder">EXP 09/29</div></div><div className="brand2">Noora</div></div>
          </div>
          <div className="app-copy">
            <span className="kicker mono" style={{ textTransform: 'uppercase', letterSpacing: '.09em', fontSize: 11, color: 'var(--rust-2)' }}>Carte &amp; application</span>
            <h2>Une carte virtuelle, une app, un seul compte Noora.</h2>
            <p>Rechargez votre carte virtuelle via Flooz ou T-Money et payez en ligne en toute sécurité. Gérez commandes et stock depuis l'app mobile.</p>
            <div className="store-row">
              <div className="store-badge"><svg className="icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg> <span><small>Télécharger sur</small><b>App Store</b></span></div>
              <div className="store-badge"><svg className="icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg> <span><small>Disponible sur</small><b>Google Play</b></span></div>
            </div>
            <div className="qr-row"><div className="qr"></div><span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>Scannez pour télécharger l'app</span></div>
          </div>
        </div>
      </section>

      <QuoteSlider />

      {/* stats */}
      <section className="stats">
        <div className="wrap">
          <div><div className="num">1 200+</div><div className="lab">Modèles de tissus</div></div>
          <div><div className="num">24h</div><div className="lab">Livraison à Lomé</div></div>
          <div><div className="num">100%</div><div className="lab">Mobile Money accepté</div></div>
          <div><div className="num">4,8/5</div><div className="lab">Note moyenne clients</div></div>
        </div>
      </section>

      {/* contact */}
      <section className="contact" id="contact">
        <div className="wrap">
          <div className="shead" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <span className="kicker">Contact</span><h2>Discutons de votre prochaine tenue</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-left">
              <div className="contact-photo">
                <img src="/img/contact-phone.jpg" alt="Une cliente joignable facilement par téléphone et WhatsApp" />
                <span className="contact-photo-tag">Réponse rapide par téléphone &amp; WhatsApp</span>
              </div>

              <div className="bizcard">
                <div className="left">
                  <h3>Noora Store</h3>
                  <div className="tag">TISSUS · VÊTEMENTS · ACCESSOIRES</div>
                  <div className="cline"><span className="ic"><svg className="icon" style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg></span> <a href="tel:+22892027395">+228 92 02 73 95</a></div>
                  <div className="cline"><span className="ic"><svg className="icon" style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" /></svg></span> <a href="https://wa.me/22892027395" target="_blank" rel="noopener noreferrer">WhatsApp : +228 92 02 73 95</a></div>
                  <div className="cline"><span className="ic"><svg className="icon" style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></svg></span> <a href="mailto:contact@noorastore.tg">contact@noorastore.tg</a></div>
                  <div className="cline"><span className="ic"><svg className="icon" style={{ width: 13, height: 13 }} viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg></span> Lomé, Maritime, Togo</div>
                </div>
                <div className="right"><div className="qr" style={{ width: 80, height: 80 }}></div><span>Scanner le contact</span></div>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
