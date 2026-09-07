import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className={`glass rounded-2xl mt-2 sm:mt-4 px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'shadow-2xl shadow-black/30 bg-primary/95' : ''
          }`}
        >
          <Link to="/" className="group flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-wider text-champagne group-hover:text-gold transition-all duration-300">
              MAESTRO CAFE
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 text-sm">
            {[
              { path: '/', label: 'Home' },
              { path: '/menu', label: 'Menu' },
              { path: '/reservation', label: 'Reservation' },
            ].map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`relative group transition-all duration-300 ${
                  location.pathname === item.path ? 'text-gold' : 'text-muted hover:text-champagne'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/reservation" 
              className="btn-gold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 hidden sm:block"
            >
              RESERVE TABLE
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-champagne p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="glass rounded-2xl mt-2 p-4 space-y-3">
            <Link to="/" className="block py-2 text-champagne hover:text-gold transition-colors">Home</Link>
            <Link to="/menu" className="block py-2 text-champagne hover:text-gold transition-colors">Menu</Link>
            <Link to="/reservation" className="block py-2 text-champagne hover:text-gold transition-colors">Reservation</Link>
            <Link to="/reservation" className="block btn-gold py-2 px-4 rounded-full text-sm text-center mt-4">
              RESERVE TABLE
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
