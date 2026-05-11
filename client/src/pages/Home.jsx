import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const features = [
  { icon: '🔥', title: 'Canapés Chauds', desc: 'Pastels, quiches, pizzas, nems et bien plus, toujours frais et croustillants' },
  { icon: '📦', title: 'Packs Gourmands', desc: 'Des packs de 18 à 50 pièces pour toutes les occasions' },
  { icon: '🎨', title: 'Box Personnalisée', desc: 'Composez votre propre box avec vos canapés préférés' },
  { icon: '🚚', title: 'Livraison Rapide', desc: 'Livraison dans tout Gonzagueville et ses environs' },
];

const packs = [
  { name: 'Pack Solo', pieces: '18 pièces', price: '6 000 F', tag: '🎯 Pour 1', img: '/images/burgers.png' },
  { name: 'Pack Duo', pieces: '20 pièces', price: '10 000 F', tag: '👫 Pour 2', img: '/images/pizzas.png' },
  { name: 'Pack VIP', pieces: '40 pièces', price: '15 000 F', tag: '⭐ Best-seller', img: '/images/pastels.png' },
  { name: 'Pack VVIP', pieces: '50 pièces', price: '25 000 F', tag: '👑 Premium', img: '/images/nems.png' },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/streetfood.png)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Bienvenue chez</p>
          <h1 className="hero-title">Carmel <span className="text-gold">Délice</span></h1>
          <p className="hero-desc">
            Street food & canapés chauds artisanaux à Gonzagueville.
            Des packs gourmands ou une box 100% personnalisée, livrés chez vous.
          </p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn btn-primary btn-lg">📦 Voir nos Packs</Link>
            <Link to="/commander" className="btn btn-outline btn-lg">🛒 Commander</Link>
          </div>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-inner" /></div>
      </section>

      {/* WHY US */}
      <section className="section-padding" style={{ background: 'var(--navy-800)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Pourquoi Nous Choisir</span>
              <h2 className="section-title">Le Street Food <span className="text-gold">Premium</span></h2>
              <div className="section-line" />
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <ScrollReveal key={i}>
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '0.8rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PACKS PREVIEW */}
      <section className="section-padding">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Nos Formules</span>
              <h2 className="section-title">Packs <span className="text-gold">Canapés Chauds</span></h2>
              <div className="section-line" />
              <p className="section-desc">Des packs pensés pour toutes les envies et toutes les occasions</p>
            </div>
          </ScrollReveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {packs.map((pack, i) => (
              <ScrollReveal key={i}>
                <div className="menu-card">
                  <div className="menu-card-img">
                    <img src={pack.img} alt={pack.name} />
                    <div className="menu-card-overlay" />
                  </div>
                  <div className="menu-card-body">
                    <div className="menu-card-top">
                      <h3 className="menu-card-name">{pack.name}</h3>
                      <span className="menu-card-price">{pack.price}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{pack.pieces}</p>
                    <div className="menu-card-footer">
                      <span className="menu-card-tag">{pack.tag}</span>
                      <Link to="/menu" className="menu-card-btn">Commander →</Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/menu" className="btn btn-outline">Voir le menu complet →</Link>
          </div>
        </div>
      </section>

      {/* HISTORY CTA */}
      <section className="section-padding" style={{ background: 'var(--navy-800)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/chef.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <ScrollReveal>
            <span className="section-tag" style={{ fontSize: '1.6rem' }}>Notre Histoire</span>
            <h2 className="section-title" style={{ maxWidth: '700px', margin: '1rem auto 1.5rem' }}>
              Une passion née de <span className="text-gold">l'amour</span> du street food
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: '1.8' }}>
              Depuis notre création, nous proposons les meilleurs canapés chauds de Gonzagueville avec fierté et créativité.
            </p>
            <Link to="/histoire" className="btn btn-primary btn-lg">Découvrir Notre Histoire →</Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ORDER CTA */}
      <section className="section-padding">
        <div className="container text-center">
          <ScrollReveal>
            <span className="section-tag" style={{ fontSize: '1.6rem' }}>Envie de Canapés ?</span>
            <h2 className="section-title" style={{ margin: '1rem auto 1.5rem' }}>
              Commandez Vos <span className="text-gold">Favoris</span>
            </h2>
            <p className="section-desc" style={{ marginBottom: '2.5rem' }}>
              Choisissez un pack ou composez votre box, on s'occupe du reste !
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary btn-lg">📦 Commander un Pack</Link>
              <a href="tel:+2250371707078" className="btn btn-outline btn-lg">📞 Appeler</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
