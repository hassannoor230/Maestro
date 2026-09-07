import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIConcierge from './components/ai/AIConcierge';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-primary text-[#F5F3ED]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
        <AIConcierge />
      </div>
    </BrowserRouter>
  );
}

export default App;
