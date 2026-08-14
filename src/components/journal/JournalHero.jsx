import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function JournalHero() {
  const ref = useReveal();
  const { t, lang } = useI18n();
  const { dark } = useTheme();
  const isRtl = lang === 'ar';

  return (
    <section className="pt-32 pb-10 text-center overflow-hidden" style={{ background: dark ? '#111009' : '#fff' }}>
      <style>{`
        .jh-wrap {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(5px);
          transition: opacity 1.1s cubic-bezier(.22,1,.36,1),
                      transform 1.1s cubic-bezier(.22,1,.36,1),
                      filter 1.1s cubic-bezier(.22,1,.36,1);
        }
        .jh-wrap.revealed { opacity:1; transform:translateY(0); filter:blur(0); }
      `}</style>

      <div ref={ref} className="jh-wrap max-w-2xl mx-auto px-6">
        <h1
          className="font-display font-light mb-4"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
        >
          {t('journal.hero.title')}
        </h1>
        <p className="font-body text-sm font-light leading-relaxed"
          style={{ fontWeight: isRtl ? 500 : undefined, color: dark ? '#a09080' : '#8b7d6b' }}>
          {t('journal.hero.subtitle')}
        </p>
      </div>
    </section>
  );
}
