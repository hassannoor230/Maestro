import { useState, useEffect } from 'react';
import { 
  login, 
  getDashboard, 
  getReservations, 
  updateReservation,
  getAdminMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  updateSettings,
  uploadImage,
  getAdminReviews,
  deleteReview,
  getAdminMessages,
  getSettings
} from '../lib/api';

type Tab = 'dashboard' | 'menu' | 'reservations' | 'reviews' | 'messages' | 'settings';

const categories = [
  { id: 'chef', label: 'Chef Specials' },
  { id: 'steak', label: 'Steaks' },
  { id: 'asian', label: 'Pan-Asian' },
  { id: 'sandwich', label: 'Sandwiches' },
  { id: 'starter', label: 'Starters' },
  { id: 'salad', label: 'Salads' },
  { id: 'shake', label: 'Shakes' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'drink', label: 'Drinks' },
  { id: 'mocktail', label: 'Mocktails' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'soup', label: 'Soup' },
  { id: 'burger', label: 'Burgers' },
  { id: 'other', label: 'Other' },
];

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('maestro_token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [dash, setDash] = useState<any>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuForm, setMenuForm] = useState({
    name: '', price: '', category: 'chef', description: '', featured: false, popular: false, image: ''
  });
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadDashboard();
      loadMenu();
      loadReviews();
      loadMessages();
      loadSettings();
      loadReservations();
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'reservations' && token) {
      loadReservations();
    }
  }, [activeTab, token]);

  const loadDashboard = async () => {
    try {
      const res = await getDashboard(token);
      setDash(res.data);
    } catch { setToken(''); }
  };

  const loadReservations = async () => {
    try {
      const res = await getReservations(token);
      setReservations(res.data);
    } catch {}
  };

  const loadMenu = async () => {
    try {
      const res = await getAdminMenu(token);
      setMenuItems(res.data);
    } catch {}
  };

  const loadReviews = async () => {
    try {
      const res = await getAdminReviews(token);
      setReviews(res.data);
    } catch {}
  };

  const loadMessages = async () => {
    try {
      const res = await getAdminMessages(token);
      setMessages(res.data);
    } catch {}
  };

  const loadSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch {}
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('maestro_token', res.data.token);
      setToken(res.data.token);
      setError('');
    } catch { setError('Invalid credentials'); }
  };

  const logout = () => {
    localStorage.removeItem('maestro_token');
    setToken('');
  };

  const changeStatus = async (id: string, status: string) => {
    await updateReservation(id, status, token);
    loadReservations();
    loadDashboard();
  };

  const openAddMenuModal = () => {
    setMenuForm({ name: '', price: '', category: 'chef', description: '', featured: false, popular: false, image: '' });
    setEditingMenuId(null);
    setShowMenuModal(true);
  };

  const handleEditMenu = (item: any) => {
    setMenuForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category,
      description: item.description,
      featured: item.featured,
      popular: item.popular,
      image: item.image || ''
    });
    setEditingMenuId(item.id);
    setShowMenuModal(true);
  };

  const handleDeleteMenu = async (id: string) => {
    if (confirm('Delete this menu item?')) {
      await deleteMenuItem(id, token);
      loadMenu();
      loadDashboard();
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const res = await uploadImage(file, token);
      setMenuForm({ ...menuForm, image: res.data.url });
    } catch {}
  };

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...menuForm, price: parseInt(menuForm.price) || 0 };
      if (editingMenuId) {
        await updateMenuItem(editingMenuId, data, token);
      } else {
        await createMenuItem(data, token);
      }
      loadMenu();
      loadDashboard();
      setShowMenuModal(false);
    } catch {}
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this review?')) {
      await deleteReview(id, token);
      loadReviews();
      loadDashboard();
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    try {
      await updateSettings(data, token);
      loadSettings();
      alert('Settings saved successfully!');
    } catch {}
  };

  if (!token) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="glass-strong rounded-2xl p-10 w-full max-w-md space-y-5">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
            <h1 className="font-serif text-3xl text-champagne">Maestro Admin</h1>
            <p className="text-muted text-sm mt-1">Sign in to manage your restaurant</p>
          </div>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full btn-gold py-3 rounded-full">LOGIN</button>
          <p className="text-muted text-xs text-center">admin@maestrocafe.com / maestro2026</p>
        </form>
      </div>
    );
  }

  const NavItem = ({ id, icon, label }: { id: Tab; icon: string; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
        activeTab === id 
          ? 'bg-gradient-to-r from-gold/20 to-amber-500/10 text-gold border border-gold/30 shadow-lg shadow-gold/10' 
          : 'text-muted hover:bg-white/5 hover:text-champagne border border-transparent hover:border-white/10'
      }`}
    >
      <span className="text-lg flex-shrink-0 w-6 text-center">{icon}</span>
      <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-500 ${
        sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
      }`}>
        {label}
      </span>
    </button>
  );

  return (
    <div className="pt-20 pb-16 min-h-screen flex">
      {/* 3D Luxury Menu Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMenuModal(false)} />
          
          <div className="relative w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-3d-modal">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-champagne/10 rounded-2xl sm:rounded-3xl blur-xl" />
            
            <div className="relative glass-luxury rounded-2xl sm:rounded-3xl p-4 sm:p-6 m-2 sm:m-4">
              <button 
                onClick={() => setShowMenuModal(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-muted hover:text-champagne transition-all z-10"
              >
                ✕
              </button>

              <div className="text-center mb-4 sm:mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center shadow-2xl shadow-gold/30">
                  <span className="text-3xl sm:text-4xl">{editingMenuId ? '✏️' : '➕'}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-champagne">
                  {editingMenuId ? 'Edit Menu Item' : 'Add New Item'}
                </h2>
                <p className="text-muted text-xs sm:text-sm mt-2">
                  {editingMenuId ? 'Update the details below' : 'Fill in the details for your new menu item'}
                </p>
              </div>

              <form onSubmit={handleMenuSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm text-gold mb-2 font-medium">Item Name *</label>
                    <input type="text" required value={menuForm.name} onChange={e => setMenuForm({...menuForm, name: e.target.value})}
                      placeholder="e.g. Polo Stuffed Chicken"
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none transition-all focus:shadow-lg focus:shadow-gold/10" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2 font-medium">Price (PKR) *</label>
                    <input type="number" required value={menuForm.price} onChange={e => setMenuForm({...menuForm, price: e.target.value})}
                      placeholder="1490"
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none transition-all focus:shadow-lg focus:shadow-gold/10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gold mb-2 font-medium">Category *</label>
                  <select value={menuForm.category} onChange={e => setMenuForm({...menuForm, category: e.target.value})}
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none transition-all focus:shadow-lg focus:shadow-gold/10">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gold mb-2 font-medium">Description</label>
                  <textarea rows={3} value={menuForm.description} onChange={e => setMenuForm({...menuForm, description: e.target.value})}
                    placeholder="Describe the dish..."
                    className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none transition-all focus:shadow-lg focus:shadow-gold/10" />
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <input type="checkbox" checked={menuForm.featured} onChange={e => setMenuForm({...menuForm, featured: e.target.checked})}
                      className="w-5 h-5 accent-gold" />
                    <span className="text-champagne">★ Featured</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                    <input type="checkbox" checked={menuForm.popular} onChange={e => setMenuForm({...menuForm, popular: e.target.checked})}
                      className="w-5 h-5 accent-gold" />
                    <span className="text-champagne">🔥 Popular</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm text-gold mb-2 font-medium">Image</label>
                  <div className="relative">
                    <input type="text" value={menuForm.image} onChange={e => setMenuForm({...menuForm, image: e.target.value})}
                      placeholder="Paste image URL or upload below"
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none transition-all focus:shadow-lg focus:shadow-gold/10" />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm text-muted mb-2">Or upload image</label>
                    <input type="file" accept="image/*" onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                      className="w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gold/20 file:text-gold file:cursor-pointer hover:file:bg-gold/30 transition-all" />
                    {menuForm.image && (
                      <div className="mt-3 relative inline-block">
                        <img src={menuForm.image} alt="Preview" className="h-24 rounded-xl object-cover border border-gold/30" />
                        <button type="button" onClick={() => setMenuForm({...menuForm, image: ''})}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-xs">
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 btn-gold py-4 rounded-xl text-sm font-medium hover:shadow-2xl hover:shadow-gold/30 transition-all">
                    {editingMenuId ? 'Update Item' : 'Add Item'}
                  </button>
                  <button type="button" onClick={() => setShowMenuModal(false)} 
                    className="px-6 py-4 rounded-xl border border-white/20 text-muted hover:text-champagne hover:border-white/40 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div 
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gradient-to-b from-[#171717] to-[#111111] border-r border-gold/20 transition-all duration-500 z-40 ${
          sidebarOpen ? 'w-72' : 'w-20'
        } hidden lg:block group`}
      >
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        
        <div className="p-4 flex flex-col h-full">
          {/* Header */}
          <div className={`relative flex items-center mb-6 ${sidebarOpen ? 'justify-between' : 'h-24 justify-center'}`}>
            <div className={`flex items-center gap-3 transition-all duration-500 ${
              sidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold/25 ring-1 ring-gold/40">
                <span className="text-black font-serif font-bold text-2xl leading-none">M</span>
              </div>
              <div>
                <span className="font-serif text-xl text-champagne tracking-wider">Admin</span>
                <p className="text-[10px] text-gold/60">Control Panel</p>
              </div>
            </div>
            {/* Logo when collapsed */}
            {!sidebarOpen && (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold/25 ring-1 ring-gold/40">
                <span className="text-black font-serif font-bold text-2xl leading-none">M</span>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className={`p-2 rounded-lg hover:bg-gold/10 text-gold/60 hover:text-gold flex-shrink-0 transition-all duration-300 ${sidebarOpen ? '' : 'absolute bottom-0 left-1/2 -translate-x-1/2'}`}
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <svg className={`w-4 h-4 transition-transform duration-500 ${sidebarOpen ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1.5">
            <NavItem id="dashboard" icon="📊" label="Dashboard" />
            <NavItem id="menu" icon="🍴" label="Menu Items" />
            <NavItem id="reservations" icon="📅" label="Reservations" />
            <NavItem id="reviews" icon="⭐" label="Reviews" />
            <NavItem id="messages" icon="💬" label="Messages" />
            <NavItem id="settings" icon="⚙️" label="Settings" />
          </nav>
          
          {/* Logout */}
          <button onClick={logout} className="mt-4 w-full bg-gradient-to-r from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/10 border border-red-500/20 hover:border-red-500/40 py-2.5 rounded-xl text-sm flex items-center gap-3 overflow-hidden transition-all duration-300 group-hover:px-3">
            <span className="text-lg flex-shrink-0">🚪</span>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-500 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gradient-to-b from-[#171717] to-[#111111] border-r border-gold/20 transition-all duration-500 z-40 w-72 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}>
        {/* Gold top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
        
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-gold via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold/25">
                <span className="text-black font-serif font-bold text-2xl leading-none">M</span>
              </div>
              <div>
                <span className="font-serif text-xl text-champagne tracking-wider">Admin</span>
                <p className="text-[10px] text-gold/60">Control Panel</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 rounded-lg hover:bg-gold/10 text-gold/60 hover:text-gold transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* AI Concierge Button */}
          <button 
            onClick={() => { setAiChatOpen(true); setSidebarOpen(false); }}
            className="w-full mb-4 p-3 rounded-xl bg-gradient-to-r from-gold/20 to-amber-500/10 border border-gold/30 hover:border-gold/50 transition-all duration-300 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/50 via-amber-400/40 to-yellow-600/30 flex items-center justify-center shadow-lg shadow-gold/20">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-2 2v-2H9z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="text-sm font-medium text-champagne">AI Concierge</span>
              <p className="text-[10px] text-gold/60">Chat with Maestro</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>
          </button>
          
          {/* Navigation */}
          <nav className="flex-1 space-y-1.5">
            <NavItem id="dashboard" icon="📊" label="Dashboard" />
            <NavItem id="menu" icon="🍴" label="Menu Items" />
            <NavItem id="reservations" icon="📅" label="Reservations" />
            <NavItem id="reviews" icon="⭐" label="Reviews" />
            <NavItem id="messages" icon="💬" label="Messages" />
            <NavItem id="settings" icon="⚙️" label="Settings" />
          </nav>
          
          {/* Logout */}
          <button onClick={logout} className="mt-4 w-full bg-gradient-to-r from-red-500/10 to-red-600/5 hover:from-red-500/20 hover:to-red-600/10 border border-red-500/20 hover:border-red-500/40 py-2.5 rounded-xl text-sm flex items-center gap-3 transition-all duration-300">
            <span className="text-lg">🚪</span>
            <span className="whitespace-nowrap overflow-hidden">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center mb-6 sm:mb-8 py-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                aria-label={sidebarOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
                aria-expanded={sidebarOpen}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              <h1 className="font-serif text-2xl sm:text-3xl text-champagne capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'menu' ? 'Menu Management' :
               activeTab === 'reservations' ? 'Reservations' :
               activeTab === 'reviews' ? 'Reviews' :
               activeTab === 'messages' ? 'Messages' : 'Settings'}
              </h1>
            </div>
          </div>

          {/* Dashboard */}
          {activeTab === 'dashboard' && dash && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="glass rounded-xl p-4 sm:p-6">
                  <p className="text-muted text-xs uppercase tracking-wider">Total Reservations</p>
                  <p className="font-serif text-4xl text-gold mt-2">{dash.totalReservations}</p>
                </div>
                <div className="glass rounded-xl p-6">
                  <p className="text-muted text-xs uppercase tracking-wider">Pending</p>
                  <p className="font-serif text-4xl text-yellow-400 mt-2">{dash.pendingReservations}</p>
                </div>
                <div className="glass rounded-xl p-6">
                  <p className="text-muted text-xs uppercase tracking-wider">Menu Items</p>
                  <p className="font-serif text-4xl text-gold mt-2">{dash.menuItems}</p>
                </div>
                <div className="glass rounded-xl p-6">
                  <p className="text-muted text-xs uppercase tracking-wider">Delivery Orders</p>
                  <p className="font-serif text-4xl text-green-400 mt-2">{dash.deliveryReservations}</p>
                </div>
              </div>
            </>
          )}

          {/* Menu Management */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="glass rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-serif text-2xl text-champagne">Menu Items</h2>
                    <p className="text-muted text-sm mt-1">Manage your restaurant menu</p>
                  </div>
                  <button onClick={openAddMenuModal} className="btn-gold px-6 py-3 rounded-xl flex items-center gap-2">
                    <span className="text-lg">➕</span> Add New Item
                  </button>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-xl text-champagne mb-4">All Menu Items ({menuItems.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="py-3 px-2 text-sm text-muted">Image</th>
                        <th className="py-3 px-2 text-sm text-muted">Name</th>
                        <th className="py-3 px-2 text-sm text-muted">Category</th>
                        <th className="py-3 px-2 text-sm text-muted">Price</th>
                        <th className="py-3 px-2 text-sm text-muted">Status</th>
                        <th className="py-3 px-2 text-sm text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map(item => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-2">
                            <img src={item.image || `https://source.unsplash.com/100x100/?food,${item.name}`} alt={item.name} 
                              className="w-12 h-12 rounded-lg object-cover" />
                          </td>
                          <td className="py-3 px-2 text-champagne">{item.name}</td>
                          <td className="py-3 px-2 text-muted text-sm">{categories.find(c => c.id === item.category)?.label || item.category}</td>
                          <td className="py-3 px-2 text-gold">PKR {item.price.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              {item.featured && <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">★ Featured</span>}
                              {item.popular && <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Popular</span>}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button onClick={() => handleEditMenu(item)} className="text-xs btn-outline px-3 py-1 rounded-full">Edit</button>
                              <button onClick={() => handleDeleteMenu(item.id)} className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Reservations */}
          {activeTab === 'reservations' && (
            <div className="space-y-4">
              {reservations.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <p className="text-4xl mb-4">📅</p>
                  <p className="text-muted">No reservations yet.</p>
                </div>
              ) : (
                reservations.map(r => (
                  <div key={r.id} className="glass rounded-xl p-6">
                    <div className="flex flex-wrap justify-between gap-4 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-serif text-xl text-champagne">{r.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            r.reservationType === 'delivery' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {r.reservationType === 'delivery' ? '🚚 Delivery' : '🍽️ Dine-in'}
                          </span>
                          <span className={`text-xs px-3 py-1 rounded-full ${
                            r.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 
                            r.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        <p className="text-muted text-sm">{r.date} at {r.time} · {r.guests} guests · {r.phone}</p>
                        {r.selectedItem && <p className="text-gold text-sm mt-1">Selected: {r.selectedItem}</p>}
                        {r.reservationType === 'delivery' && r.deliveryAddress && (
                          <p className="text-muted text-sm mt-1">Delivery to: {r.deliveryAddress}</p>
                        )}
                        {r.specialRequest && <p className="text-muted text-xs mt-2 italic">"{r.specialRequest}"</p>}
                      </div>
                      <div className="flex gap-2 items-center">
                        {r.status === 'pending' && (
                          <>
                            <button onClick={() => changeStatus(r.id, 'confirmed')} className="btn-gold px-4 py-2 rounded-full text-sm">Confirm</button>
                            <button onClick={() => changeStatus(r.id, 'cancelled')} className="btn-outline px-4 py-2 rounded-full text-sm text-red-400">Cancel</button>
                          </>
                        )}
                        {r.status === 'confirmed' && (
                          <button onClick={() => changeStatus(r.id, 'completed')} className="btn-outline px-4 py-2 rounded-full text-sm">Mark Complete</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="glass rounded-xl p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-lg text-champagne">{r.name}</h3>
                        <span className="text-gold text-sm">{'★'.repeat(r.rating || 5)}</span>
                      </div>
                      <p className="text-champagne/80">{r.text}</p>
                    </div>
                    <button onClick={() => handleDeleteReview(r.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center">
                  <p className="text-4xl mb-4">💬</p>
                  <p className="text-muted">No messages yet.</p>
                </div>
              ) : (
                messages.map(m => (
                  <div key={m.id} className="glass rounded-xl p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-lg text-champagne">{m.name}</h3>
                      <span className="text-muted text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted text-sm">{m.email} · {m.phone}</p>
                    <p className="text-champagne/80 mt-3">{m.message}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && settings && (
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-champagne">Basic Information</h2>
                    <p className="text-muted text-sm">Current: {settings.name}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gold mb-2">Restaurant Name</label>
                    <input type="text" name="name" defaultValue={settings.name}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Tagline</label>
                    <input type="text" name="tagline" defaultValue={settings.tagline}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Phone</label>
                    <input type="text" name="phone" defaultValue={settings.phone}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Email</label>
                    <input type="email" name="email" defaultValue={settings.email}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gold mb-2">Address</label>
                    <input type="text" name="address" defaultValue={settings.address}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Working Hours</label>
                    <input type="text" name="hours" defaultValue={settings.hours}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Years in Business</label>
                    <input type="number" name="years" defaultValue={settings.years}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-champagne">Hero Section</h2>
                    <p className="text-muted text-sm">Main banner content</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gold mb-2">Hero Title (Line 1)</label>
                    <input type="text" name="heroTitle" defaultValue={settings.heroTitle}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Hero Subtitle (Line 2)</label>
                    <input type="text" name="heroSubtitle" defaultValue={settings.heroSubtitle}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gold mb-2">Hero Description</label>
                    <textarea rows={3} name="heroDescription" defaultValue={settings.heroDescription}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-champagne">Stats Section</h2>
                    <p className="text-muted text-sm">Displayed on homepage</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gold mb-2">Rating</label>
                    <input type="text" name="rating" defaultValue={settings.rating}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Reviews Count</label>
                    <input type="number" name="reviewsCount" defaultValue={settings.reviewsCount}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Price Range</label>
                    <input type="text" name="priceRange" defaultValue={settings.priceRange}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-champagne">Announcement Banner</h2>
                    <p className="text-muted text-sm">Show banner on website</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gold mb-2">Enable Banner</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="bannerEnabled" defaultChecked={settings.bannerEnabled}
                        className="w-5 h-5 accent-gold" />
                      <span className="text-champagne text-sm">Show announcement banner on website</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Banner Text</label>
                    <input type="text" name="bannerText" defaultValue={settings.bannerText}
                      placeholder="e.g. Special Offer: 20% off on weekends!"
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Banner Link (optional)</label>
                    <input type="text" name="bannerLink" defaultValue={settings.bannerLink}
                      placeholder="e.g. /menu or https://example.com"
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold mb-2">Banner Background Color</label>
                    <select name="bannerBgColor" defaultValue={settings.bannerBgColor || 'gold'}
                      className="w-full bg-primary border border-white/10 rounded-xl px-4 py-3 text-champagne focus:border-gold outline-none">
                      <option value="gold">Gold</option>
                      <option value="red">Red</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-gold px-8 py-4 rounded-xl text-sm font-medium hover:shadow-2xl hover:shadow-gold/30 transition-all">
                💾 Save All Settings
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .animate-3d-modal {
          animation: modal3dIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes modal3dIn {
          from {
            opacity: 0;
            transform: perspective(1500px) rotateX(-15deg) translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: perspective(1500px) rotateX(0) translateY(0) scale(1);
          }
        }
        .glass-luxury {
          background: rgba(17, 17, 17, 0.95);
          backdrop-filter: blur(40px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 60px rgba(212, 175, 55, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
      `}</style>

      {/* AI Chat Modal - Right Side */}
      {aiChatOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setAiChatOpen(false)} />
          <div className="relative w-full sm:w-[400px] md:w-[420px] h-full max-w-full bg-gradient-to-b from-[#171717] to-[#111111] border-l border-gold/20 flex flex-col animate-slide-in-right">
            <div className="relative px-5 py-4 bg-[#1a1a1a] border-b border-gold/20">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/50 via-amber-400/40 to-yellow-600/30 flex items-center justify-center shadow-lg shadow-gold/20">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-2 2v-2H9z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-champagne">MAESTRO AI</h3>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-muted">ONLINE</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setAiChatOpen(false)} className="p-2 rounded-xl hover:bg-white/10 text-muted hover:text-champagne transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="text-center space-y-4 pt-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold/30 to-amber-500/20 flex items-center justify-center shadow-lg shadow-gold/20 animate-float">
                  <svg className="w-10 h-10 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-2 2v-2H9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-serif text-xl text-champagne">Welcome to Maestro AI</h4>
                  <p className="text-sm text-muted mt-2">Your personal digital concierge is ready to help.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/10 text-sm text-champagne transition-all">
                  🍽️ Menu
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/10 text-sm text-champagne transition-all">
                  📅 Reserve
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/10 text-sm text-champagne transition-all">
                  🕐 Hours
                </button>
                <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-gold/10 text-sm text-champagne transition-all">
                  📞 Contact
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input type="text" placeholder="Ask me anything..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-champagne placeholder:text-muted/50 focus:border-gold/50 focus:outline-none" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-br from-gold to-amber-600 text-black hover:scale-105 transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
