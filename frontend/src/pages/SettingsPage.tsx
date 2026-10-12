import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { RestaurantSetting } from '../types';
import {
  Settings,
  Building,
  Save,
  CheckCircle,
  AlertCircle,
  Receipt,
  Percent,
  FileText
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({
    restaurant_name: 'The Grand Spice Kitchen & Lounge',
    address: '108 Brigade Road, Residency Road Junction, Bengaluru - 560025',
    phone: '+91 98765 43210',
    email: 'contact@grandspicekitchen.com',
    gstin: '29AABCT1332L1Z4',
    cgst_rate: '2.50',
    sgst_rate: '2.50',
    receipt_footer: 'Thank you for dining with us! Please visit again.'
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get<RestaurantSetting[]>('/settings');
      const mapped: Record<string, string> = { ...settings };
      res.data.forEach((s) => {
        mapped[s.key] = s.value;
      });
      setSettings(mapped);
    } catch {
      // Use defaults
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.post('/settings/bulk', settings);
      setSuccessMessage('Restaurant configuration & tax rates updated successfully.');
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to save settings.');
      setTimeout(() => setErrorMessage(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          Restaurant Profile & Invoicing Settings
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure business identity, legal GST credentials, tax brackets, and printed receipt notices
        </p>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Identity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Building className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-100 text-sm">Business Identity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Restaurant / Legal Name *</label>
              <input
                type="text"
                required
                value={settings.restaurant_name}
                onChange={(e) => handleChange('restaurant_name', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-slate-400 block mb-1">Physical Address *</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email Address</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* GST & Tax Configuration */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Percent className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">Tax & GSTIN Invoicing Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={settings.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">CGST Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.cgst_rate}
                onChange={(e) => handleChange('cgst_rate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">SGST Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={settings.sgst_rate}
                onChange={(e) => handleChange('sgst_rate', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Receipt Customization */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-slate-100 text-sm">Receipt Footer Note</h3>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Receipt Footer Message</label>
            <input
              type="text"
              value={settings.receipt_footer}
              onChange={(e) => handleChange('receipt_footer', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
