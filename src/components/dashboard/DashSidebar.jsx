import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6"/></svg>,
  },
  {
    id: 'orders', label: 'My Orders',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.6"/></svg>,
  },
  {
    id: 'wishlist', label: 'Wishlist',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'addresses', label: 'Addresses',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/></svg>,
  },
  {
    id: 'settings', label: 'Settings',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
];

export default function DashSidebar({ active, setActive }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem('aurevia_user') || 'null'); } catch { return null; }
  })();

  return (
    <aside style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' }}>

      {/* User info */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid #f3f4f6', background: '#f0fdf4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#16a34a', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 700, flexShrink: 0,
          }}>
            {(savedUser?.name || savedUser?.email || 'U')[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {savedUser?.name || 'User'}
            </p>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.68rem', color: '#6b7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {savedUser?.email || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ padding: '0.5rem' }}>
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => setActive(item.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '0.7rem 0.85rem', borderRadius: '10px', border: 'none',
              background: isActive ? '#f0fdf4' : 'transparent',
              color: isActive ? '#16a34a' : '#374151',
              cursor: 'pointer', textAlign: 'left',
              fontFamily: 'Poppins', fontSize: '0.83rem', fontWeight: isActive ? 600 : 500,
              transition: 'all 0.15s',
              borderLeft: isActive ? '3px solid #16a34a' : '3px solid transparent',
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f9fafb'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; } }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.5rem', borderTop: '1px solid #f3f4f6' }}>
        <button
          onClick={() => { logout(); localStorage.removeItem('aurevia_user'); localStorage.removeItem('aurevia_token'); navigate('/'); }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '0.7rem 0.85rem', borderRadius: '10px', border: 'none',
            background: 'transparent', color: '#ef4444',
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'Poppins', fontSize: '0.83rem', fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
