import { useEffect, useRef } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';
import { usePageContent } from '../../hooks/usePageContent';

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

export default function AboutMission() {
  const leftRef  = useReveal();
  const rightRef = useReveal();
  const { t, lang } = useI18n();
  const { dark } = useTheme();
  const isRtl = lang === 'ar';
  const { data } = usePageContent('about');

  // Use API content if available, fall back to i18n
  const missionTitle   = data?.title   || t('about.missionTitle');
  const missionContent = data?.content || (t('about.missionP1') + '\n\n' + t('about.missionP2'));
  const paragraphs = missionContent.split(/\n\n+/).filter(Boolean);

  const stats = [
    { value: '12',   label: t('about.sourceCountries')     },
    { value: '50K+', label: t('about.globalCustomers')     },
    { value: '8',    label: t('about.exclusiveFragrances') },
    { value: '4.9★', label: t('about.averageRating')       },
  ];

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden" style={{ background: dark ? '#111009' : '#ffffff' }}>
      <style>{`
        .am-left {
          opacity: 0;
          transform: translateX(-80px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .am-left.revealed { opacity:1; transform:translateX(0); }

        .am-right {
          opacity: 0;
          transform: translateX(80px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.15s;
        }
        .am-right.revealed { opacity:1; transform:translateX(0); }

        .am-stat {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .am-right.revealed .am-stat:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0.2s; }
        .am-right.revealed .am-stat:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.32s; }
        .am-right.revealed .am-stat:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.44s; }
        .am-right.revealed .am-stat:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.56s; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-start">

          {/* Left — text */}
          <div ref={leftRef} className="am-left">
            <h2
              className="font-display font-light text-[#1a1612] leading-tight mb-6"
              style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
            >
              {missionTitle.split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
              ))}
            </h2>

            <div className="w-8 h-px bg-[#c9a96e] mb-7" />

            {paragraphs.map((p, i) => (
              <p key={i} className="font-body text-sm font-light leading-relaxed mb-5"
                style={{ fontWeight: isRtl ? 500 : undefined, color: dark ? '#a09080' : '#5a5048' }}>
                {p}
              </p>
            ))}
          </div>

          {/* Right — stats grid */}
          <div ref={rightRef} className="am-right grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="am-stat rounded-2xl p-8 flex flex-col items-center justify-center text-center"
                style={{ background: dark ? '#1e1b16' : '#f2f0ed' }}
              >
                <p
                  className="font-display font-light text-[#1a1612] mb-2"
                  style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.5px', color: dark ? '#faf7f2' : '#1a1612' }}
                >
                  {s.value}
                </p>
                <p className="font-body text-[0.5rem] tracking-[0.28em] uppercase text-[#c9a96e]"
                  style={{ fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.72rem' : undefined }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
