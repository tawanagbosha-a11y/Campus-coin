import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SavingsGoal } from '../../types';
import confetti from 'canvas-confetti';
import {
  Target,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Trash2,
  TrendingUp,
  DollarSign,
  Laptop,
  ShieldCheck,
  Award
} from 'lucide-react';

interface GoalsManagerProps {
  onOpenContributeModal: (goalId: string) => void;
}

export const GoalsManager: React.FC<GoalsManagerProps> = ({ onOpenContributeModal }) => {
  const { goals, addGoal, deleteGoal, user } = useAuth();

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('2026-12-15');
  const [category, setCategory] = useState('Tech & Equipment');
  const [contributionFrequency, setContributionFrequency] = useState<'weekly' | 'monthly' | 'irregular'>('weekly');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;
    if (isNaN(target) || target <= 0) return;
    if (!name.trim()) return;

    addGoal({
      userId: user?.id || 'usr_demo',
      name: name.trim(),
      targetAmount: target,
      currentAmount: initial,
      targetDate,
      category,
      contributionFrequency,
      status: initial >= target ? 'completed' : 'active'
    });

    if (initial >= target) {
      confetti({ particleCount: 80, spread: 60 });
    }

    setName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setShowAddGoalModal(false);
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter(g => g.status === 'completed' || g.currentAmount >= g.targetAmount).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
            Student Savings Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Give your money a destination. Save for laptops, fees, and emergency cushions with micro-deposits.
          </p>
        </div>

        <button
          onClick={() => setShowAddGoalModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>+ Create New Goal</span>
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Saved So Far</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            ${totalSaved.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            Across {goals.length} student targets
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Target Milestone</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ${totalTarget.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            ${Math.max(0, totalTarget - totalSaved).toFixed(2)} remaining to complete
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Completed Goals</span>
          <div className="text-2xl font-black text-[#0f2e69] mt-1 flex items-center gap-1">
            <Award className="w-6 h-6 text-amber-500" />
            {completedGoals} Achieved
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Celebrating student discipline</span>
        </div>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const isDone = goal.currentAmount >= goal.targetAmount || goal.status === 'completed';
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          // Calculate required weekly & monthly contributions
          const targetD = new Date(goal.targetDate);
          const today = new Date();
          const daysLeft = Math.max(1, Math.ceil((targetD.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));
          const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30));

          const requiredWeekly = remaining / weeksLeft;
          const requiredMonthly = remaining / monthsLeft;

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl bg-white border shadow-xs space-y-4 flex flex-col justify-between ${
                isDone ? 'border-emerald-300 bg-emerald-50/10' : 'border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {goal.category}
                    </span>
                    <h3 className="text-lg font-black text-[#0a1f44] mt-0.5">
                      {goal.name}
                    </h3>
                  </div>

                  {isDone ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Achieved!
                    </span>
                  ) : (
                    <span className="text-xs font-black text-[#0f2e69] bg-blue-50 px-2 py-1 rounded-lg">
                      {pct}%
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isDone ? 'bg-emerald-500' : 'bg-gradient-to-r from-[#0f2e69] to-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>${goal.currentAmount.toFixed(2)} accumulated</span>
                    <span>Target: ${goal.targetAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Required weekly & pace metrics */}
                {!isDone ? (
                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        Weekly Need
                      </span>
                      <span className="font-bold text-amber-700">
                        ${requiredWeekly.toFixed(2)} / week
                      </span>
                      <span className="text-[10px] text-slate-400 block">{weeksLeft} weeks left</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">
                        Target Date
                      </span>
                      <span className="font-bold text-slate-900">{goal.targetDate}</span>
                      <span className="text-[10px] text-slate-400 block">{daysLeft} days remaining</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    🎉 Goal reached! You have accumulated the full target amount of ${goal.targetAmount.toFixed(2)}.
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm(`Delete goal "${goal.name}"?`)) {
                      deleteGoal(goal.id);
                    }
                  }}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>

                {!isDone && (
                  <button
                    onClick={() => onOpenContributeModal(goal.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Contribute Money</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0a1f44]">
                Create Student Savings Goal
              </h2>
              <button
                onClick={() => setShowAddGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. ThinkPad Laptop, Emergency Cushion, Thesis Printing"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Amount ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    required
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    placeholder="e.g. 200"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Initial Deposit ($)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={currentAmount}
                    onChange={e => setCurrentAmount(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Tech & Academic Equipment">Tech & Equipment</option>
                    <option value="Emergency Fund">Emergency Cushion</option>
                    <option value="Tuition & Institutional Fees">Tuition / Fees</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Personal Project">Personal Project</option>
                    <option value="Other Custom">Other Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contribution Pace
                </label>
                <select
                  value={contributionFrequency}
                  onChange={e => setContributionFrequency(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                >
                  <option value="weekly">Weekly contributions (Recommended)</option>
                  <option value="monthly">Monthly allowance allocation</option>
                  <option value="irregular">Whenever side-gig money arrives</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] shadow-xs"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
