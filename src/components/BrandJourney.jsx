import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/i18nContext';
import { usePageContent } from '../hooks/usePageContent';

function useReveal(repeat = true) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          if (!repeat) observer.disconnect();
        } else if (repeat) {
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

export default function BrandJourney() {
  const imgRef  = useReveal(false);
  const textRef = useReveal(true);
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';
  const { data } = usePageContent('about');

  // Split title at punctuation for two lines
  const rawTitle = data?.title || null;
  const titleParts = rawTitle
    ? rawTitle.split(/[.،]\s*/).filter(Boolean)
    : null;
  const titleLine1 = titleParts?.[0] || t('brandJourney.title1');
  const titleLine2 = titleParts?.slice(1).join('. ') || t('brandJourney.title2');

  // Paragraphs from API content
  const rawContent = data?.content || data?.subtitle || null;
  const paragraphs = rawContent
    ? rawContent.split(/\n\n+/).filter(Boolean)
    : [t('brandJourney.p1'), t('brandJourney.p2')];

  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden">
      <style>{`
        /* Image — slide up reveal */
        .bj-img-wrap {
          opacity: 0;
          transform: translateY(60px);
          transition: opacity 1.2s cubic-bezier(.22,1,.36,1),
                      transform 1.2s cubic-bezier(.22,1,.36,1);
        }
        .bj-outer.revealed .bj-img-wrap {
          opacity: 1;
          transform: translateY(0);
        }

        /* Badge pops up after image */
        .bj-badge {
          opacity: 0;
          transform: translateY(20px) scale(0.92);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1),
                      transform 0.7s cubic-bezier(.22,1,.36,1);
          transition-delay: 1s;
        }
        .bj-outer.revealed .bj-badge {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Ken Burns */
        .bj-outer.revealed .bj-kenburns {
          animation: bjKenBurns 10s ease-out forwards;
        }
        @keyframes bjKenBurns {
          from { transform: scale(1.06); }
          to   { transform: scale(1); }
        }

        /* Text elements stagger from right */
        .bj-label {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1),
                      transform 0.9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.1s;
        }
        .bj-title {
          opacity: 0;
          transform: translateX(60px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1),
                      transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.25s;
        }
        .bj-divider {
          opacity: 0;
          width: 0 !important;
          transition: opacity 0.6s ease, width 0.9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.5s;
        }
        .bj-p1 {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1),
                      transform 0.9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.6s;
        }
        .bj-p2 {
          opacity: 0;
          transform: translateX(40px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1),
                      transform 0.9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.75s;
        }
        .bj-cta {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1),
                      transform 0.8s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.95s;
        }
        .bj-text.revealed .bj-label,
        .bj-text.revealed .bj-title,
        .bj-text.revealed .bj-p1,
        .bj-text.revealed .bj-p2,
        .bj-text.revealed .bj-cta  { opacity:1; transform:translateX(0) translateY(0); }
        .bj-text.revealed .bj-divider { opacity:1; width: 2.5rem !important; }

        /* CTA arrow hover */
        .bj-cta-link {
          transition: gap 0.3s ease, color 0.3s ease;
        }
        .bj-cta-link:hover { color: #c9a96e; gap: 0.75rem; }
        .bj-cta-arrow {
          transition: transform 0.3s ease;
        }
        .bj-cta-link:hover .bj-cta-arrow { transform: translateX(4px); }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}>

          {/* Left — Image + Badge wrapper */}
          <div ref={imgRef} className="bj-outer relative">
            <div className="bj-img-wrap relative rounded-2xl overflow-hidden" style={{ aspectRatio: '4/3.5', minHeight: '300px', maxHeight: '420px' }}>
              <img
                src="/ebda5ed7255aa47037a7c728a65e9e9194dba0ac.jpg"
                alt="Rare ingredients"
                className="bj-kenburns w-full h-full object-cover"
              />
            </div>

            <div className="bj-badge absolute -bottom-3 -right-3 bg-white rounded-2xl px-6 py-4 shadow-xl z-10">
              <p className="font-display text-3xl font-light text-[#1a1612] leading-none mb-1">12</p>
              <p className="font-body text-[0.5rem] tracking-[0.3em] uppercase text-[#c9a96e]"
                style={{ fontWeight: isRtl ? 700 : undefined }}>
                {t('brandJourney.badge')}
              </p>
            </div>
          </div>

          {/* Right — Text */}
          <div ref={textRef} className="bj-text flex flex-col justify-center">

            <p className="bj-label font-body text-[0.55rem] tracking-[0.35em] uppercase text-[#c9a96e] mb-5"
              style={{ fontWeight: isRtl ? 700 : undefined }}>
              {t('brandJourney.label')}
            </p>

            <h2
              className="bj-title font-display text-[#1a1612] leading-tight mb-6"
              style={{ fontSize: 'clamp(36px, 4vw, 58px)', fontWeight: isRtl ? 700 : 300, letterSpacing: '-0.5px' }}
            >
              {titleLine1}<br />
              <em className="italic" style={{ fontWeight: isRtl ? 700 : 200, fontStyle: isRtl ? 'normal' : undefined }}>
                {titleLine2}
              </em>
            </h2>

            <div className="bj-divider bg-[#c9a96e] mb-7" style={{ width: 0, height: '1px' }} />

            {paragraphs.map((p, i) => (
              <p key={i} className={`${i === 0 ? 'bj-p1' : 'bj-p2'} font-body text-sm font-light text-[#5a5048] leading-relaxed mb-5`}
                style={{ fontWeight: isRtl ? 500 : undefined }}>
                {p}
              </p>
            ))}

            <Link
              to="/about"
              className="bj-cta bj-cta-link self-start flex items-center gap-2 font-body text-[0.6rem] tracking-[0.25em] uppercase text-[#1a1612]"
              style={{ fontWeight: isRtl ? 700 : undefined }}
            >
              {t('brandJourney.cta')}
              <svg className="bj-cta-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <polyline points="8,3.5 12,7 8,10.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
