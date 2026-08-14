import { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

const getSavedUser = () => {
  try { return JSON.parse(localStorage.getItem('aurevia_user') || 'null'); } catch { return null; }
};

const loadAddresses = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('aurevia_addresses') || 'null');
    if (saved) return saved;
    // fallback: pull from user object if backend provides them
    const user = getSavedUser();
    return user?.addresses || [];
  } catch { return []; }
};

const saveAddresses = (addresses) => {
  try { localStorage.setItem('aurevia_addresses', JSON.stringify(addresses)); } catch { /* noop */ }
};

function AddressCard({ addr, onDelete, onSetDefault, dark }) {
  const { t } = useI18n();
  const c = {
    card:  dark ? '#1a1612' : '#ffffff',
    border: dark ? '#2d2926' : '#ede8e0',
    label: dark ? '#faf7f2' : '#1a1612',
    body:  dark ? '#a09080' : '#5a5048',
    muted: dark ? '#a09080' : '#8b7d6b',
    actionBorder: dark ? '#2d2926' : '#f0eeeb',
    hoverText: dark ? '#c9a96e' : '#1a1612',
  };

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-3 relative" style={{ background: c.card, border: `1px solid ${c.border}` }}>
      {/* Label + default badge */}
      <div className="flex items-center gap-2">
        <span className="font-body text-[0.52rem] tracking-[0.22em] uppercase font-semibold" style={{ color: c.label }}>
          {addr.label}
        </span>
        {addr.default && (
          <span className="font-body text-[0.44rem] tracking-[0.18em] uppercase px-2 py-0.5 rounded-full"
            style={{ background: dark ? 'rgba(22,163,74,0.15)' : '#f0fdf4', color: '#16a34a' }}>
            {t('dashboard.addressDefault')}
          </span>
        )}
      </div>

      {/* Address details */}
      <div className="font-body text-xs font-light leading-relaxed" style={{ color: c.body }}>
        <p>{addr.name}</p>
        <p>{addr.line1}</p>
        <p>{addr.city}, {addr.country}</p>
        <p className="mt-1" style={{ color: c.muted }}>{addr.phone}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2" style={{ borderTop: `1px solid ${c.actionBorder}` }}>
        {!addr.default && (
          <button onClick={() => onSetDefault(addr.id)}
            className="font-body text-[0.5rem] tracking-[0.15em] uppercase transition-colors"
            style={{ color: c.muted }}
            onMouseEnter={e => e.currentTarget.style.color = c.hoverText}
            onMouseLeave={e => e.currentTarget.style.color = c.muted}>
            {t('dashboard.setAsDefault')}
          </button>
        )}
        <button onClick={() => onDelete(addr.id)}
          className="font-body text-[0.5rem] tracking-[0.15em] uppercase transition-colors ml-auto"
          style={{ color: '#c9a96e' }}
          onMouseEnter={e => e.currentTarget.style.color = c.hoverText}
          onMouseLeave={e => e.currentTarget.style.color = '#c9a96e'}>
          {t('dashboard.removeAddress')}
        </button>
      </div>
    </div>
  );
}

export default function DashAddresses() {
  const { t }    = useI18n();
  const { dark } = useTheme();
  const [addresses, setAddresses] = useState(loadAddresses);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ label: '', name: '', line1: '', city: '', country: '', phone: '' });

  const updateAddresses = (next) => { setAddresses(next); saveAddresses(next); };

  const handleDelete   = (id) => updateAddresses(addresses.filter(a => a.id !== id));
  const handleDefault  = (id) => updateAddresses(addresses.map(a => ({ ...a, default: a.id === id })));
  const handleAdd      = (e) => {
    e.preventDefault();
    const newAddr = { ...form, id: Date.now(), default: addresses.length === 0 };
    updateAddresses([...addresses, newAddr]);
    setForm({ label: '', name: '', line1: '', city: '', country: '', phone: '' });
    setShowForm(false);
  };

  return (
    <div style={{ animation: 'dashFade 0.5s ease both' }}>
      <style>{`
        @keyframes dashFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .addr-input {
          width:100%; border:1.5px solid ${dark ? '#2d2926' : '#e8e2d8'}; border-radius:12px;
          padding:0.75rem 1rem; font-family:'Montserrat',sans-serif;
          font-size:0.76rem; color:${dark ? '#faf7f2' : '#1a1612'}; background:${dark ? '#1a1612' : 'transparent'}; outline:none;
          transition:border-color 0.3s ease;
        }
        .addr-input:focus { border-color:#c9a96e; }
        .addr-submit {
          background:${dark ? '#c9a96e' : '#1a1612'}; color:${dark ? '#1a1612' : '#faf7f2'}; border:none; border-radius:999px;
          padding:0.8rem 2rem; font-family:'Montserrat',sans-serif;
          font-size:0.58rem; font-weight:600; letter-spacing:0.22em;
          text-transform:uppercase; cursor:pointer; transition:background 0.3s ease;
        }
        .addr-submit:hover { background:${dark ? '#e8c885' : '#2d2520'}; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-light" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
          {t('dashboard.addresses')} <span className="font-body text-sm font-light text-[#8b7d6b]">({addresses.length})</span>
        </h2>
        <button
          onClick={() => setShowForm(v => !v)}
          className="font-body text-[0.52rem] tracking-[0.2em] uppercase text-[#c9a96e] flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          {showForm ? t('dashboard.cancel') : t('dashboard.addAddress')}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd}
          className="rounded-2xl border p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ background: dark ? '#1a1612' : '#ffffff', borderColor: dark ? '#2d2926' : '#ede8e0' }}>
          {[
            { key: 'label',   label: t('dashboard.labelField'),   type: 'text' },
            { key: 'name',    label: t('dashboard.fullName'),     type: 'text' },
            { key: 'line1',   label: t('dashboard.streetAddress'), type: 'text' },
            { key: 'city',    label: t('dashboard.city'),         type: 'text' },
            { key: 'country', label: t('dashboard.country'),      type: 'text' },
            { key: 'phone',   label: t('dashboard.phone'),        type: 'tel'  },
          ].map(f => (
            <div key={f.key}>
              <label className="block font-body text-[0.48rem] tracking-[0.22em] uppercase text-[#8b7d6b] mb-1.5">
                {f.label}
              </label>
              <input type={f.type} required className="addr-input"
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <button type="submit" className="addr-submit">{t('dashboard.saveAddress')}</button>
          </div>
        </form>
      )}

      {/* Address cards */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map(addr => (
            <AddressCard key={addr.id} addr={addr} onDelete={handleDelete} onSetDefault={handleDefault} dark={dark} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="font-display text-xl font-light text-[#8b7d6b]">{t('dashboard.noAddresses')}</p>
        </div>
      )}
    </div>
  );
}
