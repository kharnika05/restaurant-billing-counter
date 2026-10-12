import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Order, OrderStatus, OrderType } from '../types';
import Badge from '../components/Badge';
import ReceiptModal from '../components/ReceiptModal';
import {
  UtensilsCrossed,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  ChefHat,
  Receipt,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Truck
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Bill Generation & Modal
  const [activeBill, setActiveBill] = useState<any | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get<Order[]>('/orders');
      setOrders(res.data);
    } catch (err: any) {
      setErrorMessage('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setActionLoading(true);
      await api.patch(`/orders/${orderId}/status?status=${newStatus}`);
      setSuccessMessage(`Order updated to ${newStatus}`);
      fetchOrders();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update order status.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateBillForOrder = async (orderId: number) => {
    try {
      setActionLoading(true);
      const res = await api.post('/bills', {
        orderId,
        discountType: 'NONE',
        discountValue: 0
      });
      setActiveBill(res.data);
      setShowReceiptModal(true);
      fetchOrders();
    } catch (err: any) {
      // If bill already exists, fetch it
      if (err.response?.status === 400 && err.response?.data?.message?.includes('already generated')) {
        try {
          const billsRes = await api.get(`/bills/order/${orderId}`);
          setActiveBill(billsRes.data);
          setShowReceiptModal(true);
        } catch {
          setErrorMessage('Could not load bill for this order.');
        }
      } else {
        setErrorMessage(err.response?.data?.message || 'Failed to generate bill.');
      }
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchesType = filterType === 'ALL' || o.orderType === filterType;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.tableNumber && o.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
            Orders Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracker of all kitchen and dining orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="p-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
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

      {/* Filter Row */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order #, Guest name, or Table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {['ALL', 'CREATED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-64 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No orders found</p>
          <p className="text-xs text-slate-500 mt-1">Orders placed via POS or QR will appear here in real time</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-lg shadow-black/20"
            >
              <div>
                {/* Order Card Top Bar */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-100 text-sm">{order.orderNumber}</h4>
                      <Badge variant={order.orderType}>{order.orderType}</Badge>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Badge variant={order.status}>{order.status}</Badge>
                </div>

                {/* Table & Guest info */}
                <div className="bg-slate-800/60 rounded-xl p-2.5 mb-3 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Table: <strong className="text-slate-100">{order.tableNumber || 'N/A'}</strong>
                  </span>
                  <span>
                    Guest:{' '}
                    <strong className="text-slate-100">
                      {order.customerName ? `${order.customerName}` : 'Walk-in'}
                    </strong>
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-1.5 mb-4 max-h-36 overflow-y-auto pr-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-slate-300 py-0.5">
                      <span className="truncate pr-2">
                        <strong className="text-amber-400 mr-1.5">{item.quantity}×</strong>
                        {item.itemName}
                      </span>
                      <span className="text-slate-400 shrink-0 font-medium">
                        ₹{item.lineTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Totals and Actions */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400">Grand Total:</span>
                  <span className="text-base font-bold text-amber-400">
                    ₹{order.grandTotal.toFixed(2)}
                  </span>
                </div>

                {/* Action Transition Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {order.status === 'CREATED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 border border-indigo-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Confirm
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      Start Prep
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Ready
                    </button>
                  )}

                  {order.status === 'READY' && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                      disabled={actionLoading}
                      className="flex-1 py-1.5 px-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Complete
                    </button>
                  )}

                  {/* Generate / View Bill Button */}
                  {order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleGenerateBillForOrder(order.id)}
                      disabled={actionLoading}
                      className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Generate or view bill"
                    >
                      <Receipt className="w-3.5 h-3.5 text-amber-400" />
                      Bill
                    </button>
                  )}

                  {/* Cancel Button */}
                  {['CREATED', 'CONFIRMED'].includes(order.status) && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                      disabled={actionLoading}
                      className="py-1.5 px-2 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-semibold transition-colors"
                      title="Cancel Order"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
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

export default OrdersPage;
