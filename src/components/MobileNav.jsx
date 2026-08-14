import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const navItems = [
  {
    label: 'Home',
    href: '/',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9,22 9,12 15,12 15,22"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Shop',
    href: '/shop',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          fill={active ? 'rgba(22,163,74,0.1)' : 'none'}/>
        <line x1="3" y1="6" x2="21" y2="6" stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M16 10a4 4 0 01-8 0" stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Cart',
    href: null,
    icon: (active, count) => (
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="21" r="1" fill={active ? '#16a34a' : '#6b7280'}/>
          <circle cx="20" cy="21" r="1" fill={active ? '#16a34a' : '#6b7280'}/>
          <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.69L23 6H6"
            stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {count > 0 && (
          <span style={{
            position: 'absolute', top: '-6px', right: '-6px',
            width: '17px', height: '17px', borderRadius: '50%',
            background: '#dc2626', color: '#fff',
            fontSize: '0.55rem', fontWeight: 700, fontFamily: 'Poppins',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{count}</span>
        )}
      </div>
    ),
  },
  {
    label: 'Favorites',
    href: '/favorites',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill={active ? '#16a34a' : 'none'}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Account',
    href: '/dashboard',
    icon: (active) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4"
          stroke={active ? '#16a34a' : '#6b7280'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function MobileNav() {
  const location = useLocation();
  const { setIsOpen, count } = useCart();

  return (
    <>
      <style>{`
        .mob-nav-bar {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          width: 100%;
          box-sizing: border-box;
          z-index: 60;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid #e5e7eb;
          padding: 10px 0 0;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
          box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
          min-height: 65px;
        }
        @media (max-width: 1023px) {
          .mob-nav-bar { display: flex; }
          .mob-nav-spacer { display: block; }
        }
        .mob-nav-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          padding: 8px 4px;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .mob-nav-item:active { transform: scale(0.9); }
        .mob-nav-label {
          font-family: 'Poppins', sans-serif;
          font-size: 0.65rem;
          font-weight: 600;
          line-height: 1;
        }
      `}</style>

      <nav className="mob-nav-bar">
        {navItems.map((item) => {
          const isActive = item.href && location.pathname === item.href;
          const color = isActive ? '#16a34a' : '#6b7280';

          if (item.label === 'Cart') {
            return (
              <button
                key="cart"
                className="mob-nav-item"
                onClick={() => setIsOpen(true)}
              >
                {item.icon(false, count)}
                <span className="mob-nav-label" style={{ color }}>Cart</span>
              </button>
            );
          }

          return (
            <Link key={item.href} to={item.href} className="mob-nav-item">
              {item.icon(isActive)}
              <span className="mob-nav-label" style={{ color }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer to prevent content hidden behind nav — mobile only */}
      <style>{`.mob-nav-spacer { display: none; } @media (max-width: 1023px) { .mob-nav-spacer { display: block; } }`}</style>
      <div className="mob-nav-spacer" style={{ height: '65px' }} />
    </>
  );
}
