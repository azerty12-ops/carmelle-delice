import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

export default function Histoire() {
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
                Redéfinir le Street Food à Gonzagueville
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Carmel Délice est né d'un constat simple et d'une passion ardente. À Port Bouet, et plus précisément à Gonzagueville, il était difficile de trouver des canapés chauds, des amuse-bouches et du street food qui allient <strong>qualité artisanale, présentation soignée et saveurs authentiques</strong>.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '1.5rem' }}>
                Nous avons créé Carmel Délice avec l'ambition de combler ce vide. Notre objectif ? Devenir la référence incontournable de vos événements, de vos pauses gourmandes et de vos soirées entre amis, en livrant directement chez vous des créations fraîchement préparées.
              </p>
              <div style={{ borderLeft: '3px solid var(--gold-400)', paddingLeft: '1.5rem', marginTop: '2rem' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--white)', fontSize: '1.1rem' }}>
                  "Notre mission n'est pas seulement de vous nourrir, mais de vous offrir une véritable expérience culinaire, à l'intérieur même d'une box."
                </p>
              </div>
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
                  S'imposer comme le service traiteur et street food numéro 1 de la commune, réputé pour notre réactivité et la constance de notre qualité.
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

      {/* CALL TO ACTION */}
      <section className="section-padding page-alt">
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
