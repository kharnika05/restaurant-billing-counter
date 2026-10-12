import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { Category, MenuItem, RestaurantTable } from '../types';
import { useAuth } from '../context/AuthContext';
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
  Check,
  LogOut,
  Tag,
  Percent,
  Clock,
  Printer,
  Download,
  Flame,
  ChefHat
} from 'lucide-react';

const DEFAULT_CATEGORIES: Category[] = [
  { id: 6, name: 'Biryani Specials', displayOrder: 1 },
  { id: 1, name: 'Starters & Appetizers', displayOrder: 2 },
  { id: 2, name: 'Main Course', displayOrder: 3 },
  { id: 3, name: 'Breads & Rice', displayOrder: 4 },
  { id: 4, name: 'Beverages & Mocktails', displayOrder: 5 },
  { id: 5, name: 'Desserts', displayOrder: 6 }
];

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // --- BIRYANI SPECIALS (MULTIPLE BIRYANIS) ---
  {
    id: 9,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Aromatic long-grain basmati rice layered with spiced marinated tender chicken, saffron, mint and desi ghee',
    price: 350,
    isVeg: false,
    veg: false,
    imageUrl: '/images/dum_biryani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 13,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Royal Mutton Dum Biryani',
    description: 'Slow-cooked succulent tender lamb cuts dum-cooked in sealed clay handi with aged basmati and brown fried onions',
    price: 440,
    isVeg: false,
    veg: false,
    imageUrl: '/images/mutton_biryani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 14,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Shahi Paneer Dum Biryani',
    description: 'Golden marinated paneer cubes, garden peas, and fragrant saffron basmati rice layered with rose water and cashews',
    price: 290,
    isVeg: true,
    veg: true,
    imageUrl: '/images/paneer_biryani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 15,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Awadhi Lucknowi Chicken Biryani',
    description: 'Delicate and mild Awadhi royal chicken biryani infused with green cardamom, kewra, saffron, and rich stock',
    price: 370,
    isVeg: false,
    veg: false,
    imageUrl: '/images/awadhi_biryani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 16,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Spicy Egg Dum Biryani',
    description: 'Crisp spiced farm eggs simmered in roasted onion-tomato masala and layered with fragrant basmati rice',
    price: 250,
    isVeg: false,
    veg: false,
    imageUrl: '/images/egg_biryani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 17,
    categoryId: 6,
    categoryName: 'Biryani Specials',
    name: 'Coastal Prawns Dum Biryani',
    description: 'Juicy marinated tiger prawns cooked in coastal aromatic spice blend, layered with fluffy basmati and fried shallots',
    price: 420,
    isVeg: false,
    veg: false,
    imageUrl: '/images/prawns_biryani.png',
    isAvailable: true,
    available: true
  },

  // --- STARTERS & APPETIZERS ---
  {
    id: 1,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Paneer Tikka Sizzler',
    description: 'Cottage cheese cubes marinated in spiced hung curd with bell peppers and roasted in tandoor',
    price: 280,
    isVeg: true,
    veg: true,
    imageUrl: '/images/paneer_tikka.png',
    isAvailable: true,
    available: true
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Crispy Corn Pepper Fry',
    description: 'Golden American corn tossed with cracked black pepper, curry leaves, and scallions',
    price: 190,
    isVeg: true,
    veg: true,
    imageUrl: '/images/crispy_corn.png',
    isAvailable: true,
    available: true
  },
  {
    id: 3,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Chicken Tikka Angaara',
    description: 'Succulent boneless chicken chunks smoked over glowing charcoal with aromatic spices',
    price: 320,
    isVeg: false,
    veg: false,
    imageUrl: '/images/chicken_tikka.png',
    isAvailable: true,
    available: true
  },
  {
    id: 18,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Spicy Chicken 65',
    description: 'Crispy fried chicken bites tossed with fiery South Indian curry leaves, crushed garlic, and green chilies',
    price: 290,
    isVeg: false,
    veg: false,
    imageUrl: '/images/chicken_65.png',
    isAvailable: true,
    available: true
  },
  {
    id: 19,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Tandoori Malai Chaap',
    description: 'Soya chaap marinated in rich cashew cream paste, hung curd, cardamom, and charred in clay tandoor',
    price: 260,
    isVeg: true,
    veg: true,
    imageUrl: '/images/malai_chaap.png',
    isAvailable: true,
    available: true
  },
  {
    id: 20,
    categoryId: 1,
    categoryName: 'Starters & Appetizers',
    name: 'Hara Bhara Kabab',
    description: 'Crispy spinach, green pea, and potato patties stuffed with spiced nuts and melted cottage cheese',
    price: 230,
    isVeg: true,
    veg: true,
    imageUrl: '/images/hara_bhara_kabab.png',
    isAvailable: true,
    available: true
  },

  // --- MAIN COURSE ---
  {
    id: 4,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Royal Butter Chicken',
    description: 'Tender chicken simmered in a silky tomato, cashew cream, and rich butter gravy',
    price: 380,
    isVeg: false,
    veg: false,
    imageUrl: '/images/butter_chicken.png',
    isAvailable: true,
    available: true
  },
  {
    id: 5,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Dal Makhani Bukhara',
    description: 'Slow-cooked black lentils simmered overnight with tomatoes, churned butter and fresh cream',
    price: 260,
    isVeg: true,
    veg: true,
    imageUrl: '/images/dal_makhani.png',
    isAvailable: true,
    available: true
  },
  {
    id: 6,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Paneer Butter Masala',
    description: 'Melt-in-mouth cottage cheese in mildly sweet, velvety tomato-onion gravy with fenugreek',
    price: 310,
    isVeg: true,
    veg: true,
    imageUrl: '/images/paneer_butter_masala.png',
    isAvailable: true,
    available: true
  },
  {
    id: 21,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Kashmiri Mutton Rogan Josh',
    description: 'Tender lamb shanks slow-braised in Kashmiri chilies, aromatic whole spices, and rich velvety gravy',
    price: 450,
    isVeg: false,
    veg: false,
    imageUrl: '/images/rogan_josh.png',
    isAvailable: true,
    available: true
  },
  {
    id: 22,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Kadhai Paneer Special',
    description: 'Fresh cottage cheese cubes tossed with crunchy bell peppers, onions, and freshly pounded kadhai spices',
    price: 310,
    isVeg: true,
    veg: true,
    imageUrl: '/images/kadhai_paneer.png',
    isAvailable: true,
    available: true
  },
  {
    id: 23,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Chicken Tikka Masala',
    description: 'Charcoal-grilled boneless chicken chunks simmered in a mildly spiced buttery tomato cream gravy',
    price: 370,
    isVeg: false,
    veg: false,
    imageUrl: '/images/chicken_tikka_masala.png',
    isAvailable: true,
    available: true
  },
  {
    id: 7,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Margherita Artisan Pizza',
    description: 'Handcrafted sourdough base topped with San Marzano sauce, fresh mozzarella & basil',
    price: 340,
    isVeg: true,
    veg: true,
    imageUrl: '/images/margherita_pizza.png',
    isAvailable: true,
    available: true
  },
  {
    id: 8,
    categoryId: 2,
    categoryName: 'Main Course',
    name: 'Royal Gourmet Burger',
    description: 'Double patty gourmet burger with aged cheddar, caramelized onions, crisp lettuce & fries',
    price: 290,
    isVeg: false,
    veg: false,
    imageUrl: '/images/royal_burger.png',
    isAvailable: true,
    available: true
  },

  // --- BREADS & RICE ---
  {
    id: 10,
    categoryId: 3,
    categoryName: 'Breads & Rice',
    name: 'Garlic Butter Naan',
    description: 'Clay oven leavened bread brushed with minced garlic butter and fresh coriander',
    price: 60,
    isVeg: true,
    veg: true,
    imageUrl: '/images/garlic_naan.png',
    isAvailable: true,
    available: true
  },

  // --- BEVERAGES & MOCKTAILS ---
  {
    id: 11,
    categoryId: 4,
    categoryName: 'Beverages & Mocktails',
    name: 'Strawberry Mint Mojito',
    description: 'Crushed fresh strawberries, mint sprigs, lime wedges, and sparkling soda',
    price: 160,
    isVeg: true,
    veg: true,
    imageUrl: '/images/strawberry_mojito.png',
    isAvailable: true,
    available: true
  },
  {
    id: 24,
    categoryId: 4,
    categoryName: 'Beverages & Mocktails',
    name: 'Royal Mango Lassi',
    description: 'Chilled thick yogurt smoothie blended with ripe Alphonso mango puree and garnished with saffron and pistachios',
    price: 140,
    isVeg: true,
    veg: true,
    imageUrl: '/images/mango_lassi.png',
    isAvailable: true,
    available: true
  },
  {
    id: 25,
    categoryId: 4,
    categoryName: 'Beverages & Mocktails',
    name: 'Blue Curacao Lagoon Cooler',
    description: 'Vibrant citrus cooler with blue curacao syrup, crushed ice, fresh mint, and sparkling effervescence',
    price: 160,
    isVeg: true,
    veg: true,
    imageUrl: '/images/blue_lagoon.png',
    isAvailable: true,
    available: true
  },

  // --- DESSERTS ---
  {
    id: 12,
    categoryId: 5,
    categoryName: 'Desserts',
    name: 'Gulab Jamun with Rabri',
    description: 'Warm khoya dumplings soaked in rose saffron syrup served with chilled thickened rabri',
    price: 150,
    isVeg: true,
    veg: true,
    imageUrl: '/images/gulab_jamun.png',
    isAvailable: true,
    available: true
  },
  {
    id: 26,
    categoryId: 5,
    categoryName: 'Desserts',
    name: 'Sizzling Brownie with Gelato',
    description: 'Warm dark chocolate fudge brownie served on a smoking hot sizzler plate with vanilla gelato & chocolate drizzle',
    price: 220,
    isVeg: true,
    veg: true,
    imageUrl: '/images/sizzling_brownie.png',
    isAvailable: true,
    available: true
  },
  {
    id: 27,
    categoryId: 5,
    categoryName: 'Desserts',
    name: 'Kesar Pista Rasmalai',
    description: 'Soft, delicate cottage cheese dumplings soaked in chilled saffron cardamom milk and topped with slivered pistachios',
    price: 170,
    isVeg: true,
    veg: true,
    imageUrl: '/images/rasmalai.png',
    isAvailable: true,
    available: true
  }
];

export const CustomerMenuPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterVeg, setFilterVeg] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Table Selection Modal state
  const [showTableModal, setShowTableModal] = useState<boolean>(false);
  const [tableSectionFilter, setTableSectionFilter] = useState<string>('ALL');

  // Customer Offers / Discount state
  const [selectedOffer, setSelectedOffer] = useState<'NONE' | 'ROYAL10' | 'FLAT50'>('ROYAL10');

  // Quick Bill & Payment Modal
  const [activeBill, setActiveBill] = useState<any | null>(null);
  const [showBillModal, setShowBillModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Payment tender options inside bill modal
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [transactionRef, setTransactionRef] = useState<string>('');

  const {
    items,
    orderType,
    selectedTable,
    customerName,
    customerPhone,
    notes,
    subtotal,
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
    // Set customer name from auth session
    if (user && !customerName) {
      setCustomerName(user.fullName || user.username);
      if (user.phone) setCustomerPhone(user.phone);
    }
    fetchInitialData();
  }, [user]);

  // Helper for dish images
  const getItemImage = (item: Partial<MenuItem>): string => {
    if (item.imageUrl && item.imageUrl.trim() !== '' && !item.imageUrl.includes('placeholder')) {
      return item.imageUrl;
    }
    const name = (item.name || '').toLowerCase();
    if (name.includes('mutton biryani') || name.includes('gosht biryani')) return '/images/mutton_biryani.png';
    if (name.includes('paneer biryani') || name.includes('veg biryani')) return '/images/paneer_biryani.png';
    if (name.includes('awadhi') || name.includes('lucknowi')) return '/images/awadhi_biryani.png';
    if (name.includes('egg biryani')) return '/images/egg_biryani.png';
    if (name.includes('prawn') || name.includes('seafood biryani')) return '/images/prawns_biryani.png';
    if (name.includes('biryani')) return '/images/dum_biryani.png';

    if (name.includes('chicken 65')) return '/images/chicken_65.png';
    if (name.includes('malai chaap') || name.includes('soya chaap')) return '/images/malai_chaap.png';
    if (name.includes('hara bhara') || name.includes('kabab')) return '/images/hara_bhara_kabab.png';
    if (name.includes('rogan josh') || name.includes('lamb')) return '/images/rogan_josh.png';
    if (name.includes('kadhai paneer')) return '/images/kadhai_paneer.png';
    if (name.includes('chicken tikka masala')) return '/images/chicken_tikka_masala.png';
    if (name.includes('butter chicken')) return '/images/butter_chicken.png';
    if (name.includes('paneer butter') || name.includes('butter masala')) return '/images/paneer_butter_masala.png';
    if (name.includes('paneer tikka')) return '/images/paneer_tikka.png';
    if (name.includes('chicken tikka')) return '/images/chicken_tikka.png';
    if (name.includes('corn')) return '/images/crispy_corn.png';
    if (name.includes('dal') || name.includes('makhani')) return '/images/dal_makhani.png';
    if (name.includes('pizza') || name.includes('margherita')) return '/images/margherita_pizza.png';
    if (name.includes('burger')) return '/images/royal_burger.png';
    if (name.includes('naan') || name.includes('roti') || name.includes('bread')) return '/images/garlic_naan.png';
    if (name.includes('mango') || name.includes('lassi')) return '/images/mango_lassi.png';
    if (name.includes('blue') || name.includes('curacao') || name.includes('lagoon')) return '/images/blue_lagoon.png';
    if (name.includes('mojito') || name.includes('drink') || name.includes('shake')) return '/images/strawberry_mojito.png';
    if (name.includes('brownie') || name.includes('sizzler') || name.includes('gelato')) return '/images/sizzling_brownie.png';
    if (name.includes('rasmalai') || name.includes('chenna')) return '/images/rasmalai.png';
    if (name.includes('jamun') || name.includes('sweet') || name.includes('dessert') || name.includes('rabri')) return '/images/gulab_jamun.png';
    return item.isVeg || (item as any)?.veg ? '/images/paneer_tikka.png' : '/images/butter_chicken.png';
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [catsRes, itemsRes, tablesRes] = await Promise.all([
        api.get<Category[]>('/categories').catch(() => ({ data: DEFAULT_CATEGORIES })),
        api.get<MenuItem[]>('/menu-items').catch(() => api.get<MenuItem[]>('/menu')).catch(() => ({ data: DEFAULT_MENU_ITEMS })),
        api.get<RestaurantTable[]>('/tables').catch(() => ({ data: [] }))
      ]);

      const loadedCats = Array.isArray(catsRes?.data) && catsRes.data.length > 0 ? catsRes.data : DEFAULT_CATEGORIES;
      setCategories(loadedCats);

      const rawItems = Array.isArray(itemsRes?.data) && itemsRes.data.length > 0 ? itemsRes.data : DEFAULT_MENU_ITEMS;
      const normalizedItems: MenuItem[] = rawItems.map((i: any) => ({
        ...i,
        isAvailable: i.isAvailable !== undefined ? Boolean(i.isAvailable) : (i.available !== undefined ? Boolean(i.available) : true),
        isVeg: i.isVeg !== undefined ? Boolean(i.isVeg) : (i.veg !== undefined ? Boolean(i.veg) : false),
        imageUrl: getItemImage(i)
      }));

      const availableItems = normalizedItems.filter((i) => i.isAvailable);
      setMenuItems(availableItems.length > 0 ? availableItems : normalizedItems);

      const tableList = Array.isArray(tablesRes?.data) ? tablesRes.data : [];
      setTables(tableList);

      if (!selectedTable && tableList.length > 0) {
        const firstAvailable = tableList.find((t) => t.status === 'AVAILABLE');
        if (firstAvailable) setSelectedTable(firstAvailable);
      }
    } catch (err: any) {
      console.warn('Using default menu catalog due to API error', err);
      setCategories(DEFAULT_CATEGORIES);
      setMenuItems(DEFAULT_MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // Helper for table images
  const getSectionImage = (section: string): string => {
    const s = section.toLowerCase();
    if (s.includes('window')) return '/images/tables/window_section.png';
    if (s.includes('rooftop') || s.includes('lounge')) return '/images/tables/rooftop.png';
    if (s.includes('garden') || s.includes('terrace')) return '/images/tables/garden_patio.png';
    return '/images/tables/main_dining.png';
  };

  // Filter items by category, search bar, and veg/non-veg
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategoryId ? item.categoryId === selectedCategoryId : true;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(query));
    
    const isItemVeg = item.isVeg !== undefined ? Boolean(item.isVeg) : (item.veg !== undefined ? Boolean(item.veg) : false);
    const matchesVeg =
      filterVeg === 'ALL' ? true : filterVeg === 'VEG' ? isItemVeg : !isItemVeg;
    
    return matchesCategory && matchesSearch && matchesVeg;
  });

  // Table section filters
  const tableSections = ['ALL', ...Array.from(new Set(tables.map((t) => t.section)))];
  const filteredTables = tables.filter((t) =>
    tableSectionFilter === 'ALL' ? true : t.section === tableSectionFilter
  );

  // Offer calculation
  const discountAmount =
    selectedOffer === 'ROYAL10'
      ? Number(((subtotal * 10) / 100).toFixed(2))
      : selectedOffer === 'FLAT50'
      ? Math.min(50, subtotal)
      : 0;

  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = Number((taxableAmount * 0.05).toFixed(2));
  const finalPayableAmount = Number((taxableAmount + gstAmount).toFixed(2));

  // Handle Generate Bill & Scan QR
  const handleGenerateBillAndScanPay = async () => {
    if (items.length === 0) return;
    if (orderType === 'DINE_IN' && !selectedTable) {
      setErrorMessage('Please select a dining table for your dine-in experience.');
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
        customerName: customerName.trim() || user?.fullName || 'Valued Guest',
        customerPhone: customerPhone.trim() || user?.phone || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.menuItem.id,
          quantity: i.quantity,
          notes: i.notes
        }))
      };

      const orderRes = await api.post('/orders', orderPayload);
      const createdOrder = orderRes.data;

      // 2. Generate bill with discount
      const billPayload = {
        orderId: createdOrder.id,
        discountType: selectedOffer === 'ROYAL10' ? 'PERCENTAGE' : selectedOffer === 'FLAT50' ? 'FIXED' : 'NONE',
        discountValue: selectedOffer === 'ROYAL10' ? 10 : selectedOffer === 'FLAT50' ? 50 : 0
      };

      const billRes = await api.post('/bills', billPayload);
      const createdBill = billRes.data;

      setActiveBill(createdBill);
      clearCart();
      setShowBillModal(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to generate food bill. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm payment in bill modal
  const handleConfirmCustomerPayment = async () => {
    if (!activeBill) return;
    try {
      setActionLoading(true);
      const payload = {
        amount: activeBill.grandTotal,
        paymentMethod,
        transactionReference: transactionRef.trim() || `UPI-TXN-${Date.now().toString().slice(-6)}`
      };

      await api.post(`/payments/bill/${activeBill.id}`, payload);

      // Fetch fresh bill with paid status
      const updatedBillRes = await api.get(`/bills/${activeBill.id}`);
      setActiveBill(updatedBillRes.data);
      setShowBillModal(false);
      setShowReceiptModal(true);
      setSuccessMessage('Payment completed successfully! Thank you for dining with Royal Feast.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Payment confirmation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // QR Code URL
  const billQrUrl = activeBill
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `upi://pay?pa=royalfeast@upi&pn=Royal Feast Dine&am=${activeBill.grandTotal.toFixed(
          2
        )}&tr=${activeBill.billNumber}&cu=INR`
      )}`
    : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Customer Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md shadow-amber-500/20">
            <UtensilsCrossed className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              ROYAL FEAST
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Customer Portal
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Welcome, <strong className="text-amber-300">{user?.fullName || user?.username || 'Guest Diner'}</strong>
            </p>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3">
          {/* Table Indicator (Dine-In) */}
          {selectedTable && (
            <button
              onClick={() => setShowTableModal(true)}
              className="hidden sm:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
            >
              <Armchair className="w-4 h-4 text-amber-400" />
              <span>Table {selectedTable.tableNumber}</span>
              <span className="text-[10px] text-slate-400">({selectedTable.section})</span>
            </button>
          )}

          {/* Logout / Switch Account */}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-6 max-w-[1600px] w-full mx-auto">
        
        {/* Left Side: Search Bar, Category Filters, and Colorful Food Items */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:p-6 shadow-xl">
          
          {/* Search Bar & Veg Filter */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dishes (e.g. biryani, butter chicken, pizza, mojito)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl pl-11 pr-10 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner transition-colors font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/60 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Pure Veg / Non-Veg Toggle */}
              <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-2xl p-1 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setFilterVeg('ALL')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    filterVeg === 'ALL'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Food
                </button>
                <button
                  onClick={() => setFilterVeg('VEG')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterVeg === 'VEG'
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Pure Veg
                </button>
                <button
                  onClick={() => setFilterVeg('NON_VEG')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterVeg === 'NON_VEG'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Non-Veg
                </button>
              </div>
            </div>

            {/* Quick Search Chips */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-slate-400 text-[11px] font-semibold mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Quick Search:
              </span>
              {[
                { label: 'Chicken Biryani', icon: '🍗', isVeg: false },
                { label: 'Mutton Biryani', icon: '🍖', isVeg: false },
                { label: 'Paneer Biryani', icon: '🧀', isVeg: true },
                { label: 'Egg Biryani', icon: '🥚', isVeg: false },
                { label: 'Prawns Biryani', icon: '🍤', isVeg: false },
                { label: 'Chicken 65', icon: '🌶️', isVeg: false },
                { label: 'Butter Chicken', icon: '🍛', isVeg: false },
                { label: 'Pizza', icon: '🍕', isVeg: true },
                { label: 'Mango Lassi', icon: '🥭', isVeg: true },
                { label: 'Sizzling Brownie', icon: '🍫', isVeg: true }
              ].map(({ label, icon, isVeg: tagVeg }) => {
                const isActive = searchQuery.toLowerCase() === label.toLowerCase();
                return (
                  <button
                    key={label}
                    onClick={() => {
                      if (isActive) {
                        setSearchQuery('');
                      } else {
                        setSearchQuery(label);
                        if (filterVeg === 'VEG' && !tagVeg) setFilterVeg('ALL');
                        if (filterVeg === 'NON_VEG' && tagVeg) setFilterVeg('ALL');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Food Type Categories Horizontal Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategoryId === null
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                }`}
              >
                🍽️ All Items ({menuItems.length})
              </button>
              {categories.map((cat) => {
                const count = menuItems.filter((i) => i.categoryId === cat.id).length;
                const catLower = cat.name.toLowerCase();
                const icon = catLower.includes('biryani')
                  ? '👑'
                  : catLower.includes('starter')
                  ? '🥗'
                  : catLower.includes('main')
                  ? '🍲'
                  : catLower.includes('bread')
                  ? '🫓'
                  : catLower.includes('beverage')
                  ? '🍹'
                  : catLower.includes('dessert')
                  ? '🍨'
                  : '🍽️';

                const isSelected = selectedCategoryId === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/40'
                        : catLower.includes('biryani')
                        ? 'bg-amber-950/40 text-amber-300 hover:bg-amber-900/40 border border-amber-600/40'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700/60'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feedback Alerts */}
          {successMessage && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Food Items Grid with Colorful Images & Price Under Image */}
          <div className="flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-slate-800/50 rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <UtensilsCrossed className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-base font-bold text-slate-300">No dishes found</p>
                <p className="text-xs text-slate-500 mt-1">Try searching with a different term or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item) => {
                  const cartEntry = items.find((ci) => ci.menuItem.id === item.id);
                  const displayImg = getItemImage(item);

                  return (
                    <div
                      key={item.id}
                      className="group relative bg-slate-850/90 border border-slate-750 hover:border-amber-500/60 rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/10"
                    >
                      {/* Dish Photo */}
                      <div className="relative h-40 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={displayImg}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                          }}
                        />

                        {/* Veg / Non-Veg Indicator Dot */}
                        <span
                          className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-md border flex items-center justify-center bg-slate-950/90 backdrop-blur-sm shadow-md ${
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

                        {/* Category Tag */}
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/85 backdrop-blur-sm text-amber-300 border border-amber-500/30">
                          {item.categoryName}
                        </span>
                      </div>

                      {/* Content Section with Price Clearly Under Image */}
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Price Tag Under Image */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base font-black text-amber-400">
                              ₹{item.price.toFixed(2)}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              +5% GST
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 min-h-[2rem]">
                            {item.description || 'Authentic gourmet recipe freshly prepared.'}
                          </p>
                        </div>

                        {/* Add to Cart or Quantity Adjuster */}
                        <div className="mt-3 pt-2.5 border-t border-slate-700/60">
                          {cartEntry ? (
                            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl px-2 py-1 font-bold text-xs shadow-md shadow-amber-500/25">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-amber-600 rounded-lg transition-colors"
                                title="Decrease"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 font-black text-sm">
                                {cartEntry.quantity} in Cart
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
                              className="w-full bg-slate-750 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-slate-200 hover:text-slate-950 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                              <span>Add to Cart</span>
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

        {/* Right Side: Customer Cart & Bill Summary */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col p-5 lg:p-6 shadow-xl">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              Your Food Cart
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
              {items.length} Dishes
            </span>
          </div>

          {/* Table Selector Card */}
          <div className="my-3">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Armchair className="w-3.5 h-3.5 text-amber-400" />
                Dining Table Option
              </label>
              <button
                onClick={() => setShowTableModal(true)}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
              >
                {selectedTable ? 'Change Table' : 'Choose Table'}
              </button>
            </div>

            {selectedTable ? (
              <div
                onClick={() => setShowTableModal(true)}
                className="cursor-pointer group relative overflow-hidden bg-slate-800/90 border border-amber-500/50 hover:border-amber-400 rounded-2xl p-2.5 flex items-center gap-3 transition-all shadow-md shadow-amber-500/10"
              >
                <img
                  src={getSectionImage(selectedTable.section)}
                  alt={selectedTable.section}
                  className="w-12 h-12 rounded-xl object-cover border border-amber-500/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Table {selectedTable.tableNumber}
                    </h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {selectedTable.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-300/80 mt-0.5 truncate font-medium">
                    {selectedTable.section} • {selectedTable.seatingCapacity} Seats
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTableModal(true)}
                className="w-full py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-dashed border-amber-500/40 rounded-2xl text-xs font-bold text-amber-400 flex items-center justify-center gap-2 transition-all"
              >
                <Armchair className="w-4 h-4" />
                <span>Select Dining Table</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto border-t border-b border-slate-800 py-3 space-y-2.5 max-h-[300px]">
            {items.length === 0 ? (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-2 stroke-1 text-slate-600" />
                <p className="text-xs font-bold text-slate-400">Cart is empty</p>
                <p className="text-[11px] text-slate-600 mt-1">Select dishes from the menu to start ordering</p>
              </div>
            ) : (
              items.map(({ menuItem, quantity }) => (
                <div
                  key={menuItem.id}
                  className="bg-slate-800/50 border border-slate-750/60 rounded-2xl p-2.5 flex items-center justify-between gap-2.5"
                >
                  <img
                    src={getItemImage(menuItem)}
                    alt={menuItem.name}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{menuItem.name}</h5>
                    <span className="text-[11px] text-slate-400">
                      ₹{menuItem.price.toFixed(2)} × {quantity} ={' '}
                      <strong className="text-amber-400">
                        ₹{(menuItem.price * quantity).toFixed(2)}
                      </strong>
                    </span>
                  </div>

                  {/* Quantity adjustments */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateQuantity(menuItem.id, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-750 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-750 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(menuItem.id)}
                      className="w-6 h-6 rounded-lg text-rose-400 hover:bg-rose-500/20 flex items-center justify-center ml-0.5"
                      title="Remove"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Special Offer Selection */}
          <div className="py-3 border-b border-slate-800">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              Special Dining Offers
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedOffer('ROYAL10')}
                className={`p-2 rounded-xl text-xs font-bold text-left border transition-all ${
                  selectedOffer === 'ROYAL10'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-sm'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>ROYAL10</span>
                  <Percent className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-normal block mt-0.5">10% Off Order</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOffer('FLAT50')}
                className={`p-2 rounded-xl text-xs font-bold text-left border transition-all ${
                  selectedOffer === 'FLAT50'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-sm'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>FLAT50</span>
                  <Tag className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] text-slate-400 font-normal block mt-0.5">₹50 Flat Off</span>
              </button>
            </div>
          </div>

          {/* Real-time Bill Computation */}
          <div className="pt-3 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Food Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Special Offer ({selectedOffer}):</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-400">
              <span>GST (5% Total):</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-base font-bold text-white">
              <span>Total Payable Amount:</span>
              <span className="text-amber-400 text-lg">₹{finalPayableAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Proceed to Bill & Pay Button */}
          <button
            onClick={handleGenerateBillAndScanPay}
            disabled={items.length === 0 || actionLoading}
            className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                <span>Show Full Bill & Scan QR to Pay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Selector Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl p-6 flex flex-col max-h-[88vh] shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Armchair className="w-5 h-5 text-amber-400" />
                  Select Your Dining Table
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

            {/* Tables Grid */}
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
                      <div className="relative h-28 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={secImg}
                          alt={tbl.section}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        <span
                          className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md ${
                            isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-slate-950'
                          }`}
                        >
                          {tbl.status}
                        </span>

                        <div className="absolute bottom-2 left-3">
                          <h4 className="text-base font-black text-white drop-shadow">
                            Table {tbl.tableNumber}
                          </h4>
                          <span className="text-[11px] text-amber-300 font-semibold drop-shadow-sm">
                            {tbl.section}
                          </span>
                        </div>
                      </div>

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

      {/* FULL BILL & DYNAMIC SCANNER MODAL ("show the full bill and generate scanner on bill") */}
      {showBillModal && activeBill && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[92vh]">
            
            {/* Left: Dynamic QR Scanner on Bill */}
            <div className="w-full md:w-5/12 bg-gradient-to-b from-slate-950 to-slate-900 p-6 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-between text-center">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-3">
                  <Sparkles className="w-3 h-3" />
                  Instant UPI QR Scanner
                </span>
                <h3 className="text-xl font-black text-white">Scan & Pay for Food</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Google Pay • PhonePe • Paytm • BHIM • Cred
                </p>
              </div>

              {/* Dynamic QR Code */}
              <div className="my-4 p-3.5 bg-white rounded-2xl shadow-xl border-4 border-amber-500/40 flex flex-col items-center">
                <img
                  src={billQrUrl}
                  alt={`UPI QR Scanner for Bill #${activeBill.billNumber}`}
                  className="w-48 h-48 rounded-xl object-contain"
                />
                <span className="text-[11px] text-slate-800 font-mono font-bold mt-2">
                  UPI ID: royalfeast@upi
                </span>
              </div>

              <div>
                <div className="text-xs text-slate-400">Total Bill Amount Payable</div>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  ₹{activeBill.grandTotal.toFixed(2)}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bill #{activeBill.billNumber} • Order #{activeBill.orderNumber}
                </p>
              </div>
            </div>

            {/* Right: Full Itemized Food Bill Breakdown */}
            <div className="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-wider">
                      Royal Feast Food Invoice
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bill No: <strong className="text-amber-400">{activeBill.billNumber}</strong> • Table: <strong>{activeBill.tableNumber || 'Dine-In'}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowBillModal(false);
                      setShowReceiptModal(true);
                    }}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Receipt</span>
                  </button>
                </div>

                {/* Customer Details */}
                <div className="py-2 text-xs text-slate-300 border-b border-slate-800 flex justify-between">
                  <span>Guest: <strong>{activeBill.customerName || user?.fullName || 'Valued Diner'}</strong></span>
                  <span>Date: {new Date(activeBill.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Ordered Items Table */}
                <div className="py-3">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Food Items Ordered ({activeBill.items.length})
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                    {activeBill.items.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-1.5 border-b border-slate-800/40 text-slate-200"
                      >
                        <span className="truncate pr-2 font-medium">
                          {item.itemName}{' '}
                          <span className="text-slate-400">× {item.quantity}</span>
                        </span>
                        <span className="font-bold text-white shrink-0">
                          ₹{item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bill Breakdown with Amt, GST, Offers, Total */}
                <div className="bg-slate-950/70 rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-300 border border-slate-800 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Food Subtotal:</span>
                    <span>₹{activeBill.subtotal.toFixed(2)}</span>
                  </div>

                  {activeBill.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Dining Offer Applied ({activeBill.discountType}):</span>
                      <span>-₹{activeBill.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Food Amount:</span>
                    <span>₹{activeBill.taxableAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>CGST (2.5%):</span>
                    <span>₹{activeBill.cgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>SGST (2.5%):</span>
                    <span>₹{activeBill.sgstAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                    <span>GRAND TOTAL AMOUNT:</span>
                    <span className="text-amber-400 text-base">
                      ₹{activeBill.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Mode Selector */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs font-bold text-slate-300 block">
                    Select How You Paid
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'UPI'
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      UPI / QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'CASH'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CARD')}
                      className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        paymentMethod === 'CARD'
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Card POS
                    </button>
                  </div>
                </div>

                {paymentMethod !== 'CASH' && (
                  <div className="mb-4">
                    <label className="text-[11px] text-slate-400 block mb-1">
                      UPI Ref / Transaction Reference (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. UPI-92384729"
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowBillModal(false);
                    setShowReceiptModal(true);
                  }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Pay Later
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCustomerPayment}
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  Confirm Payment & Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official Tax Invoice & Thermal Receipt Modal */}
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

export default CustomerMenuPage;
