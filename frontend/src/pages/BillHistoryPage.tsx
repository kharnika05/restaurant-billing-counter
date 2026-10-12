import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Bill, PaymentStatus } from '../types';
import Badge from '../components/Badge';
import ReceiptModal from '../components/ReceiptModal';
import {
  Receipt,
  Search,
  Filter,
  Download,
  CreditCard,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Printer,
  DollarSign
} from 'lucide-react';

export const BillHistoryPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [activeBill, setActiveBill] = useState<Bill | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  // Pay modal state
  const [showPayModal, setShowPayModal] = useState<boolean>(false);
  const [selectedBillForPayment, setSelectedBillForPayment] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'OTHER'>('CASH');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [payLoading, setPayLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get<Bill[]>('/bills');
      setBills(res.data);
    } catch (err: any) {
      setErrorMessage('Failed to load bills history.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPayment = (bill: Bill) => {
    setSelectedBillForPayment(bill);
    setPaymentAmount(bill.balanceAmount);
    setTransactionRef('');
    setPaymentMethod('CASH');
    setShowPayModal(true);
  };

  const handleRecordPayment = async () => {
    if (!selectedBillForPayment) return;
    try {
      setPayLoading(true);
      await api.post(`/payments/bill/${selectedBillForPayment.id}`, {
        amount: paymentAmount,
        paymentMethod,
        transactionReference: transactionRef.trim() || undefined
      });
      setSuccessMessage(`Payment of ₹${paymentAmount.toFixed(2)} recorded successfully.`);
      setShowPayModal(false);
      fetchBills();
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to record payment.');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setPayLoading(false);
    }
  };

  const handleDownloadPdf = async (billId: number, billNumber: string) => {
    try {
      const response = await api.get(`/bills/${billId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${billNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMessage('Failed to download PDF receipt.');
    }
  };

  const filteredBills = bills.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.paymentStatus === statusFilter;
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.customerName && b.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.customerPhone && b.customerPhone.includes(searchQuery));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            Billing & Invoices History
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit trail of generated invoices, tax breakdowns, and payment settlements
          </p>
        </div>

        <button
          onClick={fetchBills}
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

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Bill #, Order #, Guest name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'PAID', 'PARTIALLY_PAID', 'UNPAID', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-750">
              <tr>
                <th className="py-3 px-4">Bill Number</th>
                <th className="py-3 px-4">Order / Table</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4 text-right">Subtotal</th>
                <th className="py-3 px-4 text-right">GST (5%)</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={10} className="py-4 px-4 bg-slate-850/40"></td>
                  </tr>
                ))
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No bills found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-400">{bill.billNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-200">{bill.orderNumber}</div>
                      <span className="text-[10px] text-slate-500">
                        {bill.orderType} {bill.tableNumber ? `• Table ${bill.tableNumber}` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-200">{bill.customerName || 'Walk-in'}</div>
                      <span className="text-[10px] text-slate-500">{bill.customerPhone || ''}</span>
                    </td>
                    <td className="py-3 px-4 text-right">₹{bill.subtotal.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-slate-400">₹{bill.totalTax.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100">
                      ₹{bill.grandTotal.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {bill.balanceAmount > 0 ? (
                        <span className="text-rose-400">₹{bill.balanceAmount.toFixed(2)}</span>
                      ) : (
                        <span className="text-emerald-400">₹0.00</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={bill.paymentStatus}>{bill.paymentStatus}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(bill.createdAt).toLocaleDateString()}{' '}
                      {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {bill.balanceAmount > 0 && (
                          <button
                            onClick={() => handleOpenPayment(bill)}
                            className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg transition-colors"
                            title="Collect Payment"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActiveBill(bill);
                            setShowReceiptModal(true);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg transition-colors"
                          title="View / Print Receipt"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(bill.id, bill.billNumber)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Remaining Modal */}
      {showPayModal && selectedBillForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Settle Due Balance • #{selectedBillForPayment.billNumber}
            </h3>
            <p className="text-xs text-slate-400">
              Outstanding Amount:{' '}
              <strong className="text-rose-400">
                ₹{selectedBillForPayment.balanceAmount.toFixed(2)}
              </strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / QR</option>
                  <option value="CARD">Card / POS</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount to Pay</label>
                <input
                  type="number"
                  max={selectedBillForPayment.balanceAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              {paymentMethod !== 'CASH' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Transaction / UPI Reference ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI-98765432"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={payLoading || paymentAmount <= 0}
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20"
              >
                Submit Payment
              </button>
            </div>
          </div>
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

export default BillHistoryPage;
