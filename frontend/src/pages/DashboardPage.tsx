import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { DashboardSummary, SalesReportItem } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import {
  IndianRupee,
  ShoppingBag,
  Receipt,
  TrendingUp,
  Clock,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sumRes, trendRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/sales?days=7'),
      ]);
      setSummary(sumRes.data);
      setSalesTrend(trendRes.data);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const COLORS = ['#f97316', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-slate-500">Live sales performance, active kitchen load & inventory metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pos"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <span>POS Billing</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Today's Sales"
          value={`₹${summary?.todaySales?.toFixed(2) || '0.00'}`}
          icon={IndianRupee}
          color="brand"
        />
        <StatCard
          title="Orders Today"
          value={summary?.todayOrderCount || 0}
          icon={ShoppingBag}
          color="emerald"
        />
        <StatCard
          title="Bills Finalized"
          value={summary?.totalBillsGenerated || 0}
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Avg Order Value"
          value={`₹${summary?.averageOrderValue?.toFixed(2) || '0.00'}`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          title="Pending Kitchen"
          value={summary?.pendingOrders || 0}
          icon={Clock}
          color="rose"
        />
        <StatCard
          title="Low Stock Items"
          value={summary?.lowStockCount || 0}
          icon={AlertTriangle}
          color={summary?.lowStockCount ? 'rose' : 'emerald'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Weekly Revenue Trend</h3>
              <p className="text-xs text-slate-400">Daily gross revenue breakdown (Last 7 Days)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
              Live DB Aggregations
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Gross Sales']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none' }}
                />
                <Area type="monotone" dataKey="grossSales" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Payment Methods</h3>
            <p className="text-xs text-slate-400">Share of collected revenue</p>
          </div>

          <div className="h-52 w-full my-auto flex items-center justify-center">
            {summary?.paymentMethods && summary.paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.paymentMethods}
                    dataKey="totalAmount"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {summary.paymentMethods.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Total Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No payment records yet for today.</p>
            )}
          </div>

          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            {summary?.paymentMethods?.map((pm, idx) => (
              <div key={pm.method} className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {pm.method}
                </span>
                <span className="font-bold text-slate-800">₹{pm.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Sellers and Recent Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Best Selling Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Top Selling Dishes</h3>
            <Link to="/menu" className="text-xs text-orange-600 hover:underline font-semibold">View Menu</Link>
          </div>
          <div className="space-y-3">
            {summary?.topSellingItems && summary.topSellingItems.length > 0 ? (
              summary.topSellingItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{item.itemName}</p>
                    <p className="text-[11px] text-slate-500">{item.quantitySold} portions ordered</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">₹{item.totalRevenue.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No finalized bill records yet.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Recent Restaurant Orders</h3>
            <Link to="/orders" className="text-xs text-orange-600 hover:underline font-semibold">All Orders</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Type / Table</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary?.recentOrders && summary.recentOrders.length > 0 ? (
                  summary.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 font-mono font-medium text-slate-700">{ord.orderNumber}</td>
                      <td className="py-3 text-slate-600">{ord.tableNumber || ord.orderType}</td>
                      <td className="py-3 text-slate-600">{ord.items?.length || 0} items</td>
                      <td className="py-3 font-bold text-slate-800">₹{ord.grandTotal.toFixed(2)}</td>
                      <td className="py-3">
                        <Badge
                          variant={
                            ord.status === 'COMPLETED'
                              ? 'emerald'
                              : ord.status === 'READY'
                              ? 'blue'
                              : ord.status === 'CANCELLED'
                              ? 'rose'
                              : 'amber'
                          }
                        >
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/orders`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-slate-600 font-semibold transition-colors"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
