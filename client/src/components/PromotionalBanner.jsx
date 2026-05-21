import { FiGift, FiTruck } from 'react-icons/fi';

export default function PromotionalBanner() {
  return (
    <div className="promo-banner">
      <div className="promo-track">
        <div className="promo-item">
          <FiTruck /> 🚚 Livraison partout à Abidjan — Commandez avant 18h pour le jour même !
        </div>
        <div className="promo-item">
          <FiGift /> 🎁 Packs Canapés dès 6 500 F — Box Découverte, Moyenne et VIP !
        </div>
        <div className="promo-item">
          ✨ Contactez-nous sur WhatsApp pour des commandes personnalisées !
        </div>
        {/* Duplicate for infinite loop */}
        <div className="promo-item">
          <FiTruck /> 🚚 Livraison partout à Abidjan — Commandez avant 18h pour le jour même !
        </div>
        <div className="promo-item">
          <FiGift /> 🎁 Packs Canapés dès 6 500 F — Box Découverte, Moyenne et VIP !
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
