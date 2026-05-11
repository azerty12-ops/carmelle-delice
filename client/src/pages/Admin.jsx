import { useState, useEffect } from 'react';
import { FiLock, FiLogOut, FiPackage, FiClock, FiCheckCircle, FiTruck, FiDollarSign, FiTrash2, FiChevronDown, FiUsers, FiTrendingUp, FiBarChart2, FiXCircle, FiTag, FiPlus, FiMessageCircle } from 'react-icons/fi';
import { getOrders, updateOrderStatus, deleteOrder, getOrderStats, getPromos, createPromo, deletePromo } from '../api/api';

const ADMIN_PASSWORD = '77002602KO';

const statusConfig = {
  pending: { label: 'En attente', color: '#f59e0b', icon: <FiClock size={14} /> },
  confirmed: { label: 'Confirmée', color: '#3b82f6', icon: <FiCheckCircle size={14} /> },
  preparing: { label: 'En préparation', color: '#8b5cf6', icon: <FiPackage size={14} /> },
  delivered: { label: 'Livrée', color: '#10b981', icon: <FiTruck size={14} /> },
  cancelled: { label: 'Annulée', color: '#ef4444', icon: <FiXCircle size={14} /> },
};

const statusFlow = ['pending', 'confirmed', 'preparing', 'delivered', 'cancelled'];

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [promos, setPromos] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');

  // Promo form state
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');

  const login = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPasswordError('');
      sessionStorage.setItem('admin_auth', 'true');
    } else {
      setPasswordError('Mot de passe incorrect');
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersRes = await getOrders();
      setOrders(ordersRes.data.orders || []);
    } catch { setOrders([]); }
    try {
      const statsRes = await getOrderStats();
      setStats(statsRes.data.stats || null);
    } catch { setStats(null); }
    try {
      const promosRes = await getPromos();
      setPromos(promosRes.data || []);
    } catch { setPromos([]); }
    setLoading(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      try { const s = await getOrderStats(); setStats(s.data.stats || null); } catch {}
    } catch {}
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm('Supprimer cette commande définitivement ?')) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o._id !== orderId));
      try { const s = await getOrderStats(); setStats(s.data.stats || null); } catch {}
    } catch {}
  };

  const handleCreatePromo = async (e) => {
    e.preventDefault();
    try {
      await createPromo({ code: newPromoCode, discountPercentage: Number(newPromoDiscount) });
      setNewPromoCode('');
      setNewPromoDiscount('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Supprimer ce code promo ?')) return;
    try {
      await deletePromo(id);
      setPromos(prev => prev.filter(p => p._id !== id));
    } catch {}
  };

  const logout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };

  const filteredOrders = (filter === 'all' ? orders : orders.filter(o => o.status === filter))
    .filter(o => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return o.customerName?.toLowerCase().includes(q) || o.customerPhone?.includes(q) || o.orderNumber?.toLowerCase().includes(q);
    });

  const getWhatsAppLink = (order) => {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const message = `Bonjour ${order.customerName},\nVotre commande ${order.orderNumber || ''} de chez Carmel Délice est désormais : *${statusConfig[order.status].label}*.\nMerci pour votre confiance !`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  if (!authenticated) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon"><FiLock size={32} /></div>
            <h1>Carmel <span className="text-gold">Délice</span></h1>
            <p>Espace Administrateur</p>
          </div>
          <form onSubmit={login}>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input type="password" className="form-input" required placeholder="Entrez le mot de passe"
                value={password} onChange={e => { setPassword(e.target.value); setPasswordError(''); }} />
              {passwordError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{passwordError}</p>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              <FiLock /> Se Connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <span>Carmel</span> <span className="text-gold">Délice</span>
        </div>
        <nav className="admin-sidebar-nav">
          <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <FiPackage size={18} /> Commandes
            {stats?.pending > 0 && <span className="admin-nav-badge">{stats.pending}</span>}
          </button>
          <button className={`admin-nav-item ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
            <FiUsers size={18} /> Clients
          </button>
          <button className={`admin-nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <FiBarChart2 size={18} /> Analyse
          </button>
          <button className={`admin-nav-item ${activeTab === 'marketing' ? 'active' : ''}`} onClick={() => setActiveTab('marketing')}>
            <FiTag size={18} /> Marketing (Promos)
          </button>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={fetchData} className="admin-nav-item">🔄 Actualiser</button>
          <button onClick={logout} className="admin-nav-item admin-logout"><FiLogOut size={18} /> Déconnexion</button>
        </div>
      </aside>

      <main className="admin-main">
        {stats && (
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(212,168,67,0.15)', color: 'var(--gold-400)' }}><FiPackage size={22} /></div>
              <div><div className="stat-number">{stats.total}</div><div className="stat-label">Total</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}><FiClock size={22} /></div>
              <div><div className="stat-number">{stats.pending}</div><div className="stat-label">En attente</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}><FiPackage size={22} /></div>
              <div><div className="stat-number">{stats.preparing}</div><div className="stat-label">Préparation</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><FiTruck size={22} /></div>
              <div><div className="stat-number">{stats.delivered}</div><div className="stat-label">Livrées</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(212,168,67,0.15)', color: 'var(--gold-400)' }}><FiDollarSign size={22} /></div>
              <div><div className="stat-number">{stats.revenue.toLocaleString()} F</div><div className="stat-label">Revenus</div></div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            <div className="admin-toolbar">
              <div className="admin-filters">
                {[{ key: 'all', label: 'Toutes', count: stats?.total },
                  { key: 'pending', label: '⏳ En attente', count: stats?.pending },
                  { key: 'confirmed', label: '✅ Confirmées', count: stats?.confirmed },
                  { key: 'preparing', label: '👨‍🍳 Préparation', count: stats?.preparing },
                  { key: 'delivered', label: '🚚 Livrées', count: stats?.delivered },
                ].map(f => (
                  <button key={f.key} className={`admin-filter-btn ${filter === f.key ? 'active' : ''}`} onClick={() => setFilter(f.key)}>
                    {f.label} {f.count > 0 && <span className="filter-count">{f.count}</span>}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="🔍 Rechercher client, n° commande..." className="admin-search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Chargement...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="admin-empty"><FiPackage size={48} /><p>Aucune commande trouvée</p></div>
            ) : (
              <div className="admin-orders">
                {filteredOrders.map(order => {
                  const cfg = statusConfig[order.status] || statusConfig.pending;
                  const isExpanded = expandedOrder === order._id;
                  return (
                    <div key={order._id} className={`admin-order-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="admin-order-header" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                        <div className="admin-order-left">
                          <span className="admin-order-status" style={{ background: cfg.color + '18', color: cfg.color, borderColor: cfg.color + '40' }}>
                            {cfg.icon} {cfg.label}
                          </span>
                          <div className="admin-order-client">
                            <strong>{order.customerName}</strong>
                            <span>{order.customerPhone}</span>
                          </div>
                        </div>
                        <div className="admin-order-right">
                          {order.orderNumber && <span className="admin-order-num">{order.orderNumber}</span>}
                          <span className="admin-order-total">{order.totalPrice?.toLocaleString()} F</span>
                          <span className="admin-order-date">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <FiChevronDown className={`admin-chevron ${isExpanded ? 'open' : ''}`} />
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="admin-order-details">
                          <div className="admin-details-grid">
                            <div className="admin-order-section">
                              <h4>📦 Articles commandés</h4>
                              {order.items?.map((item, i) => (
                                <div key={i} className="admin-order-item">
                                  <div>
                                    <span className="admin-item-qty">{item.quantity}x</span> {item.name}
                                    {item.desc && <p className="admin-item-desc">{item.desc}</p>}
                                  </div>
                                  <span>{(item.price * item.quantity).toLocaleString()} F</span>
                                </div>
                              ))}
                              {order.discountAmount > 0 && (
                                <div className="admin-order-item" style={{ color: '#10b981' }}>
                                  <span>Réduction ({order.promoCode})</span>
                                  <span>-{order.discountAmount.toLocaleString()} F</span>
                                </div>
                              )}
                              <div className="admin-order-item" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.5rem', fontWeight: 700, color: 'var(--gold-400)' }}>
                                <span>Total Payé</span>
                                <span>{order.totalPrice?.toLocaleString()} F</span>
                              </div>
                            </div>
                            <div className="admin-order-section">
                              <h4>📍 Livraison</h4>
                              <p>{order.customerAddress || 'Non renseignée'}</p>
                              <p style={{ marginTop: '0.5rem', color: 'var(--gold-400)' }}><FiClock /> {order.deliveryDate || "Aujourd'hui"} à {order.deliveryTime || "Dès que possible"}</p>
                              
                              <h4 style={{ marginTop: '1rem' }}>💳 Paiement</h4>
                              <p style={{ color: order.paymentMethod === 'mobile_money' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                                {order.paymentMethod === 'mobile_money' ? 'Mobile Money (Payé)' : 'Paiement à la livraison (Cash)'}
                              </p>

                              {order.notes && <><h4 style={{ marginTop: '1rem' }}>📝 Notes</h4><p>{order.notes}</p></>}
                              <h4 style={{ marginTop: '1rem' }}>📞 Contact</h4>
                              <a href={`tel:${order.customerPhone}`} style={{ color: 'var(--gold-400)' }}>{order.customerPhone}</a>
                            </div>
                          </div>
                          <div className="admin-order-actions">
                            <div className="admin-status-btns">
                              {statusFlow.map(s => (
                                <button key={s} className={`admin-status-btn ${order.status === s ? 'current' : ''}`}
                                  style={{ borderColor: statusConfig[s].color, color: order.status === s ? '#fff' : statusConfig[s].color, background: order.status === s ? statusConfig[s].color : 'transparent' }}
                                  onClick={() => handleStatusChange(order._id, s)}>
                                  {statusConfig[s].icon} {statusConfig[s].label}
                                </button>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <a href={getWhatsAppLink(order)} target="_blank" rel="noreferrer" className="admin-status-btn" style={{ borderColor: '#10b981', color: '#10b981' }}>
                                <FiMessageCircle /> WhatsApp
                              </a>
                              <button className="admin-delete-btn" onClick={() => handleDelete(order._id)}><FiTrash2 /> Supprimer</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && stats?.topCustomers && (
          <div className="admin-customers-tab">
            <h2 className="admin-tab-title"><FiUsers /> Étude des Clients</h2>
            <div className="admin-customers-grid">
              {stats.topCustomers.map((c, i) => (
                <div key={i} className="admin-customer-card">
                  <div className="customer-avatar">{c._id.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div className="customer-info">
                    <strong>{c._id.name}</strong>
                    <span className="customer-phone">{c._id.phone}</span>
                  </div>
                  <div className="customer-stats">
                    <div className="customer-stat">
                      <span className="customer-stat-value">{c.totalOrders}</span>
                      <span className="customer-stat-label">Commandes</span>
                    </div>
                    <div className="customer-stat">
                      <span className="customer-stat-value">{c.totalSpent.toLocaleString()} F</span>
                      <span className="customer-stat-label">Dépensé</span>
                    </div>
                    <div className="customer-stat">
                      <span className="customer-stat-value">{new Date(c.lastOrder).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                      <span className="customer-stat-label">Dernière</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && stats && (
          <div className="admin-analytics-tab">
            <h2 className="admin-tab-title"><FiBarChart2 /> Analyse des Ventes</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3><FiTrendingUp /> Produits les plus vendus</h3>
                {stats.popularItems?.length > 0 ? (
                  <div className="popular-items-list">
                    {stats.popularItems.map((item, i) => (
                      <div key={i} className="popular-item">
                        <div className="popular-rank">#{i + 1}</div>
                        <div className="popular-info">
                          <strong>{item._id}</strong>
                          <span>{item.count} vendus · {item.revenue.toLocaleString()} F</span>
                        </div>
                        <div className="popular-bar-container">
                          <div className="popular-bar" style={{ width: `${(item.count / (stats.popularItems[0]?.count || 1)) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p>Pas encore de données</p>}
              </div>

              <div className="analytics-card">
                <h3><FiBarChart2 /> Commandes (7 derniers jours)</h3>
                {stats.dailyOrders?.length > 0 ? (
                  <div className="daily-chart">
                    {stats.dailyOrders.map((day, i) => {
                      const maxCount = Math.max(...stats.dailyOrders.map(d => d.count));
                      return (
                        <div key={i} className="daily-bar-group">
                          <div className="daily-bar-value">{day.count}</div>
                          <div className="daily-bar" style={{ height: `${(day.count / maxCount) * 120}px` }} />
                          <div className="daily-bar-label">{new Date(day._id).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</div>
                          <div className="daily-bar-revenue">{day.revenue.toLocaleString()} F</div>
                        </div>
                      );
                    })}
                  </div>
                ) : <p>Pas encore de données</p>}
              </div>
            </div>
          </div>
        )}

        {/* MARKETING TAB (PROMOS) */}
        {activeTab === 'marketing' && (
          <div className="admin-marketing-tab">
            <h2 className="admin-tab-title"><FiTag /> Marketing & Fidélisation</h2>
            
            <div className="analytics-grid">
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--gold-400)' }}>Créer un Code Promo</h3>
                <form onSubmit={handleCreatePromo}>
                  <div className="form-group">
                    <label className="form-label">Code (ex: VIP2026)</label>
                    <input type="text" className="form-input" required value={newPromoCode} onChange={e => setNewPromoCode(e.target.value.toUpperCase())} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Réduction (%)</label>
                    <input type="number" min="1" max="100" className="form-input" required value={newPromoDiscount} onChange={e => setNewPromoDiscount(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}><FiPlus /> Créer le Code</button>
                </form>
              </div>

              <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--gold-400)' }}>Codes Actifs</h3>
                {promos.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Aucun code promo créé pour le moment.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {promos.map(promo => (
                      <div key={promo._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1.2rem', color: 'var(--white)', letterSpacing: '1px' }}>{promo.code}</strong>
                          <span style={{ color: '#10b981', fontWeight: 'bold' }}>-{promo.discountPercentage}%</span>
                        </div>
                        <button onClick={() => handleDeletePromo(promo._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}>
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
