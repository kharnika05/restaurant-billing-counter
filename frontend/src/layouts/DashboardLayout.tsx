import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ShoppingCart,
  Clock,
  Receipt,
  ChefHat,
  UtensilsCrossed,
  LayoutGrid,
  Boxes,
  Users,
  BarChart3,
  UserCog,
  Settings,
  QrCode,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CASHIER'] },
    { to: '/pos', label: 'POS Billing', icon: ShoppingCart, roles: ['ADMIN', 'CASHIER'] },
    { to: '/orders', label: 'Orders Live', icon: Clock, roles: ['ADMIN', 'CASHIER', 'KITCHEN_STAFF'] },
    { to: '/bills', label: 'Invoices & Bills', icon: Receipt, roles: ['ADMIN', 'CASHIER'] },
    { to: '/kitchen', label: 'Kitchen KDS', icon: ChefHat, roles: ['ADMIN', 'KITCHEN_STAFF'] },
    { to: '/menu', label: 'Menu Catalog', icon: UtensilsCrossed, roles: ['ADMIN'] },
    { to: '/tables', label: 'Floor Plan', icon: LayoutGrid, roles: ['ADMIN', 'CASHIER'] },
    { to: '/inventory', label: 'Inventory Stock', icon: Boxes, roles: ['ADMIN'] },
    { to: '/customers', label: 'Customers', icon: Users, roles: ['ADMIN', 'CASHIER'] },
    { to: '/reports', label: 'Sales Reports', icon: BarChart3, roles: ['ADMIN'] },
    { to: '/staff', label: 'Staff Roles', icon: UserCog, roles: ['ADMIN'] },
    { to: '/settings', label: 'Settings', icon: Settings, roles: ['ADMIN'] },
    { to: '/qr-menu', label: 'Public QR Menu', icon: QrCode, roles: ['ADMIN', 'CASHIER', 'KITCHEN_STAFF'] },
  ];

  const filteredNav = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">The Grand Spice</h1>
              <p className="text-[10px] text-amber-400 font-medium tracking-wider">POS & Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850/80 mb-2 border border-slate-800">
            <div className="truncate pr-1">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'User'}</p>
              <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xs font-bold text-slate-200">The Grand Spice Kitchen & Lounge</h2>
              <p className="text-[11px] text-slate-500">POS Billing, Kitchen & Inventory Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-inner">
              {currentTime}
            </span>

            {['ADMIN', 'CASHIER'].includes(user?.role || '') && (
              <button
                onClick={() => navigate('/pos')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>New POS Bill</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
