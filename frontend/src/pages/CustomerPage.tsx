import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Customer, Order } from '../types';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add customer modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Order history modal
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get<Customer[]>('/customers');
      setCustomers(res.data);
    } catch {
      setErrorMessage('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setActionLoading(true);
      await api.post('/customers', {
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined
      });
      setSuccessMessage('Customer registered.');
      setShowAddModal(false);
      setName('');
      setPhone('');
      setEmail('');
      fetchCustomers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add customer.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewCustomerOrders = async (cust: Customer) => {
    setSelectedCustomer(cust);
    setShowHistoryModal(true);
    try {
      setHistoryLoading(true);
      const res = await api.get<Order[]>(`/customers/${cust.id}/orders`);
      setCustomerOrders(res.data);
    } catch {
      setCustomerOrders([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Customer Directory & Loyalty
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Profiles, dining visit history, and lifetime expenditures
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
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

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or telephone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-750">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Visits</th>
                <th className="py-3 px-4 text-right">Lifetime Spent</th>
                <th className="py-3 px-4">Joined On</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-4 bg-slate-850/40"></td>
                  </tr>
                ))
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No customers found. Click "+ Add Customer" or place orders with phone numbers.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">{c.name}</td>
                    <td className="py-3.5 px-4 text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      {c.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{c.email || '—'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
                        {c.totalVisits} visits
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-amber-400">
                      ₹{c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleViewCustomerOrders(c)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ml-auto"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                        Orders
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustomer}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">Register Customer</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email (Optional)</label>
              <input
                type="email"
                placeholder="ananya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Past Orders Modal */}
      {showHistoryModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {selectedCustomer.name}'s Order History
                </h3>
                <p className="text-xs text-slate-400">
                  Total Spent: <strong className="text-amber-400">₹{selectedCustomer.totalSpent.toFixed(2)}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {historyLoading ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading orders...</div>
              ) : customerOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No previous orders recorded for this customer.
                </div>
              ) : (
                customerOrders.map((o) => (
                  <div
                    key={o.id}
                    className="bg-slate-800/60 border border-slate-750 rounded-xl p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-100">{o.orderNumber}</div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()} • {o.orderType}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-amber-400 text-xs">
                        ₹{o.grandTotal.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{o.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
