import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useBanners } from '../context/BannersContext';

export default function Hero() {
  const { t, lang } = useI18n();
  const isRtl = lang === 'ar';

  const { getBanners, loading } = useBanners();
  const apiBanners = getBanners('HOME_HERO');

  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const defaultSlides = [
    {
      label:    t('hero.label1'),
      title:    t('hero.title1'),
      subtitle: t('hero.sub1'),
      img:      '/HeroSection.png',
      mobileImg: '/HeroSection (1).png',
    },
    {
      label:    t('hero.label2'),
      title:    t('hero.title2'),
      subtitle: t('hero.sub2'),
      img:      '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg',
      mobileImg: '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg',
    },
  ];

  // Map API banners → slides; fall back to local default slides when empty
  const slides = apiBanners.length
    ? apiBanners.map((b) => {
        const titleWords = (b.title || '').split(' ');
        const mid = Math.ceil(titleWords.length / 2);
        const formattedTitle = titleWords.length > 2
          ? titleWords.slice(0, mid).join(' ') + '\n' + titleWords.slice(mid).join(' ')
          : b.title || '';
        return {
          label:    b.subtitle || '',
          title:    formattedTitle,
          subtitle: b.subtitle || '',
          img:      b.img,
          mobileImg: b.mobileImg || b.img,
        };
      })
    : defaultSlides;

  const goTo = useCallback((index) => {
    if (transitioning || index === current) return;
    setTransitioning(true);

    setTimeout(() => {
      setPrev(current);
      setCurrent(index);
    }, 400);

    setTimeout(() => {
      setPrev(null);
      setTransitioning(false);
    }, 1200);
  }, [transitioning, current]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [goTo, current, slides.length]);

  // Skeleton only when no cache AND fresh data not yet loaded
  if (loading) {
    return (
      <section className="relative w-full h-[100svh] min-h-[560px] overflow-hidden animate-pulse" style={{ marginTop: '-80px', background: '#1a1612' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2d2520 0%, #1a1612 100%)' }} />
      </section>
    );
  }

  const slide = slides[current % slides.length];

  return (
    <section id="home" className="relative w-full h-[100svh] min-h-[560px] lg:h-[120vh] lg:min-h-[700px] overflow-hidden" style={{ marginTop: '-80px', background: '#111009' }}>

      {/* Previous slide fading out */}
      {prev !== null && (
        <div className="absolute inset-0" style={{ zIndex: 1, animation: 'fadeOut 0.8s ease forwards', transform: isRtl ? 'scaleX(-1)' : undefined }}>
          <img
            src={slides[prev].img}
            alt=""
            className="hidden lg:block w-full h-full object-cover"
            style={{ objectPosition: 'center top', transform: 'translateY(80px)' }}
          />
        <img
          src={slides[prev].mobileImg || slides[prev].img}
          alt=""
          className="lg:hidden w-full h-full object-cover"
          style={{ objectPosition: 'center 20%', background: '#111009' }}
        />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1612]/80 via-[#1a1612]/40 to-transparent lg:from-[#1a1612]/80 lg:via-[#1a1612]/40 lg:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/30 to-transparent" />
        </div>
      )}

      {/* Current slide with Ken Burns (desktop) */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 2, animation: transitioning ? 'fadeIn 1.2s ease forwards' : 'none', transform: isRtl ? 'scaleX(-1)' : undefined }}
        key={current}
      >
        <img
          src={slide.img}
          alt="Hero"
          className="hidden lg:block w-full h-full object-cover"
          style={{
            objectPosition: 'center top',
            transform: 'translateY(80px)',
            animation: 'kenBurns 8s ease-out forwards',
            transformOrigin: 'center center',
          }}
        />
        <img
          src={slide.mobileImg || slide.img}
          alt="Hero"
          className="lg:hidden w-full h-full object-cover"
          style={{ objectPosition: 'center 20%', background: '#111009' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1612]/80 via-[#1a1612]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1612]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center pt-20" style={{ zIndex: 10 }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-xl">

            {/* Label */}
            <p
              key={`label-${current}`}
              className="section-label text-[#c9a96e] mb-5"
              style={{ animation: 'slideUpFade 1s ease both', animationDelay: '0ms', fontWeight: isRtl ? 700 : undefined }}
            >
              {slide.label}
            </p>

            {/* Title */}
            <h1
              key={`title-${current}`}
              className="font-display font-light text-[#faf7f2] whitespace-pre-line"
              style={{
                fontSize: 'clamp(40px, 6vw, 96px)',
                lineHeight: 'clamp(44px, 6.5vw, 100px)',
                letterSpacing: '-2px',
                fontWeight: isRtl ? 700 : 300,
                marginBottom: '1.5rem',
                animation: 'slideUpFade 1.1s ease both',
                animationDelay: '150ms',
              }}
            >
              {slide.title}
            </h1>

            {/* Divider */}
            <div
              key={`divider-${current}`}
              className="bg-[#c9a96e] mb-6"
              style={{
                width: 0,
                height: '1px',
                animation: 'expandLine 1s ease both',
                animationDelay: '350ms',
              }}
            />

            {/* Subtitle */}
            <p
              key={`subtitle-${current}`}
              className="font-body text-sm font-light text-[#faf7f2]/80 leading-relaxed mb-10 max-w-sm"
              style={{ animation: 'slideUpFade 1s ease both', animationDelay: '450ms', fontWeight: isRtl ? 600 : undefined }}
            >
              {slide.subtitle}
            </p>

            {/* CTA Buttons */}
            <div
              key={`btns-${current}`}
              className="flex flex-wrap gap-4"
              style={{ animation: 'slideUpFade 1s ease both', animationDelay: '580ms' }}
            >
              <button
                onClick={() => scrollToSection('shop')}
                className="inline-block px-8 py-3 font-body text-[0.65rem] font-medium tracking-[0.2em] uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-[#faf7f2]/10 border-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(138, 137, 137, 0.34) 0%, rgba(17, 17, 17, 0.8) 100%)',
                  color: '#faf7f2',
                  fontWeight: isRtl ? 700 : undefined,
                  fontFamily: 'inherit',
                }}
              >
                {t('hero.discover')}
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="inline-block px-8 py-3 font-body text-[0.65rem] font-medium tracking-[0.2em] uppercase border border-white rounded-full cursor-pointer transition-all duration-300 hover:bg-[#faf7f2]/10"
                style={{ background: 'transparent', color: '#faf7f2', fontWeight: isRtl ? 700 : undefined, fontFamily: 'inherit' }}
              >
                {t('hero.ourStory')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', zIndex: 10 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? '2rem' : '0.5rem',
              height: '2px',
              background: i === current ? '#c9a96e' : 'rgba(250,247,242,0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-10 right-6 lg:right-12 z-10 flex flex-col items-center gap-2 opacity-60">
        <span className="font-body text-[0.5rem] tracking-[0.3em] uppercase text-[#faf7f2] rotate-90 translate-y-6">
          Scroll
        </span>
        <div className="w-px h-12 bg-[#faf7f2]/40" />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes kenBurns {
          from { transform: translateY(80px) scale(1.08); }
          to   { transform: translateY(80px) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(24px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes expandLine {
          from { width: 0; }
          to   { width: 2.5rem; }
        }
      `}</style>
    </section>
  );
}
