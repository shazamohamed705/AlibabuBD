import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useBanners } from '../context/BannersContext';

export default function OudBanner() {
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const { getBanners } = useBanners();
  const apiBanners = getBanners('HOME_MIDDLE');
  const banner = apiBanners[0]; // first active HOME_MIDDLE banner; undefined → local fallback

  const sectionRef = useRef(null);
  const imgRef     = useRef(null);
  const textRef    = useRef(null);
  const btnRef     = useRef(null);

  useEffect(() => {
    const els = [imgRef.current, textRef.current, btnRef.current];
    const observer = new IntersectionObserver(
      ([entry]) => {
        els.forEach(el => {
          if (!el) return;
          if (entry.isIntersecting) el.classList.add('revealed');
          else el.classList.remove('revealed');
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#faf7f2] py-10 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <style>{`
        /* Banner container reveal */
        .oud-img {
          opacity: 0;
          clip-path: inset(0 0 100% 0);
          transition: clip-path 1.4s cubic-bezier(.22,1,.36,1),
                      opacity 0.01s;
        }
        .oud-img.revealed {
          opacity: 1;
          clip-path: inset(0 0 0% 0);
        }

        /* Text slides from left */
        .oud-text {
          opacity: 0;
          transform: translateX(-60px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.5s;
        }
        .oud-text.revealed {
          opacity: 1;
          transform: translateX(0);
        }

        /* Button fades up */
        .oud-btn {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1),
                      transform 0.8s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.9s;
        }
        .oud-btn.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Ken Burns on image */
        .oud-kenburns {
          animation: oudKenBurns 10s ease-out forwards;
        }
        @keyframes oudKenBurns {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }

        .oud-cta {
          transition: background 0.3s ease, color 0.3s ease;
        }
        .oud-cta:hover {
          background: rgba(255,255,255,0.15) !important;
        }
      `}</style>

      {/* Banner box */}
      <div
        ref={imgRef}
        className="oud-img relative w-full rounded-2xl overflow-hidden"
        style={{ minHeight: '580px', maxHeight: '680px' }}
      >
        {/* Background image with Ken Burns */}
        <img
          src={banner?.img || '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg'}
          alt={banner?.title || 'The Art of Oud'}
          className="oud-kenburns absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
          onError={e => { e.target.src = '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg'; }}
        />

        {/* Dark overlay — stronger on left for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(10,7,5,0.82) 0%, rgba(10,7,5,0.45) 50%, rgba(10,7,5,0.1) 100%)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex items-end px-8 sm:px-14 lg:px-20 pb-4 pt-16">
          <div className="max-w-lg">

            {/* Label */}
            <div ref={textRef} className="oud-text">
              <p className="font-body text-[0.55rem] tracking-[0.35em] uppercase text-[#c9a96e] mb-4">
                {t('oudBanner.label')}
              </p>

              {/* Title */}
              <h2
                className="font-display text-white leading-tight mb-5"
                style={{
                  fontSize: 'clamp(40px, 5.5vw, 72px)',
                  fontWeight: isRtl ? 700 : 300,
                  letterSpacing: '-0.5px',
                }}
              >
                {banner?.title || t('oudBanner.title')}
              </h2>

              {/* Divider */}
              <div className="w-8 h-px bg-[#c9a96e] mb-5" />

              {/* Description */}
              <p className="font-body text-sm font-light text-white/80 leading-relaxed mb-8 max-w-sm" style={{ fontWeight: isRtl ? 500 : undefined, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
                {banner?.subtitle || t('oudBanner.desc')}
              </p>
            </div>

            {/* CTA Button */}
            <button
              ref={btnRef}
              onClick={() => {
                const el = document.getElementById('shop');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="oud-btn oud-cta inline-block font-body text-[0.6rem] font-medium tracking-[0.25em] uppercase text-white border border-white/60 rounded-full px-7 py-3"
              style={{ background: 'rgba(255,255,255,0.08)', fontWeight: isRtl ? 700 : undefined, fontFamily: 'inherit' }}
            >
              {t('oudBanner.cta')}
            </button>

          </div>
        </div>
      </div>
    </section>
  );
}
