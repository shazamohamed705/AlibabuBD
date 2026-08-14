import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export default function OrderSummary() {
  const { items, total, fetching } = useCart();
  const { dark } = useTheme();

  const isLoading = fetching && items.length === 0;

  return (
    <div
      className="rounded-3xl p-7 border sticky top-28 h-fit"
      style={{ background: dark ? '#1a1612' : '#ffffff', borderColor: dark ? '#2d2926' : '#ede8e0' }}
    >
      <h3 className="font-display text-2xl font-light mb-7" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
        Order Summary
      </h3>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-4 mb-7">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-16 h-16 rounded-2xl flex-shrink-0"
                style={{ background: dark ? '#2d2926' : '#f0eeeb' }} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3 rounded" style={{ background: dark ? '#2d2926' : '#f0eeeb', width: '70%' }} />
                <div className="h-2 rounded" style={{ background: dark ? '#2d2926' : '#f0eeeb', width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Items */}
      {!isLoading && (
        <div className="flex flex-col gap-5 mb-7">
          {items.map(item => (
            <div key={item.key} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0"
                style={{ background: dark ? '#16140f' : '#f6f4f1' }}>
                <img src={item.product.img} alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = '/favicon.svg'; }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-light leading-tight truncate"
                  style={{ color: dark ? '#faf7f2' : '#1a1612' }}>{item.product.name}</p>
                <p className="font-body text-[0.52rem] mt-0.5" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
                  ×{item.qty}
                </p>
              </div>
              <p className="font-body text-sm font-medium flex-shrink-0"
                style={{ color: dark ? '#faf7f2' : '#1a1612' }}>
                EGP {(Number(item.product.price) || 0) * item.qty}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="h-px mb-5" style={{ background: dark ? '#2d2926' : '#f0eeeb' }} />

      {/* Total */}
      <div className="flex items-center justify-between">
        <p className="font-display text-xl font-light" style={{ color: dark ? '#faf7f2' : '#1a1612' }}>Total</p>
        <p className="font-display"
          style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 300, letterSpacing: '-0.5px', color: dark ? '#faf7f2' : '#1a1612' }}>
          {total > 0 ? `EGP ${total}` : '—'}
        </p>
      </div>
    </div>
  );
}
