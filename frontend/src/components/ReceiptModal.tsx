import React from 'react';
import { Bill } from '../types';
import { Printer, Download, X } from 'lucide-react';
import api from '../api/client';

interface ReceiptModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ bill, isOpen, onClose }) => {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(`/bills/${bill.id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${bill.billNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download PDF bill receipt', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Actions Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Printable Receipt Card */}
        <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            id="printable-receipt"
            className="w-full bg-white p-6 shadow-sm border border-slate-200 text-slate-850 font-mono text-xs rounded"
          >
            {/* Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
              <h2 className="text-base font-bold tracking-wider font-sans text-slate-900 uppercase">
                Royal Feast Dine & Lounge
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5 font-sans">
                42 Gourmet Boulevard, Indiranagar, Bengaluru
              </p>
              <p className="text-[11px] text-slate-600 font-sans">
                Tel: +91 98765 43210 | GSTIN: 29AABCU9603R1ZM
              </p>
            </div>

            {/* Meta */}
            <div className="border-b border-dashed border-slate-300 pb-3 mb-3 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Bill No:</span>
                <span className="font-bold">{bill.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(bill.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Order No:</span>
                <span>{bill.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Table / Type:</span>
                <span>{bill.tableNumber || bill.orderType}</span>
              </div>
              {bill.customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{bill.customerName}</span>
                </div>
              )}
              {bill.cashierName && (
                <div className="flex justify-between">
                  <span>Cashier:</span>
                  <span>{bill.cashierName}</span>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="border-b border-dashed border-slate-300 pb-3 mb-3">
              <div className="grid grid-cols-12 font-bold border-b border-slate-200 pb-1 mb-2">
                <span className="col-span-6">ITEM</span>
                <span className="col-span-2 text-center">QTY</span>
                <span className="col-span-2 text-right">RATE</span>
                <span className="col-span-2 text-right">AMT</span>
              </div>
              <div className="space-y-1.5">
                {bill.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 text-[11px]">
                    <span className="col-span-6 truncate">{item.itemName}</span>
                    <span className="col-span-2 text-center">{item.quantity}</span>
                    <span className="col-span-2 text-right">{item.unitPrice.toFixed(2)}</span>
                    <span className="col-span-2 text-right font-medium">{item.lineTotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="border-b border-dashed border-slate-300 pb-3 mb-3 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{bill.subtotal.toFixed(2)}</span>
              </div>
              {bill.discountAmount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount ({bill.discountType}):</span>
                  <span>-₹{bill.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span>₹{bill.taxableAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST ({bill.cgstRate}%):</span>
                <span>₹{bill.cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST ({bill.sgstRate}%):</span>
                <span>₹{bill.sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>GRAND TOTAL:</span>
                <span>₹{bill.grandTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Paid Amount:</span>
                <span>₹{bill.paidAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Balance Due:</span>
                <span>₹{bill.balanceAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>Payment Status:</span>
                <span className="uppercase font-bold tracking-wider">{bill.paymentStatus}</span>
              </div>
            </div>

            {/* Scannable UPI QR Code */}
            <div className="flex flex-col items-center justify-center my-3 py-2 border-b border-dashed border-slate-300">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                  `upi://pay?pa=royalfeast@upi&pn=Royal Feast Dine&am=${bill.grandTotal.toFixed(
                    2
                  )}&tr=${bill.billNumber}&cu=INR`
                )}`}
                alt="Receipt Payment QR"
                className="w-24 h-24 border border-slate-300 p-1 rounded"
              />
              <span className="text-[10px] text-slate-600 font-mono mt-1">Scan & Pay: royalfeast@upi</span>
            </div>

            {/* Footer */}
            <div className="text-center font-sans text-[11px] text-slate-500 space-y-0.5">
              <p className="font-semibold text-slate-700">Thank you for dining with Royal Feast!</p>
              <p>Please visit again soon.</p>
              <p className="text-[9px] text-slate-400 mt-2">*** Computer Generated Tax Invoice ***</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
