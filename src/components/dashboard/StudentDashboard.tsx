import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Wallet,
  Zap,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
  ArrowRight,
  Info,
  ChevronRight,
  CheckCircle2,
  Clock,
  Laptop,
  Bus,
  Utensils,
  CreditCard,
  Wifi,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  onOpenAddTx: () => void;
  onOpenContributeGoal: (goalId: string) => void;
  onOpenUpgrade: () => void;
}

export const StudentDashboard: React.FC<DashboardProps> = ({
  onOpenAddTx,
  onOpenContributeGoal,
  onOpenUpgrade
}) => {
  const {
    user,
    transactions,
    budget,
    goals,
    recurring,
    semesterPlan,
    safeToSpend,
    insights,
    setActiveView
  } = useAuth();

  const [showSafeSpendModal, setShowSafeSpendModal] = useState(false);

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // This month's total spending
  const currentMonth = new Date().toISOString().substring(0, 7);
  const monthSpending = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  // Total savings across active goals
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalGoalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  // Health label calculation
  const budgetRatio = budget?.totalBudget > 0 ? monthSpending / budget.totalBudget : 0;
  let healthLabel = 'On Track';
  let healthBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let healthDot = 'bg-emerald-500';

  if (budgetRatio > 0.85) {
    healthLabel = 'Budget Pressure';
    healthBg = 'bg-red-50 text-red-800 border-red-200';
    healthDot = 'bg-red-500';
  } else if (budgetRatio > 0.65) {
    healthLabel = 'Watch Spending';
    healthBg = 'bg-amber-50 text-amber-800 border-amber-200';
    healthDot = 'bg-amber-500';
  }

  // Category breakdown for Doughnut / Progress Bars
  const categorySpending: { [name: string]: number } = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  const categoryEntries = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
  const totalExpenses = Object.values(categorySpending).reduce((sum, v) => sum + v, 0) || 1;

  const categoryColors: { [key: string]: string } = {
    'Food & Meals': '#f59e0b',
    'Transport & Kombis': '#3b82f6',
    'Academic & Printing': '#10b981',
    'Airtime & Data': '#8b5cf6',
    'Accommodation & Rent': '#ef4444',
    'Entertainment & Outings': '#ec4899',
    'Personal & Shopping': '#06b6d4',
    'Other Expenses': '#64748b'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              {getGreeting()}, {user?.firstName || 'Student'}
            </h1>
            {user?.isHitVerified && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                HIT Verified
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Your financial snapshot • {semesterPlan?.semesterName || 'Semester 1 (HIT)'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAddTx}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Cash Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Current Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0f2e69] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-[#0a1f44]">
              ${safeToSpend.availableBalance.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time liquid cash on hand</span>
            </div>
          </div>
        </div>

        {/* Safe-to-Spend Today */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-white p-5 rounded-2xl border border-amber-300/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 uppercase tracking-wide flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              Safe to Spend Today
            </span>
            <button
              onClick={() => setShowSafeSpendModal(true)}
              className="text-amber-700 hover:text-amber-900 transition-colors"
              title="See transparent math formula"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-amber-950 flex items-baseline gap-1">
              ${safeToSpend.safeToSpendDaily.toFixed(2)}
              <span className="text-xs font-bold text-amber-800">/day</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-amber-900 font-semibold">
                ${safeToSpend.safeToSpendWeekly.toFixed(2)} this week
              </span>
              <button
                onClick={() => setShowSafeSpendModal(true)}
                className="text-amber-800 underline font-bold"
              >
                Explain
              </button>
            </div>
          </div>
        </div>

        {/* This Month's Spending vs Budget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Month Spending
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthBg} flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${healthDot}`} />
              {healthLabel}
            </span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900">
              ${monthSpending.toFixed(2)}
              <span className="text-xs font-semibold text-slate-400 ml-1">
                / ${budget?.totalBudget?.toFixed(2) || '195.00'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  budgetRatio > 0.85 ? 'bg-red-500' : budgetRatio > 0.65 ? 'bg-amber-500' : 'bg-[#0f2e69]'
                }`}
                style={{ width: `${Math.min(100, Math.round(budgetRatio * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Savings Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Savings Reserve
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-emerald-900">
              ${totalSaved.toFixed(2)}
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
              <span>{Math.round((totalSaved / (totalGoalTarget || 1)) * 100)}% of targets</span>
              <button
                onClick={() => setActiveView('goals')}
                className="text-blue-700 hover:underline font-semibold"
              >
                View Goals
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Financial Insight Bar */}
      {insights.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold text-xs">
              !
            </div>
            <div>
              <span className="font-bold text-slate-900 mr-1.5">{insights[0].title}:</span>
              <span className="text-slate-700">{insights[0].message}</span>
            </div>
          </div>
          {insights[0].actionText && (
            <button
              onClick={() => setActiveView('insights')}
              className="text-amber-900 font-bold hover:underline shrink-0 text-xs flex items-center gap-1"
            >
              <span>{insights[0].actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Middle Grid: Semester Runway & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Semester Runway Widget */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0f2e69] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0a1f44]">Semester Runway</h3>
                <p className="text-xs text-slate-500">
                  {semesterPlan?.semesterName} • {semesterPlan?.startDate} to {semesterPlan?.endDate}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('semester')}
              className="text-xs font-bold text-[#0f2e69] hover:underline flex items-center gap-0.5"
            >
              <span>Open Planner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Runway Visual Indicator */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                {safeToSpend.remainingDays} days remaining in term
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Projected runway: Safe to final exam
              </span>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#0f2e69] to-amber-500 h-full rounded-full"
                style={{ width: `${Math.min(100, Math.round(((116 - safeToSpend.remainingDays) / 116) * 100))}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  Expected Income
                </span>
                <span className="font-black text-slate-900 text-sm">
                  ${semesterPlan?.expectedIncome?.toFixed(2) || '920.00'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  Committed Fees
                </span>
                <span className="font-black text-amber-700 text-sm">
                  ${semesterPlan?.fees?.toFixed(2) || '150.00'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-bold">
                  Target Savings
                </span>
                <span className="font-black text-emerald-700 text-sm">
                  ${semesterPlan?.savingsTarget?.toFixed(2) || '147.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Protected Commitments */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Upcoming Committed Obligations</span>
              <span className="text-slate-500 text-[11px]">Protected from daily spending</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {recurring.slice(0, 3).map(rec => (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{rec.title}</span>
                    <span className="font-bold text-[#0f2e69]">${rec.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Due {rec.nextDueDate}</span>
                    <span className="capitalize">{rec.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Spending Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0a1f44]">Spending Categories</h3>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-xs font-bold text-[#0f2e69] hover:underline"
            >
              All Spending
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {categoryEntries.slice(0, 5).map(([catName, amt]) => {
              const pct = Math.round((amt / totalExpenses) * 100);
              const color = categoryColors[catName] || '#64748b';
              return (
                <div key={catName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{catName}</span>
                    <span className="font-bold text-slate-900">${amt.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Category Summary */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-500">
              Food and transport make up{' '}
              <strong className="text-slate-800">
                {Math.round((((categorySpending['Food & Meals'] || 0) + (categorySpending['Transport & Kombis'] || 0)) / totalExpenses) * 100)}%
              </strong>{' '}
              of your living expenses.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Transactions & Savings Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0a1f44]">Recent Transactions</h3>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-xs font-bold text-[#0f2e69] hover:underline"
            >
              View All ({transactions.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{tx.merchant}</span>
                    <span className="text-[10px] text-slate-500">
                      {tx.category} • {tx.paymentMethod} • {tx.date}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-sm ${
                      tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenAddTx}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#0f2e69] text-xs font-bold text-[#0f2e69] hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {/* Savings Goals Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0a1f44]">Savings Goals</h3>
            <button
              onClick={() => setActiveView('goals')}
              className="text-xs font-bold text-[#0f2e69] hover:underline"
            >
              All Goals ({goals.length})
            </button>
          </div>

          <div className="space-y-4">
            {goals.map(goal => {
              const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
              return (
                <div key={goal.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {goal.name}
                    </span>
                    <span className="font-bold text-xs text-blue-900">{pct}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span>
                      ${goal.currentAmount.toFixed(2)} of ${goal.targetAmount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onOpenContributeGoal(goal.id)}
                      className="text-[11px] font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] px-2.5 py-1 rounded-lg transition-colors"
                    >
                      + Save $
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-[11px] text-blue-900 flex items-center justify-between">
            <span>Weekly micro-savings protect your semester emergency cushion.</span>
            <button
              onClick={() => setActiveView('goals')}
              className="font-bold underline shrink-0 ml-2"
            >
              Set New Goal
            </button>
          </div>
        </div>
      </div>

      {/* Safe-to-Spend Transparent Math Breakdown Modal */}
      {showSafeSpendModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  Safe-to-Spend Math Breakdown
                </h3>
              </div>
              <button
                onClick={() => setShowSafeSpendModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              We never guess your safe spending limit. Here is the exact transparent formula Campus Coin uses to safeguard your student finances:
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600">Available Cash on Hand:</span>
                <span className="font-bold text-slate-900">+${safeToSpend.availableBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>- Upcoming Fixed Commitments:</span>
                <span className="font-bold">-${safeToSpend.upcomingCommitments.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>- Reserved Planned Goal Savings:</span>
                <span className="font-bold">-${safeToSpend.plannedSavings.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900">
                <span>= Net Spendable Living Reserve:</span>
                <span>${safeToSpend.netSpendable.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>÷ Allowance Cycle Days Left:</span>
                <span>30 days (or {safeToSpend.remainingDays} sem days)</span>
              </div>
              <div className="border-t-2 border-amber-300 pt-2 flex justify-between font-black text-amber-900 text-sm">
                <span>Safe to Spend Today:</span>
                <span>${safeToSpend.safeToSpendDaily.toFixed(2)} / day</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              As long as you keep your daily living purchases under{' '}
              <strong>${safeToSpend.safeToSpendDaily.toFixed(2)}</strong>, your semester fees,
              recurring transport, and laptop savings goals will remain 100% protected.
            </p>

            <button
              onClick={() => setShowSafeSpendModal(false)}
              className="w-full py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs transition-colors"
            >
              Understood, Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
