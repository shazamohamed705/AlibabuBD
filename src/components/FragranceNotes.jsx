import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
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

const noteEmojis = ['🪵', '🌹', '✨', '🩶', '🤍', '🌲', '🌸', '🍋'];

export default function FragranceNotes() {
  const headerRef    = useReveal();
  const gridRef      = useReveal();
  const { t, lang }  = useI18n();
  const { dark }     = useTheme();
  const isRtl        = lang === 'ar';

  const sectionBg  = dark ? '#111009' : '#f2f0ed';
  const cardBg     = dark ? '#1e1b16' : '#faf7f2';
  const cardHoverBg = dark ? '#242018' : '#ffffff';
  const titleColor = dark ? '#faf7f2' : '#1a1612';
  const descColor  = dark ? '#a09080' : '#8b7d6b';

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: sectionBg }}>
      <style>{`
        .fn-header {
          opacity: 0;
          transform: translateY(-30px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
        }
        .fn-header.revealed { opacity: 1; transform: translateY(0); }

        .fn-card {
          opacity: 0;
          filter: blur(8px);
          transition: opacity 1.1s cubic-bezier(.22,1,.36,1),
                      filter 1.1s cubic-bezier(.22,1,.36,1);
        }
        .fn-grid.revealed .fn-card:nth-child(1) { opacity:1; filter:blur(0); transition-delay:0s; }
        .fn-grid.revealed .fn-card:nth-child(2) { opacity:1; filter:blur(0); transition-delay:0.12s; }
        .fn-grid.revealed .fn-card:nth-child(3) { opacity:1; filter:blur(0); transition-delay:0.24s; }
        .fn-grid.revealed .fn-card:nth-child(4) { opacity:1; filter:blur(0); transition-delay:0.36s; }
        .fn-grid.revealed .fn-card:nth-child(5) { opacity:1; filter:blur(0); transition-delay:0.48s; }
        .fn-grid.revealed .fn-card:nth-child(6) { opacity:1; filter:blur(0); transition-delay:0.60s; }
        .fn-grid.revealed .fn-card:nth-child(7) { opacity:1; filter:blur(0); transition-delay:0.72s; }
        .fn-grid.revealed .fn-card:nth-child(8) { opacity:1; filter:blur(0); transition-delay:0.84s; }

        .fn-card-inner {
          transition: transform 0.35s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.35s cubic-bezier(.22,1,.36,1),
                      background 0.35s ease;
        }
        .fn-emoji {
          transition: transform 0.4s cubic-bezier(.22,1,.36,1);
          display: inline-block;
        }
        .fn-card-inner:hover .fn-emoji {
          transform: scale(1.25) rotate(-5deg);
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="fn-header text-center mb-12">
          <h2
            className="font-display text-4xl sm:text-5xl font-light mb-4"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: titleColor }}
          >
            {t('notes.title')}
          </h2>
          <p className="font-body text-xs font-light tracking-wide" style={{ color: descColor, fontWeight: isRtl ? 600 : undefined }}>
            {t('notes.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="fn-grid grid grid-cols-2 sm:grid-cols-4 gap-4">
          {noteEmojis.map((emoji, i) => (
            <div key={i} className="fn-card">
              <div
                className="fn-card-inner rounded-2xl p-7 cursor-pointer"
                style={{ background: cardBg }}
                onMouseEnter={e => e.currentTarget.style.background = cardHoverBg}
                onMouseLeave={e => e.currentTarget.style.background = cardBg}
              >
                <div className="text-3xl mb-5">
                  <span className="fn-emoji">{emoji}</span>
                </div>
                <h3 className="font-display text-xl font-light mb-1"
                  style={{ fontWeight: isRtl ? 700 : undefined, color: titleColor }}>
                  {t(`notes.items.${i}.name`)}
                </h3>
                <p className="font-body text-[0.52rem] tracking-[0.22em] uppercase"
                  style={{ color: descColor }}>
                  {t(`notes.items.${i}.desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
