import { useEffect, useRef } from 'react';
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

const events = [
  { year: '2021', side: 'left'  },
  { year: '2022', side: 'right' },
  { year: '2023', side: 'left'  },
  { year: '2024', side: 'right' },
  { year: '2025', side: 'left'  },
];

export default function AboutTimeline() {
  const headerRef   = useReveal();
  const timelineRef = useReveal();
  const { t, lang } = useI18n();
  const { dark } = useTheme();
  const isRtl = lang === 'ar';

  return (
    <section className="py-20 lg:py-28 overflow-hidden" style={{ background: dark ? '#111009' : '#f6f4f1' }}>
      <style>{`
        .tl-header {
          opacity: 0;
          transform: translateY(-24px);
          transition: opacity 1s cubic-bezier(.22,1,.36,1), transform 1s cubic-bezier(.22,1,.36,1);
        }
        .tl-header.revealed { opacity:1; transform:translateY(0); }

        /* Vertical line draws itself */
        .tl-line {
          width: 1px;
          background: #d4c9b8;
          transform-origin: top;
          transform: scaleY(0);
          transition: transform 1.5s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.3s;
        }
        .tl-wrap.revealed .tl-line { transform: scaleY(1); }

        /* Events stagger */
        .tl-event {
          opacity: 0;
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1);
        }
        .tl-event.left  { transform: translateX(-60px); }
        .tl-event.right { transform: translateX(60px); }

        .tl-wrap.revealed .tl-event:nth-child(1) { opacity:1; transform:translateX(0); transition-delay:0.4s; }
        .tl-wrap.revealed .tl-event:nth-child(2) { opacity:1; transform:translateX(0); transition-delay:0.65s; }
        .tl-wrap.revealed .tl-event:nth-child(3) { opacity:1; transform:translateX(0); transition-delay:0.90s; }
        .tl-wrap.revealed .tl-event:nth-child(4) { opacity:1; transform:translateX(0); transition-delay:1.15s; }
        .tl-wrap.revealed .tl-event:nth-child(5) { opacity:1; transform:translateX(0); transition-delay:1.40s; }
      `}</style>

      <div className="max-w-[900px] mx-auto px-6 lg:px-12">

        {/* Header */}
        <div ref={headerRef} className="tl-header text-center mb-16">
          <h2
            className="font-display text-4xl sm:text-5xl font-light text-[#1a1612]"
            style={{ letterSpacing: '-0.5px', fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}
          >
            {t('about.timelineTitle')}
          </h2>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="tl-wrap relative">

          {/* Center line */}
          <div className="tl-line absolute left-1/2 -translate-x-1/2 top-0 bottom-0" style={{ background: dark ? '#2d2926' : '#d4c9b8' }} />

          {/* Events */}
          <div className="flex flex-col gap-0">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`tl-event ${ev.side} relative flex items-start gap-8 pb-12 ${
                  ev.side === 'left'
                    ? 'flex-row-reverse text-right pr-[calc(50%+2rem)] lg:pr-[calc(50%+3rem)]'
                    : 'flex-row text-left pl-[calc(50%+2rem)] lg:pl-[calc(50%+3rem)]'
                }`}
              >
                {/* Dot on center line */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-[#c9a96e] bg-white"
                  style={{ top: '4px', zIndex: 2 }}
                />

                {/* Content */}
                <div className="flex-1">
                  <p className="font-body text-[0.5rem] tracking-[0.3em] uppercase text-[#c9a96e] mb-2"
                    style={{ fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.7rem' : undefined }}>
                    {ev.year}
                  </p>
                  <h3 className="font-display text-xl font-light text-[#1a1612] mb-2"
                    style={{ fontWeight: isRtl ? 700 : undefined, color: dark ? '#faf7f2' : '#1a1612' }}>
                    {t(`about.timeline.${i}.title`)}
                  </h3>
                  <p className="font-body text-xs font-light text-[#8b7d6b] leading-relaxed"
                    style={{ fontWeight: isRtl ? 500 : undefined, color: dark ? '#a09080' : '#8b7d6b' }}>
                    {t(`about.timeline.${i}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
