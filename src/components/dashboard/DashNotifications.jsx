import { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useTheme } from '../../context/ThemeContext';

const orderIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M12 7h2l1.5 2.5V13h-3.5V7z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="4" cy="14" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
    <circle cx="11" cy="14" r="1.2" stroke="currentColor" strokeWidth="1.1"/>
  </svg>
);

const heartIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.6 8 3.5C8.8 2.6 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

const sparkleIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const defs = [
  { id: 1, type: 'order',    titleKey: 'notifOrderShipped',      descKey: 'notifOrderShippedDesc',     timeKey: 'notif2hAgo', read: false, icon: orderIcon },
  { id: 2, type: 'wishlist', titleKey: 'notifBackInStock',       descKey: 'notifBackInStockDesc',      timeKey: 'notif2dAgo', read: false, icon: heartIcon },
  { id: 3, type: 'order',    titleKey: 'notifOrderDelivered',    descKey: 'notifOrderDeliveredDesc',   timeKey: 'notif2wAgo', read: true,  icon: orderIcon },
  { id: 4, type: 'promo',    titleKey: 'notifNewCollection',     descKey: 'notifNewCollectionDesc',    timeKey: 'notif3wAgo', read: true,  icon: sparkleIcon },
];

export default function DashNotifications() {
  const { t }    = useI18n();
  const { dark } = useTheme();

  const c = {
    bg:            dark ? '#16140f' : '#ffffff',
    border:        dark ? '#2d2926' : '#ede8e0',
    text:          dark ? '#faf7f2' : '#1a1612',
    muted:         dark ? '#a09080' : '#8b7d6b',
    itemBorder:    dark ? '#2a2520' : '#f0eeeb',
    hoverBg:       dark ? 'rgba(255,255,255,0.04)' : '#faf9f7',
    unreadBg:      dark ? 'rgba(201,169,110,0.12)' : '#fdf8ee',
    unreadHoverBg: dark ? 'rgba(201,169,110,0.18)' : '#faf3e0',
    iconReadBg:    dark ? '#2a2520' : '#f0eeeb',
    iconReadColor: dark ? '#a09080' : '#8b7d6b',
    iconUnreadBg:  dark ? 'rgba(201,169,110,0.18)' : '#f5edda',
    markAllHover:  dark ? '#faf7f2' : '#1a1612',
  };

  const initialNotifs = defs.map(d => ({
    ...d,
    title: t(`dashboard.${d.titleKey}`),
    desc:  t(`dashboard.${d.descKey}`),
    time:  t(`dashboard.${d.timeKey}`),
  }));
  const [notifs, setNotifs] = useState(initialNotifs);
  const unread = notifs.filter(n => !n.read).length;

  const markRead   = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()  => setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  return (
    <div style={{ animation: 'dashFade 0.5s ease both' }}>
      <style>{`
        @keyframes dashFade { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .notif-item {
          display:flex; align-items:flex-start; gap:1rem;
          padding:1rem 1.25rem;
          border-radius:16px;
          transition:background 0.2s ease;
          cursor:pointer;
          border-bottom:1px solid var(--n-border);
        }
        .notif-item:last-child { border-bottom:none; }
        .notif-item:hover { background: var(--n-hover); }
        .notif-item.unread { background: var(--n-unread); }
        .notif-item.unread:hover { background: var(--n-unread-hover); }
        .notif-dot {
          width:7px; height:7px; border-radius:50%;
          background:#c9a96e; flex-shrink:0; margin-top:5px;
          transition:opacity 0.3s ease;
        }
        .mark-all {
          font-family:'Montserrat',sans-serif;
          font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase;
          color:var(--n-muted); cursor:pointer; background:none; border:none;
          transition:color 0.2s ease;
        }
        .mark-all:hover { color: var(--n-mark-hover); }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-light flex items-center gap-2" style={{ color: c.text }}>
          {t('dashboard.notifications')}
          {unread > 0 && (
            <span className="font-body text-sm font-light" style={{ color: c.muted }}>({unread})</span>
          )}
        </h2>
        {unread > 0 && (
          <button className="mark-all" onClick={markAllRead}>{t('dashboard.markAllAsRead')}</button>
        )}
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden"
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          '--n-border': c.itemBorder,
          '--n-hover': c.hoverBg,
          '--n-unread': c.unreadBg,
          '--n-unread-hover': c.unreadHoverBg,
          '--n-muted': c.muted,
          '--n-mark-hover': c.markAllHover,
        }}>
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`notif-item ${!n.read ? 'unread' : ''}`}
            onClick={() => markRead(n.id)}
          >
            {/* Icon */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: n.read ? c.iconReadBg : c.iconUnreadBg,
                color: n.read ? c.iconReadColor : '#c9a96e',
              }}
            >
              {n.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium leading-tight mb-0.5" style={{ color: c.text }}>{n.title}</p>
              <p className="font-body text-xs font-light leading-relaxed" style={{ color: c.muted }}>{n.desc}</p>
            </div>

            {/* Time + dot */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className="font-body text-[0.48rem] whitespace-nowrap" style={{ color: c.muted }}>{n.time}</span>
              {!n.read && <div className="notif-dot" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
