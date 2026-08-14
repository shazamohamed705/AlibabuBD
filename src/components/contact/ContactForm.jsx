import { useState } from 'react';
import emailjs from '@emailjs/browser';

const contactInfo = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
    label: 'Address',
    value: 'Dhaka, Bangladesh',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.36 1.18a2 2 0 011.99-1.18H5.35a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l.77-.77a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Phone',
    value: '+880 1234 567890',
    href: 'tel:+8801234567890',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Email',
    value: 'info@alibabubd.com',
    href: 'mailto:info@alibabubd.com',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Working Hours',
    value: 'Sat–Thu: 9:00 AM – 9:00 PM',
  },
];

export default function ContactForm() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, subject: form.subject, message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      const to      = encodeURIComponent('info@alibabubd.com');
      const subject = encodeURIComponent(form.subject || 'Message from AlibabuBD');
      const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`https://mail.google.com/mail/?view=cm&to=${to}&su=${subject}&body=${body}`, '_blank');
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  const inputStyle = {
    width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem',
    color: '#111827', background: '#f9fafb',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    padding: '0.75rem 1rem', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <section style={{ fontFamily: 'Poppins, sans-serif', background: '#fff', paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.75rem', fontWeight: 800, color: '#14532d', margin: '0 0 8px' }}>
            Contact Us
          </h1>
          <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', color: '#6b7280', margin: 0 }}>
            Have a question or need help? We're here for you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2.5rem', alignItems: 'start' }}
          className="contact-grid">
          <style>{`
            @media (max-width: 768px) {
              .contact-grid { grid-template-columns: 1fr !important; }
            }
            .cf-input-ali:focus {
              border-color: #16a34a !important;
              box-shadow: 0 0 0 3px rgba(22,163,74,0.1) !important;
              background: #fff !important;
            }
          `}</style>

          {/* Left — info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Info cards */}
            {contactInfo.map((info, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                padding: '16px', borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                background: '#fff',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: '#f0fdf4', color: '#16a34a', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {info.icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.68rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 3px' }}>
                    {info.label}
                  </p>
                  {info.href ? (
                    <a href={info.href} style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#111827', textDecoration: 'none', fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#16a34a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#111827'}
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#111827', margin: 0, fontWeight: 500 }}>
                      {info.value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #f0f0f0', background: '#fff' }}>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', fontWeight: 700, color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Follow Us
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { label: 'Facebook',  href: '#', bg: '#1877f2',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  { label: 'Instagram', href: '#', bg: '#e1306c',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1" fill="#fff"/></svg> },
                  { label: 'WhatsApp',  href: '#', bg: '#25d366',
                    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label} style={{
                    width: '38px', height: '38px', borderRadius: '8px',
                    background: s.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            {!sent ? (
              <>
                <h2 style={{ fontFamily: 'Poppins', fontSize: '1.1rem', fontWeight: 700, color: '#111827', margin: '0 0 1.5rem' }}>
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}
                    className="form-row">
                    <style>{`@media(max-width:500px){.form-row{grid-template-columns:1fr!important}}`}</style>
                    <div>
                      <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text" required placeholder="Your name"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="cf-input-ali" style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email" required placeholder="your@email.com"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        className="cf-input-ali" style={inputStyle}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Subject *
                    </label>
                    <input
                      type="text" required placeholder="How can we help?"
                      value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="cf-input-ali" style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                      Message *
                    </label>
                    <textarea
                      required rows={5} placeholder="Write your message here..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className="cf-input-ali" style={{ ...inputStyle, resize: 'none' }}
                    />
                  </div>

                  <button type="submit" disabled={sending} style={{
                    fontFamily: 'Poppins', fontSize: '0.9rem', fontWeight: 700,
                    padding: '13px', borderRadius: '10px', border: 'none',
                    background: sending ? '#15803d' : '#16a34a', color: '#fff',
                    cursor: sending ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                    onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#15803d'; }}
                    onMouseLeave={e => { if (!sending) e.currentTarget.style.background = '#16a34a'; }}
                  >
                    {sending ? (
                      <>
                        <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'cfSpin 0.7s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <line x1="22" y1="2" x2="11" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                  <style>{`@keyframes cfSpin { to { transform: rotate(360deg); } }`}</style>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', gap: '1rem', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 700, color: '#111827', margin: 0 }}>
                  Message Sent!
                </h3>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#6b7280', margin: 0 }}>
                  Thank you! We'll get back to you within 24 hours.
                </p>
                <button onClick={() => setSent(false)} style={{
                  fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 600,
                  color: '#16a34a', background: 'none', border: '1.5px solid #16a34a',
                  borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', marginTop: '8px',
                }}>
                  Send Another
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
