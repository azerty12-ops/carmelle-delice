import { useState, useEffect } from 'react';
import { FiMinus, FiPlus, FiTrash2, FiSend, FiCheckCircle, FiPhone, FiClock, FiMapPin, FiCreditCard, FiTag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder, validatePromo } from '../api/api';
import ScrollReveal from '../components/ScrollReveal';

export default function Commander() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', notes: '',
    deliveryDate: 'Aujourd\'hui', deliveryTime: 'Dès que possible',
    paymentMethod: 'cash'
  });
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); // percentage
  const [applyingPromo, setApplyingPromo] = useState(false);

  const [sending, setSending] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [showMobileMoney, setShowMobileMoney] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const discountAmount = Math.floor(totalPrice * (discount / 100));
  const finalPrice = totalPrice - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    try {
      const res = await validatePromo(promoCode);
      if (res.data.valid) {
        setDiscount(res.data.discountPercentage);
        // showToast is context based, we don't have it directly but we can alert
        alert(`Code appliqué ! -${res.data.discountPercentage}% de réduction.`);
      }
    } catch (err) {
      setDiscount(0);
      alert(err.response?.data?.message || 'Code invalide');
    }
    setApplyingPromo(false);
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    setSending(true);
    
    const orderData = {
      customerName: formData.name,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      notes: formData.notes,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, desc: i.desc || '' })),
      totalPrice: finalPrice,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'mobile_money' ? 'paid' : 'pending',
      promoCode: discount > 0 ? promoCode : null,
      discountAmount
    };

    try {
      const res = await createOrder(orderData);
      setOrderResult({
        success: true,
        order: res.data.order,
        ...orderData,
        items: [...cart],
        total: finalPrice,
      });
      clearCart();
    } catch (err) {
      setOrderResult({
        success: false,
        customerName: formData.name,
        items: [...cart],
        total: finalPrice,
      });
    }
    setSending(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.paymentMethod === 'mobile_money') {
      setShowMobileMoney(true);
    } else {
      handleConfirmOrder();
    }
  };

  const handleMobileMoneyPay = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setShowMobileMoney(false);
      handleConfirmOrder();
    }, 2500); // simulate network delay
  };

  // CONFIRMATION PAGE
  if (orderResult) {
    const order = orderResult.order;
    return (
      <>
        <section className="hero" style={{ minHeight: '40vh' }}>
          <div className="hero-bg" style={{ backgroundImage: 'url(/images/streetfood.png)' }} />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              <span className="text-gold">Commande</span> {orderResult.success ? 'Confirmée' : 'Enregistrée'} ✅
            </h1>
          </div>
        </section>
        <section className="section-padding" style={{ background: 'var(--navy-800)', paddingTop: '3rem' }}>
          <div className="container" style={{ maxWidth: '700px' }}>
            <ScrollReveal>
              <div className="confirmation-card">
                <div className="confirmation-header">
                  <FiCheckCircle size={48} className="confirmation-icon" />
                  <h2>Merci, {orderResult.customerName} !</h2>
                  <p>Votre commande a bien été reçue et sera traitée rapidement.</p>
                </div>

                {order?.orderNumber && (
                  <div className="confirmation-number">
                    <span className="confirmation-number-label">N° de commande</span>
                    <span className="confirmation-number-value">{order.orderNumber}</span>
                  </div>
                )}

                <div className="confirmation-section">
                  <h3>📦 Récapitulatif</h3>
                  <div className="confirmation-items">
                    {orderResult.items.map((item, i) => (
                      <div key={i} className="confirmation-item">
                        <div>
                          <span className="confirmation-item-qty">{item.quantity}x</span>
                          <span>{item.name}</span>
                          {item.desc && <p className="confirmation-item-desc">{item.desc}</p>}
                        </div>
                        <span className="confirmation-item-price">{(item.price * item.quantity).toLocaleString()} F</span>
                      </div>
                    ))}
                  </div>
                  {orderResult.discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem', color: '#10b981' }}>
                      <span>Réduction ({orderResult.promoCode})</span>
                      <span>-{orderResult.discountAmount.toLocaleString()} F</span>
                    </div>
                  )}
                  <div className="confirmation-total">
                    <span>Total Payé</span>
                    <span>{orderResult.total.toLocaleString()} F</span>
                  </div>
                </div>

                <div className="confirmation-section">
                  <h3>📋 Informations</h3>
                  <div className="confirmation-info-grid">
                    <div className="confirmation-info-item">
                      <FiMapPin size={18} />
                      <div>
                        <span className="info-label">Livraison</span>
                        <span className="info-value">{orderResult.customerAddress}</span>
                      </div>
                    </div>
                    <div className="confirmation-info-item">
                      <FiClock size={18} />
                      <div>
                        <span className="info-label">Date prévue</span>
                        <span className="info-value">{orderResult.deliveryDate} à {orderResult.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="confirmation-info-item">
                      <FiCreditCard size={18} />
                      <div>
                        <span className="info-label">Paiement</span>
                        <span className="info-value" style={{ color: orderResult.paymentMethod === 'mobile_money' ? '#10b981' : '#f59e0b' }}>
                          {orderResult.paymentMethod === 'mobile_money' ? 'Payé (Mobile Money)' : 'À payer à la livraison'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="confirmation-steps">
                  <h3>🔔 Prochaines étapes</h3>
                  <div className="step-list">
                    <div className="step active">
                      <div className="step-dot" />
                      <div><strong>Commande reçue</strong><span>Maintenant</span></div>
                    </div>
                    <div className="step">
                      <div className="step-dot" />
                      <div><strong>Confirmation par téléphone</strong><span>Sous 15 minutes</span></div>
                    </div>
                    <div className="step">
                      <div className="step-dot" />
                      <div><strong>Préparation de votre commande</strong><span>Selon votre horaire</span></div>
                    </div>
                    <div className="step">
                      <div className="step-dot" />
                      <div><strong>Livraison à votre porte</strong><span>À temps</span></div>
                    </div>
                  </div>
                </div>

                <div className="confirmation-actions">
                  <a href={`https://wa.me/2250371707078?text=Bonjour, je viens de passer la commande ${order?.orderNumber || ''}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    💬 Nous écrire sur WhatsApp
                  </a>
                  <Link to="/menu" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                    📦 Nouvelle Commande
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="hero" style={{ minHeight: '45vh' }}>
        <div className="hero-bg" style={{ backgroundImage: 'url(/images/streetfood.png)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tag">Finalisez Votre</p>
          <h1 className="hero-title"><span className="text-gold">Commande</span></h1>
          <p className="hero-desc">Planifiez votre livraison et choisissez votre mode de paiement</p>
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--navy-800)' }}>
        <div className="container">
          {cart.length === 0 ? (
            <ScrollReveal>
              <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '1rem' }}>Votre panier est vide</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.7 }}>
                  Parcourez notre menu pour ajouter des packs ou créer votre box personnalisée !
                </p>
                <Link to="/menu" className="btn btn-primary">📦 Voir le Menu</Link>
              </div>
            </ScrollReveal>
          ) : (
            <div className="order-layout">
              {/* CART RECAP */}
              <ScrollReveal>
                <div className="glass-card order-cart" style={{ position: 'sticky', top: '100px' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    🛒 Votre Panier ({totalItems} article{totalItems > 1 ? 's' : ''})
                  </h2>
                  {cart.map(item => (
                    <div key={item.name} className="order-item">
                      <div className="order-item-info">
                        <strong>{item.name}</strong>
                        {item.desc && <p className="order-item-desc">{item.desc}</p>}
                        <span className="order-item-price">{item.price.toLocaleString()} F</span>
                      </div>
                      <div className="order-item-controls">
                        <button className="qty-btn" onClick={() => updateQuantity(item.name, item.quantity - 1)}><FiMinus size={14} /></button>
                        <span className="qty-count">{item.quantity}</span>
                        <button className="qty-btn qty-btn-plus" onClick={() => updateQuantity(item.name, item.quantity + 1)}><FiPlus size={14} /></button>
                        <button className="order-remove" onClick={() => removeFromCart(item.name)}><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  
                  {/* PROMO CODE */}
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                      <FiTag /> Code Promo
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Ex: WELCOME10" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="form-input" 
                        style={{ padding: '0.5rem', fontSize: '0.9rem' }}
                        disabled={discount > 0}
                      />
                      <button 
                        type="button" 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={handleApplyPromo}
                        disabled={applyingPromo || discount > 0 || !promoCode}
                      >
                        {applyingPromo ? '...' : (discount > 0 ? 'Appliqué' : 'Appliquer')}
                      </button>
                    </div>
                  </div>

                  <div className="order-total" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Sous-total</span>
                      <span style={{ fontSize: '1rem' }}>{totalPrice.toLocaleString()} F</span>
                    </div>
                    {discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#10b981' }}>
                        <span style={{ fontSize: '1rem' }}>Réduction ({discount}%)</span>
                        <span style={{ fontSize: '1rem' }}>-{discountAmount.toLocaleString()} F</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                      <span>Total à payer</span>
                      <span className="order-total-price">{finalPrice.toLocaleString()} F</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* ORDER FORM */}
              <ScrollReveal>
                <div className="glass-card order-form-card">
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    📋 Vos Informations
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Nom Complet</label>
                      <input className="form-input" required placeholder="Votre nom complet" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone</label>
                      <input className="form-input" required placeholder="+225 XX XX XX XX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Adresse de Livraison</label>
                      <textarea className="form-input" required placeholder="Votre adresse complète (Gonzagueville et environs)" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ minHeight: '60px' }} />
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-400)', marginTop: '2rem', marginBottom: '1rem' }}>⏰ Planification</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Date de livraison</label>
                        <select className="form-input" value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}>
                          <option value="Aujourd'hui">Aujourd'hui</option>
                          <option value="Demain">Demain</option>
                          <option value="Dans 2 jours">Dans 2 jours</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Heure de livraison</label>
                        <select className="form-input" value={formData.deliveryTime} onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}>
                          <option value="Dès que possible">Dès que possible</option>
                          <option value="Midi (12h - 14h)">Midi (12h - 14h)</option>
                          <option value="Après-midi (14h - 18h)">Après-midi (14h - 18h)</option>
                          <option value="Soir (18h - 21h)">Soir (18h - 21h)</option>
                        </select>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', color: 'var(--gold-400)', marginTop: '2rem', marginBottom: '1rem' }}>💳 Paiement</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                        style={{ border: `2px solid ${formData.paymentMethod === 'cash' ? 'var(--gold-500)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-md)', padding: '1rem', cursor: 'pointer', textAlign: 'center', background: formData.paymentMethod === 'cash' ? 'rgba(200,152,46,0.1)' : 'transparent', transition: '0.2s' }}
                      >
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>💵</span>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>Payer à la livraison</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Espèces au livreur</span>
                      </div>
                      <div 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'mobile_money' })}
                        style={{ border: `2px solid ${formData.paymentMethod === 'mobile_money' ? 'var(--gold-500)' : 'var(--glass-border)'}`, borderRadius: 'var(--radius-md)', padding: '1rem', cursor: 'pointer', textAlign: 'center', background: formData.paymentMethod === 'mobile_money' ? 'rgba(200,152,46,0.1)' : 'transparent', transition: '0.2s' }}
                      >
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.5rem' }}>📱</span>
                        <strong style={{ display: 'block', fontSize: '0.9rem' }}>Mobile Money</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Wave, Orange, MTN</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Notes (optionnel)</label>
                      <textarea className="form-input" placeholder="Instructions spéciales, allergies..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={{ minHeight: '60px' }} />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.1rem', padding: '1rem' }} disabled={sending}>
                      {sending ? 'Envoi en cours...' : <><FiSend /> Confirmer — {finalPrice.toLocaleString()} F</>}
                    </button>
                  </form>
                </div>
              </ScrollReveal>
            </div>
          )}
        </div>
      </section>

      {/* MOBILE MONEY MODAL SIMULATION */}
      {showMobileMoney && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', textAlign: 'center', background: 'var(--navy-900)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--white)' }}>Paiement Sécurisé</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Montant à payer : <strong className="text-gold">{finalPrice.toLocaleString()} F</strong></p>
            
            {!paymentProcessing ? (
              <>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                  <div style={{ background: '#0052cc', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>Wave</div>
                  <div style={{ background: '#ff6600', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold' }}>Orange</div>
                </div>
                <input type="text" className="form-input" placeholder="Entrez votre numéro de téléphone" defaultValue={formData.phone} style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.1rem' }} />
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleMobileMoneyPay}>
                  Payer {finalPrice.toLocaleString()} F
                </button>
                <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', background: 'transparent', color: 'var(--text-muted)' }} onClick={() => setShowMobileMoney(false)}>
                  Annuler
                </button>
              </>
            ) : (
              <div style={{ padding: '2rem 0' }}>
                <div style={{ width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--gold-400)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem' }} />
                <h3 style={{ color: 'var(--gold-400)' }}>Validation en cours...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Veuillez confirmer le paiement sur votre téléphone.</p>
              </div>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
