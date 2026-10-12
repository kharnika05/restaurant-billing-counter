import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Order, OrderStatus } from '../types';
import Badge from '../components/Badge';
import {
  ChefHat,
  Clock,
  CheckCircle,
  Play,
  CheckSquare,
  RefreshCw,
  AlertCircle,
  UtensilsCrossed,
  Bell
} from 'lucide-react';

export const KitchenDisplayPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 10000); // auto-poll every 10s for kitchen
    return () => clearInterval(interval);
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const res = await api.get<Order[]>('/kitchen/orders');
      setOrders(res.data);
    } catch (err: any) {
      setErrorMessage('Failed to fetch kitchen orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      setActionLoading(true);
      await api.patch(`/kitchen/orders/${orderId}/status?status=${status}`);
      fetchKitchenOrders();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update order.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const incomingOrders = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'CREATED');
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING');
  const readyOrders = orders.filter((o) => o.status === 'READY');

  const getElapsedTimeMinutes = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    return Math.max(0, diff);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Kitchen Display System (KDS)
            </h2>
            <p className="text-xs text-slate-400">
              Live orders queue • Auto-refreshing every 10 seconds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Live Kitchen Feed ({orders.length} active)
          </span>

          <button
            onClick={fetchKitchenOrders}
            className="p-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Refresh now"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3-Column Kitchen Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Incoming / Queued */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <h3 className="font-bold text-slate-100 text-sm">Queued Orders</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {incomingOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
            {incomingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No pending orders</div>
            ) : (
              incomingOrders.map((order) => {
                const elapsed = getElapsedTimeMinutes(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-lg hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">
                            {order.orderNumber}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {order.orderType}{' '}
                            {order.tableNumber ? `• Table ${order.tableNumber}` : ''}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            elapsed > 15
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {elapsed}m ago
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 my-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start text-xs text-slate-200"
                          >
                            <span className="font-medium">
                              <strong className="text-amber-400 mr-1.5 text-sm">
                                {it.quantity}×
                              </strong>
                              {it.itemName}
                            </span>
                            {it.notes && (
                              <span className="text-[10px] text-amber-300 italic block">
                                Note: {it.notes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mb-3">
                          <strong>Order Note:</strong> {order.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                      disabled={actionLoading}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Start Cooking
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="font-bold text-slate-100 text-sm">In Kitchen (Cooking)</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {preparingOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">Nothing on stoves</div>
            ) : (
              preparingOrders.map((order) => {
                const elapsed = getElapsedTimeMinutes(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="bg-slate-800/80 border border-amber-500/40 rounded-2xl p-4 shadow-lg hover:border-amber-400 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-100 text-sm">
                            {order.orderNumber}
                          </h4>
                          <span className="text-[11px] text-slate-400">
                            {order.orderType}{' '}
                            {order.tableNumber ? `• Table ${order.tableNumber}` : ''}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                            elapsed > 20
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {elapsed}m cooking
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 my-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-start text-xs text-slate-200"
                          >
                            <span className="font-medium">
                              <strong className="text-amber-400 mr-1.5 text-sm">
                                {it.quantity}×
                              </strong>
                              {it.itemName}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-[11px] text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 mb-3">
                          <strong>Note:</strong> {order.notes}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleUpdateStatus(order.id, 'READY')}
                      disabled={actionLoading}
                      className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark Plated & Ready
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Ready for Pickup */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-slate-100 text-sm">Ready to Serve / Dispatch</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {readyOrders.length}
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">No orders waiting for pickup</div>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-800/80 border border-emerald-500/40 rounded-2xl p-4 shadow-lg hover:border-emerald-400 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">
                          {order.orderNumber}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          {order.orderType}{' '}
                          {order.tableNumber ? `• Table ${order.tableNumber}` : ''}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Ready
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="space-y-1.5 my-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-750">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-start text-xs text-slate-200"
                        >
                          <span>
                            <strong className="text-emerald-400 mr-1.5">{it.quantity}×</strong>
                            {it.itemName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                    disabled={actionLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Served / Completed
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplayPage;
