import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
        <UtensilsCrossed className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">404</h1>
      <h2 className="text-lg font-bold text-slate-300 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-2 mb-6">
        The dining page or resource you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
