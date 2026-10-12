import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { RestaurantTable, TableStatus } from '../types';
import Badge from '../components/Badge';
import {
  Armchair,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const TableManagementPage: React.FC = () => {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sectionFilter, setSectionFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(4);
  const [section, setSection] = useState<string>('Main Dining');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await api.get<RestaurantTable[]>('/tables');
      setTables(res.data);
    } catch {
      setErrorMessage('Failed to load tables.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (tableId: number, newStatus: TableStatus) => {
    try {
      await api.patch(`/tables/${tableId}/status?status=${newStatus}`);
      fetchTables();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to update table status.');
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim()) return;
    try {
      setActionLoading(true);
      await api.post('/tables', {
        tableNumber: tableNumber.trim(),
        seatingCapacity: capacity,
        section
      });
      setSuccessMessage('Table registered successfully.');
      setTableNumber('');
      setShowAddModal(false);
      fetchTables();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add table.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const uniqueSections = Array.from(new Set(tables.map((t) => t.section)));

  const filteredTables = tables.filter((t) => {
    const matchesSection = sectionFilter === 'ALL' || t.section === sectionFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSection && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Armchair className="w-5 h-5 text-amber-500" />
            Table & Floor Plan Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time floor occupancy, seating capacity, and table statuses
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Table
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Section Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSectionFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              sectionFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            All Sections ({tables.length})
          </button>
          {uniqueSections.map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                sectionFilter === sec
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'AVAILABLE', 'OCCUPIED', 'RESERVED', 'OUT_OF_SERVICE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                statusFilter === st
                  ? 'bg-slate-700 text-slate-100 border border-slate-600'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Floor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {loading ? (
          [...Array(12)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl h-44 animate-pulse" />
          ))
        ) : filteredTables.length === 0 ? (
          <div className="col-span-full bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            No tables in this section.
          </div>
        ) : (
          filteredTables.map((table) => {
            const isAvailable = table.status === 'AVAILABLE';
            const isOccupied = table.status === 'OCCUPIED';
            const isReserved = table.status === 'RESERVED';

            return (
              <div
                key={table.id}
                className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 shadow-md ${
                  isAvailable
                    ? 'border-emerald-500/40 hover:border-emerald-500 shadow-emerald-500/5'
                    : isOccupied
                    ? 'border-rose-500/40 hover:border-rose-500 shadow-rose-500/5'
                    : isReserved
                    ? 'border-indigo-500/40 hover:border-indigo-500 shadow-indigo-500/5'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-slate-100">{table.tableNumber}</span>
                    <Badge variant={table.status}>{table.status}</Badge>
                  </div>

                  <span className="text-[11px] text-slate-400 block mb-1">{table.section}</span>

                  <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>{table.seatingCapacity} Guests</span>
                  </div>
                </div>

                {/* Status Switcher Select */}
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1 uppercase font-semibold">
                    Set Status
                  </label>
                  <select
                    value={table.status}
                    onChange={(e) => handleUpdateStatus(table.id, e.target.value as TableStatus)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="OUT_OF_SERVICE">Out of Service</option>
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddTable}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">Add Dining Table</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Table Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. T-12, VIP-1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Seating Capacity *</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="Main Dining">Main Dining</option>
                <option value="AC Lounge">AC Lounge</option>
                <option value="Garden Patio">Garden Patio</option>
                <option value="Rooftop">Rooftop</option>
                <option value="Bar Area">Bar Area</option>
              </select>
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
                Save Table
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TableManagementPage;
