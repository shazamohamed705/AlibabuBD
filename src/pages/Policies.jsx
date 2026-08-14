import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useI18n }  from '../i18n/i18nContext';

export default function Policies() {
  const { dark }    = useTheme();
  const { t, lang } = useI18n();
  const isRtl       = lang === 'ar';

  const [searchParams, setSearchParams] = useSearchParams();
  const initial = searchParams.get('tab') || 'shipping';
  const [active, setActive] = useState(['shipping','returns','privacy'].includes(initial) ? initial : 'shipping');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['shipping','returns','privacy'].includes(tab)) setActive(tab);
  }, [searchParams]);

  const switchTab = (key) => { setActive(key); setSearchParams({ tab: key }); };

  const TABS = [
    { key: 'shipping', label: t('policies.tabs.shipping') },
    { key: 'returns',  label: t('policies.tabs.returns')  },
    { key: 'privacy',  label: t('policies.tabs.privacy')  },
  ];

  const content = t(`policies.${active}`);

  const c = {
    bg:     dark ? '#111009' : '#faf7f2',
    card:   dark ? '#1a1612' : '#ffffff',
    border: dark ? '#2d2926' : '#ede8e0',
    text:   dark ? '#faf7f2' : '#1a1612',
    muted:  dark ? '#a09080' : '#5a5048',
    dimmed: dark ? '#6b6056' : '#8b7d6b',
  };

  return (
    <main className="min-h-screen" style={{ background: c.bg }} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Hero */}
      <div className="pt-4 pb-16 px-6 lg:px-12 max-w-[1100px] mx-auto">
        <p className="font-body text-[0.5rem] tracking-[0.35em] uppercase text-[#c9a96e] mb-3"
          style={{ fontWeight: isRtl ? 700 : undefined }}>
          {t('policies.eyebrow')}
        </p>
        <h1 className="font-display font-light leading-tight"
          style={{ fontSize: 'clamp(40px, 5vw, 72px)', letterSpacing: isRtl ? 0 : '-1px', color: c.text, fontWeight: isRtl ? 700 : 300 }}>
          {t('policies.title1')}<br />
          <em className="italic" style={{ fontWeight: isRtl ? 700 : 200, fontStyle: isRtl ? 'normal' : undefined }}>
            {t('policies.title2')}
          </em>
        </h1>
        <div className="w-10 h-px bg-[#c9a96e] mt-6" />
      </div>

      {/* Tab bar */}
      <div className="px-6 lg:px-12 max-w-[1100px] mx-auto mb-10">
        <div className="flex gap-1 p-1 rounded-2xl w-fit"
          style={{ background: dark ? '#1a1612' : '#ede8e0' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className="font-body text-[0.58rem] tracking-[0.18em] uppercase px-5 py-2.5 rounded-xl transition-all duration-300"
              style={{
                background: active === tab.key ? (dark ? '#c9a96e' : '#1a1612') : 'transparent',
                color:      active === tab.key ? (dark ? '#1a1612' : '#faf7f2') : c.dimmed,
                fontWeight: active === tab.key ? 700 : (isRtl ? 600 : undefined),
                fontSize:   isRtl ? '0.7rem' : undefined,
                letterSpacing: isRtl ? 0 : undefined,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 max-w-[1100px] mx-auto pb-24"
        key={active}
        style={{ animation: 'polFade 0.4s cubic-bezier(.22,1,.36,1) both' }}>
        <style>{`@keyframes polFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }`}</style>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">

          {/* Side nav (desktop) */}
          <div className="hidden lg:flex flex-col gap-1 sticky top-28">
            {content.sections.map((s, i) => (
              <a key={i} href={`#section-${i}`}
                className="font-body text-[0.52rem] tracking-[0.15em] uppercase py-2 px-3 rounded-xl transition-colors"
                style={{ color: c.dimmed, fontWeight: isRtl ? 600 : undefined, fontSize: isRtl ? '0.7rem' : undefined, letterSpacing: isRtl ? 0 : undefined }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                onMouseLeave={e => e.currentTarget.style.color = c.dimmed}>
                {s.heading}
              </a>
            ))}
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-6">
            {content.sections.map((s, i) => (
              <div key={i} id={`section-${i}`} className="rounded-2xl p-7"
                style={{ background: c.card, border: `1px solid ${c.border}` }}>

                <div className={`flex items-center gap-3 mb-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: dark ? '#2d2926' : '#f0eeeb' }}>
                    <span className="font-body text-[0.46rem] font-semibold" style={{ color: '#c9a96e' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-light" style={{ color: c.text, fontWeight: isRtl ? 700 : undefined }}>
                    {s.heading}
                  </h2>
                </div>

                <div className={`w-6 h-px bg-[#c9a96e] mb-4 ${isRtl ? 'mr-10' : 'ml-10'}`} />

                <p className={`font-body text-sm font-light leading-relaxed ${isRtl ? 'mr-10' : 'ml-10'}`}
                  style={{ color: c.muted, fontWeight: isRtl ? 500 : undefined, lineHeight: isRtl ? '2' : undefined }}>
                  {s.body}
                </p>
              </div>
            ))}

            {/* CTA */}
            <div className="rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: dark ? '#1e1b16' : '#1a1612' }}>
              <div>
                <p className="font-body text-[0.5rem] tracking-[0.25em] uppercase text-[#c9a96e] mb-1"
                  style={{ fontWeight: isRtl ? 700 : undefined, letterSpacing: isRtl ? 0 : undefined, fontSize: isRtl ? '0.65rem' : undefined }}>
                  {t('policies.cta.label')}
                </p>
                <p className="font-display text-lg font-light text-[#faf7f2]"
                  style={{ fontWeight: isRtl ? 700 : undefined }}>
                  {t('policies.cta.subtitle')}
                </p>
              </div>
              <Link to="/contact"
                className="font-body text-[0.55rem] tracking-[0.2em] uppercase px-6 py-3 rounded-full flex-shrink-0 transition-all duration-300 hover:bg-[#faf7f2] hover:text-[#1a1612]"
                style={{ border: '1px solid rgba(250,247,242,0.3)', color: '#faf7f2', fontWeight: isRtl ? 700 : undefined, fontSize: isRtl ? '0.75rem' : undefined, letterSpacing: isRtl ? 0 : undefined }}>
                {t('policies.cta.btn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
