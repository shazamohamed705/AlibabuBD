import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.classList.add('revealed'); if (!repeat) io.disconnect(); }
        else if (repeat) el.classList.remove('revealed');
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const faqCount = 4;

function FAQItem({ q, a, index, isRtl, dark }) {
  const [open, setOpen] = useState(index === 3); // last one open by default like screenshot

  return (
    <div
      className="faq-item rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: `1px solid ${dark ? '#2d2926' : '#ede8e0'}`,
        background: dark ? '#16140f' : 'transparent',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <p className="font-body text-sm font-light"
          style={{ fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}>
          {q}
        </p>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-300"
          style={{
            background: open
              ? (dark ? '#c9a96e' : '#1a1612')
              : (dark ? '#2d2926' : '#f0eeeb'),
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
            style={{ transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}>
            <line x1="5" y1="1" x2="5" y2="9" stroke={open ? (dark ? '#1a1612' : '#faf7f2') : (dark ? '#c9a96e' : '#8b7d6b')} strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="1" y1="5" x2="9" y2="5" stroke={open ? (dark ? '#1a1612' : '#faf7f2') : (dark ? '#c9a96e' : '#8b7d6b')} strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div
        style={{
          maxHeight: open ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.4s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <p className="font-body text-xs font-light leading-relaxed px-6 pb-5"
          style={{ fontWeight: isRtl ? 500 : undefined, color: dark ? '#a09080' : '#8b7d6b' }}>
          {a}
        </p>
      </div>
    </div>
  );
}

export default function ContactFAQ() {
  const headerRef   = useReveal();
  const gridRef     = useReveal();
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl       = lang === 'ar';

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: dark ? '#0f0d0b' : '#faf7f2' }}>
      <style>{`
        .faq-header {
          opacity: 0;
          transform: translateY(-24px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .faq-header.revealed { opacity:1; transform:translateY(0); }

        .faq-grid {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.15s;
        }
        .faq-grid.revealed { opacity:1; transform:translateY(0); }

        .faq-item { transition: box-shadow 0.3s ease; }
        .faq-item:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
      `}</style>

      <div className="max-w-[1100px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="faq-header text-center mb-12">
          <h2
            className="font-display font-light"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
          >
            {t('contact.faqTitle')}
          </h2>
        </div>

        {/* 2-col FAQ grid */}
        <div ref={gridRef} className="faq-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: faqCount }).map((_, i) => (
            <FAQItem
              key={i}
              q={t(`contact.faqs.${i}.q`)}
              a={t(`contact.faqs.${i}.a`)}
              index={i}
              isRtl={isRtl}
              dark={dark}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
