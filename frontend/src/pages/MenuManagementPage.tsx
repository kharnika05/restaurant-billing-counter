import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Category, MenuItem } from '../types';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  Image,
  FolderPlus,
  DollarSign
} from 'lucide-react';

export const MenuManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Edit/Create Item Modal
  const [showItemModal, setShowItemModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [itemName, setItemName] = useState<string>('');
  const [itemCategory, setItemCategory] = useState<number>(1);
  const [itemPrice, setItemPrice] = useState<number>(0);
  const [itemDesc, setItemDesc] = useState<string>('');
  const [itemImageUrl, setItemImageUrl] = useState<string>('');
  const [itemIsVeg, setItemIsVeg] = useState<boolean>(true);
  const [itemIsAvailable, setItemIsAvailable] = useState<boolean>(true);

  // Create Category Modal
  const [showCatModal, setShowCatModal] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>('');
  const [newCatDesc, setNewCatDesc] = useState<string>('');

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<MenuItem[]>('/menu-items')
      ]);
      setCategories(catsRes.data);
      setMenuItems(itemsRes.data);
      if (catsRes.data.length > 0) {
        setItemCategory(catsRes.data[0].id);
      }
    } catch {
      setErrorMessage('Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setItemName('');
    setItemPrice(150);
    setItemDesc('');
    setItemImageUrl('/images/royal_burger.png');
    setItemIsVeg(true);
    setItemIsAvailable(true);
    if (categories.length > 0) setItemCategory(categories[0].id);
    setShowItemModal(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.categoryId);
    setItemPrice(item.price);
    setItemDesc(item.description || '');
    setItemImageUrl(item.imageUrl || '');
    setItemIsVeg(item.isVeg);
    setItemIsAvailable(item.isAvailable);
    setShowItemModal(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const payload = {
        name: itemName,
        categoryId: itemCategory,
        price: itemPrice,
        description: itemDesc,
        imageUrl: itemImageUrl,
        isVeg: itemIsVeg,
        isAvailable: itemIsAvailable
      };

      if (editingItem) {
        await api.put(`/menu-items/${editingItem.id}`, payload);
        setSuccessMessage('Menu item updated successfully.');
      } else {
        await api.post('/menu-items', payload);
        setSuccessMessage('New menu item added successfully.');
      }

      setShowItemModal(false);
      fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save menu item.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      await api.patch(`/menu-items/${item.id}/availability?isAvailable=${!item.isAvailable}`);
      fetchData();
    } catch {
      setErrorMessage('Failed to update availability.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to remove this dish? It will be archived.')) return;
    try {
      await api.delete(`/menu-items/${id}`);
      setSuccessMessage('Menu item removed.');
      fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setErrorMessage('Failed to remove item.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      setActionLoading(true);
      await api.post('/categories', {
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined
      });
      setSuccessMessage('Category created successfully.');
      setNewCatName('');
      setNewCatDesc('');
      setShowCatModal(false);
      fetchData();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create category.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = menuItems.filter((i) => {
    const matchesCategory = selectedCategoryId ? i.categoryId === selectedCategoryId : true;
    const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
            Menu & Pricing Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage food categories, recipe items, dynamic pricing, and kitchen availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCatModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-amber-400" />
            + Category
          </button>
          <button
            onClick={handleOpenCreateItem}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategoryId === null
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            All Categories ({menuItems.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-60 animate-pulse" />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No items match this filter. Click "+ Add Menu Item" to register new dishes.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-slate-900 border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-lg ${
                item.isAvailable ? 'border-slate-800 hover:border-slate-700' : 'border-rose-900/30 opacity-70'
              }`}
            >
              <div className="relative h-36 bg-slate-800 overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <UtensilsCrossed className="w-8 h-8" />
                  </div>
                )}
                <span
                  className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md border flex items-center justify-center bg-slate-950/80 backdrop-blur-sm ${
                    item.isVeg ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </span>

                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-950/80 text-slate-300">
                  {item.categoryName}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-100 text-sm">{item.name}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-base font-bold text-amber-400">₹{item.price.toFixed(2)}</span>

                  <div className="flex items-center gap-1.5">
                    {/* Availability Switch */}
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all ${
                        item.isAvailable
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-rose-500/40 bg-rose-500/10 text-rose-400'
                      }`}
                      title="Toggle availability"
                    >
                      {item.isAvailable ? 'In Stock' : 'Sold Out'}
                    </button>

                    <button
                      onClick={() => handleOpenEditItem(item)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg border border-slate-700 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                      title="Archive Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveItem}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">
              {editingItem ? 'Edit Dish Details' : 'Add New Menu Item'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Category *</label>
                <select
                  value={itemCategory}
                  onChange={(e) => setItemCategory(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Image URL / Path</label>
                <input
                  type="text"
                  placeholder="/images/paneer_tikka.png"
                  value={itemImageUrl}
                  onChange={(e) => setItemImageUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVeg"
                  checked={itemIsVeg}
                  onChange={(e) => setItemIsVeg(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="isVeg" className="text-xs text-slate-300">
                  Vegetarian Dish
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={itemIsAvailable}
                  onChange={(e) => setItemIsAvailable(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="isAvailable" className="text-xs text-slate-300">
                  Available in Kitchen
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowItemModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCategory}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">Create New Category</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sizzlers & Grills"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Description (Optional)</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MenuManagementPage;
