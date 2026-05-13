import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLogOut, FiStar, FiPackage, FiInfo, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { getMyOrders, trackOrder } from '../api/api';

export default function Profil() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'info', 'reviews'
  
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [reviewStatus, setReviewStatus] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      getMyOrders().then(res => setOrders(res.data.orders)).catch(console.error);
    }
  }, [user]);

  // Polling for active orders
  useEffect(() => {
    const activeOrders = orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status));
    if (activeOrders.length === 0) return;

    const intervalId = setInterval(() => {
      activeOrders.forEach(async (order) => {
        try {
          const res = await trackOrder(order.orderNumber);
          if (res.data.success && res.data.order.status !== order.status) {
            setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: res.data.order.status } : o));
          }
        } catch(err) {}
      });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [orders]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('carmel_token');
      await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/reviews', 
        { ...reviewData, userName: user.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewStatus('Merci pour votre avis !');
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      setReviewStatus('Erreur lors de la soumission');
    }
  };

  if (loading || !user) return <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chargement...</div>;

  return (
    <section className="container" style={{ paddingTop: '6rem', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)' }}>Bonjour, {user.name.split(' ')[0]} 👋</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>
          <FiLogOut /> Déconnexion
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* SIDEBAR NAVIGATION (GLOVO STYLE) */}
        <div className="glass-card" style={{ flex: '1 1 250px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: activeTab === 'orders' ? 'rgba(212,168,67,0.1)' : 'transparent', border: 'none', borderRadius: '16px', color: activeTab === 'orders' ? 'var(--gold-primary)' : 'var(--white)', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', fontWeight: '500', transition: 'all 0.3s' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FiPackage size={20} /> Mes Commandes</span>
            <FiChevronRight />
          </button>
          <button 
            onClick={() => setActiveTab('info')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: activeTab === 'info' ? 'rgba(212,168,67,0.1)' : 'transparent', border: 'none', borderRadius: '16px', color: activeTab === 'info' ? 'var(--gold-primary)' : 'var(--white)', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', fontWeight: '500', transition: 'all 0.3s' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FiUser size={20} /> Mes Informations</span>
            <FiChevronRight />
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: activeTab === 'reviews' ? 'rgba(212,168,67,0.1)' : 'transparent', border: 'none', borderRadius: '16px', color: activeTab === 'reviews' ? 'var(--gold-primary)' : 'var(--white)', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', fontWeight: '500', transition: 'all 0.3s' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FiStar size={20} /> Laisser un avis</span>
            <FiChevronRight />
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ flex: '3 1 600px' }}>
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Mes Commandes en cours et passées</h2>
              {orders.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                  <FiPackage size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>Vous n'avez pas encore passé de commande.</p>
                  <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Découvrir le menu</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {orders.map(order => (
                    <div key={order._id} className="glass-card" style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.2rem', display: 'block' }}>Commande {order.orderNumber}</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ color: 'var(--gold-400)', fontSize: '1.2rem' }}>{order.totalPrice.toLocaleString()} F</strong>
                        </div>
                      </div>

                      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        {order.items.map((item, i) => (
                          <div key={i}>{item.quantity}x {item.name}</div>
                        ))}
                      </div>

                      {['pending', 'confirmed', 'preparing'].includes(order.status) ? (
                        <div className="confirmation-steps" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0, color: '#10b981', fontSize: '0.95rem' }}>🟢 En cours...</h4>
                            <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Mise à jour auto</span>
                          </div>
                          <div className="step-list" style={{ marginTop: '0.5rem', paddingLeft: '0.5rem' }}>
                            <div className={`step ${['pending', 'confirmed', 'preparing', 'delivered'].includes(order.status) ? 'active' : ''}`} style={{ marginBottom: '0.5rem' }}>
                              <div className="step-dot" style={{ width: '10px', height: '10px', left: '-5px' }} /><div><strong style={{fontSize:'0.85rem'}}>Reçue</strong></div>
                            </div>
                            <div className={`step ${['confirmed', 'preparing', 'delivered'].includes(order.status) ? 'active' : ''}`} style={{ marginBottom: '0.5rem' }}>
                              <div className="step-dot" style={{ width: '10px', height: '10px', left: '-5px' }} /><div><strong style={{fontSize:'0.85rem'}}>Confirmée</strong></div>
                            </div>
                            <div className={`step ${['preparing', 'delivered'].includes(order.status) ? 'active' : ''}`} style={{ marginBottom: '0.5rem' }}>
                              <div className="step-dot" style={{ width: '10px', height: '10px', left: '-5px' }} /><div><strong style={{fontSize:'0.85rem'}}>Préparation</strong></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p style={{ display: 'inline-block', padding: '0.4rem 1rem', background: order.status === 'delivered' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: order.status === 'delivered' ? '#10b981' : '#ef4444', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '500' }}>
                          {order.status === 'delivered' ? '✓ Livrée' : '× Annulée'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* INFO TAB */}
          {activeTab === 'info' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Mes Informations</h2>
                <button 
                  onClick={async () => {
                    const name = prompt('Nom complet:', user.name);
                    const phone = prompt('Téléphone:', user.phone || '');
                    if (name) {
                      try {
                        const res = await updateUser({ name, phone });
                        updateUserInfo(res.data.user);
                        alert('Profil mis à jour !');
                      } catch { alert('Erreur lors de la mise à jour'); }
                    }
                  }} 
                  className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <FiEdit3 /> Modifier mon profil
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Nom Complet</label>
                  <p style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>{user.name}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Email</label>
                  <p style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>{user.email}</p>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Téléphone</label>
                  <p style={{ fontSize: '1.1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px' }}>{user.phone || 'Non renseigné'}</p>
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ color: 'var(--text-muted)' }}>Mes Adresses de Livraison</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {user.addresses?.map((addr, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                        <span>{addr}</span>
                        <button onClick={async () => {
                          const newAddrs = user.addresses.filter((_, idx) => idx !== i);
                          const res = await updateUser({ addresses: newAddrs });
                          updateUserInfo(res.data.user);
                        }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FiTrash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={async () => {
                      const addr = prompt('Nouvelle adresse:');
                      if (addr) {
                        const newAddrs = [...(user.addresses || []), addr];
                        const res = await updateUser({ addresses: newAddrs });
                        updateUserInfo(res.data.user);
                      }
                    }} className="btn btn-outline" style={{ padding: '0.5rem', fontSize: '0.85rem', marginTop: '0.5rem', borderStyle: 'dashed' }}>
                      + Ajouter une adresse
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(212,168,67,0.1)', borderRadius: '24px', border: '1px solid rgba(212,168,67,0.3)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-400)' }}>
                      <FiStar /> Programme Fidélité
                    </h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: 'var(--white)' }}>{user.points || 0} <span style={{ fontSize: '1rem', color: 'var(--gold-400)' }}>Points</span></p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Valeur estimée : <strong>{(Math.floor((user.points || 0) / 100) * 500).toLocaleString()} F</strong> de réduction.<br/>
                      Cumulez 100 points pour obtenir 500 F de remise ! (1 pt par 100 F dépensés)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1rem' }}>Laisser un avis</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>Avez-vous aimé votre dernière commande ? Laissez-nous un petit mot !</p>
              
              {reviewStatus && <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', marginBottom: '1.5rem', borderRadius: '16px', fontWeight: '500' }}>{reviewStatus}</div>}
              
              <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Note sur 5</label>
                  <select className="form-input" value={reviewData.rating} onChange={e => setReviewData({...reviewData, rating: Number(e.target.value)})} style={{ borderRadius: '16px' }}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Étoiles</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Votre commentaire</label>
                  <textarea className="form-input" required rows="4" placeholder="Super bon ! Le temps de livraison était respecté..." value={reviewData.comment} onChange={e => setReviewData({...reviewData, comment: e.target.value})} style={{ borderRadius: '16px' }}></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}><FiStar /> Envoyer mon avis</button>
              </form>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
