import { useTheme } from '../../context/ThemeContext';

export default function CheckoutStepper({ steps, current }) {
  const { dark } = useTheme();
  return (
    <div className="flex items-center w-full">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-body text-[0.55rem] font-semibold transition-all duration-400"
                style={{
                  background: active
                    ? (dark ? '#c9a96e' : '#1a1612')
                    : done ? '#c9a96e' : (dark ? '#2d2926' : '#e8e2d8'),
                  color: active
                    ? (dark ? '#1a1612' : '#faf7f2')
                    : done ? '#fff' : '#8b7d6b',
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : i + 1}
              </div>
              <span
                className="font-body text-[0.45rem] tracking-[0.2em] uppercase"
                style={{ color: active ? (dark ? '#faf7f2' : '#1a1612') : (dark ? '#a09080' : '#8b7d6b') }}
              >
                {label}
              </span>
            </div>

            {/* Line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-2 mb-5 relative overflow-hidden" style={{ background: dark ? '#2d2926' : '#e8e2d8' }}>
                <div
                  className="absolute inset-0 transition-all duration-600"
                  style={{ background: '#c9a96e', width: done ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
