import { useState } from 'react';
import { FiPlus, FiMinus, FiShoppingBag, FiPackage, FiEdit3 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import ScrollReveal from '../components/ScrollReveal';

const packs = [
  {
    id: 'solo', name: 'Pack Solo', pieces: 18, price: 6000, tag: '🎯 Idéal pour 1',
    img: '/images/burgers.png',
    items: ['4 Pastels viande', '4 Quiches', '4 Mini Pizzas', '4 Nems', '2 Burgers ou 2 Hot Dogs'],
    color: 'linear-gradient(135deg, #c0a44d, #e8d48b)',
  },
  {
    id: 'duo', name: 'Pack Duo', pieces: 20, price: 10000, tag: '👫 Pour 2 personnes',
    img: '/images/pizzas.png',
    items: ['5 Mini Pizzas', '4 Mini Quiches', '3 Mini Burgers', '3 Mini Hot Dogs', '5 Pastels viande', '4 Samosas'],
    color: 'linear-gradient(135deg, #4da0c0, #8bd4e8)',
  },
  {
    id: 'vip', name: 'Pack VIP', pieces: 40, price: 15000, tag: '⭐ Best-seller',
    img: '/images/pastels.png',
    items: ['6 Pastels (viande ou poulet)', '6 Quiches (poulet ou jambon)', '6 Mini Pizzas', '6 Nems', '6 Burgers / Begel / Hot Dogs', '4 Samosas', '6 Crêpes'],
    color: 'linear-gradient(135deg, #c04d8c, #e88bd4)',
  },
  {
    id: 'vvip', name: 'Pack VVIP', pieces: 50, price: 25000, tag: '👑 Premium',
    img: '/images/nems.png',
    items: ['5 Pastels viande', '5 Pastels poulet champignon', '5 Quiches', '5 Nems', '5 Burgers', '5 Begel', '5 Hot Dogs', '5 Samosas', '5 Beignets crevette', '5 Ailerons', '5 Volovents poulet'],
    color: 'linear-gradient(135deg, #c0964d, #e8c88b)',
  },
];

const canapes = [
  { name: 'Pastel viande', price: 600, emoji: '🥟' },
  { name: 'Pastel poulet champignon', price: 750, emoji: '🥟' },
  { name: 'Quiche', price: 450, emoji: '🥧' },
  { name: 'Mini Pizza', price: 550, emoji: '🍕' },
  { name: 'Nems', price: 400, emoji: '🌯' },
  { name: 'Mini Burger', price: 750, emoji: '🍔' },
  { name: 'Hot Dog', price: 600, emoji: '🌭' },
  { name: 'Samosa', price: 500, emoji: '📐' },
  { name: 'Begel', price: 550, emoji: '🥯' },
  { name: 'Beignet crevette', price: 650, emoji: '🍤' },
  { name: 'Ailerons', price: 800, emoji: '🍗' },
  { name: 'Volovent poulet champignon', price: 650, emoji: '🧁' },
  { name: 'Crêpes', price: 700, emoji: '🥞' },
];

export default function Menu() {
  const [tab, setTab] = useState('packs');
  const [customBox, setCustomBox] = useState({});
  const { addToCart, showToast } = useCart();

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

  const addPackToCart = (pack) => {
    addToCart({ name: pack.name, price: pack.price, img: pack.img });
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
                className={`menu-tab ${tab === 'custom' ? 'active' : ''}`}
                onClick={() => setTab('custom')}
              >
                <FiEdit3 style={{ marginRight: 8 }} /> Box Personnalisée
              </button>
            </div>
          </ScrollReveal>

          {/* PACKS VIEW */}
          {tab === 'packs' && (
            <div className="packs-grid">
              {packs.map((pack) => (
                <ScrollReveal key={pack.id}>
                  <div className="pack-card">
                    <div className="pack-card-img">
                      <img src={pack.img} alt={pack.name} />
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
                        onClick={() => addPackToCart(pack)}
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

      {/* INFO */}
      <section className="section-padding">
        <div className="container text-center">
          <ScrollReveal>
            <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '700px', margin: '0 auto' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem' }}>
                🚚 Livraison au frais du client
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                Commandez vos packs ou composez votre box personnalisée,
                puis passez votre commande pour une livraison rapide à Gonzagueville et environs.
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="tel:+2250371707078" className="btn btn-outline">📞 Appeler</a>
                <a href="https://wa.me/2250371707078" target="_blank" rel="noreferrer" className="btn btn-primary">💬 WhatsApp</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
