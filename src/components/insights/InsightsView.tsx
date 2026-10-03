import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  ShieldAlert,
  ArrowRight,
  PieChart,
  Target,
  Zap,
  BookOpen
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { insights, safeToSpend, budget, goals, transactions, setActiveView } = useAuth();

  const iconByType = (type: string) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const bgByType = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50/60 border-red-200';
      case 'warning':
        return 'bg-amber-50/60 border-amber-200';
      case 'positive':
        return 'bg-emerald-50/60 border-emerald-200';
      default:
        return 'bg-blue-50/60 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              Spending Insights Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Transparent, rule-based observations grounded directly in your stored transactions, budgets, and semester goals.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Pace Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Daily Spending Ceiling</span>
          <div className="text-2xl font-black text-amber-950">
            ${safeToSpend.safeToSpendDaily.toFixed(2)} / day
          </div>
          <p className="text-[11px] text-slate-500">
            Calculated after deducting upcoming fee commitments & savings reserves.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Monthly Budget Health</span>
          <div className="text-2xl font-black text-[#0f2e69]">
            {budget?.totalBudget > 0
              ? `${Math.round(((budget.categories || []).reduce((s, c) => s + c.spent, 0) / budget.totalBudget) * 100)}% Used`
              : 'On Track'}
          </div>
          <p className="text-[11px] text-slate-500">
            Based on actual expenses logged in the current calendar month.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Semester Horizon</span>
          <div className="text-2xl font-black text-emerald-700">
            {safeToSpend.remainingDays} Days Left
          </div>
          <p className="text-[11px] text-slate-500">
            Pacing ensures cash lasts through final examination week.
          </p>
        </div>
      </div>

      {/* Generated Rule-based Insights Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#0a1f44]">
          Active Observations & Recommendations ({insights.length})
        </h2>

        <div className="space-y-3">
          {insights.map(ins => (
            <div
              key={ins.id}
              className={`p-5 rounded-2xl border shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${bgByType(
                ins.type
              )}`}
            >
              <div className="flex items-start gap-3.5">
                <div className="shrink-0 mt-0.5">{iconByType(ins.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{ins.title}</h3>
                    {ins.metric && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-800">
                        {ins.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
                    {ins.message}
                  </p>
                </div>
              </div>

              {ins.actionText && (
                <button
                  onClick={() => {
                    if (ins.actionText?.toLowerCase().includes('budget')) setActiveView('budget');
                    else if (ins.actionText?.toLowerCase().includes('spending') || ins.actionText?.toLowerCase().includes('recurring')) setActiveView('transactions');
                    else if (ins.actionText?.toLowerCase().includes('goal')) setActiveView('goals');
                    else if (ins.actionText?.toLowerCase().includes('wellness')) setActiveView('wellness');
                  }}
                  className="shrink-0 self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition-colors flex items-center gap-1.5"
                >
                  <span>{ins.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanatory Note on AI Architecture */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Engine Transparency: </strong>
        Campus Coin believes financial software must be honest with students. These insights are calculated strictly using deterministic financial rules from your verified transactions, remaining days, and semester commitments. When our optional AI Student Financial Coach is integrated in future updates, you will have the choice to enable conversational guidance with full privacy controls.
      </div>
    </div>
  );
};
