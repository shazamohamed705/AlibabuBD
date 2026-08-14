import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';

const helpLinks = [
  { label: 'Contact Us', to: '/contact'              },
  { label: 'My Orders',  to: '/dashboard'             },
  { label: 'Shipping',   to: '/policies?tab=shipping' },
  { label: 'Returns',    to: '/policies?tab=returns'  },
  { label: 'FAQ',        to: '/contact'               },
];

const socialLinks = [
  {
    label: 'Facebook', href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Instagram', href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp', href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Email', href: 'mailto:info@alibabubd.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const contactItems = [
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#9ca3af" strokeWidth="1.6"/><circle cx="12" cy="10" r="3" stroke="#9ca3af" strokeWidth="1.6"/></svg>,
    text: 'Dhaka, Bangladesh',
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.36 1.18a2 2 0 011.99-1.18H5.35a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l.77-.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    text: '+880 1234 567890',
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    text: 'info@alibabubd.com',
  },
  {
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="1.6"/><polyline points="12,6 12,12 16,14" stroke="#9ca3af" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    text: 'Sat–Thu: 9am – 9pm',
  },
];

export default function Footer() {
  const { apiCategories } = useProducts();

  const shopLinks = apiCategories.length > 0
    ? apiCategories.filter(c => c.isActive !== false).slice(0, 6).map(c => ({ label: c.name, to: `/shop?category=${c._id}` }))
    : [
        { label: 'All Products', to: '/shop' },
        { label: 'New Arrivals', to: '/shop?category=new' },
        { label: 'Best Sellers', to: '/shop?category=bestsellers' },
      ];

  return (
    <footer style={{ background: '#111827', fontFamily: 'Poppins, sans-serif' }}>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <img
                src="https://cdn.phototourl.com/member/2026-05-11-f794e908-eeb4-479c-ac42-66b5b1cbcdb3.jpg"
                alt="AlibabuBD"
                style={{ height: '36px', width: 'auto', borderRadius: '5px' }}
                onError={e => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                Alibab<span style={{ color: '#f97316' }}>u</span>BD
              </span>
            </Link>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Your trusted online shopping destination. Quality products, fast delivery.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1f2937', color: '#9ca3af', transition: 'background 0.2s, color 0.2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#1f2937'; e.currentTarget.style.color = '#9ca3af'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shop</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Help</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {helpLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {contactItems.map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {icon}
                  <span style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#9ca3af' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #1f2937' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#6b7280', margin: 0 }}>
            © {new Date().getFullYear()} AlibabuBD. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Privacy Policy', to: '/policies?tab=privacy'  },
              { label: 'Terms of Use',   to: '/policies?tab=shipping' },
              { label: 'Returns',        to: '/policies?tab=returns'  },
            ].map(item => (
              <Link key={item.label} to={item.to} style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#9ca3af'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
