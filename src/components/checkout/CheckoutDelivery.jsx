import { useState } from 'react';
import { BackBtn, formStyles } from './CheckoutForm';
import { useTheme } from '../../context/ThemeContext';

const options = [
  { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: 'Free', badge: null },
  { id: 'express',  label: 'Express Delivery',  sub: '1–2 business days', price: '50 LE', badge: 'Fast' },
  { id: 'same',     label: 'Same Day (Cairo)',   sub: 'Before 10 PM today', price: '80 LE', badge: 'Today' },
];

export default function CheckoutDelivery({ data, onNext, onBack }) {
  const { dark } = useTheme();
  const [selected, setSelected] = useState(data.delivery || 'standard');

  return (
    <div className={`co-step bg-white rounded-2xl p-6 lg:p-8 ${dark ? 'co-dark' : ''}`}>
      <style>{formStyles}</style>
      <h2 className="font-display text-2xl font-light text-[#1a1612] mb-6"
        style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Delivery Method</h2>

      <div className="flex flex-col gap-3 mb-6">
        {options.map(opt => (
          <label key={opt.id}
            className="flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200"
            style={{
              borderColor: selected === opt.id
                ? (dark ? '#c9a96e' : '#1a1612')
                : (dark ? '#2d2926' : '#e8e2d8'),
              background:  selected === opt.id
                ? (dark ? '#1e1b16' : '#faf9f7')
                : (dark ? '#16140f' : '#fff'),
              boxShadow:   selected === opt.id
                ? (dark ? '0 0 0 1px #c9a96e' : '0 0 0 1px #1a1612')
                : 'none',
            }}
          >
            <div className="flex items-center gap-4">
              <input type="radio" className="accent-[#1a1612] w-4 h-4" name="delivery"
                style={{ accentColor: dark ? '#c9a96e' : undefined }}
                value={opt.id} checked={selected === opt.id} onChange={() => setSelected(opt.id)} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-medium text-[#1a1612]">{opt.label}</p>
                  {opt.badge && (
                    <span className="font-body text-[0.44rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                      style={{ background: '#f0fdf4', color: '#16a34a' }}>{opt.badge}</span>
                  )}
                </div>
                <p className="font-body text-xs font-light text-[#8b7d6b]">{opt.sub}</p>
              </div>
            </div>
            <p className="font-display text-base font-light text-[#1a1612]">{opt.price}</p>
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="co-continue-btn"
          onClick={() => onNext({ delivery: selected })}
        >
          Continue →
        </button>
        <BackBtn onClick={onBack} />
      </div>
    </div>
  );
}
