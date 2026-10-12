import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Category, MenuItem, RestaurantTable } from '../types';
import { useCart } from '../context/CartContext';
import ReceiptModal from '../components/ReceiptModal';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  UtensilsCrossed,
  ShoppingBag,
  Truck,
  CreditCard,
  DollarSign,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Armchair,
  Users,
  QrCode,
  Sparkles,
  X,
  Check
} from 'lucide-react';

export const POSBillingPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVeg, setFilterVeg] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Table Selection Modal state
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [tableSectionFilter, setTableSectionFilter] = useState<string>('ALL');

  // Quick Bill & Payment Modal
  const [activeBill, setActiveBill] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Discount Modal state
  const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
  const [discountType, setDiscountType] = useState<'NONE' | 'PERCENTAGE' | 'FIXED'>('NONE');
  const [discountValue, setDiscountValue] = useState<number>(0);

  // Payment Modal after billing
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'OTHER'>('UPI');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [transactionRef, setTransactionRef] = useState<string>('');

  const {
    items,
    orderType,
    selectedTable,
    customerName,
    customerPhone,
    notes,
    subtotal,
    grandTotal,
    addItem,
    removeItem,
    updateQuantity,
    setOrderType,
    setSelectedTable,
    setCustomerName,
    setCustomerPhone,
    setNotes,
    clearCart
  } = useCart();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        api.get<Category[]>('/categories'),
        api.get<MenuItem[]>('/menu-items').catch(() => api.get<MenuItem[]>('/menu')),
        api.get<RestaurantTable[]>('/tables')
      ]);
      setCategories(catsRes.data);
      const rawList = Array.isArray(itemsRes.data) ? itemsRes.data : [];
      const normalized = rawList.map((i: any) => ({
        ...i,
        isAvailable: i.isAvailable !== undefined ? Boolean(i.isAvailable) : (i.available !== undefined ? Boolean(i.available) : true),
        isVeg: i.isVeg !== undefined ? Boolean(i.isVeg) : (i.veg !== undefined ? Boolean(i.veg) : false)
      }));
      setMenuItems(normalized.filter((i: any) => i.isAvailable));
      setTables(tablesRes.data);
      if (!selectedTable && tablesRes.data.length > 0) {
        // Default to first available table
        const firstAvailable = tablesRes.data.find((t) => t.status === 'AVAILABLE');
        if (firstAvailable) {
          setSelectedTable(firstAvailable);
        }
      }
    } catch (err: any) {
      setErrorMessage('Failed to load menu or tables.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function for dish image fallback
  const getItemImage = (item: MenuItem): string => {
    if (item.imageUrl && item.imageUrl.trim() !== '') return item.imageUrl;
    const name = item.name.toLowerCase();
    if (name.includes('butter chicken')) return '/images/butter_chicken.png';
    if (name.includes('paneer butter') || name.includes('butter masala')) return '/images/paneer_butter_masala.png';
    if (name.includes('paneer tikka')) return '/images/paneer_tikka.png';
    if (name.includes('chicken tikka')) return '/images/chicken_tikka.png';
    if (name.includes('corn')) return '/images/crispy_corn.png';
    if (name.includes('dal') || name.includes('makhani')) return '/images/dal_makhani.png';
    if (name.includes('pizza') || name.includes('margherita')) return '/images/margherita_pizza.png';
    if (name.includes('burger')) return '/images/royal_burger.png';
    if (name.includes('biryani')) return '/images/dum_biryani.png';
    if (name.includes('naan') || name.includes('roti') || name.includes('bread')) return '/images/garlic_naan.png';
    if (name.includes('mojito') || name.includes('drink') || name.includes('shake')) return '/images/strawberry_mojito.png';
    if (name.includes('jamun') || name.includes('sweet') || name.includes('dessert')) return '/images/gulab_jamun.png';
    return '/images/paneer_tikka.png';
  };

  // Helper function for table section visuals
  const getSectionImage = (section: string): string => {
    const s = section.toLowerCase();
    if (s.includes('window')) return '/images/tables/window_section.png';
    if (s.includes('rooftop') || s.includes('lounge')) return '/images/tables/rooftop.png';
    if (s.includes('garden') || s.includes('terrace')) return '/images/tables/garden_patio.png';
    return '/images/tables/main_dining.png';
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryId ? item.categoryId === selectedCategoryId : true;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg =
      filterVeg === 'ALL' ? true : filterVeg === 'VEG' ? item.isVeg : !item.isVeg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  // Unique table sections for filter
  const tableSections = ['ALL', ...Array.from(new Set(tables.map((t) => t.section)))];
  const filteredTables = tables.filter((t) =>
    tableSectionFilter === 'ALL' ? true : t.section === tableSectionFilter
  );

  // Calculate discount and preview total
  const calculatedDiscount =
    discountType === 'PERCENTAGE'
      ? Number(((subtotal * discountValue) / 100).toFixed(2))
      : discountType === 'FIXED'
      ? Math.min(discountValue, subtotal)
      : 0;
  const taxableAmount = Math.max(0, subtotal - calculatedDiscount);
  const calculatedTax = Number((taxableAmount * 0.05).toFixed(2));
  const finalEstimatedTotal = Number((taxableAmount + calculatedTax).toFixed(2));

  const handlePlaceOrderOnly = async () => {
    if (items.length === 0) return;
    if (orderType === 'DINE_IN' && !selectedTable) {
      setErrorMessage('Please select a dining table for Dine-In orders.');
      setShowTableModal(true);
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);

      const orderPayload = {
        orderType,
        tableId: orderType === 'DINE_IN' ? selectedTable?.id : null,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes
        }))
      };

      const res = await api.post('/orders', orderPayload);
      setSuccessMessage(`Order #${res.data.orderNumber} placed successfully!`);
      clearCart();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePlaceOrderAndGenerateBill = async () => {
    if (items.length === 0) return;
    if (orderType === 'DINE_IN' && !selectedTable) {
      setErrorMessage('Please select a dining table for Dine-In orders.');
      setShowTableModal(true);
      return;
    }

    try {
      setActionLoading(true);
      setErrorMessage(null);

      // 1. Create order
      const orderPayload = {
        orderType,
        tableId: orderType === 'DINE_IN' ? selectedTable?.id : null,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes
        }))
      };

      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data;

      // 2. Generate bill
      const billPayload = {
        orderId: createdOrder.id,
        discountType,
        discountValue
      };

      const billRes = await api.post('/bills', billPayload);
      const createdBill = billRes.data;

      setActiveBill(createdBill);
      setPaymentAmount(createdBill.grandTotal);
      clearCart();
      setShowPayModal(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to generate bill.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordPayment = async () => {
    if (!activeBill) return;
    try {
      setActionLoading(true);
      const payload = {
        amount: paymentAmount,
        paymentMethod,
        transactionReference: transactionRef.trim() || undefined
      };
      await api.post(`/payments/bill/${activeBill.id}`, payload);

      // Refresh bill details for receipt
      const updatedBillRes = await api.get(`/bills/${activeBill.id}`);
      setActiveBill(updatedBillRes.data);
      setShowPayModal(false);
      setShowReceiptModal(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to record payment.');
    } finally {
      setActionLoading(false);
    }
  };

  // QR Code Payment URI string
  const upiQrUrl = activeBill
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `upi://pay?pa=royalfeast@upi&pn=Royal Feast Dine&am=${activeBill.grandTotal.toFixed(
          2
        )}&tr=${activeBill.billNumber}&cu=INR`
      )}`
    : '';

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6.5rem)]">
      {/* Left Menu Section */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl p-5 overflow-hidden">
        {/* Top Controls: Search & Category Chips */}
        <div className="space-y-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search delicious dishes, starters, biryani, pizzas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Veg / Non-Veg filter toggle */}
            <div className="flex items-center bg-slate-800/80 border border-slate-700 rounded-xl p-1 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setFilterVeg('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterVeg === 'ALL'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterVeg('VEG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filterVeg === 'VEG'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Pure Veg
              </button>
              <button
                onClick={() => setFilterVeg('NON_VEG')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  filterVeg === 'NON_VEG'
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                Non-Veg
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategoryId === null
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
              }`}
            >
              🍽️ All Menu ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategoryId === cat.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Menu Cards Grid with Vivid Colorful Images */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-800/50 rounded-2xl h-60 animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <UtensilsCrossed className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-base font-medium text-slate-300">No dishes match your filter</p>
              <p className="text-xs text-slate-500 mt-1">Try searching with a different term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const cartEntry = items.find((ci) => ci.menuItem.id === item.id);
                const displayImg = getItemImage(item);

                return (
                  <div
                    key={item.id}
                    className="group relative bg-slate-800/70 border border-slate-750 hover:border-amber-500/60 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
                  >
                    {/* Item Image with Vibrant Colors */}
                    <div className="relative h-36 w-full bg-slate-950 overflow-hidden">
                      <img
                        src={displayImg}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                        }}
                      />

                      {/* Veg / Non-Veg badge */}
                      <span
                        className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md border flex items-center justify-center bg-slate-900/90 backdrop-blur-sm shadow-md ${
                          item.isVeg ? 'border-emerald-500 text-emerald-400' : 'border-rose-500 text-rose-400'
                        }`}
                        title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                      </span>

                      {/* Category Label */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 backdrop-blur-sm text-amber-300 border border-amber-500/30">
                        {item.categoryName || 'Special'}
                      </span>
                    </div>

                    {/* Item Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 min-h-[2rem]">
                          {item.description || 'Delicious freshly prepared authentic dish.'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-700/60">
                        <span className="text-base font-extrabold text-amber-400">
                          ₹{item.price.toFixed(2)}
                        </span>

                        {cartEntry ? (
                          <div className="flex items-center bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl px-1.5 py-0.5 font-bold text-xs shadow-md shadow-amber-500/25">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-amber-600 rounded-lg transition-colors"
                              title="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 min-w-[1.25rem] text-center font-black">
                              {cartEntry.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-amber-600 rounded-lg transition-colors"
                              title="Increase"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addItem(item)}
                            className="bg-slate-750 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-slate-200 hover:text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                            title="Add to cart"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Cart & Bill Panel */}
      <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col p-5 overflow-hidden">
        {/* Order Type Header Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-800/80 p-1 rounded-xl mb-4 border border-slate-750">
          <button
            onClick={() => setOrderType('DINE_IN')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'DINE_IN'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Dine-In
          </button>
          <button
            onClick={() => setOrderType('TAKEAWAY')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'TAKEAWAY'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Takeaway
          </button>
          <button
            onClick={() => setOrderType('DELIVERY')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              orderType === 'DELIVERY'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            Delivery
          </button>
        </div>

        {/* Clear Visual Dining Table Option with Colorful Image */}
        {orderType === 'DINE_IN' && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Armchair className="w-3.5 h-3.5 text-amber-400" />
                Dining Table Option *
              </label>
              <button
                onClick={() => setShowTableModal(true)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
              >
                {selectedTable ? 'Switch Table' : 'Choose Table'}
              </button>
            </div>

            {selectedTable ? (
              <div
                onClick={() => setShowTableModal(true)}
                className="cursor-pointer group relative overflow-hidden bg-slate-800/90 border border-amber-500/50 hover:border-amber-400 rounded-xl p-2.5 flex items-center gap-3 transition-all shadow-md shadow-amber-500/10"
              >
                <img
                  src={getSectionImage(selectedTable.section)}
                  alt={selectedTable.section}
                  className="w-14 h-14 rounded-lg object-cover border border-amber-500/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      Table {selectedTable.tableNumber}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedTable.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-0.5 truncate font-medium">
                    {selectedTable.section}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3 text-slate-500" />
                    {selectedTable.seatingCapacity} Guest Seating
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTableModal(true)}
                className="w-full py-3 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-dashed border-amber-500/40 rounded-xl text-xs font-bold text-amber-400 flex items-center justify-center gap-2 transition-all"
              >
                <Armchair className="w-4 h-4" />
                <span>Select Dining Table (View Visual Layout)</span>
              </button>
            )}
          </div>
        )}

        {/* Guest Input */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Guest Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. 9876543210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto border-t border-b border-slate-800 py-2 space-y-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-1" />
              <p className="text-xs font-medium">Cart is currently empty</p>
              <p className="text-[11px] text-slate-600">Select food items from the left menu to add</p>
            </div>
          ) : (
            items.map(({ menuItem, quantity }) => (
              <div
                key={menuItem.id}
                className="bg-slate-800/40 border border-slate-750/50 rounded-xl p-2.5 flex items-center justify-between gap-2 hover:bg-slate-800/80 transition-colors"
              >
                <img
                  src={getItemImage(menuItem)}
                  alt={menuItem.name}
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        menuItem.isVeg ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <h5 className="text-xs font-semibold text-slate-200 truncate">
                      {menuItem.name}
                    </h5>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    ₹{menuItem.price.toFixed(2)} × {quantity} ={' '}
                    <strong className="text-amber-400">
                      ₹{(menuItem.price * quantity).toFixed(2)}
                    </strong>
                  </span>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(menuItem.id, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors text-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-slate-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(menuItem.id, 1)}
                    className="w-6 h-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center transition-colors text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeItem(menuItem.id)}
                    className="w-6 h-6 rounded-lg text-rose-400 hover:bg-rose-500/20 flex items-center justify-center transition-colors ml-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pricing Summary */}
        <div className="pt-3 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {/* Discount Trigger / Display */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Discount:</span>
              <button
                onClick={() => setShowDiscountModal(true)}
                className="text-[10px] text-amber-400 underline hover:text-amber-300 font-bold"
              >
                {discountType === 'NONE' ? '+ Apply Discount' : `Edit (${discountType})`}
              </button>
            </div>
            <span className="text-emerald-400 font-semibold">-₹{calculatedDiscount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">GST (5% Total):</span>
            <span>₹{calculatedTax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-base font-bold text-slate-100">
            <span>Payable Amount:</span>
            <span className="text-amber-400 text-lg">₹{finalEstimatedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Cart Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800">
          <button
            onClick={handlePlaceOrderOnly}
            disabled={items.length === 0 || actionLoading}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Place Order
          </button>

          <button
            onClick={handlePlaceOrderAndGenerateBill}
            disabled={items.length === 0 || actionLoading}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            Generate QR & Bill Pay
          </button>
        </div>
      </div>

      {/* Clear Dining Table Selector Modal with Colorful Images */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 flex flex-col max-h-[88vh] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-amber-400" />
                  Select Dining Table
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose a comfortable table section with seating capacity and live availability
                </p>
              </div>
              <button
                onClick={() => setShowTableModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto py-3 border-b border-slate-800 scrollbar-thin">
              {tableSections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setTableSectionFilter(sec)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    tableSectionFilter === sec
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {sec === 'ALL' ? 'All Sections' : sec}
                </button>
              ))}
            </div>

            {/* Tables Grid with Colorful Section Thumbnails */}
            <div className="flex-1 overflow-y-auto py-4 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredTables.map((tbl) => {
                  const isSelected = selectedTable?.id === tbl.id;
                  const isAvailable = tbl.status === 'AVAILABLE';
                  const secImg = getSectionImage(tbl.section);

                  return (
                    <div
                      key={tbl.id}
                      onClick={() => {
                        setSelectedTable(tbl);
                        setShowTableModal(false);
                      }}
                      className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all relative group flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20'
                          : 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {/* Section Image Banner */}
                      <div className="relative h-28 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={secImg}
                          alt={tbl.section}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Status Badge */}
                        <span
                          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                            isAvailable
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-amber-500/90 text-slate-950'
                          }`}
                        >
                          {tbl.status}
                        </span>

                        {/* Table Number Title */}
                        <div className="absolute bottom-2 left-3">
                          <h4 className="text-base font-black text-white drop-shadow">
                            Table {tbl.tableNumber}
                          </h4>
                          <span className="text-[11px] text-amber-300 font-semibold drop-shadow-sm">
                            {tbl.section}
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="p-3 flex items-center justify-between bg-slate-900/90">
                        <div className="flex items-center gap-1.5 text-xs text-slate-300">
                          <Users className="w-3.5 h-3.5 text-amber-400" />
                          <span>{tbl.seatingCapacity} Seater</span>
                        </div>

                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 group-hover:text-amber-400 font-semibold transition-colors">
                            Click to Select
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Pay with Dynamic QR & Complete Bill Details Modal */}
      {showPayModal && activeBill && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]">
            {/* Left: Dynamic QR Code Payment & UPI Scanner */}
            <div className="w-full md:w-5/12 bg-gradient-to-b from-slate-950 to-slate-900 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-between text-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
                  <Sparkles className="w-3 h-3" />
                  Instant UPI Bill Pay
                </span>
                <h3 className="text-lg font-black text-white">Scan & Pay via QR</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Google Pay • PhonePe • Paytm • BHIM
                </p>
              </div>

              {/* Dynamic QR Code Card */}
              <div className="my-4 p-3 bg-white rounded-2xl shadow-xl border-4 border-amber-500/30 flex flex-col items-center">
                <img
                  src={upiQrUrl}
                  alt={`UPI QR for ${activeBill.billNumber}`}
                  className="w-48 h-48 rounded-xl object-contain"
                />
                <span className="text-[10px] text-slate-700 font-mono font-bold mt-1.5">
                  UPI ID: royalfeast@upi
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400">Total Payable Amount</div>
                <div className="text-2xl font-black text-amber-400 mt-0.5">
                  ₹{activeBill.grandTotal.toFixed(2)}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Bill #{activeBill.billNumber} • Status: {activeBill.paymentStatus}
                </p>
              </div>
            </div>

            {/* Right: Complete Itemized Bill Details & Tender Options */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">Food Bill Details</h3>
                    <p className="text-xs text-slate-400">
                      Order #{activeBill.orderNumber} • Table:{' '}
                      <strong className="text-amber-400">
                        {activeBill.tableNumber || activeBill.orderType}
                      </strong>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowPayModal(false);
                      setShowReceiptModal(true);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                    title="View printable receipt"
                  >
                    View Receipt
                  </button>
                </div>

                {/* Customer Details */}
                {activeBill.customerName && (
                  <div className="py-2 text-xs text-slate-400 border-b border-slate-800/60 flex justify-between">
                    <span>Guest: {activeBill.customerName}</span>
                    <span>{activeBill.customerPhone || ''}</span>
                  </div>
                )}

                {/* Itemized Food List */}
                <div className="py-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Items Ordered ({activeBill.items.length})
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                    {activeBill.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1 border-b border-slate-800/40 text-slate-200"
                      >
                        <span className="truncate pr-2">
                          {item.itemName}{' '}
                          <span className="text-slate-400">× {item.quantity}</span>
                        </span>
                        <span className="font-semibold text-slate-100 shrink-0">
                          ₹{item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown */}
                <div className="bg-slate-950/60 rounded-xl p-3 space-y-1.5 text-xs text-slate-300 border border-slate-800 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal:</span>
                    <span>₹{activeBill.subtotal.toFixed(2)}</span>
                  </div>
                  {activeBill.discountAmount > 0 && (
                    <div className="flex justify-between text-rose-400">
                      <span>Discount:</span>
                      <span>-₹{activeBill.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Amount:</span>
                    <span>₹{activeBill.taxableAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST (2.5%) + SGST (2.5%):</span>
                    <span>
                      ₹{(activeBill.cgstAmount + activeBill.sgstAmount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800">
                    <span>Grand Total:</span>
                    <span className="text-amber-400">
                      ₹{activeBill.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Tender Method Selector */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Confirm Payment Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-sm'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      UPI / QR
                    </button>
                    <button
                      onClick={() => setPaymentMethod('CASH')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod('CARD')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-sm'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Card POS
                    </button>
                  </div>
                </div>

                {/* Transaction Ref input */}
                {paymentMethod !== 'CASH' && (
                  <div className="mb-4">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      UPI Ref / Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI-98234812"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowPayModal(false);
                    setShowReceiptModal(true);
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Pay Later
                </button>
                <button
                  onClick={handleRecordPayment}
                  disabled={actionLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Paid & Print Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discount Configuration Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Apply Order Discount</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Discount Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setDiscountType('NONE')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      discountType === 'NONE'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    None
                  </button>
                  <button
                    onClick={() => setDiscountType('PERCENTAGE')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      discountType === 'PERCENTAGE'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    % Percent
                  </button>
                  <button
                    onClick={() => setDiscountType('FIXED')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      discountType === 'FIXED'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    ₹ Fixed
                  </button>
                </div>
              </div>

              {discountType !== 'NONE' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    {discountType === 'PERCENTAGE' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={discountType === 'PERCENTAGE' ? '100' : subtotal}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => setShowDiscountModal(false)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal & PDF Receipt Modal */}
      {showReceiptModal && activeBill && (
        <ReceiptModal
          bill={activeBill}
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            setActiveBill(null);
          }}
        />
      )}
    </div>
  );
};

export default POSBillingPage;
