import { FaWhatsapp } from 'react-icons/fa';

export default function FloatingWhatsApp() {
  const phone = "2250103717078";
  const message = "Bonjour Carmel Délice, j'ai une question concernant le menu ou une commande.";

  return (
    <>
      <a 
        href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        aria-label="Contactez-nous sur WhatsApp"
      >
        <div className="whatsapp-tooltip">Besoin d'aide ? 👋</div>
        <FaWhatsapp />
      </a>

      <style>{`
        .whatsapp-float {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: #25D366;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          z-index: 2500;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
        }

        .whatsapp-float:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }

        .whatsapp-tooltip {
          position: absolute;
          right: 75px;
          background: white;
          color: #333;
          padding: 8px 15px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .whatsapp-float:hover .whatsapp-tooltip {
          opacity: 1;
          visibility: visible;
          right: 70px;
        }

        /* Animation d'appel à l'action */
        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        .whatsapp-float {
          animation: pulse-green 2s infinite;
        }

        @media (max-width: 768px) {
          .whatsapp-float {
            width: 50px;
            height: 50px;
            font-size: 26px;
            bottom: 85px;
            right: 15px;
          }
          .whatsapp-tooltip {
            display: none; /* Cache le texte sur mobile pour ne pas encombrer */
          }
        }
      `}</style>
    </>
  );
}
