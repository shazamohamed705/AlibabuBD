import { useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function JournalModal({ post, onClose }) {
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl       = lang === 'ar';

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const title   = t(`journal.posts.${post.id}.title`);
  const excerpt = t(`journal.posts.${post.id}.excerpt`);
  const read    = t(`journal.posts.${post.id}.read`);
  const date    = t(`journal.posts.${post.id}.date`);

  return (
    <>
      <style>{`
        @keyframes jmBackdrop { from{opacity:0} to{opacity:1} }
        @keyframes jmSlide    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200]"
        style={{
          background: 'rgba(10,8,6,0.75)',
          backdropFilter: 'blur(6px)',
          animation: 'jmBackdrop 0.3s ease both',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl"
          style={{
            background: dark ? '#1a1612' : '#ffffff',
            animation: 'jmSlide 0.4s cubic-bezier(.22,1,.36,1) both',
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Hero image */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <img
              src={post.img}
              alt={title}
              className="w-full h-full object-cover"
              style={{ borderRadius: '1.5rem 1.5rem 0 0' }}
            />
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#faf7f2' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-[0.48rem] tracking-[0.25em] uppercase"
                style={{ color: '#c9a96e', fontWeight: isRtl ? 700 : undefined }}>
                {read}
              </span>
              <span style={{ color: dark ? '#2d2926' : '#e8e2d8' }}>·</span>
              <span className="font-body text-[0.48rem] tracking-wide"
                style={{ color: dark ? '#6b6056' : '#8b7d6b' }}>
                {date}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-display font-light leading-tight mb-5"
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                letterSpacing: isRtl ? 0 : '-0.5px',
                color: dark ? '#faf7f2' : '#1a1612',
                fontWeight: isRtl ? 700 : 300,
              }}
            >
              {title}
            </h2>

            {/* Divider */}
            <div className="w-8 h-px bg-[#c9a96e] mb-5" />

            {/* Excerpt / body */}
            <p className="font-body text-sm font-light leading-relaxed mb-6"
              style={{
                color: dark ? '#a09080' : '#5a5048',
                fontWeight: isRtl ? 500 : undefined,
                lineHeight: isRtl ? '2' : '1.9',
              }}>
              {excerpt}
            </p>

            {/* Placeholder paragraphs — body content */}
            <p className="font-body text-sm font-light leading-relaxed mb-4"
              style={{ color: dark ? '#a09080' : '#5a5048', opacity: 0.7 }}>
              The journey begins long before the first drop is bottled. Every fragrance in the AUREVIA collection starts with a single rare ingredient — sourced directly from the regions where it grows best, harvested at the peak of its season, and transported under strict conditions to preserve its integrity.
            </p>
            <p className="font-body text-sm font-light leading-relaxed"
              style={{ color: dark ? '#a09080' : '#5a5048', opacity: 0.7 }}>
              What separates a rare fragrance from a mass-market one is not price — it is provenance. Knowing exactly where an ingredient comes from, who cultivated it, and how it was extracted is the foundation of everything we create at AUREVIA.
            </p>

            {/* Close CTA */}
            <button
              onClick={onClose}
              className="mt-8 font-body text-[0.55rem] tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-all duration-300"
              style={{
                background: dark ? '#c9a96e' : '#1a1612',
                color: dark ? '#1a1612' : '#faf7f2',
                fontWeight: isRtl ? 700 : 600,
                fontSize: isRtl ? '0.72rem' : undefined,
                letterSpacing: isRtl ? 0 : undefined,
              }}
            >
              {isRtl ? '← إغلاق' : '← Close'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
