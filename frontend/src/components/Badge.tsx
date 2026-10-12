import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'slate', className = '' }) => {
  const getStyle = (v: string) => {
    switch (v) {
      // Order & Payment Success
      case 'COMPLETED':
      case 'PAID':
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

      // Pending / In progress
      case 'PREPARING':
      case 'CONFIRMED':
      case 'PARTIALLY_PAID':
      case 'amber':
      case 'CASHIER':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';

      // Ready / Admin
      case 'READY':
      case 'ADMIN':
      case 'blue':
      case 'DINE_IN':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

      // Chef / Cooking
      case 'KITCHEN_STAFF':
      case 'TAKEAWAY':
      case 'orange':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30';

      // Alert / Cancel / Unpaid
      case 'CANCELLED':
      case 'UNPAID':
      case 'OCCUPIED':
      case 'rose':
      case 'REFUNDED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';

      // Reserved / Delivery
      case 'RESERVED':
      case 'DELIVERY':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';

      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStyle(
        variant
      )} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
