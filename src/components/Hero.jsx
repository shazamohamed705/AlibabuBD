import { useState, useEffect, useCallback } from 'react';
import { useBanners } from '../context/BannersContext';

export default function Hero() {
  const { getBanners, loading } = useBanners();
  const apiBanners = getBanners('HOME_HERO');

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const defaultSlides = [
    { img: '/HeroSection.png',      mobileImg: '/HeroSection (1).png' },
    { img: '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg', mobileImg: '/e710b796ba3e0cfd864dbf7c31f21c2b486665e7.jpg' },
  ];

  const slides = apiBanners.length
    ? apiBanners.map(b => ({ img: b.img, mobileImg: b.mobileImg || b.img }))
    : defaultSlides;

  // Auto-advance slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % slides.length);
        setTransitioning(false);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section style={{ width: '100%', height: '60vw', minHeight: '280px', maxHeight: '600px', background: '#f3f4f6', animation: 'heroPulse 1.4s ease infinite' }}>
        <style>{`@keyframes heroPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
      </section>
    );
  }

  const slide = slides[current % slides.length];

  return (
    <section style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#f3f4f6' }}>
      <style>{`
        @keyframes heroFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes heroKenBurns { from{transform:scale(1.04)} to{transform:scale(1)} }
        .hero-dots button { transition: width 0.3s ease, background 0.3s ease; }
      `}</style>

      {/* Image */}
      <img
        key={current}
        src={slide.img}
        alt="Banner"
        className="hero-img"
        style={{
          width: '100%',
          height: '480px',
          display: 'block',
          objectFit: 'cover',
          opacity: transitioning ? 0 : 1,
          animation: transitioning ? 'none' : 'heroFadeIn 0.6s ease, heroKenBurns 6s ease-out forwards',
          transition: 'opacity 0.4s ease',
        }}
        onError={e => { e.target.src = '/HeroSection.png'; }}
      />
      <style>{`
        @media (max-width: 640px) { .hero-img { height: 260px !important; } }
        @media (min-width: 641px) and (max-width: 1023px) { .hero-img { height: 380px !important; } }
        @media (min-width: 1024px) { .hero-img { height: 550px !important; } }
      `}</style>

      {/* Dots — only if multiple slides */}
      {slides.length > 1 && (
        <div className="hero-dots" style={{
          position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', alignItems: 'center',
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => { setTransitioning(true); setTimeout(() => { setCurrent(i); setTransitioning(false); }, 300); }} style={{
              width: current === i ? '20px' : '6px',
              height: '6px', borderRadius: '999px',
              background: current === i ? '#16a34a' : 'rgba(255,255,255,0.6)',
              border: 'none', cursor: 'pointer', padding: 0,
            }} />
          ))}
        </div>
      )}
    </section>
  );
}
