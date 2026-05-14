import { useAuth } from '../context/AuthContext';
import { FiGift, FiTruck } from 'react-icons/fi';

export default function PromotionalBanner() {
  const { user } = useAuth();
  
  return (
    <div className="promo-banner">
      <div className="promo-track">
        <div className="promo-item">
          <FiTruck /> 🚚 Livraison partout à Abidjan — Commandez avant 18h pour le jour même !
        </div>
        <div className="promo-item">
          <FiGift /> 🎁 Programme Fidélité : Accumulez des points à chaque commande !
        </div>
        {user ? (
          <div className="promo-item promo-loyalty">
            ⭐ Bonjour {user.name} ! Vous avez <strong>{user.points || 0} points</strong>. Plus que {Math.max(0, 1000 - (user.points || 0))} pts pour 1000F de remise !
          </div>
        ) : (
          <div className="promo-item">
            ✨ Connectez-vous pour profiter de -10% sur votre première commande !
          </div>
        )}
        {/* Duplicate for infinite loop */}
        <div className="promo-item">
          <FiTruck /> 🚚 Livraison partout à Abidjan — Commandez avant 18h pour le jour même !
        </div>
        <div className="promo-item">
          <FiGift /> 🎁 Programme Fidélité : Accumulez des points à chaque commande !
        </div>
      </div>

      <style>{`
        .promo-banner {
          background: var(--gold-400);
          color: var(--navy-900);
          padding: 8px 0;
          font-size: 0.85rem;
          font-weight: 600;
          overflow: hidden;
          position: relative;
          z-index: 2000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .promo-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }
        .promo-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 4rem;
        }
        .promo-loyalty {
          color: var(--navy-800);
          background: rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 2px 15px;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (max-width: 768px) {
          .promo-banner { font-size: 0.75rem; }
          .promo-track { animation-duration: 20s; }
        }
      `}</style>
    </div>
  );
}
