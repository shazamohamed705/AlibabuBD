import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { key: 'home',      label: 'Home',      href: '/'          },
  { key: 'favorites', label: 'Favorites', href: '/favorites'  },
  { key: 'myorders',  label: 'My Orders', href: '/dashboard'  },
];

export default function Header() {
  const [scrolled,      setScrolled]      = useState(false);
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const userMenuRef = useRef(null);
  const location    = useLocation();
  const navigate    = useNavigate();
  const { setIsOpen, count } = useCart();
  const { user, logout }     = useAuth();

  const savedUser = (() => {
    try { return JSON.parse(localStorage.getItem('aurevia_user') || 'null'); } catch { return null; }
  })();

  // Always light mode
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('aurevia-theme', 'light');
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Base ── */
        .ali-header {
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
        }

        /* ── Material Symbols ── */
        .ms {
          font-family: 'Material Symbols Outlined';
          font-weight: normal; font-style: normal;
          line-height: 1; letter-spacing: normal;
          text-transform: none; display: inline-block;
          white-space: nowrap; word-wrap: normal;
          direction: ltr; font-feature-settings: 'liga';
          -webkit-font-smoothing: antialiased;
          font-size: 22px;
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          user-select: none;
        }
        .ms-sm { font-size: 18px; }
        .ms-fill {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        /* ── Logo ── */
        .ali-logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          color: #111827 !important; letter-spacing: -0.02em;
          text-decoration: none;
        }
        .ali-logo-text span { color: #f97316; }

        /* ── Nav links ── */
        .ali-nav-link {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem; font-weight: 600;
          color: #14532d !important; text-decoration: none;
          padding: 0.3rem 0; position: relative;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .ali-nav-link::after {
          content: ''; position: absolute;
          bottom: -1px; left: 0; width: 0; height: 2px;
          background: #dc2626; border-radius: 2px;
          transition: width 0.25s ease;
        }
        .ali-nav-link:hover { color: #dc2626 !important; }
        .ali-nav-link:hover::after { width: 100%; }
        .ali-nav-link.active { color: #dc2626 !important; font-weight: 700; }
        .ali-nav-link.active::after { width: 100%; }

        /* ── Icon button ── */
        .ali-icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 40px; height: 40px; border-radius: 50%;
          border: none; background: transparent !important;
          cursor: pointer; color: #4b5563 !important;
          transition: background 0.18s, color 0.18s;
          position: relative; flex-shrink: 0;
        }
        .ali-icon-btn:hover {
          background: #dcfce7 !important;
          color: #14532d !important;
        }

        /* ── Badge ── */
        .ali-badge {
          position: absolute; top: 2px; right: 2px;
          min-width: 17px; height: 17px; border-radius: 999px;
          background: #dc2626; color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.55rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }

        /* ── Search row ── */
        .ali-search-form {
          display: flex; align-items: center; gap: 0.6rem;
          background: #f3f4f6 !important;
          border: 1.5px solid #f3f4f6;
          border-radius: 999px;
          padding: 0.45rem 0.6rem 0.45rem 1rem;
          width: 100%;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .ali-search-form:focus-within {
          background: #fff !important;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
        }
        .ali-search-form input {
          border: none; background: transparent !important;
          outline: none; flex: 1;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem; color: #111827 !important;
        }
        .ali-search-form input::placeholder { color: #9ca3af; }
        .ali-search-btn {
          background: #16a34a; color: #fff;
          border: none; cursor: pointer;
          padding: 0.38rem 1.1rem; border-radius: 999px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          flex-shrink: 0; transition: background 0.18s;
          display: flex; align-items: center; gap: 0.3rem;
        }
        .ali-search-btn:hover { background: #15803d; }

        /* ── User dropdown ── */
        .ali-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          min-width: 210px; background: #fff;
          border-radius: 14px; overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          border: 1px solid #f3f4f6;
          animation: aliDropIn 0.18s ease;
          z-index: 100;
        }
        @keyframes aliDropIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ali-drop-item {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.7rem 1rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem; color: #374151;
          cursor: pointer; transition: background 0.15s;
          text-decoration: none; border: none;
          background: none; width: 100%; text-align: left;
        }
        .ali-drop-item:hover { background: #dcfce7; color: #14532d; }
        .ali-drop-item .ms { font-size: 18px; }

        /* ── Mobile drawer ── */
        .ali-drawer {
          position: fixed; top: 0; right: 0; height: 100%;
          width: 285px; background: #fff; z-index: 60;
          box-shadow: -4px 0 32px rgba(0,0,0,0.13);
          transition: transform 0.32s cubic-bezier(.22,1,.36,1);
          display: flex; flex-direction: column;
        }
        @media (min-width: 1024px) {
          .ali-drawer { display: none !important; }
          .ali-backdrop { display: none !important; }
          .ali-mobile-only { display: none !important; }
        }
        @media (max-width: 1023px) {
          .ali-desktop-only { display: none !important; }
        }
        .ali-mob-link {
          display: flex; align-items: center; gap: 0.6rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem; font-weight: 500; color: #374151;
          text-decoration: none; padding: 0.8rem 1rem;
          border-radius: 10px; transition: background 0.15s, color 0.15s;
        }
        .ali-mob-link:hover, .ali-mob-link.active {
          background: #dcfce7; color: #14532d;
        }
        .ali-mob-link .ms { font-size: 20px; }
      `}</style>

      {/* ════════════════════ HEADER ════════════════════ */}
      <header
        className="ali-header fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.85)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 0 #f3f4f6',
          transition: 'background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* ── ROW 1: Logo · Nav · Icons ── */}
          <div style={{ display: 'flex', alignItems: 'center', height: scrolled ? '52px' : '70px', gap: '1.5rem', transition: 'height 0.3s ease' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
              <img
                src="https://cdn.phototourl.com/member/2026-05-11-f794e908-eeb4-479c-ac42-66b5b1cbcdb3.jpg"
                alt="AlibabuBD logo"
                style={{ height: scrolled ? '32px' : '44px', width: 'auto', objectFit: 'contain', borderRadius: '6px', transition: 'height 0.3s ease' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span className="ali-logo-text">Alibab<span>u</span>BD</span>
            </Link>

            {/* Desktop nav — centered */}
            <nav className="ali-desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {navLinks.map(link => (
                <Link
                  key={link.key}
                  to={link.href}
                  className={`ali-nav-link${location.pathname === link.href ? ' active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {/* User inside nav center */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button className="ali-icon-btn" onClick={() => setUserMenuOpen(v => !v)} aria-label="Account">
                  {savedUser ? (
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 700 }}>
                      {(savedUser.name || savedUser.email || 'U')[0].toUpperCase()}
                    </div>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="ali-dropdown">
                    {user ? (
                      <>
                        <div style={{ padding: '0.9rem 1rem 0.7rem', borderBottom: '1px solid #f3f4f6' }}>
                          <p style={{ fontFamily: 'Poppins', fontSize: '0.83rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                            {savedUser?.name || user.displayName || 'User'}
                          </p>
                          <p style={{ fontFamily: 'Poppins', fontSize: '0.7rem', color: '#6b7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {savedUser?.email || user.email}
                          </p>
                        </div>
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="ali-drop-item"><span className="ms">dashboard</span> Dashboard</Link>
                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="ali-drop-item"><span className="ms">receipt_long</span> My Orders</Link>
                        <button onClick={() => { logout(); localStorage.removeItem('aurevia_user'); localStorage.removeItem('aurevia_token'); setUserMenuOpen(false); navigate('/'); }} className="ali-drop-item" style={{ color: '#ef4444' }}>
                          <span className="ms" style={{ color: '#ef4444' }}>logout</span> Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="ali-drop-item">
                        <span className="ms">login</span> Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </nav>

            {/* Cart — right side only */}
            <div className="ali-desktop-only" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              <button className="ali-icon-btn" style={{ position: 'relative' }} onClick={() => setIsOpen(true)} aria-label="Cart">
                <span className="ms">shopping_bag</span>
                {count > 0 && <span className="ali-badge">{count}</span>}
              </button>
            </div>

            {/* Mobile: hamburger only */}
            <div className="ali-mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
              <button className="ali-icon-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
                <span className="ms">{menuOpen ? 'close' : 'menu'}</span>
              </button>
            </div>

          </div>{/* end row 1 */}

          {/* ── ROW 2: Search bar ── */}
          <div className="ali-desktop-only" style={{ paddingBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <form className="ali-search-form" onSubmit={handleSearch} style={{ maxWidth: '680px' }}>
              <span className="ms ms-sm" style={{ color: '#9ca3af', flexShrink: 0 }}>search</span>
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="ali-search-btn">
                <span className="ms ms-sm">search</span>
                Search
              </button>
            </form>
          </div>

        </div>
      </header>

      {/* ════════ Mobile Backdrop ════════ */}
      <div
        className="ali-backdrop lg:hidden"
        style={{
          position: 'fixed', inset: 0, zIndex: 55,
          background: 'rgba(0,0,0,0.38)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* ════════ Mobile Drawer ════════ */}
      <div
        className="ali-drawer lg:hidden"
        style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Drawer top */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src="https://cdn.phototourl.com/member/2026-05-11-f794e908-eeb4-479c-ac42-66b5b1cbcdb3.jpg"
              alt="AlibabuBD"
              style={{ height: '32px', width: 'auto', borderRadius: '4px' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            <span className="ali-logo-text" style={{ fontSize: '1.1rem' }}>Alibab<span>u</span>BD</span>
          </div>
          <button className="ali-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close">
            <span className="ms">close</span>
          </button>
        </div>

        {/* Search in drawer */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
          <form className="ali-search-form" onSubmit={handleSearch}>
            <span className="ms ms-sm" style={{ color: '#9ca3af' }}>search</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
          <Link to="/"          className={`ali-mob-link${location.pathname === '/' ? ' active' : ''}`}          onClick={() => setMenuOpen(false)}><span className="ms">home</span> Home</Link>
          <Link to="/favorites" className={`ali-mob-link${location.pathname === '/favorites' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="ms">favorite</span> Favorites</Link>
          <Link to="/dashboard" className={`ali-mob-link${location.pathname === '/dashboard' ? ' active' : ''}`} onClick={() => setMenuOpen(false)}><span className="ms">receipt_long</span> My Orders</Link>
        </nav>

        {/* Auth bottom */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f3f4f6' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                {savedUser?.name || user.displayName || 'User'}
              </p>
              <button
                onClick={() => { logout(); localStorage.removeItem('aurevia_user'); localStorage.removeItem('aurevia_token'); setMenuOpen(false); navigate('/'); }}
                style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <span className="ms ms-sm" style={{ color: '#ef4444' }}>logout</span> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="ali-mob-link" onClick={() => setMenuOpen(false)}>
              <span className="ms">login</span> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="header-spacer" />
      <style>{`
        .header-spacer { height: 120px; }
        @media (max-width: 1023px) { .header-spacer { height: 0px; } }
      `}</style>
    </>
  );
}
