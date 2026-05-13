import { useState, useEffect } from 'react';
import { FiPlus, FiMinus, FiShoppingBag, FiPackage, FiEdit3 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';
import axios from 'axios';

export default function Menu() {
  const [tab, setTab] = useState('packs');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customBox, setCustomBox] = useState({});
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    axios.get((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/menu')
      .then(res => {
        setMenuItems(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const packs = menuItems.filter(item => item.category === 'pack');
  const canapes = menuItems.filter(item => item.category === 'canape');
  const plats = menuItems.filter(item => item.category === 'plat');

  const updateCustom = (name, delta) => {
    setCustomBox(prev => {
      const qty = (prev[name] || 0) + delta;
      if (qty <= 0) { const { [name]: _, ...rest } = prev; return rest; }
      return { ...prev, [name]: qty };
    });
  };

  const customTotal = Object.entries(customBox).reduce((sum, [name, qty]) => {
    const item = canapes.find(c => c.name === name);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const customPieces = Object.values(customBox).reduce((s, q) => s + q, 0);

  const handleAddPack = (pack) => {
    addToCart({ name: pack.name, price: pack.price, img: pack.image });
    showToast(`✅ ${pack.name} ajouté au panier !`);
  };

  const addCustomBoxToCart = () => {
    if (customPieces === 0) return;
    const items = Object.entries(customBox).map(([name, qty]) => {
      const item = canapes.find(c => c.name === name);
      return `${qty}x ${name}`;
    }).join(', ');
    addToCart({
      name: `Box Perso (${customPieces} pcs)`,
      price: customTotal,
      desc: items,
    });
    showToast(`✅ Box personnalisée ajoutée au panier !`);
    setCustomBox({});
  };

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/canapes.png)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Nos Canapés Chauds</p>
          <h1 className="hero-title">Le <span className="text-gold">Menu</span></h1>
          <p className="hero-desc">Des packs gourmands ou une box 100% à votre goût</p>
        </div>
      </section>

      {/* TABS */}
      <section className="section-padding" style={{ background: 'var(--navy-800)' }}>
        <div className="container">
          <ScrollReveal>
            <div className="menu-tabs">
              <button
                className={`menu-tab ${tab === 'packs' ? 'active' : ''}`}
                onClick={() => setTab('packs')}
              >
                <FiPackage style={{ marginRight: 8 }} /> Nos Packs
              </button>
              <button
                className={`menu-tab ${tab === 'plats' ? 'active' : ''}`}
                onClick={() => setTab('plats')}
              >
                <FiShoppingBag style={{ marginRight: 8 }} /> Nos Plats
              </button>
              <button
                className={`menu-tab ${tab === 'custom' ? 'active' : ''}`}
                onClick={() => setTab('custom')}
              >
                <FiEdit3 style={{ marginRight: 8 }} /> Box Personnalisée
              </button>
            </div>
          </ScrollReveal>

          {/* LOADING SKELETON */}
          {loading && (
            <div className="packs-grid">
              {[1, 2, 3].map(i => (
                <div key={i} className="pack-card skeleton" style={{ height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          )}

          {/* PACKS VIEW */}
          {!loading && tab === 'packs' && (
            <div className="packs-grid">
              {packs.map((pack) => (
                <ScrollReveal key={pack._id || pack.id}>
                  <div className="pack-card">
                    <div className="pack-card-img">
                      <img src={pack.image} alt={pack.name} />
                      <div className="pack-badge" style={{ background: pack.color }}>
                        {pack.tag}
                      </div>
                    </div>
                    <div className="pack-card-body">
                      <div className="pack-header">
                        <h3 className="pack-name">{pack.name}</h3>
                        <span className="pack-pieces">{pack.pieces} pièces</span>
                      </div>
                      <div className="pack-price">{pack.price.toLocaleString()} F</div>
                      <ul className="pack-items">
                        {pack.items.map((item, i) => (
                          <li key={i}><span className="pack-check">✓</span> {item}</li>
                        ))}
                      </ul>
                      <button
                        className="btn btn-primary pack-btn"
                        onClick={() => handleAddPack(pack)}
                      >
                        <FiShoppingBag /> Ajouter au panier
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* PLATS VIEW */}
          {!loading && tab === 'plats' && (
            <div className="packs-grid">
              {plats.map((plat) => (
                <ScrollReveal key={plat._id || plat.id}>
                  <div className="pack-card">
                    <div className="pack-card-img" style={{ height: '220px' }}>
                      <img src={plat.image} alt={plat.name} style={{ objectFit: 'cover' }} />
                      <div className="pack-badge" style={{ background: 'var(--gold-400)' }}>
                        Nouveau
                      </div>
                    </div>
                    <div className="pack-card-body">
                      <div className="pack-header">
                        <h3 className="pack-name">{plat.name}</h3>
                        <span className="pack-pieces">Plat Authentique</span>
                      </div>
                      <div className="pack-price">{plat.price.toLocaleString()} F</div>
                      <ul className="pack-items">
                        {plat.items.map((item, i) => (
                          <li key={i}><span className="pack-check">✓</span> {item}</li>
                        ))}
                      </ul>
                      <button
                        className="btn btn-primary pack-btn"
                        onClick={() => handleAddPack(plat)}
                      >
                        <FiShoppingBag /> Ajouter au panier
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* CUSTOM BOX VIEW */}
          {tab === 'custom' && (
            <ScrollReveal>
              <div className="custom-box-section">
                <div className="section-header" style={{ marginBottom: '2rem' }}>
                  <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
                    Composez Votre <span className="text-gold">Box</span>
                  </h2>
                  <p className="section-desc">Choisissez vos canapés préférés et leurs quantités</p>
                </div>

                <div className="custom-grid">
                  {canapes.map(item => (
                    <div key={item.name} className="custom-item">
                      <div className="custom-item-info">
                        <span className="custom-emoji">{item.emoji}</span>
                        <div>
                          <span className="custom-name">{item.name}</span>
                          <span className="custom-price">{item.price} F</span>
                        </div>
                      </div>
                      <div className="custom-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateCustom(item.name, -1)}
                          disabled={!customBox[item.name]}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="qty-count">{customBox[item.name] || 0}</span>
                        <button
                          className="qty-btn qty-btn-plus"
                          onClick={() => updateCustom(item.name, 1)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CUSTOM BOX SUMMARY */}
                <div className="custom-summary">
                  <div className="custom-summary-info">
                    <div>
                      <span className="custom-summary-label">Votre Box</span>
                      <span className="custom-summary-pieces">{customPieces} pièce{customPieces > 1 ? 's' : ''}</span>
                    </div>
                    <div className="custom-summary-total">
                      {customTotal.toLocaleString()} F
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
                    onClick={addCustomBoxToCart}
                    disabled={customPieces === 0}
                  >
                    <FiShoppingBag /> Ajouter la box au panier
                  </button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* RESERVATION SECTION */}
      <section className="section-padding" style={{ background: 'var(--navy-900)' }}>
        <div className="container">
          <ScrollReveal>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="section-header">
                <span className="section-tag">Réservation</span>
                <h2 className="section-title">Réserver un <span className="text-gold">Menu</span></h2>
                <div className="section-line" />
                <p className="section-desc">Planifiez la préparation de votre menu à l'avance</p>
              </div>
              <div className="glass-card" style={{ padding: '2.5rem' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const data = Object.fromEntries(fd.entries());
                  try {
                    await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/reservations', data);
                    showToast('✅ Votre menu a été réservé !');
                    e.target.reset();
                  } catch { alert('Erreur lors de la réservation'); }
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="form-group">
                      <label className="form-label">Nom Complet</label>
                      <input className="form-input" name="name" required placeholder="Votre nom" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input className="form-input" name="phone" required placeholder="+225 ..." />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label className="form-label">Menu souhaité</label>
                    <select className="form-input" name="guests" required>
                      <option value="">-- Sélectionner un menu --</option>
                      {packs.map(p => (
                        <option key={p._id} value={p.name}>{p.name} - {p.price} F</option>
                      ))}
                      <option value="Box Perso">Box Personnalisée</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date souhaitée</label>
                      <input className="form-input" name="date" type="date" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Heure souhaitée</label>
                      <input className="form-input" name="time" type="time" required />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}>
                    <FiPackage style={{ marginRight: 8 }} /> Réserver ce Menu
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INFO */}
      <section className="section-padding">
        <div className="container text-center">
          <ScrollReveal>
            <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                🚚 Livraison partout à Abidjan
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                Commandez vos packs ou composez votre box personnalisée,
                puis passez votre commande pour une livraison rapide partout à Abidjan.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+2250103717078" className="btn btn-outline">📞 Appeler</a>
                <a href="https://wa.me/2250103717078" target="_blank" rel="noreferrer" className="btn btn-primary">💬 WhatsApp</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
