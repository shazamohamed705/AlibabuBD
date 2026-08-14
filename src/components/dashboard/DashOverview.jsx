import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

const API = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';

const STATUS_COLORS = {
  Pending:    { color: '#d97706', bg: '#fef3c7' },
  Processing: { color: '#2563eb', bg: '#dbeafe' },
  Shipped:    { color: '#7c3aed', bg: '#ede9fe' },
  Delivered:  { color: '#16a34a', bg: '#dcfce7' },
  Cancelled:  { color: '#dc2626', bg: '#fee2e2' },
};

function formatDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return iso; }
}

export default function DashOverview() {
  const navigate = useNavigate();
  const { user, getAuthToken } = useAuth();
  const { favorites } = useFavorites();
  const [orders, setOrders] = useState([]);
  const [total,  setTotal]  = useState(0);
  const [ready,  setReady]  = useState(false);

  const savedUser = (() => { try { return JSON.parse(localStorage.getItem('aurevia_user') || 'null'); } catch { return null; } })();
  const name = savedUser?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) { setReady(true); return; }
      try {
        const res  = await fetch(`${API}/orders/my-orders?page=1&limit=5`, { headers: { Authorization: `Bearer ${token}` } });
        const json = await res.json();
        setOrders(json?.data?.orders ?? []);
        setTotal(json?.total ?? 0);
      } catch { setOrders([]); }
      finally { setReady(true); }
    };
    load();
  }, [getAuthToken]);

  const stats = [
    {
      label: 'Total Orders', value: ready ? total : '—',
      icon: <span className="ms" style={{ fontSize: '22px', color: '#1d4ed8' }}>shopping_bag</span>,
      color: '#dbeafe', textColor: '#1d4ed8',
    },
    {
      label: 'Wishlist Items', value: favorites?.length ?? 0,
      icon: <span className="ms" style={{ fontSize: '22px', color: '#dc2626' }}>favorite</span>,
      color: '#fee2e2', textColor: '#dc2626',
    },
    {
      label: 'Saved Addresses', value: (() => { try { return JSON.parse(localStorage.getItem('aurevia_addresses') || '[]').length; } catch { return 0; } })(),
      icon: <span className="ms" style={{ fontSize: '22px', color: '#16a34a' }}>location_on</span>,
      color: '#dcfce7', textColor: '#16a34a',
    },
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Welcome */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Welcome back, {name} 👋
        </h2>
        <p style={{ fontFamily: 'Poppins', fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', marginBottom: '10px' }}>
              {s.icon}
            </div>
            <p style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 800, color: s.textColor, margin: '0 0 2px' }}>{s.value}</p>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#6b7280', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontFamily: 'Poppins', fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Recent Orders
          </h3>
          <button onClick={() => navigate('/dashboard?tab=orders')} style={{
            fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#16a34a',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>
            View All →
          </button>
        </div>

        {!ready ? (
          <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1,2,3].map(i => <div key={i} style={{ height: '48px', background: '#f3f4f6', borderRadius: '8px', animation: 'dashPulse 1.4s ease infinite' }} />)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <span className="ms" style={{ fontSize: '48px', color: '#d1d5db', display: 'block', marginBottom: '8px' }}>inbox</span>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>No orders yet</p>
          </div>
        ) : (
          orders.map((o, i) => {
            const st = STATUS_COLORS[o.orderStatus] ?? { color: '#6b7280', bg: '#f3f4f6' };
            return (
              <div key={o._id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '0.85rem 1.25rem',
                borderTop: i > 0 ? '1px solid #f3f4f6' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.7rem', color: '#9ca3af', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {o.items?.map(i => i.name).join(', ')}
                  </p>
                </div>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#6b7280' }}>{formatDate(o.createdAt)}</p>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>{o.totalPrice} LE</p>
                <span style={{ fontFamily: 'Poppins', fontSize: '0.68rem', fontWeight: 600, color: st.color, background: st.bg, padding: '3px 10px', borderRadius: '999px' }}>
                  {o.orderStatus}
                </span>
              </div>
            );
          })
        )}
      </div>
      <style>{`@keyframes dashPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </div>
  );
}
