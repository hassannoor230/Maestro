import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIConcierge from './components/ai/AIConcierge';

function AppContent() {
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (mainRef.current) {
        gsap.fromTo(
          '.page-content',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
      }
    }, mainRef.current);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <div ref={mainRef} className="min-h-screen bg-primary text-[#F5F3ED]">
        <Routes location={location}>
          <Route path="/" element={
            <div className="page-content"><Home /></div>
          } />
          <Route path="/menu" element={
            <div className="page-content"><Menu /></div>
          } />
          <Route path="/reservation" element={
            <div className="page-content"><Reservation /></div>
          } />
          <Route path="/admin" element={
            <div className="page-content"><Admin /></div>
          } />
        </Routes>
      </div>
      <Footer />
      <AIConcierge />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
