import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useTheme } from '../context/ThemeContext';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
        } else {
          el.classList.remove('revealed');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function BrandStory() {
  const { t, lang } = useI18n();
  const { dark } = useTheme();
  const isRtl = lang === 'ar';
  const titleRef    = useReveal();
  const dividerRef  = useReveal();
  const subtextRef  = useReveal();

  return (
    <section id="about" className="bg-[#faf7f2] py-24 lg:py-32 overflow-hidden" style={{ background: dark ? '#111009' : '#faf7f2' }}>
      <style>{`
        .slide-left {
          opacity: 0;
          transform: translateX(-300px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
        }
        .slide-left.revealed { opacity: 1; transform: translateX(0); }

        .slide-right {
          opacity: 0;
          transform: translateX(300px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.15s;
        }
        .slide-right.revealed { opacity: 1; transform: translateX(0); }

        .brand-line {
          opacity: 0;
          width: 0 !important;
          transition: opacity 0.6s ease, width 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.3s;
        }
        .brand-line.revealed { opacity: 1; width: 40px !important; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Headline */}
        <div className="text-center max-w-3xl mx-auto">

          {/* Title — slides from left */}
          <h2
            ref={titleRef}
            className="slide-left font-display text-3xl sm:text-4xl lg:text-4xl text-[#1a1612] leading-snug mb-6"
            style={{ fontWeight: isRtl ? 700 : 300, color: dark ? '#faf7f2' : '#1a1612' }}
          >
            {t('brandStory.line1')}<br />
            <em className="italic" style={{ fontWeight: isRtl ? 700 : 200 }}>{t('brandStory.line2')}</em>
          </h2>

          <div ref={dividerRef} className="brand-line divider-gold mb-6" />

          {/* Subtext — slides from right */}
          <p
            ref={subtextRef}
            className="slide-right font-body text-sm sm:text-base font-light leading-loose max-w-3xl mx-auto"
            style={{ color: dark ? '#a09080' : (isRtl ? '#3d362f' : '#5a5048'), fontWeight: isRtl ? 500 : undefined }}
          >
            {t('brandStory.body')}
          </p>
        </div>

      </div>
    </section>
  );
}
