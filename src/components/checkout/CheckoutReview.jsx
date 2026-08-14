import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { formStyles } from './CheckoutForm';

const API = import.meta.env.VITE_API_BASE_URL || 'https://aurevia-brand.com/api/v1';

const wallets = [
  { id: 'cash_on_delivery', label: 'Cash On Delivery' },
  { id: 'instapay',         label: 'InstaPay'          },
  { id: 'vodafone',         label: 'Vodafone Cash'     },
  { id: 'orange',           label: 'Orange Cash'       },
  { id: 'etisalat',         label: 'Etisalat Cash'     },
  { id: 'wepay',            label: 'WE Pay'            },
];

const paymentMethodMap = {
  cash_on_delivery: 'Cash On Delivery',
  instapay:  'Cash On Delivery',
  vodafone:  'Cash On Delivery',
  orange:    'Cash On Delivery',
  etisalat:  'Cash On Delivery',
  wepay:     'Cash On Delivery',
};

export default function CheckoutReview({ data, onBack }) {
  const { items, total, clearCart } = useCart();
  const navigate         = useNavigate();
  const { dark }         = useTheme();
  const { getAuthToken } = useAuth();

  const [couponCode,   setCouponCode]   = useState('');
  const [couponData,   setCouponData]   = useState(null);  // validated coupon
  const [couponErr,    setCouponErr]    = useState('');
  const [couponLoading,setCouponLoading]= useState(false);

  const [placing, setPlacing] = useState(false);
  const [done,    setDone]    = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error,   setError]   = useState('');

  // ─── Coupon discount ────────────────────────────────────────────────────────
  // API may return coupon data in different shapes — handle both
  const couponDiscount     = couponData?.discount     ?? couponData?.discountValue  ?? 0;
  const couponDiscountType = couponData?.discountType ?? couponData?.type ?? 'fixed';
  const discountAmt = couponDiscountType === 'percentage'
    ? Math.round(total * couponDiscount / 100)
    : Number(couponDiscount);
  const finalTotal = Math.max(0, total - discountAmt);

  // ─── Validate coupon ────────────────────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!total || total === 0) {
      setCouponErr('Cart is empty. Add items first.');
      return;
    }
    setCouponLoading(true);
    setCouponErr('');
    setCouponData(null);
    try {
      const token = getAuthToken();
      const res   = await fetch(`${API}/coupons/validate`, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code: couponCode.trim(), cartTotal: total }),
      });
      const json = await res.json();
      if (res.ok && (json?.data || json?.status === 'success')) {
        setCouponData(json.data ?? json);
      } else {
        setCouponErr(json?.message || json?.error || 'Invalid coupon code.');
      }
    } catch {
      setCouponErr('Could not validate coupon. Try again.');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponCode('');
    setCouponErr('');
  };

  // ─── Place order ────────────────────────────────────────────────────────────
  const placeOrder = async () => {
    setPlacing(true);
    setError('');
    const token = getAuthToken();

    const shippingAddress = {
      fullName: data.fullName     || '',
      phone:    data.phone        || '',
      street:   data.streetAddress || '',
      city:     data.city         || '',
      country:  'Egypt',
    };

    // Save address to localStorage for DashAddresses
    try {
      const saved = JSON.parse(localStorage.getItem('aurevia_addresses') || '[]');
      const exists = saved.some(a => a.street === shippingAddress.street && a.phone === shippingAddress.phone);
      if (!exists) {
        const newAddr = {
          id: Date.now(), label: 'Home',
          name: shippingAddress.fullName, line1: shippingAddress.street,
          city: shippingAddress.city, country: shippingAddress.country,
          phone: shippingAddress.phone, default: saved.length === 0,
        };
        localStorage.setItem('aurevia_addresses', JSON.stringify([...saved, newAddr]));
      }
    } catch { /* noop */ }

    const orderPayload = {
      items: items.map(i => ({
        product:    i.key,
        name:       i.product.name,
        coverImage: i.product.img || '',
        price:      i.product.price,
        quantity:   i.qty,
      })),
      shippingAddress,
      paymentMethod: paymentMethodMap[data.paymentMethod] || 'Cash On Delivery',
      discount:      discountAmt,
      shippingCost:  0,
      coupon:        couponData ? couponCode.trim() : null,
    };

    if (token) {
      try {
        const res  = await fetch(`${API}/orders`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body:    JSON.stringify(orderPayload),
        });
        const json = await res.json();
        if (res.ok && json?.data?.order) {
          setOrderId(json.data.order._id);
          clearCart();
          setDone(true);
        } else {
          setError(json?.message || 'Failed to place order. Please try again.');
        }
      } catch {
        setError('Network error. Please check your connection.');
      }
    } else {
      clearCart();
      setDone(true);
    }
    setPlacing(false);
  };

  // ─── Success screen ──────────────────────────────────────────────────────────
  if (done) return (
    <div className={`co-step bg-white rounded-2xl p-10 text-center flex flex-col items-center gap-5 ${dark ? 'co-dark' : ''}`}>
      <style>{formStyles}</style>
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: dark ? '#1e1b16' : '#f0fdf4' }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="12" stroke="#16a34a" strokeWidth="1.5"/>
          <path d="M8 14l4 4 8-9" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div>
        <h2 className="font-display text-2xl font-light mb-2"
          style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Order Confirmed!</h2>
        <p className="font-body text-sm font-light text-[#8b7d6b]">
          Thank you for your order. You'll receive a confirmation shortly.
        </p>
        {orderId && (
          <p className="font-body text-[0.52rem] tracking-widest uppercase text-[#c9a96e] mt-2">
            Order #{orderId.slice(-8).toUpperCase()}
          </p>
        )}
      </div>
      <button onClick={() => navigate('/dashboard?tab=orders')} className="co-continue-btn" style={{ maxWidth: '280px' }}>
        View My Orders
      </button>
    </div>
  );

  // ─── Review form ─────────────────────────────────────────────────────────────
  return (
    <div className={`co-step bg-white rounded-2xl p-6 lg:p-8 ${dark ? 'co-dark' : ''}`}>
      <style>{`
        ${formStyles}
        .review-section-label {
          font-family:'Montserrat',sans-serif; font-size:0.46rem;
          letter-spacing:0.25em; text-transform:uppercase; color:#c9a96e; margin-bottom:0.4rem;
        }
        .review-box {
          border:1px solid #e8e2d8; border-radius:16px;
          padding:1rem 1.25rem; margin-bottom:0.75rem;
        }
        .coupon-input {
          flex:1; border:none; outline:none;
          font-family:'Montserrat',sans-serif; font-size:0.76rem;
          color:#1a1612; background:transparent;
        }
        .coupon-input::placeholder { color:rgba(26,22,18,0.3); }
        .apply-btn {
          background:#1a1612; color:#faf7f2; border:none; border-radius:999px;
          padding:0.5rem 1.2rem; font-family:'Montserrat',sans-serif;
          font-size:0.52rem; font-weight:600; letter-spacing:0.18em;
          text-transform:uppercase; cursor:pointer; transition:background 0.3s ease;
          white-space:nowrap;
        }
        .apply-btn:hover { background:#2d2520; }
        .apply-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .order-row {
          display:flex; justify-content:space-between;
          font-family:'Montserrat',sans-serif; font-size:0.72rem;
          color:#1a1612; padding:0.3rem 0;
        }
        .order-row.muted { color:#8b7d6b; }
        .checkout-actions { display:flex; align-items:center; gap:1rem; margin-top:1.5rem; }
        .place-btn {
          flex:1; background:#1a1612; color:#faf7f2; border:none;
          border-radius:999px; padding:0.95rem 1rem;
          font-family:'Montserrat',sans-serif; font-size:0.6rem;
          font-weight:600; letter-spacing:0.25em; text-transform:uppercase;
          cursor:pointer; transition:background 0.3s ease;
        }
        .place-btn:hover { background:#2d2520; }
        .place-btn:disabled { opacity:0.65; cursor:not-allowed; }
        .back-pill {
          font-family:'Montserrat',sans-serif; font-size:0.55rem;
          letter-spacing:0.15em; text-transform:uppercase; color:#8b7d6b;
          cursor:pointer; background:none; border:none; white-space:nowrap;
          transition:color 0.2s ease;
        }
        .back-pill:hover { color:#1a1612; }
        .co-dark .review-box { border-color:#2d2926; }
        .co-dark .order-row { color:#faf7f2; }
        .co-dark .order-row.muted { color:#a09080; }
        .co-dark .apply-btn { background:#c9a96e; color:#1a1612; }
        .co-dark .apply-btn:hover { background:#e8d5b0; }
        .co-dark .place-btn { background:#c9a96e; color:#1a1612; }
        .co-dark .place-btn:hover { background:#e8d5b0; }
        .co-dark .back-pill { color:#a09080; }
        .co-dark .back-pill:hover { color:#c9a96e; }
        .co-dark .coupon-input { color:#faf7f2; }
      `}</style>

      <h2 className="font-display text-2xl font-light mb-6"
        style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Review Your Order</h2>

      {/* Shipping address */}
      <div className="review-box">
        <p className="review-section-label">Shipping Address</p>
        <p className="font-body text-sm font-light" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
          {data.fullName}
        </p>
        {data.streetAddress && (
          <p className="font-body text-xs mt-0.5" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
            {data.streetAddress}, {data.city}
          </p>
        )}
        {data.phone && (
          <p className="font-body text-xs" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>{data.phone}</p>
        )}
      </div>

      {/* Payment method */}
      <div className="review-box">
        <p className="review-section-label">Payment Method</p>
        <p className="font-body text-sm font-light" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
          {wallets.find(w => w.id === data.paymentMethod)?.label || 'Cash On Delivery'}
        </p>
      </div>

      {/* Coupon */}
      <div className="review-box">
        <p className="review-section-label">Coupon Code</p>

        {couponData ? (
          /* Applied state */
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-2">
              <span className="font-body text-xs font-semibold text-[#16a34a]">✓ {couponCode.toUpperCase()}</span>
              <span className="font-body text-xs" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
                — {couponDiscountType === 'percentage' ? `${couponDiscount}% off` : `${couponDiscount} LE off`}
              </span>
            </div>
            <button onClick={removeCoupon}
              className="font-body text-[0.5rem] tracking-widest uppercase text-[#c9a96e] hover:text-red-500 transition-colors">
              Remove
            </button>
          </div>
        ) : (
          /* Input state */
          <div className="flex items-center gap-3 mt-1">
            <input
              className="coupon-input"
              placeholder="Enter coupon code..."
              value={couponCode}
              onChange={e => { setCouponCode(e.target.value); setCouponErr(''); }}
              onKeyDown={e => e.key === 'Enter' && applyCoupon()}
            />
            <button className="apply-btn" type="button"
              onClick={applyCoupon} disabled={couponLoading}>
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
        )}

        {couponErr && (
          <p className="font-body text-[0.52rem] text-red-500 mt-1">{couponErr}</p>
        )}
      </div>

      {/* Price summary */}
      <div className="review-box">
        <div className="order-row muted">
          <span>Subtotal</span>
          <span>EGP {total}</span>
        </div>
        {discountAmt > 0 && (
          <div className="order-row" style={{ color: '#16a34a' }}>
            <span>Discount ({couponCode.toUpperCase()})</span>
            <span>− EGP {discountAmt}</span>
          </div>
        )}
        <div className="h-px my-2" style={{ background: dark ? '#2d2926' : '#f0eeeb' }} />
        <div className="flex items-center justify-between">
          <p className="font-display text-lg font-light" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Total</p>
          <p className="font-display" style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 300, color: dark ? '#faf7f2' : '#1a1612' }}>
            EGP {finalTotal}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 mb-2 font-body text-xs text-red-600"
          style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="checkout-actions">
        <button className="back-pill" onClick={onBack}>← Back</button>
        <button className="place-btn" onClick={placeOrder} disabled={placing}>
          {placing ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
