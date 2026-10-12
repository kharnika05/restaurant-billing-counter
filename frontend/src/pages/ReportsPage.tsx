import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { SalesReportItem, TopSellingItem, PaymentMethodReport } from '../types';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Receipt,
  ShoppingBag,
  CreditCard,
  PieChart as PieIcon,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#10b981', '#6366f1', '#06b6d4', '#f59e0b'];

export const ReportsPage: React.FC = () => {
  const [days, setDays] = useState<number>(30);
  const [salesData, setSalesData] = useState<SalesReportItem[]>([]);
  const [topItems, setTopItems] = useState<TopSellingItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchReportData();
  }, [days]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [salesRes, topRes, pmRes] = await Promise.all([
        api.get<SalesReportItem[]>(`/reports/sales?days=${days}`),
        api.get<TopSellingItem[]>(`/reports/top-selling?days=${days}&limit=5`),
        api.get<PaymentMethodReport[]>(`/reports/payment-methods?days=${days}`)
      ]);
      setSalesData(salesRes.data);
      setTopItems(topRes.data);
      setPaymentMethods(pmRes.data);
    } catch {
      // default state
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      const response = await api.get(`/reports/sales/csv?days=${days}`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${days}days.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export CSV report.');
    }
  };

  const totalGross = salesData.reduce((acc, curr) => acc + curr.grossSales, 0);
  const totalNet = salesData.reduce((acc, curr) => acc + curr.netSales, 0);
  const totalTax = salesData.reduce((acc, curr) => acc + curr.taxAmount, 0);
  const totalDiscount = salesData.reduce((acc, curr) => acc + curr.discountAmount, 0);
  const totalOrders = salesData.reduce((acc, curr) => acc + curr.orderCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            Financial Analytics & Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit revenue, tax collection, discount impact, and dish velocity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Days selector */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  days === d
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Net Sales</span>
          <h3 className="text-lg font-bold text-emerald-400 mt-1">₹{totalNet.toFixed(2)}</h3>
          <span className="text-[10px] text-slate-500">Collected Revenue</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Gross Bill Amount</span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">₹{totalGross.toFixed(2)}</h3>
          <span className="text-[10px] text-slate-500">Before Deductions</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">GST Tax (5%)</span>
          <h3 className="text-lg font-bold text-amber-400 mt-1">₹{totalTax.toFixed(2)}</h3>
          <span className="text-[10px] text-slate-500">CGST + SGST</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-[11px] text-slate-400 font-medium">Total Discounts</span>
          <h3 className="text-lg font-bold text-rose-400 mt-1">₹{totalDiscount.toFixed(2)}</h3>
          <span className="text-[10px] text-slate-500">Promotions Offered</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 col-span-2 md:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium">Orders Count</span>
          <h3 className="text-lg font-bold text-indigo-400 mt-1">{totalOrders}</h3>
          <span className="text-[10px] text-slate-500">Completed Orders</span>
        </div>
      </div>

      {/* Sales Trend Bar Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            Daily Revenue & Tax Distribution ({days} Days)
          </h3>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="dateLabel" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="netSales" fill="#f59e0b" name="Net Sales (₹)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="taxAmount" fill="#06b6d4" name="GST Tax (₹)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Payment Method Breakdown & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            Payment Methods Breakdown
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            {paymentMethods.length === 0 ? (
              <span className="text-xs text-slate-500">No payment data recorded</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="totalAmount"
                    nameKey="method"
                  >
                    {paymentMethods.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top 5 Dishes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-amber-500" />
            Top Selling Dishes (By Revenue)
          </h3>

          <div className="space-y-3">
            {topItems.length === 0 ? (
              <span className="text-xs text-slate-500">No sales recorded yet</span>
            ) : (
              topItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 border border-slate-750/60 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{item.itemName}</h4>
                      <span className="text-[11px] text-slate-400">{item.quantitySold} units sold</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    ₹{item.totalRevenue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
