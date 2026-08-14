import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useTheme } from '../context/ThemeContext';

function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          el.classList.remove('revealed');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}


export default function LuxurySteps() {
  const headerRef = useReveal();
  const gridRef   = useReveal();
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl = lang === 'ar';

  const steps = (t('luxurySteps.items') || []).map((item, i) => ({
    num: String(i + 1).padStart(2, '0'),
    title: item?.title,
    desc:  item?.desc,
  }));

  return (
    <section className="py-24 lg:py-32 overflow-hidden" style={{ background: dark ? '#111009' : '#f0eeeb' }}>
      <style>{`
        .ls-header {
          opacity: 0;
          transform: translateY(-30px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .ls-header.revealed { opacity: 1; transform: translateY(0); }

        /* Steps grid */
        .ls-card {
          opacity: 0;
          clip-path: inset(0 100% 0 0);
          transition: opacity 0.01s,
                      clip-path 1.1s cubic-bezier(.22,1,.36,1);
        }
        .ls-grid.revealed .ls-card:nth-child(1) { opacity:1; clip-path:inset(0 0% 0 0); transition-delay:0s; }
        .ls-grid.revealed .ls-card:nth-child(2) { opacity:1; clip-path:inset(0 0% 0 0); transition-delay:0.2s; }
        .ls-grid.revealed .ls-card:nth-child(3) { opacity:1; clip-path:inset(0 0% 0 0); transition-delay:0.4s; }
        .ls-grid.revealed .ls-card:nth-child(4) { opacity:1; clip-path:inset(0 0% 0 0); transition-delay:0.6s; }

        /* Number counter pulse */
        .ls-num {
          transition: color 0.3s ease, transform 0.3s cubic-bezier(.22,1,.36,1);
          display: inline-block;
        }
        .ls-grid.revealed .ls-card:nth-child(1) .ls-num { animation: numPop 0.5s cubic-bezier(.22,1,.36,1) 1.1s both; }
        .ls-grid.revealed .ls-card:nth-child(2) .ls-num { animation: numPop 0.5s cubic-bezier(.22,1,.36,1) 1.3s both; }
        .ls-grid.revealed .ls-card:nth-child(3) .ls-num { animation: numPop 0.5s cubic-bezier(.22,1,.36,1) 1.5s both; }
        .ls-grid.revealed .ls-card:nth-child(4) .ls-num { animation: numPop 0.5s cubic-bezier(.22,1,.36,1) 1.7s both; }
        @keyframes numPop {
          0%   { color: #8b7d6b; transform: scale(1); }
          50%  { color: #c9a96e; transform: scale(1.4); }
          100% { color: #c9a96e; transform: scale(1); }
        }

        /* Divider line draws itself */
        .ls-divider {
          width: 0;
          transition: width 0.8s cubic-bezier(.22,1,.36,1);
        }
        .ls-grid.revealed .ls-card:nth-child(1) .ls-divider { width: 100%; transition-delay: 1.1s; }
        .ls-grid.revealed .ls-card:nth-child(2) .ls-divider { width: 100%; transition-delay: 1.3s; }
        .ls-grid.revealed .ls-card:nth-child(3) .ls-divider { width: 100%; transition-delay: 1.5s; }
        .ls-grid.revealed .ls-card:nth-child(4) .ls-divider { width: 100%; transition-delay: 1.7s; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="ls-header text-center mb-16">
          <h2
            className="font-display text-4xl sm:text-5xl font-light"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
          >
            {t('luxurySteps.title')}
          </h2>
        </div>

        {/* Steps grid */}
        <div ref={gridRef} className="ls-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x"
          style={{ borderColor: dark ? '#2d2926' : '#ddd8cf' }}>
          {steps.map((step, i) => (
            <div key={i} className="ls-card px-8 lg:px-10 py-10 flex flex-col"
              style={{ borderColor: dark ? '#2d2926' : '#ddd8cf' }}>
              <p className="mb-6">
                <span className="ls-num font-body text-[0.55rem] tracking-[0.3em] uppercase text-[#c9a96e]">
                  {step.num}
                </span>
              </p>
              <div className="ls-divider h-px mb-8" style={{ width: 0, background: dark ? '#2d2926' : '#ddd8cf' }} />
              <h3
                className="font-display text-xl font-light leading-snug mb-4 whitespace-pre-line"
                style={{ letterSpacing: '-0.3px', fontWeight: isRtl ? 600 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
              >
                {step.title}
              </h3>
              <p className="font-body text-sm font-light leading-relaxed"
                style={{ fontWeight: isRtl ? 400 : undefined, color: dark ? '#a09080' : '#8b7d6b' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
