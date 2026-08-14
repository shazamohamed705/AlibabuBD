import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { usePageContent } from '../../hooks/usePageContent';

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

export default function AboutHero() {
  const contentRef = useReveal();
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const { data } = usePageContent('about');

  // Split title at first punctuation or midpoint for two-line display
  const rawTitle = data?.title || t('about.heroTitle');
  const titleParts = rawTitle.includes('.')
    ? rawTitle.split(/\.\s*/)
    : rawTitle.split(/،\s*/); // Arabic comma

  const line1 = titleParts[0] || rawTitle;
  const line2 = titleParts.slice(1).join('. ') || t('about.heroSubtitle');

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(600px, 90vh, 900px)', marginTop: '-80px' }}
    >
      <style>{`
        .ah-content {
          opacity: 0;
          transform: translateY(30px);
          filter: blur(6px);
          transition: opacity 1.2s cubic-bezier(.22,1,.36,1),
                      transform 1.2s cubic-bezier(.22,1,.36,1),
                      filter 1.2s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.3s;
        }
        .ah-content.revealed { opacity:1; transform:translateY(0); filter:blur(0); }
      `}</style>

      {/* Background */}
      <img
        src="/ebda5ed7255aa47037a7c728a65e9e9194dba0ac.jpg"
        alt="About hero"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 30%' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.3) 50%, rgba(10,8,6,0.6) 100%)' }} />

      {/* Content centered */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: '80px' }}>
        <div ref={contentRef} className="ah-content text-center px-6">
          <h1
            className="font-display font-light text-white leading-tight"
            style={{ fontSize: 'clamp(42px, 6vw, 82px)', letterSpacing: '-1px', fontWeight: isRtl ? 700 : undefined }}
          >
            {line1}<br />
            <em className="italic" style={{ fontWeight: isRtl ? 700 : 200, fontStyle: isRtl ? 'normal' : undefined }}>
              {line2}
            </em>
          </h1>
        </div>
      </div>
    </section>
  );
}
