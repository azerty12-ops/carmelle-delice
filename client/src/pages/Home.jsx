import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiSend, FiPackage, FiStar, FiClock } from 'react-icons/fi';
import { FaTiktok, FaInstagram } from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';

const features = [
  { icon: <FiSend />, title: 'Canapés Chauds', desc: 'Pastels, quiches, pizzas, nems et bien plus, toujours frais et croustillants' },
  { icon: <FiPackage />, title: 'Packs Gourmands', desc: 'Des packs de 18 à 50 pièces pour toutes les occasions' },
  { icon: <FiStar />, title: 'Box Personnalisée', desc: 'Composez votre propre box avec vos canapés préférés' },
  { icon: <FiClock />, title: 'Livraison Rapide', desc: 'Livraison partout à Abidjan pour vos événements et petits creux' },
];

const packs = [
  { name: 'Box Découverte', pieces: '18 pièces + Boisson', price: '6 500 F', tag: '✨ Populaire', img: '/images/box_decouverte.png', items: '5 pastels, 6 mini pizzas, 2 tacos, 2 quiches, 2 mini cakes, 1 nem, 1 Fanta ou Coca-Cola' },
  { name: 'Box Moyenne', pieces: '20 pièces + Boisson', price: '8 500 F', tag: '🔥 Recommandé', img: '/images/box_moyenne.png', items: '5 pastels, 6 mini pizzas, 3 nems, 2 tacos, 2 quiches, 1 Coca-Cola ou Fanta' },
  { name: 'Box VIP', pieces: '25 pièces + 2 Boissons', price: '16 000 F', tag: '⭐ Best-seller', img: '/images/box_vip.png', items: '6 pastels, 6 mini pizzas, 2 tacos, 3 brochettes, 2 nems, 2 bat\'bout, 4 quiches, 2 Coca-Cola ou Fanta' },
  { name: 'Box Royale', pieces: '40 pièces + Grande Boisson', price: '25 000 F', tag: '👑 Prestige', img: '/images/box_royale.png', items: '8 pastels, 8 mini pizzas, 4 tacos, 5 brochettes, 4 nems, 4 bat\'bout, 6 quiches, 1 Bouteille Fanta 1.5L' },
];

const plats = [
  { name: 'Kedjenou de Poulet', price: '4 000 F', desc: 'Poulet braisé à l\'étouffée, servi avec son attiéké frais', img: '/images/kedjenou.png' },
  { name: 'Placali Sauce Kopè', price: '3 500 F', desc: 'Pâte de manioc fermentée servie avec une sauce gluante riche', img: '/images/placali.png' },
  { name: 'Tchep Rouge au Poisson', price: '4 500 F', desc: 'Riz rouge sénégalais traditionnel, poisson et légumes de saison', img: '/images/tchep.png' },
];

export default function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/reviews/featured')
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, []);

  const galleryImages = [
    '/images/burgers.png',
    '/images/pizzas.png',
    '/images/pastels.png',
    '/images/nems.png',
    '/images/streetfood.png',
    '/images/chef.png'
  ];

  return (
    <>
      {/* GLOVO-STYLE CATEGORIES STRIP */}
      <div style={{ background: 'var(--navy-900)', paddingTop: '90px', paddingBottom: '2rem', paddingLeft: '5%', paddingRight: '5%', overflowX: 'auto', whiteSpace: 'nowrap', borderBottom: '1px solid rgba(255,255,255,0.05)', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', gap: '2rem', minWidth: 'max-content', margin: '0 auto', justifyContent: 'center' }}>
        {[
          { img: '/images/burgers.png', name: 'Burgers' },
          { img: '/images/pizzas.png', name: 'Pizzas' },
          { img: '/images/pastels.png', name: 'Pastels' },
          { img: '/images/streetfood.png', name: 'Quiches' },
          { img: '/images/nems.png', name: 'Nems' },
          { img: '/images/chef.png', name: 'Packs' },
          { img: '/images/streetfood.png', name: 'Box' }
        ].map(cat => (
          <Link to="/menu" key={cat.name} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', color: 'var(--white)', textDecoration: 'none', transition: 'transform 0.3s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--glass-border)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)', padding: '2px', background: 'var(--blue-primary)' }}>
              <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>

      {/* HERO */}
      <section className="hero" style={{ minHeight: '500px', height: 'auto', padding: '4rem 0', position: 'relative' }}>
        <div className="hero-bg" style={{ filter: 'blur(3px)', backgroundImage: 'url(/images/streetfood.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} />
        <div className="hero-overlay" style={{ background: 'rgba(10,22,40,0.85)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }} />
        <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>L'Art des <span className="gold">Canapés Chauds</span></h1>
          <p className="hero-desc" style={{ marginBottom: '2rem' }}>
            Savourez nos assortiments livrés chauds chez vous partout à Abidjan.
          </p>
          
          {/* GLOVO-STYLE SEARCH / ADDRESS BAR */}
          <div style={{ background: 'var(--white)', padding: '0.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', maxWidth: '600px', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <span style={{ padding: '0 1rem', color: 'var(--blue-deep)', fontSize: '1.2rem' }}>📍</span>
            <input type="text" placeholder="Saisissez votre adresse de livraison..." style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', padding: '0.5rem', color: 'var(--blue-deep)', fontFamily: 'var(--font-body)' }} />
            <Link to="/menu" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '50px', margin: 0 }}>Chercher</Link>
          </div>
          
          <div className="hero-buttons">
            <Link to="/commander" className="btn btn-outline btn-lg">🛒 Commander</Link>
          </div>
        </div>
        <div className="hero-scroll"><div className="hero-scroll-inner" /></div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {packs.map((pack, i) => (
              <ScrollReveal key={i}>
                <div className="menu-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="menu-card-img" style={{ height: '280px' }}>
                    <img src={pack.img} alt={pack.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="menu-card-overlay" />
                  </div>
                  <div className="menu-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="menu-card-top">
                      <h3 className="menu-card-name">{pack.name}</h3>
                      <span className="menu-card-price">{pack.price}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{pack.pieces}</p>
                    {pack.items && <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', fontStyle: 'italic', flex: 1 }}>{pack.items}</p>}
                    <div className="menu-card-footer" style={{ marginTop: 'auto' }}>
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

      {/* PLATS SECTION */}
      <section className="section-padding" style={{ background: 'var(--navy-800)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Nouveau au Menu</span>
              <h2 className="section-title">Nos Plats <span className="text-gold">Authentiques</span></h2>
              <p className="section-desc">Découvrez nos spécialités ivoiriennes et d'ailleurs, cuisinées comme à la maison</p>
            </div>
          </ScrollReveal>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {plats.map((plat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="glass-card" style={{ overflow: 'hidden', transition: 'var(--transition-base)' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img src={plat.img} alt={plat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>{plat.name}</h3>
                      <span className="gold" style={{ fontWeight: 'bold' }}>{plat.price}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{plat.desc}</p>
                    <Link to="/menu" className="btn btn-outline btn-sm" style={{ width: '100%' }}>Commander le Plat</Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section-padding" style={{ background: 'var(--navy-900)' }}>
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
                <div className="feature-card glass-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="section-padding">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Témoignages</span>
              <h2 className="section-title">Ce que disent nos <span className="text-gold">Clients</span></h2>
              <div className="section-line" />
            </div>
          </ScrollReveal>
          
          {reviews.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {reviews.map((rev, i) => (
                <ScrollReveal key={i}>
                  <div className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
                    <div style={{ color: 'var(--gold-400)', fontSize: '1.2rem', marginBottom: '1rem' }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{rev.comment}"</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--navy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-400)', fontWeight: 'bold' }}>
                        {rev.userName.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ display: 'block' }}>{rev.userName}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {new Date(rev.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Soyez le premier à donner votre avis depuis votre espace client !</p>
          )}
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
              <a href="tel:+2250103717078" className="btn btn-outline btn-lg">📞 Appeler</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
