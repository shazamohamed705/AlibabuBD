import { useI18n } from '../i18n/i18nContext';

export default function AnnouncementBar() {
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';

  return (
    <div
      style={{
        background: 'linear-gradient(100deg, rgba(150,150,150,0.30) 0%, rgba(210,210,210,0.42) 30%, rgba(190,190,190,0.34) 55%, rgba(220,220,220,0.46) 80%, rgba(160,160,160,0.30) 100%)',
        boxShadow: '0 0 14px rgba(170,170,170,0.22)',
      }}
      className="w-full h-12 flex items-center justify-between px-6 lg:px-16"
    >
      <span className="font-body text-[0.48rem] tracking-[0.25em] uppercase text-[#2d2926] whitespace-nowrap hidden sm:block"
        style={{ fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.72rem' : undefined }}>
        {t('announcement.newCollection')}
      </span>

      <div className="flex items-center justify-center flex-1">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-1 rounded-full bg-[#c9a96e] flex-shrink-0" />
          <span className="font-body text-[0.48rem] tracking-[0.28em] uppercase text-[#2d2926] whitespace-nowrap"
            style={{ fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.72rem' : undefined }}>
            {t('announcement.luxuryCollection')}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#c9a96e] flex-shrink-0" />
        </div>
      </div>

      <a href="#shop"
        className="hidden sm:flex items-center gap-1.5 font-body text-[0.48rem] tracking-[0.25em] uppercase text-[#2d2926] hover:text-[#c9a96e] transition-colors duration-300 whitespace-nowrap"
        style={{ fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.72rem' : undefined }}>
        {t('announcement.discoverNow')}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <line x1="1" y1="4.5" x2="8" y2="4.5" stroke="currentColor" strokeWidth="1" />
          <polyline points="5.5,2 8,4.5 5.5,7" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </a>
    </div>
  );
}
