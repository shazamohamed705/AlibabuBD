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

const testimonialCount = 4;

function Stars({ count }) {
  return (
    <div className="flex gap-1 mb-5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#c9a96e">
          <polygon points="7,1 8.8,5.2 13.5,5.2 9.9,8.2 11.2,13 7,10.2 2.8,13 4.1,8.2 0.5,5.2 5.2,5.2" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const headerRef = useReveal();
  const gridRef   = useReveal();

  return (
    <section id="journal" className="py-24 lg:py-32 overflow-hidden" style={{ background: '#1a1612' }}>
      <style>{`
        .tm-header {
          opacity: 0;
          transform: translateY(-30px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .tm-header.revealed { opacity: 1; transform: translateY(0); }

        .tm-card {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
        }
        .tm-grid.revealed .tm-card:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0s; }
        .tm-grid.revealed .tm-card:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.15s; }
        .tm-grid.revealed .tm-card:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.30s; }
        .tm-grid.revealed .tm-card:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.45s; }

        .tm-card-inner {
          transition: transform 0.4s cubic-bezier(.22,1,.36,1),
                      box-shadow 0.4s cubic-bezier(.22,1,.36,1);
          height: 100%;
        }
        .tm-card-inner:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="tm-header text-center mb-14">
          <h2
            className="font-display text-4xl sm:text-5xl font-light text-[#faf7f2] mb-5"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined }}
          >
            {t('testimonials.title')}
          </h2>
          {/* Stars row */}
          <div className="flex justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="18" height="18" viewBox="0 0 14 14" fill="#c9a96e">
                <polygon points="7,1 8.8,5.2 13.5,5.2 9.9,8.2 11.2,13 7,10.2 2.8,13 4.1,8.2 0.5,5.2 5.2,5.2" />
              </svg>
            ))}
          </div>
          <p className="font-body text-xs text-[#8b7d6b] tracking-wide">
            {t('testimonials.rating')}
          </p>
        </div>

        {/* Cards grid */}
        <div ref={gridRef} className="tm-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {Array.from({ length: testimonialCount }).map((_, i) => (
            <div key={i} className="tm-card">
              <div
                className="tm-card-inner rounded-2xl p-7 flex flex-col"
                style={{ background: '#242018', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Stars */}
                <Stars count={5} />

                {/* Quote */}
                <p className="font-body text-sm font-light leading-relaxed flex-1 mb-8"
                  style={{ color: 'rgba(250,247,242,0.85)', fontWeight: isRtl ? 500 : undefined }}>
                  {t(`testimonials.items.${i}.quote`)}
                </p>

                {/* Divider */}
                <div className="w-full h-px mb-5" style={{ background: 'rgba(255,255,255,0.08)' }} />

                {/* Author */}
                <div>
                  <p className="font-body text-sm font-medium text-[#faf7f2] mb-0.5">
                    {t(`testimonials.items.${i}.author`)}
                  </p>
                  <p className="font-body text-[0.55rem] tracking-wide text-[#8b7d6b] mb-3">
                    {t(`testimonials.items.${i}.location`)}
                  </p>
                  <p className="font-body text-[0.5rem] tracking-[0.22em] uppercase text-[#c9a96e]">
                    {t(`testimonials.items.${i}.product`)} · {t(`testimonials.items.${i}.date`)}
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
