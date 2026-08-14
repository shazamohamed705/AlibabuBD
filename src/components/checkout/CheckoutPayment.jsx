import { useState } from 'react';
import { formStyles } from './CheckoutForm';
import { useTheme } from '../../context/ThemeContext';

const wallets = [
  {
    id: 'cash_on_delivery',
    label: 'Cash On Delivery',
    logo: (
      <div className="flex flex-col items-center gap-1">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.3"/>
          <circle cx="12" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
          <line x1="6" y1="9" x2="6" y2="9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="18" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.48rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
          Cash
        </span>
      </div>
    ),
  },
  {
    id: 'instapay',
    label: 'InstaPay',
    logo: (
      <svg viewBox="0 0 80 28" width="72" height="26" fill="none">
        <text x="0" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="18" fill="#6B21E8">i</text>
        <text x="10" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="18" fill="#E8211A">D</text>
        <text x="22" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="18" fill="#E8211A">X</text>
        <text x="36" y="20" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="11" fill="#333">Insta</text>
        <text x="36" y="30" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#333">Pay</text>
      </svg>
    ),
  },
  { id: 'vodafone', label: 'Vodafone Cash', logo: null },
  { id: 'orange',   label: 'Orange Cash',   logo: null },
  { id: 'etisalat', label: 'Etisalat Cash',  logo: null },
  { id: 'wepay',    label: 'WE Pay',         logo: null },
];

const walletInfo = {
  cash_on_delivery: 'Pay with cash when your order is delivered. No prepayment required.',
  instapay:  'You will receive the secure payment instructions after confirming your order. AUREVIA never stores card or wallet credentials.',
  vodafone:  'You will receive a Vodafone Cash payment request on your registered number after confirming your order.',
  orange:    'You will receive an Orange Cash payment request on your registered number after confirming your order.',
  etisalat:  'You will receive an Etisalat Cash payment request on your registered number after confirming your order.',
  wepay:     'You will receive a WE Pay payment request on your registered number after confirming your order.',
};

export default function CheckoutPayment({ data, onNext, onBack }) {
  const { dark } = useTheme();
  const [method, setMethod] = useState(data.paymentMethod || 'cash_on_delivery');

  return (
    <div className={`co-step bg-white rounded-2xl p-6 lg:p-8 ${dark ? 'co-dark' : ''}`}>
      <style>{`
        ${formStyles}
        .wallet-card {
          border: 1.5px solid #e8e2d8;
          border-radius: 16px;
          padding: 0.85rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 64px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          background: #fff;
        }
        .wallet-card.active {
          border-color: #1a1612;
          box-shadow: 0 0 0 1px #1a1612;
          background: #faf9f7;
        }
        .wallet-card:hover { border-color: #c9a96e; }

        .wallet-info {
          background: #faf9f7;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          animation: walletInfoIn 0.35s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes walletInfoIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .checkout-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .back-pill {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8b7d6b;
          cursor: pointer;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s ease;
          white-space: nowrap;
        }
        .back-pill:hover { color: #1a1612; }
        .co-continue-btn-row {
          flex: 1;
          background: #1a1612;
          color: #faf7f2;
          border: none;
          border-radius: 999px;
          padding: 0.95rem 1rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .co-continue-btn-row:hover { background: #2d2520; }

        /* Dark mode */
        .co-dark .wallet-card { border-color: #2d2926; background: #16140f; }
        .co-dark .wallet-card.active { border-color: #c9a96e; background: #1e1b16; box-shadow: 0 0 0 1px #c9a96e; }
        .co-dark .wallet-card:hover { border-color: #c9a96e; }
        .co-dark .wallet-info { background: #1e1b16; }
        .co-dark .co-continue-btn-row { background: #c9a96e; color: #1a1612; }
        .co-dark .co-continue-btn-row:hover { background: #e8d5b0; }
        .co-dark .back-pill { color: #a09080; }
        .co-dark .back-pill:hover { color: #c9a96e; }
      `}</style>

      <h2 className="font-display text-2xl font-light text-[#1a1612] mb-1"
        style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Payment Method</h2>
      <p className="font-body text-[0.52rem] tracking-[0.22em] uppercase text-[#c9a96e] mb-1">Mobile Wallets</p>
      <p className="font-body text-xs font-light text-[#8b7d6b] mb-5">
        Choose your preferred local payment wallet. All transactions are secured and encrypted.
      </p>

      {/* Wallets grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {wallets.map(w => (
          <button key={w.id} type="button"
            className={`wallet-card ${method === w.id ? 'active' : ''}`}
            onClick={() => setMethod(w.id)}
          >
            {w.logo ? (
              w.logo
            ) : (
              <span className="font-body text-[0.6rem] tracking-[0.1em] uppercase font-medium text-[#1a1612] text-center leading-tight">
                {w.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Info box */}
      <div className="wallet-info" key={method}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
          <circle cx="8" cy="8" r="6.5" stroke="#c9a96e" strokeWidth="1.2"/>
          <line x1="8" y1="7" x2="8" y2="11" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="8" cy="5" r="0.6" fill="#c9a96e"/>
        </svg>
        <div>
          <p className="font-body text-[0.5rem] tracking-[0.2em] uppercase font-semibold text-[#1a1612] mb-1">
            {wallets.find(w => w.id === method)?.label} Selected
          </p>
          <p className="font-body text-xs font-light text-[#8b7d6b] leading-relaxed">
            {walletInfo[method]}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="checkout-row">
        <button className="back-pill" onClick={onBack}>
          ← Back
        </button>
        <button className="co-continue-btn-row" onClick={() => onNext({ paymentMethod: method })}>
          Continue →
        </button>
      </div>
    </div>
  );
}
