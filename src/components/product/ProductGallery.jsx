import { useState, useEffect, useRef } from 'react';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('revealed'); io.disconnect(); } },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

export default function ProductGallery({ product }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const ref = useReveal();

  const imgBg    = '#f8f9fa';
  const thumbBg  = '#f3f4f6';
  const thumbBorder = '#16a34a';
  const thumbInactive = '#e5e7eb';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div ref={ref} className="pg-wrap">
      <style>{`
        .pg-wrap {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 1.1s cubic-bezier(.22,1,.36,1),
                      transform 1.1s cubic-bezier(.22,1,.36,1);
        }
        .pg-wrap.revealed { opacity:1; transform:translateX(0); }

        .pg-main-img {
          transition: transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.3s ease;
          will-change: transform;
        }
        .pg-main-container {
          overflow: hidden;
          cursor: zoom-in;
        }
        .pg-main-container.zoomed {
          cursor: zoom-out;
        }
        .pg-main-container.zoomed .pg-main-img {
          transform: scale(2.2);
          transition: transform 0s;
        }
        .pg-main-container:not(.zoomed):hover .pg-main-img {
          transform: scale(1.06);
        }

        .pg-thumb {
          transition: opacity 0.3s ease, border-color 0.25s ease, transform 0.25s ease;
          cursor: pointer;
        }
        .pg-thumb:hover { transform: scale(1.04); }

        .pg-fade-in {
          animation: pgFadeIn 0.4s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes pgFadeIn {
          from { opacity:0; transform:scale(1.04); }
          to   { opacity:1; transform:scale(1); }
        }

        .pg-desc {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.9s cubic-bezier(.22,1,.36,1),
                      transform 0.9s cubic-bezier(.22,1,.36,1);
          transition-delay: 0.6s;
        }
        .pg-wrap.revealed .pg-desc { opacity:1; transform:translateY(0); }
      `}</style>

      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div
          className={`pg-main-container relative rounded-2xl overflow-hidden ${zoomed ? 'zoomed' : ''}`}
          style={{ aspectRatio: '1/1', background: imgBg }}
          onClick={() => setZoomed(z => !z)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
        >
          <img
            key={active}
            src={product.gallery[active]}
            alt={product.name}
            className="pg-main-img pg-fade-in w-full h-full object-cover"
            style={zoomed
              ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
              : { transformOrigin: 'center center' }}
            draggable={false}
          />

          {/* Zoom hint */}
          {!zoomed && (
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 pointer-events-none"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <circle cx="5" cy="5" r="3.5" stroke="#faf7f2" strokeWidth="1.2"/>
                <line x1="7.5" y1="7.5" x2="11" y2="11" stroke="#faf7f2" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="5" y1="3.5" x2="5" y2="6.5" stroke="#faf7f2" strokeWidth="1" strokeLinecap="round"/>
                <line x1="3.5" y1="5" x2="6.5" y2="5" stroke="#faf7f2" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span className="font-body text-[0.42rem] tracking-[0.2em] uppercase text-[#faf7f2]">Zoom</span>
            </div>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {product.gallery.map((_, i) => (
              <span key={i} className="block rounded-full transition-all duration-300"
                style={{
                  width: active === i ? '18px' : '5px', height: '5px',
                  background: active === i ? '#16a34a' : 'rgba(255,255,255,0.5)',
                }} />
            ))}
          </div>
        </div>

        {/* Thumbnails — below main image */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {product.gallery.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              style={{
                width: '72px', height: '72px', flexShrink: 0,
                borderRadius: '10px', overflow: 'hidden',
                border: `2px solid ${active === i ? thumbBorder : thumbInactive}`,
                background: thumbBg,
                padding: 0, cursor: 'pointer',
                opacity: active === i ? 1 : 0.6,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
