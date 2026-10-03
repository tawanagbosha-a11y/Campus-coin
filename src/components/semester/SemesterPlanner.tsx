import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SemesterPlan, AllowanceScheduleItem } from '../../types';
import {
  Calendar,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  Edit2,
  CheckCircle2,
  Shield,
  Layers,
  Info
} from 'lucide-react';

export const SemesterPlanner: React.FC = () => {
  const { semesterPlan, saveSemesterPlan, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SemesterPlan>(semesterPlan);

  const handleStartEdit = () => {
    setFormData(JSON.parse(JSON.stringify(semesterPlan)));
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSemesterPlan(formData);
    setIsEditing(false);
  };

  // Calculations for semester metrics
  const start = new Date(formData.startDate || '2026-08-18');
  const end = new Date(formData.endDate || '2026-12-12');
  const today = new Date();

  const totalSemesterDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const daysPassed = Math.max(0, Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(1, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.round((daysPassed / totalSemesterDays) * 100));

  // Sum of fixed academic & living commitments across the semester
  const totalCommitments =
    (formData.fees || 0) +
    (formData.accommodation || 0) +
    (formData.transportBudget || 0) +
    (formData.foodBudget || 0) +
    (formData.academicCosts || 0) +
    (formData.airtimeData || 0) +
    (formData.otherCosts || 0);

  const projectedEndBalance = Math.max(0, (formData.expectedIncome || 0) - totalCommitments);
  const expectedSavings = formData.savingsTarget || 0;

  // Average daily & weekly living limits across the semester
  const dailyLivingLimit = totalSemesterDays > 0 ? (formData.foodBudget + formData.transportBudget + formData.airtimeData) / totalSemesterDays : 0;
  const weeklyLivingLimit = dailyLivingLimit * 7;

  // Upcoming pressure periods (e.g. fee registration deadline, mid-sem exam, final project submission)
  const pressureMilestones = [
    { name: 'Semester Kickoff & Registration', date: '2026-08-20', status: 'completed' },
    { name: 'Hostel Maintenance Contribution Due', date: '2026-09-25', status: 'completed' },
    { name: 'Mid-Semester Study Break & Printing', date: '2026-10-14', status: 'upcoming' },
    { name: 'Final Exam Registration Balance Deadline', date: '2026-11-15', status: 'critical' },
    { name: 'Final Year Project / Lab Demos', date: '2026-12-05', status: 'upcoming' },
    { name: 'Semester Examinations End', date: '2026-12-12', status: 'upcoming' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              Semester Financial Planner
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0f2e69]">
              CORE DIFFERENTIATOR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Synchronize your expected income, fee deadlines, and living runway across the HIT academic term.
          </p>
        </div>

        <button
          onClick={handleStartEdit}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all active:scale-95"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Semester Plan</span>
        </button>
      </div>

      {/* Main Semester Timeline Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Academic Term Progress
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              {semesterPlan.semesterName}
            </h2>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Start: <strong className="text-slate-800">{semesterPlan.startDate}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">
              End: <strong className="text-slate-800">{semesterPlan.endDate}</strong>
            </span>
          </div>
        </div>

        {/* Visual Timeline Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">{daysPassed} days completed ({progressPercent}%)</span>
            <span className="text-[#0f2e69]">{daysRemaining} days remaining</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-gradient-to-r from-[#0f2e69] via-[#1a4494] to-amber-500 h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Milestone Timeline Dots */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-700 block mb-3">
            Financial Pressure & Academic Deadlines:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {pressureMilestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                  m.status === 'critical'
                    ? 'bg-red-50/80 border-red-200 text-red-900'
                    : m.status === 'completed'
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-blue-50/60 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {m.date}
                  </span>
                  {m.status === 'critical' && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                  {m.status === 'completed' && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  )}
                </div>
                <p className="font-semibold text-[11px] leading-tight line-clamp-2">
                  {m.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projections & Limits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Expected Term Income</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ${(semesterPlan.expectedIncome || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Allowances + part-time</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Committed Costs</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ${totalCommitments.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Fees, living & accommodation</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Target Term Savings</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ${expectedSavings.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Protected goals cushion</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Projected End Balance</span>
          <div className="text-2xl font-black text-[#0f2e69] mt-1">
            ${projectedEndBalance.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Surplus buffer on Dec 12</span>
        </div>
      </div>

      {/* Daily & Weekly Living Allocations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              $
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Semester Living Ceilings
              </h3>
              <p className="text-xs text-slate-500">
                Pacing metrics for food, kombis, and data across 16 weeks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block">Average Daily Limit</span>
              <div className="text-2xl font-black text-amber-950 mt-1">
                ${dailyLivingLimit.toFixed(2)}
                <span className="text-xs font-normal text-amber-800">/day</span>
              </div>
              <span className="text-[10px] text-amber-800 mt-0.5 block">
                Balanced across 116 term days
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-xs font-bold text-blue-900 block">Average Weekly Limit</span>
              <div className="text-2xl font-black text-[#0f2e69] mt-1">
                ${weeklyLivingLimit.toFixed(2)}
                <span className="text-xs font-normal text-blue-800">/week</span>
              </div>
              <span className="text-[10px] text-blue-800 mt-0.5 block">
                7-day rolling living budget
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Planning Note: </strong>
            {semesterPlan.notes || 'Protect your exam registration balance before discretionary weekend outings.'}
          </div>
        </div>

        {/* Commitment Breakdown Details */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900">
            Semester Cost Allocations
          </h3>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Institutional Exam / Tuition Fees:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.fees || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Hostel & Accommodation:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.accommodation || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Food & Living Allowance:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.foodBudget || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Transport & Kombis:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.transportBudget || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Academic Supplies, Books & Printing:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.academicCosts || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">Airtime & Research Data:</span>
              <span className="font-bold text-slate-900">${(semesterPlan.airtimeData || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Semester Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0a1f44]">
                Edit Semester Financial Parameters
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester Name</label>
                <input
                  type="text"
                  required
                  value={formData.semesterName}
                  onChange={e => setFormData({ ...formData, semesterName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Income ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.expectedIncome}
                    onChange={e => setFormData({ ...formData, expectedIncome: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tuition / Fees ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.fees}
                    onChange={e => setFormData({ ...formData, fees: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accommodation ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.accommodation}
                    onChange={e => setFormData({ ...formData, accommodation: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Food Budget ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.foodBudget}
                    onChange={e => setFormData({ ...formData, foodBudget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transport Budget ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.transportBudget}
                    onChange={e => setFormData({ ...formData, transportBudget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data / Airtime ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={formData.airtimeData}
                    onChange={e => setFormData({ ...formData, airtimeData: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Savings Reserve ($)</label>
                <input
                  type="number"
                  step="1"
                  value={formData.savingsTarget}
                  onChange={e => setFormData({ ...formData, savingsTarget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
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
                  Save Semester Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
