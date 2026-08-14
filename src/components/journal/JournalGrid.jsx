import { useEffect, useRef } from 'react';
import { useI18n }  from '../../i18n/i18nContext';
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
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function JournalGrid({ posts = [], activeId, onSelect }) {
  const gridRef = useReveal();
  const { lang }    = useI18n();
  const { dark }    = useTheme();
  const isRtl       = lang === 'ar';

  const handleSelect = (post) => {
    onSelect?.(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (posts.length === 0) return null;

  return (
    <section id="journal-grid" className="pb-24 lg:pb-32 overflow-hidden"
      style={{ background: dark ? '#111009' : '#fff' }}>
      <style>{`
        .jg-card {
          opacity: 0; transform: translateY(50px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
          cursor: pointer;
        }
        .jg-grid.revealed .jg-card:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0s; }
        .jg-grid.revealed .jg-card:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.12s; }
        .jg-grid.revealed .jg-card:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.24s; }
        .jg-grid.revealed .jg-card:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.36s; }
        .jg-grid.revealed .jg-card:nth-child(5) { opacity:1; transform:translateY(0); transition-delay:0.48s; }
        .jg-img { overflow: hidden; border-radius: 1rem; }
        .jg-card:hover .jg-img img { transform: scale(1.05); }
        .jg-img img { transition: transform 0.7s cubic-bezier(.22,1,.36,1); }
        .jg-title { transition: color 0.3s ease; }
        .jg-card:hover .jg-title { color: #c9a96e !important; }
        .jg-active { outline: 2px solid #c9a96e; border-radius: 16px; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div ref={gridRef} className="jg-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {posts.map(post => (
            <div
              key={post._id}
              className={`jg-card group p-2 ${post._id === activeId ? 'jg-active' : ''}`}
              onClick={() => handleSelect(post)}
            >
              {/* Image */}
              <div className="jg-img mb-5" style={{ aspectRatio: '4/3' }}>
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" />
              </div>

              {/* Meta */}
              <p className="font-body text-[0.5rem] tracking-[0.22em] uppercase mb-2"
                style={{ color: dark ? '#6b6056' : '#8b7d6b', fontWeight: isRtl ? 700 : undefined }}>
                {post.read}
              </p>

              {/* Title */}
              <h3 className="jg-title font-display text-xl font-light leading-snug mb-2"
                style={{ color: dark ? '#faf7f2' : '#1a1612', fontWeight: isRtl ? 700 : undefined }}>
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="font-body text-xs font-light leading-relaxed mb-3"
                style={{ color: dark ? '#a09080' : '#8b7d6b', fontWeight: isRtl ? 500 : undefined }}>
                {post.excerpt}
              </p>

              {/* Date */}
              <p className="font-body text-[0.5rem] tracking-wide"
                style={{ color: dark ? '#6b6056' : 'rgba(139,125,107,0.6)' }}>
                {post.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
