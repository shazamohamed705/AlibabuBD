import { useRef, useEffect } from 'react';
import { useI18n }  from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

export default function JournalFeatured({ post }) {
  const imgRef  = useRef(null);
  const textRef = useRef(null);
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl       = lang === 'ar';

  // Re-trigger animation whenever post changes
  useEffect(() => {
    const timers = [imgRef, textRef].map(ref => {
      if (!ref.current) return null;
      ref.current.classList.remove('revealed');
      return setTimeout(() => ref.current?.classList.add('revealed'), 50);
    });
    return () => timers.forEach(id => id && clearTimeout(id));
  }, [post?._id, post?.id]);

  if (!post) return null;

  return (
    <section className="pb-0 overflow-hidden" style={{ background: dark ? '#111009' : '#fff' }}>
      <style>{`
        .jf-img {
          opacity: 0; transform: translateX(-60px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .jf-img.revealed { opacity:1; transform:translateX(0); }
        .jf-text {
          opacity: 0; transform: translateX(60px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.1s;
        }
        .jf-text.revealed { opacity:1; transform:translateX(0); }
        .jf-img-inner { overflow: hidden; border-radius: 1rem; }
        .jf-img-inner img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
        .jf-img-inner:hover img { transform: scale(1.04); }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 lg:gap-16 items-center py-8 lg:py-12">

          {/* Image */}
          <div ref={imgRef} className="jf-img">
            <div className="jf-img-inner" style={{ aspectRatio: '4/3' }}>
              <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="jf-text">
            <p className="font-body text-[0.52rem] tracking-[0.25em] uppercase mb-4"
              style={{ color: dark ? '#a09080' : '#8b7d6b', fontWeight: isRtl ? 700 : undefined }}>
              {post.read}
            </p>

            <h2 className="font-display font-light leading-tight mb-4"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 58px)',
                letterSpacing: isRtl ? 0 : '-0.5px',
                fontWeight: isRtl ? 700 : 300,
                color: dark ? '#faf7f2' : '#1a1612',
              }}>
              {post.title}
            </h2>

            <p className="font-body text-sm font-light leading-relaxed mb-4"
              style={{ color: dark ? '#a09080' : '#5a5048', fontWeight: isRtl ? 500 : undefined }}>
              {post.excerpt}
            </p>

            <p className="font-body text-[0.55rem] tracking-wide mb-8"
              style={{ color: dark ? '#6b6056' : '#8b7d6b' }}>
              {post.date}
            </p>

            <button
              onClick={() => window.scrollTo({ top: document.getElementById('journal-grid')?.offsetTop - 80 || 600, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 font-body text-[0.6rem] tracking-[0.22em] uppercase font-medium transition-all duration-300 hover:gap-4 hover:text-[#c9a96e]"
              style={{ color: dark ? '#faf7f2' : '#1a1612', fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.72rem' : undefined, letterSpacing: isRtl ? 0 : undefined }}
            >
              {t('journal.readArticle')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <polyline points="8,3.5 12,7 8,10.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 py-6">
          <div className="flex-1 h-px" style={{ background: dark ? '#2d2926' : '#ede8e0' }} />
          <span style={{ color: '#c9a96e', fontSize: '0.5rem' }}>✦</span>
          <div className="flex-1 h-px" style={{ background: dark ? '#2d2926' : '#ede8e0' }} />
        </div>
      </div>
    </section>
  );
}
