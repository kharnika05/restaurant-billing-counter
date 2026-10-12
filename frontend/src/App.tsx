import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Role } from './types';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import POSBillingPage from './pages/POSBillingPage';
import OrdersPage from './pages/OrdersPage';
import BillHistoryPage from './pages/BillHistoryPage';
import KitchenDisplayPage from './pages/KitchenDisplayPage';
import MenuManagementPage from './pages/MenuManagementPage';
import TableManagementPage from './pages/TableManagementPage';
import InventoryPage from './pages/InventoryPage';
import CustomerPage from './pages/CustomerPage';
import ReportsPage from './pages/ReportsPage';
import StaffManagementPage from './pages/StaffManagementPage';
import SettingsPage from './pages/SettingsPage';
import QrMenuPage from './pages/QrMenuPage';
import CustomerMenuPage from './pages/CustomerMenuPage';
import NotFoundPage from './pages/NotFoundPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a customer accesses staff routes, redirect them to customer portal
  if (user && user.role === 'CUSTOMER') {
    return <Navigate to="/customer" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If Kitchen staff tries to access admin pages, redirect to kitchen
    if (user.role === 'KITCHEN_STAFF') {
      return <Navigate to="/kitchen" replace />;
    }
    // If Cashier tries to access admin-only pages, redirect to POS
    if (user.role === 'CASHIER') {
      return <Navigate to="/pos" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage defaultTab="LOGIN" />} />
        <Route path="/signup" element={<LoginPage defaultTab="SIGNUP" />} />
        <Route path="/qr-menu" element={<QrMenuPage />} />

        {/* Customer Self-Ordering & Bill Pay Route */}
        <Route
          path="/customer"
          element={
            <CustomerRoute>
              <CustomerMenuPage />
            </CustomerRoute>
          }
        />

        {/* Protected Dashboard & Operations */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CASHIER']}>
              <POSBillingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CASHIER', 'KITCHEN_STAFF']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CASHIER']}>
              <BillHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'KITCHEN_STAFF']}>
              <KitchenDisplayPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tables"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CASHIER']}>
              <TableManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'CASHIER']}>
              <CustomerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <StaffManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
