import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiPhone } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" style={{ fontSize: '1.8rem' }}>
              Carmel <span>Délice</span>
            </Link>
            <p>Street food & canapés chauds artisanaux. Livraison partout à Abidjan. Suivez-nous sur nos réseaux pour ne rien manquer !</p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://www.instagram.com/carmel_delice_/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://www.tiktok.com/@carmel.delice" target="_blank" rel="noreferrer" className="social-link" aria-label="TikTok"><FaTiktok /></a>
              <a href="tel:+2250103717078" className="social-link" aria-label="Téléphone"><FiPhone /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/notre-histoire">Notre Histoire</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Horaires</h4>
            <ul>
              <li><span>Lundi – Dimanche</span></li>
              <li><span>08h30 – 20h30</span></li>
              <li><span style={{ color: 'var(--gold-400)' }}>Ouvert tous les jours</span></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+2250103717078">+225 01 03 71 70 78</a></li>
              <li><a href="mailto:carmeldelice7@gmail.com">carmeldelice7@gmail.com</a></li>
              <li><span>Port Bouet, Gonzagueville</span></li>
              <li><a href="https://wa.me/2250103717078" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-400)' }}>💬 WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Carmel Délice — Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
