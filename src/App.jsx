import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header        from './components/Header';
import Footer        from './components/Footer';
import CartDrawer    from './components/CartDrawer';
import MobileNav     from './components/MobileNav';

const Home          = lazy(() => import('./pages/Home'));
const Shop          = lazy(() => import('./pages/Shop'));
const About         = lazy(() => import('./pages/About'));
const Journal       = lazy(() => import('./pages/Journal'));
const Contact       = lazy(() => import('./pages/Contact'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Login         = lazy(() => import('./pages/Login'));
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Policies      = lazy(() => import('./pages/Policies'));

function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#faf7f2' }}>
      <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', border: '2px solid #e8d5b0', borderTopColor: '#c9a96e', animation: 'fallbackSpin 0.8s linear infinite' }} />
      <style>{`@keyframes fallbackSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <>
      <CartDrawer />
      <MobileNav />
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/login"     element={<Login />}     />
          <Route path="/dashboard" element={<><Header /><Dashboard /></>} />
          <Route path="/checkout"  element={<><Header /><Checkout /></>}  />
          <Route path="/"          element={<><Header /><Home /><Footer /></>}          />
          <Route path="/shop"      element={<><Header /><Shop /><Footer /></>}          />
          <Route path="/about"     element={<><Header /><About /><Footer /></>}         />
          <Route path="/journal"   element={<><Header /><Journal /><Footer /></>}       />
          <Route path="/contact"     element={<><Header /><Contact /><Footer /></>}       />
          <Route path="/policies"    element={<><Header /><Policies /><Footer /></>}      />
          <Route path="/product/:id" element={<><Header /><ProductDetail /><Footer /></>} />
        </Routes>
      </Suspense>
    </>
  );
}
