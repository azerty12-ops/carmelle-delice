import ScrollReveal from './ScrollReveal';

const reviews = [
  {
    name: "Sarah K.",
    rating: 5,
    text: "La Box VIP est juste incroyable ! Les mini pizzas et les pastels étaient encore chauds à la livraison. Une présentation digne d'un grand traiteur.",
    avatar: "👩‍💼"
  },
  {
    name: "Moussa D.",
    rating: 5,
    text: "Enfin du vrai street food premium à Abidjan. Le système de points est super avantageux, j'ai déjà eu ma réduction sur ma deuxième Box Royale.",
    avatar: "👨‍💻"
  },
  {
    name: "Awa T.",
    rating: 5,
    text: "Les quiches sont à tomber ! J'ai commandé pour l'anniversaire de ma fille et tout le monde a adoré. Je recommande à 100%.",
    avatar: "👩‍🍳"
  }
];

export default function ReviewsSection() {
  return (
    <section className="section-padding page-alt">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Témoignages</span>
            <h2 className="section-title">Ce que nos <span className="text-gold">Clients</span> disent</h2>
            <div className="section-line" />
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          {reviews.map((review, i) => (
            <ScrollReveal key={i} delay={i * 200}>
              <div className="glass-card" style={{ padding: '2rem', height: '100%', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '2rem', fontSize: '3rem', opacity: 0.1 }}>"</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                    {review.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--white)' }}>{review.name}</h4>
                    <div style={{ color: 'var(--gold-400)', fontSize: '0.8rem' }}>
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontStyle: 'italic' }}>
                  "{review.text}"
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
