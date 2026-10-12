import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  UtensilsCrossed,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  UserPlus,
  LogIn,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  QrCode,
  Armchair,
  Receipt,
  ChefHat
} from 'lucide-react';

interface LoginPageProps {
  defaultTab?: 'LOGIN' | 'SIGNUP';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultTab = 'LOGIN' }) => {
  const location = useLocation();
  const isSignupPath = location.pathname.includes('signup');
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP'>(
    isSignupPath || defaultTab === 'SIGNUP' ? 'SIGNUP' : 'LOGIN'
  );

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Login Form States
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('Admin@123');

  // Signup Form States (Full Name, Email, Mobile Number, Password)
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: loginUsername.trim(),
        password: loginPassword,
      });
      const { token, id, fullName, role, username } = response.data;
      login(token, {
        id,
        username,
        fullName,
        role,
        active: true,
        createdAt: new Date().toISOString(),
      });
      if (role === 'CUSTOMER') {
        navigate('/customer');
      } else if (role === 'KITCHEN_STAFF') {
        navigate('/kitchen');
      } else {
        navigate('/pos');
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please verify Spring Boot backend is running on http://localhost:8080.');
      } else {
        setError(
          err.response?.data?.message || err.response?.data?.error || 'Invalid credentials. Please verify your login details.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', {
        fullName: signupFullName.trim(),
        email: signupEmail.trim() || undefined,
        phone: signupPhone.trim(),
        password: signupPassword,
      });

      const { token, id, fullName, role, username } = response.data;
      login(token, {
        id,
        username,
        fullName,
        role,
        active: true,
        createdAt: new Date().toISOString(),
      });
      setSuccess(`Welcome ${fullName}! Your customer account was created. Redirecting to food menu...`);
      setTimeout(() => {
        navigate('/customer');
      }, 1200);
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure Spring Boot backend is running on http://localhost:8080.');
      } else {
        setError(
          err.response?.data?.message || err.response?.data?.error || 'Failed to create account. Please check your information.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u: string, p: string) => {
    setActiveTab('LOGIN');
    setLoginUsername(u);
    setLoginPassword(p);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Luxury Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative z-10">
        
        {/* Left Hero & Visual Showcase Column (5 cols on large screens) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative">
          {/* Brand Emblem */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <UtensilsCrossed className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  ROYAL FEAST
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </span>
                <p className="text-xs text-amber-300/80 font-medium tracking-wide uppercase">
                  Fine Dining & Smart Restaurant POS
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="mt-8 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                India's Premier Restaurant Management System
              </span>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Savor Exquisite Tastes. <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                  Automated Smart Billing.
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-md">
                Complete billing POS with dynamic UPI QR generation, interactive table reservations, live inventory syncing, and kitchen order display.
              </p>
            </div>

            {/* Colorful Food Item Previews Showcase with All 12 Gourmet Dishes */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  Gourmet Menu Showcase
                </p>
                <span className="text-[11px] font-bold text-amber-400">
                  12 Authentic Dishes
                </span>
              </div>

              {/* Top 4 Highlighted Dishes with Enlarged Photos */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="group relative bg-slate-850/90 border border-slate-700/80 hover:border-amber-500 rounded-2xl p-3 flex items-center gap-3 transition-all shadow-lg hover:shadow-amber-500/10">
                  <img
                    src="/images/butter_chicken.png"
                    alt="Royal Butter Chicken"
                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-amber-500/30 group-hover:scale-105 transition-transform shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Non-Veg
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                      Butter Chicken
                    </h4>
                    <p className="text-xs text-amber-400 font-extrabold mt-0.5">₹380.00</p>
                  </div>
                </div>

                <div className="group relative bg-slate-850/90 border border-slate-700/80 hover:border-amber-500 rounded-2xl p-3 flex items-center gap-3 transition-all shadow-lg hover:shadow-amber-500/10">
                  <img
                    src="/images/dum_biryani.png"
                    alt="Hyderabadi Dum Biryani"
                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-amber-500/30 group-hover:scale-105 transition-transform shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Bestseller
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                      Dum Biryani
                    </h4>
                    <p className="text-xs text-amber-400 font-extrabold mt-0.5">₹350.00</p>
                  </div>
                </div>

                <div className="group relative bg-slate-850/90 border border-slate-700/80 hover:border-amber-500 rounded-2xl p-3 flex items-center gap-3 transition-all shadow-lg hover:shadow-amber-500/10">
                  <img
                    src="/images/paneer_tikka.png"
                    alt="Paneer Tikka Sizzler"
                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-emerald-500/30 group-hover:scale-105 transition-transform shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Pure Veg
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                      Paneer Tikka
                    </h4>
                    <p className="text-xs text-amber-400 font-extrabold mt-0.5">₹280.00</p>
                  </div>
                </div>

                <div className="group relative bg-slate-850/90 border border-slate-700/80 hover:border-amber-500 rounded-2xl p-3 flex items-center gap-3 transition-all shadow-lg hover:shadow-amber-500/10">
                  <img
                    src="/images/strawberry_mojito.png"
                    alt="Strawberry Mint Mojito"
                    className="w-16 h-16 rounded-xl object-cover shadow-md border border-rose-500/30 group-hover:scale-105 transition-transform shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/paneer_tikka.png';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Beverage
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">
                      Mint Mojito
                    </h4>
                    <p className="text-xs text-amber-400 font-extrabold mt-0.5">₹160.00</p>
                  </div>
                </div>
              </div>

              {/* Mini Horizontal Scroll of More Items */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                {[
                  { name: 'Crispy Corn', img: '/images/crispy_corn.png', price: '₹190' },
                  { name: 'Chicken Tikka', img: '/images/chicken_tikka.png', price: '₹320' },
                  { name: 'Dal Makhani', img: '/images/dal_makhani.png', price: '₹260' },
                  { name: 'Paneer Masala', img: '/images/paneer_butter_masala.png', price: '₹310' },
                  { name: 'Artisan Pizza', img: '/images/margherita_pizza.png', price: '₹340' },
                  { name: 'Royal Burger', img: '/images/royal_burger.png', price: '₹290' },
                  { name: 'Garlic Naan', img: '/images/garlic_naan.png', price: '₹60' },
                  { name: 'Gulab Jamun', img: '/images/gulab_jamun.png', price: '₹150' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-2.5 py-1.5 shrink-0 shadow-sm"
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                    />
                    <div className="text-[10px] leading-tight">
                      <p className="font-semibold text-slate-200 whitespace-nowrap">{item.name}</p>
                      <p className="font-bold text-amber-400">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof & Features Pills Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Instant QR Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <Armchair className="w-4 h-4 text-emerald-400" />
              <span>Visual Tables</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-cyan-400" />
              <span>Thermal Receipt</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>JWT Protected</span>
            </div>
          </div>
        </div>

        {/* Right Form Card Column (6 cols on large screens) */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-center">
          
          {/* Segmented Tab Switcher (Sign In vs Sign Up) */}
          <div className="bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800 flex items-center mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab('LOGIN');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'LOGIN'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('SIGNUP');
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'SIGNUP'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {activeTab === 'LOGIN' ? (
            /* ==================== SIGN IN FORM ==================== */
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Welcome Back</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sign in with your credentials to access the Restaurant Billing POS.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Username or Mobile Number
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="e.g. admin, cashier, or phone"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign In to POS & Orders</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Quick-Fill Section */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Quick-Fill Demo Roles
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin', 'Admin@123')}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-all flex flex-col items-center gap-0.5"
                  >
                    <span>👑 Admin</span>
                    <span className="text-[9px] text-slate-500 font-normal">Full Control</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('cashier', 'Cashier@123')}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-all flex flex-col items-center gap-0.5"
                  >
                    <span>💳 Cashier</span>
                    <span className="text-[9px] text-slate-500 font-normal">POS & Billing</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('chef', 'Chef@123')}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-[11px] font-bold text-cyan-300 hover:text-cyan-200 transition-all flex flex-col items-center gap-0.5"
                  >
                    <span>🍳 Kitchen</span>
                    <span className="text-[9px] text-slate-500 font-normal">Live Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('customer', 'Customer@123')}
                    className="py-2 px-2 bg-slate-800 hover:bg-slate-750 border border-amber-500/40 rounded-xl text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-all flex flex-col items-center gap-0.5 shadow-sm"
                  >
                    <span>🧑 Customer</span>
                    <span className="text-[9px] text-slate-400 font-normal">Order & Pay</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* ==================== SIGN UP FORM ==================== */
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-white">Create New Account</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fill in your details below to set up your restaurant access profile.
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. aarav@royalfeast.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Password * (Minimum 6 Characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showSignupPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Sign Up & Go to POS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center mt-3">
                  By clicking Sign Up, you agree to our terms of service and dining privacy policy.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
