import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Ingredient, InventoryMovement } from '../types';
import {
  Boxes,
  Plus,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [activeTab, setActiveTab] = useState<'STOCK' | 'MOVEMENTS'>('STOCK');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add Ingredient Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [ingName, setIngName] = useState<string>('');
  const [ingUnit, setIngUnit] = useState<string>('kg');
  const [ingStock, setIngStock] = useState<number>(10);
  const [ingThreshold, setIngThreshold] = useState<number>(3);
  const [ingUnitCost, setIngUnitCost] = useState<number>(100);
  const [ingSupplier, setIngSupplier] = useState<string>('');

  // Stock Adjustment Modal
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [adjustType, setAdjustType] = useState<string>('INWARD_PURCHASE');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState<string>('');

  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const [ingsRes, movsRes] = await Promise.all([
        api.get<Ingredient[]>('/inventory/ingredients'),
        api.get<InventoryMovement[]>('/inventory/movements')
      ]);
      setIngredients(ingsRes.data);
      setMovements(movsRes.data);
    } catch {
      setErrorMessage('Failed to load inventory data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingName.trim()) return;
    try {
      setActionLoading(true);
      await api.post('/inventory/ingredients', {
        name: ingName.trim(),
        unit: ingUnit,
        currentStock: ingStock,
        minThreshold: ingThreshold,
        unitCost: ingUnitCost,
        supplier: ingSupplier.trim() || undefined
      });
      setSuccessMessage('Ingredient added successfully.');
      setShowAddModal(false);
      setIngName('');
      fetchInventory();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to add ingredient.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIngredient) return;
    try {
      setActionLoading(true);
      await api.post('/inventory/movements', {
        ingredientId: selectedIngredient.id,
        movementType: adjustType,
        quantity: adjustQuantity,
        reason: adjustReason.trim() || undefined
      });
      setSuccessMessage('Stock movement logged.');
      setShowAdjustModal(false);
      fetchInventory();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to log stock movement.');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setActionLoading(false);
    }
  };

  const lowStockItems = ingredients.filter((i) => i.lowStock);

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-500" />
            Inventory & Ingredients Stock
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-deducts stock upon orders, logs inward deliveries, and tracks wastage
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Raw Material
        </button>
      </div>

      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-400">
                Low Stock Alert ({lowStockItems.length} items below minimum threshold)
              </h4>
              <p className="text-xs text-slate-400">
                {lowStockItems.map((i) => `${i.name} (${i.currentStock} ${i.unit})`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('STOCK')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'STOCK'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ingredients Stock Level ({ingredients.length})
        </button>
        <button
          onClick={() => setActiveTab('MOVEMENTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'MOVEMENTS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Movement Audit Log ({movements.length})
        </button>
      </div>

      {activeTab === 'STOCK' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-750">
                <tr>
                  <th className="py-3 px-4">Ingredient Name</th>
                  <th className="py-3 px-4 text-right">Current Stock</th>
                  <th className="py-3 px-4 text-right">Min Threshold</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredIngredients.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{item.name}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                      {item.currentStock.toFixed(2)} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {item.minThreshold.toFixed(2)} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right">₹{item.unitCost.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.supplier || 'Local Market'}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.lowStock
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {item.lowStock ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedIngredient(item);
                          setAdjustQuantity(5);
                          setAdjustReason('');
                          setShowAdjustModal(true);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Movements Log */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-750">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Ingredient</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-right">Qty</th>
                  <th className="py-3 px-4 text-right">Prev Stock</th>
                  <th className="py-3 px-4 text-right">New Stock</th>
                  <th className="py-3 px-4">Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {movements.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">{m.ingredientName}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-xs text-slate-300">
                        {m.movementType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                      {m.quantity.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">
                      {m.previousStock.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-200">
                      {m.newStock.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{m.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedIngredient && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordAdjustment}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">
              Adjust Stock • {selectedIngredient.name}
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Movement Type</label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="INWARD_PURCHASE">Inward Purchase (+)</option>
                <option value="ADJUSTMENT_RETURN">Adjustment Return (+)</option>
                <option value="OUTWARD_CONSUMPTION">Manual Consumption (-)</option>
                <option value="ADJUSTMENT_WASTAGE">Wastage / Spoilage (-)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Quantity ({selectedIngredient.unit})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={adjustQuantity}
                onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Reason / Invoice Ref</label>
              <input
                type="text"
                placeholder="e.g. Daily market purchase PO-102"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdjustModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateIngredient}
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-100">Add Raw Material</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Ingredient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Basmati Rice, Paneer"
                value={ingName}
                onChange={(e) => setIngName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="kg, liters, pcs"
                  value={ingUnit}
                  onChange={(e) => setIngUnit(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Opening Stock</label>
                <input
                  type="number"
                  step="0.01"
                  value={ingStock}
                  onChange={(e) => setIngStock(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Min Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  value={ingThreshold}
                  onChange={(e) => setIngThreshold(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={ingUnitCost}
                  onChange={(e) => setIngUnitCost(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Supplier / Vendor</label>
              <input
                type="text"
                placeholder="e.g. Fresh Dairy Co."
                value={ingSupplier}
                onChange={(e) => setIngSupplier(e.target.value)}
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
