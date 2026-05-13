import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/histoire" element={<Histoire />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/commander" element={<Commander />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
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
