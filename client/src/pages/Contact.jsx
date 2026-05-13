import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiCalendar, FiUsers } from 'react-icons/fi';
import { sendMessage, createReservation } from '../api/api';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';

const infos = [
  { icon: <FiMapPin size={28} />, title: 'Adresse', lines: ['Port Bouet, Gonzagueville', 'Abidjan, Côte d\'Ivoire'] },
  { icon: <FiPhone size={28} />, title: 'Téléphone', lines: ['+225 01 03 71 70 78'], link: 'tel:+2250103717078' },
  { icon: <FiMail size={28} />, title: 'Email', lines: ['carmeldelice7@gmail.com'], link: 'mailto:carmeldelice7@gmail.com' },
  { icon: <FiClock size={28} />, title: 'Horaires', lines: ['Lun – Dim : 08h30 – 20h30', 'Ouvert tous les jours'] },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const { showToast } = useCart();

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    try { await sendMessage(form); } catch {}
    showToast('✅ Message envoyé !');
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <>
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/gallery1.png)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Nous Trouver</p>
          <h1 className="hero-title">Contactez <span className="text-gold">Nous</span></h1>
          <p className="hero-desc">Nous sommes à votre écoute pour toute question</p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--navy-800)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {infos.map((info, i) => (
              <ScrollReveal key={i}>
                <div className="contact-card">
                  <span className="contact-icon" style={{ color: 'var(--gold-400)' }}>{info.icon}</span>
                  <h4>{info.title}</h4>
                  {info.lines.map((l, j) => (
                    <p key={j}>{info.link && j === 0 ? <a href={info.link}>{l}</a> : l}</p>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="section-header">
                <span className="section-tag">Écrivez-Nous</span>
                <h2 className="section-title">Envoyer un <span className="text-gold">Message</span></h2>
                <div className="section-line" />
              </div>
              
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleMessageSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Nom</label>
                      <input className="form-input" required placeholder="Votre nom" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" required placeholder="votre@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet</label>
                    <input className="form-input" required placeholder="Sujet de votre message" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-input" required placeholder="Votre message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <FiSend /> {sent ? 'Envoyé ✓' : 'Envoyer le Message'}
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
