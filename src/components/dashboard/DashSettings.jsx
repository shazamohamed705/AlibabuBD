import { useState } from 'react';

const getSavedUser = () => {
  try { return JSON.parse(localStorage.getItem('aurevia_user') || 'null'); } catch { return null; }
};

export default function DashSettings() {
  const savedUser = getSavedUser();
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState({
    firstName: savedUser?.name?.split(' ')[0] || '',
    lastName:  savedUser?.name?.split(' ').slice(1).join(' ') || '',
    email:     savedUser?.email || '',
    phone:     savedUser?.phone || '',
  });

  const initials = `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const inputStyle = {
    width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem',
    color: '#111827', background: '#f9fafb',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    padding: '0.7rem 1rem', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <style>{`.dash-input:focus { border-color: #16a34a !important; box-shadow: 0 0 0 3px rgba(22,163,74,0.1) !important; background: #fff !important; }`}</style>

      {/* Profile card */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ background: '#f0fdf4', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: 700 }}>
              {initials}
            </div>
            <div>
              <p style={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>
                {data.firstName} {data.lastName}
              </p>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#6b7280', margin: 0 }}>{data.email}</p>
            </div>
          </div>
          <button onClick={() => setEditMode(e => !e)} style={{
            fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600,
            padding: '8px 18px', borderRadius: '8px',
            background: editMode ? '#f3f4f6' : '#16a34a',
            color: editMode ? '#374151' : '#fff',
            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {editMode ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {saved && (
          <div style={{ background: '#dcfce7', padding: '10px 1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>Profile updated successfully!</span>
          </div>
        )}

        <div style={{ padding: '1.5rem' }}>
          {editMode ? (
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="settings-grid">
                <style>{`@media(max-width:500px){.settings-grid{grid-template-columns:1fr!important}}`}</style>
                {[
                  { key: 'firstName', label: 'First Name' },
                  { key: 'lastName',  label: 'Last Name'  },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input type="text" value={data[f.key]}
                      onChange={e => setData({ ...data, [f.key]: e.target.value })}
                      style={inputStyle} className="dash-input" />
                  </div>
                ))}
                <div>
                  <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
                  <input type="email" value={data.email}
                    onChange={e => setData({ ...data, email: e.target.value })}
                    style={inputStyle} className="dash-input" />
                </div>
                <div>
                  <label style={{ fontFamily: 'Poppins', fontSize: '0.75rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Phone</label>
                  <input type="tel" value={data.phone}
                    onChange={e => setData({ ...data, phone: e.target.value })}
                    style={inputStyle} className="dash-input" />
                </div>
              </div>
              <button type="submit" style={{
                fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 700,
                padding: '10px 24px', borderRadius: '8px', border: 'none',
                background: '#16a34a', color: '#fff', cursor: 'pointer',
              }}>
                Save Changes
              </button>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="settings-grid">
              {[
                { label: 'First Name', value: data.firstName },
                { label: 'Last Name',  value: data.lastName  },
                { label: 'Email',      value: data.email     },
                { label: 'Phone',      value: data.phone || '—' },
              ].map(f => (
                <div key={f.label} style={{ background: '#f9fafb', borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.68rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>{f.label}</p>
                  <p style={{ fontFamily: 'Poppins', fontSize: '0.88rem', color: '#111827', margin: 0 }}>{f.value || '—'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Notifications prefs */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'Poppins', fontSize: '0.95rem', fontWeight: 700, color: '#111827', margin: '0 0 1rem' }}>
          Notification Preferences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Order Updates',     desc: 'Get notified about your order status'    },
            { label: 'Exclusive Offers',  desc: 'Receive deals and promotional offers'    },
            { label: 'Price Drop Alerts', desc: 'Know when wishlist items go on sale'     },
          ].map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', cursor: 'pointer' }}>
              <div>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.72rem', color: '#6b7280', margin: 0 }}>{item.desc}</p>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#16a34a', flexShrink: 0, marginTop: '2px' }} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
