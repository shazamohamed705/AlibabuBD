import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashSidebar       from '../components/dashboard/DashSidebar';
import DashOverview      from '../components/dashboard/DashOverview';
import DashOrders        from '../components/dashboard/DashOrders';
import DashWishlist      from '../components/dashboard/DashWishlist';
import DashAddresses     from '../components/dashboard/DashAddresses';
import DashSettings      from '../components/dashboard/DashSettings';
import DashNotifications from '../components/dashboard/DashNotifications';

const VIEWS = {
  overview:  DashOverview,
  orders:    DashOrders,
  wishlist:  DashWishlist,
  addresses: DashAddresses,
  settings:  DashSettings,
  notifs:    DashNotifications,
};

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const [active, setActive] = useState(searchParams.get('tab') || 'overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && VIEWS[tab]) setActive(tab);
  }, [searchParams]);

  const View = VIEWS[active] || DashOverview;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Poppins, sans-serif' }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
            My Account
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
          className="dash-layout">
          <style>{`
            @media (max-width: 768px) {
              .dash-layout { flex-direction: column !important; }
              .dash-sidebar { width: 100% !important; }
            }
          `}</style>

          {/* Sidebar */}
          <div className="dash-sidebar" style={{ width: '220px', flexShrink: 0 }}>
            <DashSidebar active={active} setActive={setActive} />
          </div>

          {/* Main content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <View />
          </main>
        </div>
      </div>
    </div>
  );
}
