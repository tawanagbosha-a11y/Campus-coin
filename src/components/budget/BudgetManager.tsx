import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Budget, BudgetCategoryItem } from '../../types';
import {
  PieChart,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit2,
  Plus,
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const { budget, saveBudget, transactions, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedCategories, setEditedCategories] = useState<BudgetCategoryItem[]>([]);
  const [totalBudgetInput, setTotalBudgetInput] = useState<string>('');

  // Start editing mode
  const handleStartEdit = () => {
    setEditedCategories(JSON.parse(JSON.stringify(budget.categories || [])));
    setTotalBudgetInput(budget.totalBudget?.toString() || '195');
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTotal = parseFloat(totalBudgetInput) || 0;
    saveBudget({
      ...budget,
      totalBudget: newTotal,
      categories: editedCategories
    });
    setIsEditing(false);
  };

  const handleCategoryAllocationChange = (index: number, val: string) => {
    const num = parseFloat(val) || 0;
    const updated = [...editedCategories];
    updated[index].allocated = num;
    setEditedCategories(updated);
  };

  // Calculations
  const totalAllocated = (budget.categories || []).reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = (budget.categories || []).reduce((sum, c) => sum + c.spent, 0);
  const remainingTotal = Math.max(0, (budget.totalBudget || 0) - totalSpent);
  const percentUsed = budget.totalBudget > 0 ? Math.round((totalSpent / budget.totalBudget) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
            Monthly Student Budget
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Plan your living allowance by category before the money is spent.
          </p>
        </div>

        <button
          onClick={handleStartEdit}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Adjust Allocations</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Monthly Ceiling</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ${budget.totalBudget?.toFixed(2) || '195.00'}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Approved monthly target</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Actual Spending</span>
          <div className="text-2xl font-black text-[#0f2e69] mt-1">
            ${totalSpent.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{percentUsed}% of total budget</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Remaining Cushion</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${remainingTotal.toFixed(2)}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">Available to end of month</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Allocated Categories</span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            ${totalAllocated.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Sum of active ceilings</span>
        </div>
      </div>

      {/* Main Budget Category Cards */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#0a1f44]">
            Category Spending vs Allocation
          </h2>
          <span className="text-xs text-slate-500">
            Real-time tracking synced with transaction records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(budget.categories || []).map(cat => {
            const ratio = cat.allocated > 0 ? cat.spent / cat.allocated : 0;
            const pct = Math.round(ratio * 100);
            const remaining = Math.max(0, cat.allocated - cat.spent);

            // States: Under Budget (<80%), Near Limit (80%-100%), Over Budget (>100%)
            let statusBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Under Budget
              </span>
            );
            let barColor = 'bg-[#0f2e69]';

            if (ratio >= 1.0) {
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-600" /> Over Budget
                </span>
              );
              barColor = 'bg-red-500';
            } else if (ratio >= 0.8) {
              statusBadge = (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" /> Near Limit
                </span>
              );
              barColor = 'bg-amber-500';
            }

            return (
              <div
                key={cat.categoryId}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{cat.categoryName}</span>
                  {statusBadge}
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${barColor} h-full rounded-full transition-all`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Budget</span>
                    <span className="font-bold text-slate-900">${cat.allocated.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Spent</span>
                    <span className="font-bold text-slate-900">${cat.spent.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Remaining</span>
                    <span className="font-bold text-emerald-700">${remaining.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Used</span>
                    <span className="font-bold text-slate-900">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Budget Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0a1f44]">
                Adjust Monthly Budget Targets
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Monthly Spending Cap (USD)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={totalBudgetInput}
                  onChange={e => setTotalBudgetInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  Category Limits (USD)
                </span>
                {editedCategories.map((c, idx) => (
                  <div key={c.categoryId} className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-700 w-1/2">
                      {c.categoryName}
                    </span>
                    <div className="relative w-1/2">
                      <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">$</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        value={c.allocated}
                        onChange={e => handleCategoryAllocationChange(idx, e.target.value)}
                        className="w-full pl-6 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] shadow-xs"
                >
                  Save Budget Targets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
