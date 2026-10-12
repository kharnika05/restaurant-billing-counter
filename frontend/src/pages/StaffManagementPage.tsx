import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { User, Role } from '../types';
import Badge from '../components/Badge';
import {
  ShieldCheck,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const StaffManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Add User Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [role, setRole] = useState<Role>('CASHIER');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<User[]>('/users');
      setUsers(res.data);
    } catch {
      setErrorMessage('Failed to load staff list.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !fullName.trim()) return;
    try {
      setActionLoading(true);
      await api.post('/users', {
        username: username.trim(),
        password: password.trim(),
        fullName: fullName.trim(),
        role,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined
      });
      setSuccessMessage(`User "${username}" created successfully.`);
      setShowAddModal(false);
      setUsername('');
      setPassword('');
      setFullName('');
      setEmail('');
      setPhone('');
      fetchUsers();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to create user.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}/status?active=${!user.active}`);
      fetchUsers();
    } catch {
      setErrorMessage('Failed to update status.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Staff & Role-Based Access Control
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage credentials, permissions (Admin, Cashier, Kitchen Staff), and account states
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
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

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-750">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4 text-center">System Role</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-4 bg-slate-850/40"></td>
                  </tr>
                ))
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-100">{u.fullName}</td>
                    <td className="py-3.5 px-4 text-amber-400 font-medium">@{u.username}</td>
                    <td className="py-3.5 px-4 text-center">
                      <Badge variant={u.role}>{u.role}</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      <div>{u.email || '—'}</div>
                      <span className="text-[11px] text-slate-500">{u.phone || ''}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                          u.active
                            ? 'border-rose-500/40 text-rose-400 hover:bg-rose-500/10'
                            : 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateUser}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">Register Staff Member</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="ramesh"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Role Permission *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="ADMIN">Administrator (Full Access)</option>
                <option value="CASHIER">Cashier (POS & Billing)</option>
                <option value="KITCHEN_STAFF">Kitchen Staff (KDS Display)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Phone</label>
              <input
                type="text"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Email</label>
              <input
                type="email"
                placeholder="ramesh@restaurant.com"
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
                Create Staff
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StaffManagementPage;
