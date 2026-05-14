import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Auth from './pages/Auth';
import Profil from './pages/Profil';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Histoire from './pages/Histoire';
import Menu from './pages/Menu';
import Commander from './pages/Commander';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import PromotionalBanner from './components/PromotionalBanner';
import { FiHome, FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Toast() {
  const { toast } = useCart();
  return (
    <div className="toast-container">
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  const { cart } = useCart();
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <FiHome /> <span>Accueil</span>
      </Link>
      <Link to="/menu" className={`bottom-nav-item ${location.pathname === '/menu' ? 'active' : ''}`}>
        <FiGrid /> <span>Menu</span>
      </Link>
      <Link to="/commander" className={`bottom-nav-item ${location.pathname === '/commander' ? 'active' : ''}`}>
        <div className="cart-badge-container">
          <FiShoppingBag />
          {totalItems > 0 && <span className="cart-badge-dot">{totalItems}</span>}
        </div>
        <span>Panier</span>
      </Link>
      <Link to="/profil" className={`bottom-nav-item ${location.pathname === '/profil' ? 'active' : ''}`}>
        <FiUser /> <span>Profil</span>
      </Link>
    </nav>
  );
}

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      <ScrollToTop />
      {!isAdmin && (
        <header style={{ position: 'sticky', top: 0, zIndex: 2000 }}>
          <PromotionalBanner />
          <Navbar />
        </header>
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notre-histoire" element={<Histoire />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/commander" element={<Commander />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <BottomNav />}
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
