import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { useTheme } from '../context/ThemeContext';

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, isOpen, setIsOpen, total, count } = useCart();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { dark } = useTheme();

  return (
    <>
      <style>{`
        /* Backdrop */
        .cart-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(26,22,18,0.45);
          backdrop-filter: blur(3px);
          animation: backdropIn 0.35s ease both;
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Drawer */
        .cart-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 101;
          width: min(420px, 100vw);
          background: #fff;
          display: flex; flex-direction: column;
          animation: drawerIn 0.45s cubic-bezier(.22,1,.36,1) both;
        }
        .cart-drawer.cart-dark { background: #16140f; }
        .cart-drawer.cart-dark { border-left: 1px solid #2d2926; }

        /* Dark scrollbar for items area */
        .cart-dark .cart-scroll { scrollbar-width: thin; scrollbar-color: #2d2926 transparent; }
        .cart-dark .cart-scroll::-webkit-scrollbar { width: 4px; }
        .cart-dark .cart-scroll::-webkit-scrollbar-thumb { background: #2d2926; border-radius: 2px; }

        /* Item hover polish in dark */
        .cart-dark .cart-item {
          border-radius: 12px;
          padding: 10px;
          margin: -10px;
          transition: background 0.25s ease;
        }
        .cart-dark .cart-item:hover { background: rgba(255,255,255,0.03); }

        /* Arabic — bold drawer typography */
        [dir="rtl"] .cart-drawer .font-display,
        [dir="rtl"] .cart-drawer .font-body {
          font-family: 'Cairo', sans-serif;
          font-weight: 700;
        }
        [dir="rtl"] .cart-drawer .font-light { font-weight: 700 !important; }
        [dir="rtl"] .cart-drawer [class*="tracking-"] { letter-spacing: 0 !important; }
        [dir="rtl"] .cart-drawer .qty-btn { font-weight: 700; }
        [dir="rtl"] .cart-drawer .checkout-btn {
          font-family: 'Cairo', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0;
        }
        @keyframes drawerIn {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .cart-drawer.closing {
          animation: drawerOut 0.35s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes drawerOut {
          from { transform: translateX(0); }
          to   { transform: translateX(100%); }
        }

        /* Item */
        .cart-item {
          animation: itemIn 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes itemIn {
          from { opacity:0; transform:translateX(30px); }
          to   { opacity:1; transform:translateX(0); }
        }

        /* Qty btn */
        .qty-btn {
          width:28px; height:28px; border-radius:50%;
          border:1px solid #e8e2d8; background:transparent;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          transition: background 0.2s ease, border-color 0.2s ease;
          font-size: 0.85rem; color: #1a1612;
        }
        .qty-btn:hover { background:#f0eeeb; border-color:#c9a96e; }
        .cart-dark .qty-btn { border-color:#2d2926; color:#faf7f2; }
        .cart-dark .qty-btn:hover { background:#2d2926; border-color:#c9a96e; }

        /* Checkout btn */
        .checkout-btn {
          width:100%; background:#1a1612; color:#faf7f2; border:none;
          border-radius:999px; padding:1rem;
          font-family:'Montserrat',sans-serif; font-size:0.6rem;
          font-weight:600; letter-spacing:0.25em; text-transform:uppercase;
          cursor:pointer; transition:background 0.3s ease, transform 0.2s ease;
        }
        .checkout-btn:hover { background:#2d2520; transform:scale(1.01); }
        .cart-dark .checkout-btn { background:#c9a96e; color:#1a1612; }
        .cart-dark .checkout-btn:hover { background:#e8d5b0; }

        /* Remove */
        .remove-btn {
          background:transparent; border:none; cursor:pointer;
          color:#c9a96e; transition:color 0.2s ease;
          padding:4px;
        }
        .remove-btn:hover { color:#1a1612; }
        .cart-dark .remove-btn:hover { color:#c9a96e; }

        /* Hover overrides for dark — gold hover instead of dark-ink hover */
        .cart-dark [class*="hover:text"]:hover { color:#c9a96e !important; }
        .cart-dark [class*="hover:border"]:hover { border-color:#c9a96e !important; }

        /* Empty state */
        .empty-bounce {
          animation: emptyBounce 0.7s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes emptyBounce {
          0%   { opacity:0; transform:scale(0.8); }
          60%  { transform:scale(1.05); }
          100% { opacity:1; transform:scale(1); }
        }
      `}</style>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="cart-backdrop" onClick={() => setIsOpen(false)} />

          {/* Drawer */}
          <div className={`cart-drawer ${dark ? 'cart-dark' : ''}`}>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: dark ? '#2d2926' : '#f0eeeb' }}>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-light text-[#1a1612]">{t('cart.title')}</h2>
                {count > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center font-body text-[0.5rem] font-semibold"
                    style={{ background: dark ? '#c9a96e' : '#1a1612', color: dark ? '#1a1612' : '#faf7f2' }}>
                    {count}
                  </span>
                )}
              </div>
              <button onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center border border-[#e8e2d8] hover:border-[#1a1612] transition-colors">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke={dark ? '#faf7f2' : '#1a1612'} strokeWidth="1.3" strokeLinecap="round"/>
                  <line x1="9" y1="1" x2="1" y2="9" stroke={dark ? '#faf7f2' : '#1a1612'} strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="cart-scroll flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="empty-bounce flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: dark ? '#1e1b16' : '#f2f0ed' }}
                  >
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                      <path d="M6 6h5l7 24h20l6-18H15" stroke={dark ? '#c9a96e' : '#d4c9b8'} strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="19" cy="37" r="3" stroke={dark ? '#c9a96e' : '#d4c9b8'} strokeWidth="1.5"/>
                      <circle cx="33" cy="37" r="3" stroke={dark ? '#c9a96e' : '#d4c9b8'} strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <p className="font-display text-xl font-light text-[#8b7d6b]">{t('cart.empty')}</p>
                  <button
                    onClick={() => { setIsOpen(false); navigate('/shop'); }}
                    className="font-body text-[0.6rem] tracking-[0.2em] uppercase text-[#c9a96e] hover:text-[#1a1612] transition-colors underline"
                  >
                    {t('cart.discover')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {items.map((item, idx) => (
                    <div key={item.key} className="cart-item flex gap-4"
                      style={{ animationDelay: `${idx * 0.06}s` }}>

                      {/* Product image */}
                      <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#f6f4f1] cursor-pointer"
                        onClick={() => { setIsOpen(false); navigate(`/product/${item.product.id}`); }}>
                        <img src={item.product.img} alt={item.product.name} className="w-full h-full object-cover"/>
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-body text-[0.48rem] tracking-[0.2em] uppercase text-[#c9a96e] mb-0.5">
                              {item.product.notes}
                            </p>
                            <p className="font-display text-base font-light text-[#1a1612] leading-tight">
                              {item.product.name}
                            </p>
                            <p className="font-body text-[0.55rem] text-[#8b7d6b] mt-0.5">{item.size}</p>
                          </div>
                          <button className="remove-btn" onClick={() => removeItem(item.key)} aria-label="Remove">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty */}
                          <div className="flex items-center gap-2">
                            <button className="qty-btn" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                            <span className="font-body text-sm font-light text-[#1a1612] w-5 text-center">{item.qty}</span>
                            <button className="qty-btn" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                          </div>
                          {/* Price */}
                          <p className="font-display text-base font-light text-[#1a1612]">
                            {(typeof item.product.price === 'string'
                              ? parseInt(item.product.price.replace(/\D/g,'')) || 0
                              : (item.product.price ?? 0)) * item.qty} LE
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t px-6 pt-5 pb-6 flex flex-col gap-4"
                style={{ borderColor: dark ? '#2d2926' : '#f0eeeb' }}>
                {/* Free shipping bar */}
                {total < 150 && (
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <p className="font-body text-[0.5rem] text-[#8b7d6b]">
                        Add <span className="text-[#c9a96e] font-medium">{150 - total} LE</span> {t('cart.addMore')}
                      </p>
                      <p className="font-body text-[0.5rem] text-[#8b7d6b]">{Math.round((total/150)*100)}%</p>
                    </div>
                    <div className="h-1 rounded-full bg-[#f0eeeb] overflow-hidden">
                      <div className="h-full rounded-full bg-[#c9a96e] transition-all duration-500"
                        style={{ width: `${Math.min((total/150)*100, 100)}%` }} />
                    </div>
                  </div>
                )}
                {total >= 150 && (
                  <p className="font-body text-[0.5rem] text-center text-green-600 tracking-wide">
                    ✓ {t('cart.freeShipping')}
                  </p>
                )}

                {/* Total */}
                <div className="flex items-center justify-between">
                  <p className="font-body text-xs font-light text-[#8b7d6b]">{t('cart.subtotal')}</p>
                  <p className="font-display text-lg font-light text-[#1a1612]">{total} LE</p>
                </div>

                {/* Checkout */}
                <button className="checkout-btn" onClick={() => { setIsOpen(false); navigate('/checkout'); }}>
                  {t('cart.checkout')}
                </button>

                {/* Clear */}
                <button onClick={clearCart}
                  className="font-body text-[0.5rem] tracking-[0.18em] uppercase text-[#8b7d6b] hover:text-[#1a1612] transition-colors text-center">
                  {t('cart.clear')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
