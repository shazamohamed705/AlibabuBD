import { useState, useEffect } from 'react';
import { useI18n }  from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth }  from '../../context/AuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP = {
  Pending:    { color: '#c9a96e', bg: '#fef9ee', label: 'Pending'    },
  Processing: { color: '#3b82f6', bg: '#eff6ff', label: 'Processing' },
  Shipped:    { color: '#8b5cf6', bg: '#f5f3ff', label: 'Shipped'    },
  Delivered:  { color: '#16a34a', bg: '#f0fdf4', label: 'Delivered'  },
  Cancelled:  { color: '#ef4444', bg: '#fef2f2', label: 'Cancelled'  },
};

function statusStyle(s) {
  return STATUS_MAP[s] ?? { color: '#8b7d6b', bg: '#f6f4f1', label: s };
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return iso; }
}

function toAbsUrl(path) {
  if (!path) return null;
  if (path.includes('localhost')) return path.replace(/https?:\/\/localhost:\d+/, 'https://aurevia-brand.com');
  if (path.startsWith('http')) return path;
  return `https://aurevia-brand.com${path.startsWith('/') ? '' : '/'}${path}`;
}

// ─── Single order row ─────────────────────────────────────────────────────────
function OrderRow({ order, expanded, onToggle, dark }) {
  const c = {
    text:    dark ? '#faf7f2' : '#1a1612',
    muted:   dark ? '#a09080' : '#8b7d6b',
    divider: dark ? '#2a2520' : '#f6f4f1',
    inner:   dark ? '#16140f' : '#faf9f7',
  };
  const st = statusStyle(order.orderStatus);
  const itemNames = order.items.map(i => i.name).join(', ');

  return (
    <>
      {/* Main row */}
      <div
        className="flex flex-wrap items-center gap-4 px-6 py-4 cursor-pointer transition-colors"
        style={{ borderTop: `1px solid ${c.divider}` }}
        onClick={onToggle}
      >
        {/* Order ID + items */}
        <div className="flex-1 min-w-0">
          <p className="font-body text-[0.6rem] font-semibold tracking-wide" style={{ color: c.text }}>
            #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="font-body text-[0.52rem] truncate mt-0.5" style={{ color: c.muted }}>
            {itemNames}
          </p>
        </div>

        {/* Date */}
        <p className="font-body text-[0.52rem] hidden sm:block flex-shrink-0" style={{ color: c.muted }}>
          {formatDate(order.createdAt)}
        </p>

        {/* Total */}
        <p className="font-display text-base font-light flex-shrink-0" style={{ color: c.text }}>
          {order.totalPrice} LE
        </p>

        {/* Status badge */}
        <span className="font-body text-[0.46rem] tracking-[0.18em] uppercase px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ color: st.color, background: st.bg }}>
          {st.label}
        </span>

        {/* Expand arrow */}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', color: c.muted, flexShrink: 0 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-6 pb-5" style={{ background: c.inner, borderTop: `1px solid ${c.divider}` }}>

          {/* Items */}
          <div className="flex flex-col gap-3 pt-4 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {toAbsUrl(item.coverImage) && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[#f6f4f1]">
                    <img src={toAbsUrl(item.coverImage)} alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-body text-xs font-medium" style={{ color: c.text }}>{item.name}</p>
                  <p className="font-body text-[0.5rem]" style={{ color: c.muted }}>
                    Qty: {item.quantity} · {item.price} LE each
                  </p>
                </div>
                <p className="font-body text-xs" style={{ color: c.text }}>
                  {item.price * item.quantity} LE
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-3" style={{ background: c.divider }} />

          {/* Address + payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[0.52rem]">
            <div>
              <p className="font-body tracking-[0.2em] uppercase mb-1" style={{ color: '#c9a96e', fontSize: '0.44rem' }}>
                Shipping Address
              </p>
              <p className="font-body font-light leading-relaxed" style={{ color: c.muted }}>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.street}<br />
                {order.shippingAddress.city}, {order.shippingAddress.country}<br />
                {order.shippingAddress.phone}
              </p>
            </div>
            <div>
              <p className="font-body tracking-[0.2em] uppercase mb-1" style={{ color: '#c9a96e', fontSize: '0.44rem' }}>
                Payment
              </p>
              <p className="font-body font-light" style={{ color: c.muted }}>{order.paymentMethod}</p>
              <p className="font-body font-light mt-0.5" style={{ color: c.muted }}>
                Status: {order.paymentStatus}
              </p>

              <div className="mt-3 flex flex-col gap-0.5">
                <div className="flex justify-between">
                  <span style={{ color: c.muted }}>Subtotal</span>
                  <span style={{ color: c.text }}>{order.subtotal} LE</span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: c.muted }}>Shipping</span>
                    <span style={{ color: c.text }}>{order.shippingCost} LE</span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: c.muted }}>Discount</span>
                    <span style={{ color: '#16a34a' }}>-{order.discount} LE</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold mt-1 pt-1" style={{ borderTop: `1px solid ${c.divider}` }}>
                  <span style={{ color: c.text }}>Total</span>
                  <span style={{ color: c.text }}>{order.totalPrice} LE</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DashOrders() {
  const { t }            = useI18n();
  const { dark }         = useTheme();
  const { getAuthToken } = useAuth();

  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [expanded, setExpanded] = useState(null);   // expanded order _id
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const LIMIT = 10;

  const c = {
    bg:     '#ffffff',
    border: '#e5e7eb',
    text:   '#111827',
    muted:  '#6b7280',
  };

  useEffect(() => {
    const load = async () => {
      const token = getAuthToken();
      if (!token) { setLoading(false); return; }
      setLoading(true);
      try {
        const res  = await fetch(`${API}/orders/my-orders?page=${page}&limit=${LIMIT}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        setOrders(json?.data?.orders ?? []);
        setTotal(json?.total ?? 0);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, getAuthToken]);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div style={{ animation: 'dashFade 0.5s ease both' }}>
      <style>{`@keyframes dashFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-light" style={{ color: c.text, fontFamily: 'Poppins', fontWeight: 700 }}>
          {t('dashboard.myOrders')}
          <span className="font-body text-sm font-light ml-2" style={{ color: c.muted }}>({total})</span>
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1,2,3].map(i => (
            <div className="h-16 rounded-2xl animate-pulse"
              style={{ background: '#f3f4f6' }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="12" width="32" height="28" rx="3" stroke={c.muted} strokeWidth="1.3"/>
            <path d="M16 12V10a8 8 0 0116 0v2" stroke={c.muted} strokeWidth="1.3"/>
            <line x1="18" y1="24" x2="30" y2="24" stroke={c.muted} strokeWidth="1.3" strokeLinecap="round"/>
            <line x1="18" y1="30" x2="26" y2="30" stroke={c.muted} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <p className="font-display text-xl font-light" style={{ color: c.muted }}>
            {t('dashboard.noOrders')}
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <>
          <div className="rounded-2xl overflow-hidden" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            {/* Table header */}
            <div className="flex items-center gap-4 px-6 py-3"
              style={{ background: '#f9fafb', borderBottom: `1px solid ${c.border}` }}>
              <p className="flex-1 font-body text-[0.46rem] tracking-[0.22em] uppercase" style={{ color: c.muted }}>Order</p>
              <p className="font-body text-[0.46rem] tracking-[0.22em] uppercase hidden sm:block" style={{ color: c.muted }}>Date</p>
              <p className="font-body text-[0.46rem] tracking-[0.22em] uppercase" style={{ color: c.muted }}>Total</p>
              <p className="font-body text-[0.46rem] tracking-[0.22em] uppercase" style={{ color: c.muted }}>Status</p>
              <div className="w-3" />
            </div>

            {orders.map(order => (
              <OrderRow
                key={order._id}
                order={order}
                expanded={expanded === order._id}
                onToggle={() => toggle(order._id)}
                dark={dark}
              />
            ))}
          </div>

          {/* Pagination */}
          {total > LIMIT && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="font-body text-[0.52rem] tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-colors disabled:opacity-40"
                style={{ color: '#6b7280', borderColor: '#e5e7eb', fontFamily: 'Poppins' }}
              >
                ← Prev
              </button>
              <span className="font-body text-[0.52rem]" style={{ color: c.muted }}>
                Page {page} of {Math.ceil(total / LIMIT)}
              </span>
              <button
                disabled={page >= Math.ceil(total / LIMIT)}
                onClick={() => setPage(p => p + 1)}
                className="font-body text-[0.52rem] tracking-[0.15em] uppercase px-4 py-2 rounded-full border transition-colors disabled:opacity-40"
                style={{ color: '#6b7280', borderColor: '#e5e7eb', fontFamily: 'Poppins' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
