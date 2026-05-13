import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cart } = useCart();
  const { user, refreshUser } = useAuth();
  
  useEffect(() => {
    if (user) refreshUser();
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/histoire', label: 'Notre Histoire' },
    { to: '/menu', label: 'Menu' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">Carmel <span>Délice</span></Link>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}>
              {l.label}
            </Link>
          ))}
          <Link to={user ? "/profil" : "/auth"} className="nav-link" title="Mon Compte" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiUser size={18} /> 
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontSize: '0.9rem' }}>{user ? user.name.split(' ')[0] : 'Connexion'}</span>
              {user && (
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-400)', fontWeight: 'bold', marginTop: '2px' }}>
                  💎 {user.points || 0} pts
                </span>
              )}
            </div>
          </Link>
          <Link to="/commander" className="nav-link cart-badge" title="Panier">
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="count">{totalItems}</span>}
          </Link>
          <Link to="/commander" className="nav-link nav-cta">Commander</Link>
        </div>
        <button className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
