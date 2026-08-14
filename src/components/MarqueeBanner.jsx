import { useI18n } from '../i18n/i18nContext';
import { useTheme } from '../context/ThemeContext';

export default function MarqueeBanner() {
  const { t, lang } = useI18n();
  const { dark }    = useTheme();
  const isRtl = lang === 'ar';

  const items = [
    t('marquee.item1'), '✦',
    t('marquee.item2'), '✦',
    t('marquee.item3'), '✦',
    t('marquee.item4'), '✦',
    t('marquee.item1'), '✦',
    t('marquee.item2'), '✦',
    t('marquee.item3'), '✦',
    t('marquee.item4'), '✦',
  ];

  return (
    <div className="w-full overflow-hidden" style={{ background: dark ? '#3f3a33' : '#111009', height: '36px' }}>
      <style>{`
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 28s linear infinite;
        }
        .marquee-track:hover { animation-play-state: paused; }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div className="marquee-track h-full items-center flex">
        {items.map((item, i) => (
          <span key={i} className="font-body whitespace-nowrap px-5"
            style={{
              fontSize: isRtl ? '0.72rem' : '0.52rem',
              letterSpacing: item === '✦' ? '0' : '0.22em',
              textTransform: 'uppercase',
              color: item === '✦' ? '#c9a96e' : '#faf7f2',
              fontWeight: isRtl ? 700 : undefined,
              lineHeight: '36px',
            }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
