import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useI18n }  from '../i18n/i18nContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth }  from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { t }    = useI18n();
  const { dark } = useTheme();
  const { signInWithGoogle } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [done,    setDone]    = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      setDone(true);
    } catch (e) {
      setError(e.message || 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success ─────────────────────────────────────────────────────────────────
  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-6 relative"
      style={{ background: dark ? '#0f0d0b' : '#f2f0ed' }}>
      <style>{`
        .success-wrap { animation: successIn 0.7s cubic-bezier(.22,1,.36,1) both; }
        @keyframes successIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        .check-circle { animation: checkPop 0.6s cubic-bezier(.22,1,.36,1) 0.2s both; }
        @keyframes checkPop { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
        .success-btn {
          width:100%; background:${dark ? '#c9a96e' : '#1a1612'}; color:${dark ? '#1a1612' : '#faf7f2'}; border:none;
          border-radius:999px; padding:1rem;
          font-family:'Montserrat',sans-serif; font-size:0.6rem; font-weight:600;
          letter-spacing:0.28em; text-transform:uppercase;
          cursor:pointer; transition:background 0.3s ease,transform 0.2s ease;
        }
        .success-btn:hover { background:${dark ? '#e8c885' : '#2d2520'}; transform:scale(1.02); }
      `}</style>

      {dark && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)' }} />
      )}

      <Link to="/" className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
        style={{ border: `1px solid ${dark ? '#2d2926' : '#d4c9b8'}` }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <line x1="1" y1="1" x2="11" y2="11" stroke={dark ? '#a09080' : '#8b7d6b'} strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="11" y1="1" x2="1" y2="11" stroke={dark ? '#a09080' : '#8b7d6b'} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </Link>

      <div className="success-wrap w-full max-w-sm text-center flex flex-col items-center gap-5">
        <div className="check-circle w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: dark ? 'rgba(201,169,110,0.15)' : '#e0ddd8', border: dark ? '1px solid rgba(201,169,110,0.3)' : 'none' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-12" stroke={dark ? '#c9a96e' : '#8b7d6b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 className="font-display font-light mb-2"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.5px', color: dark ? '#faf7f2' : '#1a1612' }}>
            {t('login.welcomeTitle')}
          </h1>
          <p className="font-body text-sm font-light" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
            {t('login.accountReady')}
          </p>
        </div>
        <button className="success-btn mt-4" onClick={() => navigate('/dashboard')}>
          {t('login.continueShopping')}
        </button>
      </div>
    </div>
  );

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: dark ? '#0f0d0b' : '#faf7f2' }}>
      <style>{`
        .login-left { animation: loginFadeIn 0.8s cubic-bezier(.22,1,.36,1) both; }
        @keyframes loginFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .google-btn {
          width:100%; display:flex; align-items:center; justify-content:center; gap:0.75rem;
          background:#fff; border:1.5px solid #e8e2d8; border-radius:14px;
          padding:1rem; font-family:'Montserrat',sans-serif; font-size:0.72rem;
          font-weight:500; color:#1a1612; cursor:pointer;
          transition:border-color 0.25s ease,box-shadow 0.25s ease,transform 0.2s ease;
        }
        .google-btn:hover { border-color:#c9a96e; box-shadow:0 2px 16px rgba(0,0,0,0.08); transform:scale(1.01); }
        .google-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .login-right { animation: loginSlideIn 1s cubic-bezier(.22,1,.36,1) 0.1s both; }
        @keyframes loginSlideIn { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* ── Left ── */}
      <div className="login-left w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 min-h-screen"
        style={{ background: dark ? '#0f0d0b' : '#faf7f2' }}>

        <Link to="/" className="mb-12 block">
          <img src="/Frame 1984079817.png" alt="Aurevia" className="h-7 w-auto object-contain" />
        </Link>

        <h1 className="font-display font-light text-[#1a1612] mb-3"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)', letterSpacing: '-0.5px', color: dark ? '#faf7f2' : '#1a1612' }}>
          {t('login.welcome')}
        </h1>
        <p className="font-body text-sm font-light mb-10" style={{ color: dark ? '#a09080' : '#8b7d6b' }}>
          Sign in to your account to continue
        </p>

        {/* Google button */}
        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-[#c9a96e] border-t-transparent animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="font-body text-xs text-red-500 text-center mt-4">{error}</p>
        )}

        <p className="font-body text-[0.48rem] text-[#8b7d6b] text-center mt-8">
          By continuing, you agree to our{' '}
          <Link to="/policies?tab=privacy" className="underline hover:text-[#c9a96e] transition-colors">{t('login.privacy')}</Link>.
        </p>
      </div>

      {/* ── Right image ── */}
      <div className="login-right hidden lg:block flex-1 relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <img src="/download.jpg" alt="A world of fragrance"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.72) 0%, rgba(10,8,6,0.1) 55%)' }} />

        <Link to="/" className="absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-white/20"
          style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="1" y1="1" x2="11" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="11" y1="1" x2="1" y2="11" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </Link>

        <div className="absolute bottom-10 left-10 right-10">
          <h2 className="font-display font-light text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', letterSpacing: '-0.5px' }}>
            {t('login.imageTitle')}<br />
            <em className="italic" style={{ fontWeight: 200 }}>{t('login.imageSubtitle')}</em>
          </h2>
          <p className="font-body text-xs font-light text-white/70">{t('login.imageDesc')}</p>
        </div>
      </div>
    </div>
  );
}
