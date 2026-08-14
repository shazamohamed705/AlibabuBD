import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/i18nContext';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add('revealed'); observer.disconnect(); }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const contentRef = useReveal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <section id="contact" className="relative py-28 lg:py-36 overflow-hidden" style={{ background: '#0f0d0b' }}>
      <style>{`
        /* Big watermark text */
        .nl-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          user-select: none;
          overflow: hidden;
        }
        .nl-watermark span {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(80px, 18vw, 260px);
          font-weight: 300;
          color: rgba(255,255,255,0.025);
          white-space: nowrap;
          letter-spacing: 0.15em;
        }

        /* Content reveal */
        .nl-content {
          opacity: 0;
          transform: translateY(40px);
          filter: blur(6px);
          transition: opacity 1.2s cubic-bezier(.22,1,.36,1),
                      transform 1.2s cubic-bezier(.22,1,.36,1),
                      filter 1.2s cubic-bezier(.22,1,.36,1);
        }
        .nl-content.revealed { opacity:1; transform:translateY(0); filter:blur(0); }

        /* Input */
        .nl-input {
          background: linear-gradient(90deg, rgba(138,137,137,0.34) 0%, rgba(17,17,17,0.8) 100%);
          border: 1px solid rgba(255,255,255,0.1);
          color: #faf7f2;
          border-radius: 999px;
          padding: 0.85rem 1.5rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.72rem;
          outline: none;
          transition: border-color 0.3s ease;
          width: 100%;
        }
        .nl-input::placeholder { color: rgba(250,247,242,0.45); }
        .nl-input:focus { border-color: rgba(201,169,110,0.5); }

        /* Button */
        .nl-btn {
          background: linear-gradient(90deg, rgba(138,137,137,0.34) 0%, rgba(17,17,17,0.8) 100%);
          color: #faf7f2;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 999px;
          padding: 0.85rem 1.8rem;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 0.3s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .nl-btn:hover { border-color: rgba(201,169,110,0.6); transform: scale(1.03); }

        /* Success checkmark */
        .nl-success {
          animation: successPop 0.5s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes successPop {
          from { opacity:0; transform: scale(0.8); }
          to   { opacity:1; transform: scale(1); }
        }
      `}</style>

      {/* Watermark */}
      <div className="nl-watermark">
        <span>AUREVIA</span>
      </div>

      {/* Content */}
      <div ref={contentRef} className="nl-content relative z-10 max-w-2xl mx-auto px-6 text-center">

        <p className="font-body text-[0.52rem] tracking-[0.35em] uppercase text-[#c9a96e] mb-6">
          {t('newsletter.label')}
        </p>

        <h2
          className="font-display text-[#faf7f2] leading-tight mb-6"
          style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 300, letterSpacing: '-0.5px' }}
        >
          {t('newsletter.title')}
        </h2>

        <p className="font-body text-sm font-light leading-relaxed mb-10" style={{ color: 'rgba(250,247,242,0.5)' }}>
          {t('newsletter.subtitle')}
        </p>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              className="nl-input"
            />
            <button type="submit" className="nl-btn">
              {t('newsletter.subscribe')}
            </button>
          </form>
        ) : (
          <div className="nl-success flex items-center justify-center gap-3 text-[#c9a96e]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#c9a96e" strokeWidth="1.2" />
              <path d="M5 9l3 3 5-5" stroke="#c9a96e" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-body text-xs tracking-[0.2em] uppercase">{t('newsletter.success')}</span>
          </div>
        )}

        <p className="font-body text-[0.48rem] tracking-widest uppercase mt-5" style={{ color: 'rgba(250,247,242,0.2)' }}>
          {t('newsletter.privacy')}
        </p>

      </div>
    </section>
  );
}
