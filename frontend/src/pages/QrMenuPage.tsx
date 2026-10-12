import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { Category, MenuItem } from '../types';
import {
  UtensilsCrossed,
  Search,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  CheckCircle,
  Bell
} from 'lucide-react';

export const QrMenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegFilter, setVegFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [waiterCalled, setWaiterCalled] = useState<boolean>(false);

  useEffect(() => {
    fetchPublicMenu();
  }, []);

  const fetchPublicMenu = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<MenuItem[]>('/menu-items')
      ]);
      setCategories(catsRes.data);
      const rawList = Array.isArray(itemsRes.data) ? itemsRes.data : [];
      const normalized = rawList.map((i: any) => ({
        ...i,
        isAvailable: i.isAvailable !== undefined ? Boolean(i.isAvailable) : (i.available !== undefined ? Boolean(i.available) : true),
        isVeg: i.isVeg !== undefined ? Boolean(i.isVeg) : (i.veg !== undefined ? Boolean(i.veg) : false)
      }));
      setMenuItems(normalized.filter((i: any) => i.isAvailable));
    } catch {
      // Handle fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 5000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryId ? item.categoryId === selectedCategoryId : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg =
      vegFilter === 'ALL' ? true : vegFilter === 'VEG' ? item.isVeg : !item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Brand Hero Header */}
      <header className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 px-4 pt-8 pb-6 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
            <UtensilsCrossed className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-100">
            The Grand Spice Kitchen
          </h1>
          <p className="text-xs text-slate-400">
            Fine Dining & Culinary Excellence • Digital Contactless Menu
          </p>

          {tableParam && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mt-2">
              <Sparkles className="w-3.5 h-3.5" />
              Dining at Table {tableParam}
            </div>
          )}

          {/* Call waiter trigger */}
          <div className="pt-2">
            <button
              onClick={handleCallWaiter}
              disabled={waiterCalled}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all inline-flex items-center gap-1.5 ${
                waiterCalled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-slate-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              {waiterCalled ? 'Waiter Summoned!' : 'Call Waiter for Assistance'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl w-full mx-auto p-4 flex-1 space-y-4">
        {/* Search & Veg/Non-Veg Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sticky top-2 z-20 bg-slate-950/90 backdrop-blur-md py-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dishes, desserts, cocktails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-md"
            />
          </div>

          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setVegFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                vegFilter === 'ALL' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('VEG')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                vegFilter === 'VEG' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Veg
            </button>
            <button
              onClick={() => setVegFilter('NON_VEG')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                vegFilter === 'NON_VEG' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Non-Veg
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === null
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Menu
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dishes List */}
        <div className="space-y-3 pt-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-28 animate-pulse" />
            ))
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No dishes match your selection.
            </div>
          ) : (
            filteredItems.map((dish) => (
              <div
                key={dish.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex gap-4 items-center hover:border-slate-700 transition-all shadow-md"
              >
                {/* Photo */}
                <div className="w-24 h-24 rounded-xl bg-slate-800 overflow-hidden shrink-0 relative">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <UtensilsCrossed className="w-6 h-6" />
                    </div>
                  )}
                  <span
                    className={`absolute top-1.5 left-1.5 w-4 h-4 rounded-md border flex items-center justify-center bg-slate-950/80 ${
                      dish.isVeg ? 'border-emerald-500' : 'border-rose-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        dish.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{dish.name}</h3>
                      <span className="text-[10px] text-slate-400">{dish.categoryName}</span>
                    </div>
                    <span className="text-sm font-bold text-amber-400 shrink-0">
                      ₹{dish.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {dish.description || 'Specially crafted chef recipe.'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-900 p-6 text-center text-xs text-slate-500">
        <p>© 2026 The Grand Spice Kitchen & Lounge. All rights reserved.</p>
        <p className="text-[11px] text-slate-600 mt-1">Prices are inclusive of standard 5% GST taxes.</p>
      </footer>
    </div>
  );
};

export default QrMenuPage;
