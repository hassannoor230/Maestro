import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu } from '../lib/api';
import { getMenuImage } from '../lib/images';

const categories = [
  { id: 'all', label: 'All' },
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
];

export default function Menu() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params: any = {};
    if (filter !== 'all') params.category = filter;
    if (search) params.search = search;
    getMenu(params)
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [filter, search]);

  const handleItemClick = (item: any) => {
    const queryParams = new URLSearchParams({
      item: item.id,
      name: item.name,
      price: item.price.toString()
    });
    navigate(`/reservation?${queryParams.toString()}`);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gold tracking-[0.3em] text-xs uppercase mb-3 animate-pulse-slow">Our Menu</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl animate-fade-in-up">CULINARY ARTISTRY</h1>
          <p className="text-muted mt-4 max-w-lg mx-auto">Handcrafted dishes prepared with passion and the finest ingredients.</p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface border border-white/10 rounded-xl px-5 py-3 text-champagne focus:border-gold outline-none transition animate-glow-focus"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                filter === c.id
                  ? 'border-gold/50 text-gold bg-gold/10 scale-105'
                  : 'border-white/10 text-muted hover:border-gold/30 hover:text-gold hover:scale-105'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-muted py-20">
            <div className="animate-spin w-12 h-12 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center text-muted py-20">No items found.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`menu-card glass rounded-2xl overflow-hidden border border-white/5 cursor-pointer transform transition-all duration-500 ${
                  hoveredId === item.id ? 'scale-105 shadow-2xl shadow-gold/20' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image || getMenuImage(item.name)} 
                    alt={item.name} 
                    className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-gold text-sm font-medium">Click to Reserve</span>
                  </div>
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-gold text-black text-xs px-3 py-1 rounded-full font-medium animate-pulse">
                      ★ Featured
                    </div>
                  )}
                  {item.popular && (
                    <div className="absolute top-3 left-3 bg-green-500/80 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Popular
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-serif text-xl text-champagne transition-colors hover:text-gold">{item.name}</h3>
                    <span className="text-gold text-sm font-medium whitespace-nowrap bg-gold/10 px-3 py-1 rounded-full">
                      PKR {item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-muted text-sm leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs tracking-wider text-gold/60 uppercase">{item.category}</span>
                    <button className="text-xs text-gold hover:text-champagne transition-colors flex items-center gap-1">
                      Reserve <span className="animate-bounce-right">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
