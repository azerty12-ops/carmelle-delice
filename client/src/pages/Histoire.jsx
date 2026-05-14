import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Histoire() {
  const galleryImages = [
    '/images/gallery1.png',
    '/images/dish1.png',
    '/images/dish2.png',
    '/images/dish3.png',
    '/images/chef.png'
  ];

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/chef.png)', backgroundPosition: 'center 30%' }} />
        <div className="hero-overlay" style={{ background: 'linear-gradient(180deg, rgba(6,13,26,0.7) 0%, rgba(6,13,26,0.9) 100%)' }} />
        <div className="hero-content">
          <p className="hero-tag">Les Origines</p>
          <h1 className="hero-title">
            La Naissance de <span className="text-gold">Carmel Délice</span>
          </h1>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="section-padding page-alt">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <ScrollReveal className="reveal-left">
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: '-15px', background: 'var(--gold-400)', borderRadius: 'var(--radius-md)', opacity: 0.1, transform: 'rotate(-3deg)' }} />
                <img src="/images/pastels.png" alt="Nos créations" style={{ borderRadius: 'var(--radius-md)', position: 'relative', zIndex: 1, width: '100%', boxShadow: 'var(--shadow-lg)' }} />
              </div>
            </ScrollReveal>
            
            <ScrollReveal className="reveal-right">
              <span className="section-tag">Notre Vision</span>
              <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
                Une passion née de <span className="text-gold">l'amour</span> du street food
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Carmel Délice est né d'un constat simple et d'une passion ardente. À Port Bouet, nous avons réalisé qu'il était difficile de trouver des canapés chauds, des amuse-bouches et du street food qui allient <strong>qualité artisanale, présentation soignée et saveurs authentiques</strong> pour tout Abidjan.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Depuis notre création, nous proposons les meilleurs canapés chauds avec fierté et créativité. Notre mission n'est pas seulement de vous nourrir, mais de vous offrir une véritable expérience culinaire, à l'intérieur même d'une box.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* AMBITIONS SECTION */}
      <section className="section-padding">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <span className="section-tag">Où Allons-Nous ?</span>
              <h2 className="section-title">Nos <span className="text-gold">Ambitions</span></h2>
              <div className="section-line" />
            </div>
          </ScrollReveal>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <ScrollReveal>
              <div className="glass-card" style={{ padding: '2.5rem', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥇</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', fontSize: '1.3rem', marginBottom: '1rem' }}>Devenir Leader</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  S'imposer comme le service traiteur et street food numéro 1 d'Abidjan, réputé pour notre réactivité et la constance de notre qualité.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="glass-card" style={{ padding: '2.5rem', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚚</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', fontSize: '1.3rem', marginBottom: '1rem' }}>Extension du Service</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  Développer notre flotte logistique pour étendre nos zones de livraison et garantir des plats toujours chauds et parfaitement dressés.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="glass-card" style={{ padding: '2.5rem', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💡</div>
                <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--gold-400)', fontSize: '1.3rem', marginBottom: '1rem' }}>Innovation Culinaire</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                  Renouveler constamment notre carte avec des créations originales, en fusionnant les saveurs locales avec des concepts de street food internationaux.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* BOX ROYALE - NOTRE SIGNATURE */}
      <section className="section-padding" style={{ background: 'var(--navy-900)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <ScrollReveal className="reveal-left">
              <div style={{ position: 'relative' }}>
                <img src="/images/box_royale.png" alt="Box Royale" style={{ borderRadius: 'var(--radius-md)', width: '100%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gold-400)' }} />
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'var(--gold-400)', color: 'var(--navy-900)', padding: '1rem', borderRadius: '50%', fontWeight: 'bold', boxShadow: 'var(--shadow-md)' }}>
                  Le Top
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal className="reveal-right">
              <span className="section-tag">Notre Signature</span>
              <h2 className="section-title">La Box <span className="text-gold">Royale</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                Plus qu'un menu, c'est une célébration. La Box Royale est notre création la plus ambitieuse : 
                <strong> 40 pièces</strong> d'exception accompagnées d'une grande bouteille de 1.5L pour vos plus beaux moments.
              </p>
              <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--gold-400)' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', fontStyle: 'italic' }}>
                  "Un assortiment complet pour les gourmets qui ne veulent faire aucun compromis."
                </p>
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Link to="/menu" className="btn btn-primary">Découvrir le Menu</Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* COMMUNITY GALLERY */}
      <section className="section-padding page-alt">
        <div className="container" style={{ maxWidth: '1200px' }}>
          <ScrollReveal>
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
              <span className="section-tag">Notre Communauté</span>
              <h2 className="section-title">Suivez-nous sur <span className="text-gold">Instagram & TikTok</span></h2>
              <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                <a href="https://www.instagram.com/carmel_delice_/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  <FaInstagram style={{ color: '#e1306c' }} /> @carmel_delice_
                </a>
                <a href="https://www.tiktok.com/@carmel.delice" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  <FaTiktok style={{ color: 'var(--white)' }} /> @carmel.delice
                </a>
              </div>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {galleryImages.map((img, i) => (
              <ScrollReveal key={i}>
                <div className="gallery-item" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-sm)', aspectRatio: '1/1' }}>
                  <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                  <div className="gallery-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease' }}>
                    <span style={{ color: '#ef4444', fontSize: '2rem' }}>❤️</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <style>{`
            .gallery-item:hover img { transform: scale(1.1); }
            .gallery-item:hover .gallery-overlay { opacity: 1; }
          `}</style>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="section-padding">
        <div className="container text-center">
          <ScrollReveal>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
              Faites Partie de <span className="text-gold">l'Aventure</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '1.1rem' }}>
              Testez nos packs ou composez votre box et découvrez pourquoi Carmel Délice est la nouvelle tendance gourmande.
            </p>
            <Link to="/menu" className="btn btn-primary btn-lg">📦 Voir le Menu</Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
