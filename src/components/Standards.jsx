import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/i18nContext';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('revealed');
        else el.classList.remove('revealed');
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const itemIcons = [
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="6" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M13 9h3l2 3v3h-5V9z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="5" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="15" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2L12.5 7H18L13.5 10.5L15.5 16L10 12.5L4.5 16L6.5 10.5L2 7H7.5L10 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 8h14v9a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5h18v3H1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M10 5V18" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 5c0 0-2-3 0-3s0 3 0 3z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 5c0 0 2-3 0-3" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4 8A6 6 0 1 1 4 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M1 8h4V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 9l3 3 5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2L3 5v5c0 4 3.5 7 7 8 3.5-1 7-4 7-8V5L10 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2l2 4 4.5.7-3.2 3.1.7 4.4L10 12l-4 2.2.7-4.4L3.5 6.7 8 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  ),
];

export default function Standards() {
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const headerRef = useReveal();
  const gridRef   = useReveal();

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <style>{`
        .st-header {
          opacity: 0;
          transform: translateY(-30px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .st-header.revealed { opacity: 1; transform: translateY(0); }

        .st-card {
          opacity: 0;
          filter: blur(6px);
          transform: translateY(20px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      filter 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
        }
        .st-grid.revealed .st-card:nth-child(1) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0s; }
        .st-grid.revealed .st-card:nth-child(2) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0.12s; }
        .st-grid.revealed .st-card:nth-child(3) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0.24s; }
        .st-grid.revealed .st-card:nth-child(4) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0.36s; }
        .st-grid.revealed .st-card:nth-child(5) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0.48s; }
        .st-grid.revealed .st-card:nth-child(6) { opacity:1; filter:blur(0); transform:translateY(0); transition-delay:0.60s; }

        .st-card-inner {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.35s cubic-bezier(.22,1,.36,1);
        }
        .st-card-inner:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
        }
        .st-icon {
          transition: color 0.3s ease, transform 0.3s cubic-bezier(.22,1,.36,1);
        }
        .st-card-inner:hover .st-icon {
          color: #c9a96e !important;
          transform: scale(1.15);
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="st-header text-center mb-14">
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-[#1a1612]"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined }}
          >
            {t('standards.title')}
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="st-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {itemIcons.map((icon, i) => (
            <div key={i} className="st-card h-full">
              <div
                className="st-card-inner h-full rounded-2xl p-7 flex items-start gap-5 border border-[#ece8e0]"
                style={{ background: '#ffffff' }}
              >
                {/* Icon */}
                <div
                  className="st-icon flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: '#ece8e0', color: '#8b7d6b' }}
                >
                  {icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-body text-sm font-medium text-[#1a1612] mb-1.5" style={{ fontWeight: isRtl ? 700 : undefined }}>
                    {t(`standards.items.${i}.title`)}
                  </h3>
                  <p className="font-body text-xs font-light text-[#8b7d6b] leading-relaxed">
                    {t(`standards.items.${i}.desc`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
