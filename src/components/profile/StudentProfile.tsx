import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';

interface ProfileProps {
  onOpenUpgrade: () => void;
}

export const StudentProfile: React.FC<ProfileProps> = ({ onOpenUpgrade }) => {
  const {
    user,
    verifyHitStudent,
    togglePlan,
    exportDataJson,
    exportTransactionsCsv,
    logout
  } = useAuth();

  const [notificationPrefs, setNotificationPrefs] = useState({
    budgetAlerts: true,
    safeToSpendDaily: true,
    upcomingBills: true,
    goalMilestones: true,
    campusDeals: true,
    emailDigest: false
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const handleTogglePref = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toLowerCase() === 'delete') {
      logout();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0a1f44] to-[#1a4494] text-white flex items-center justify-center font-black text-xl shadow-md">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">
                {user?.firstName} {user?.lastName}
              </h1>
              {user?.isHitVerified && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  HIT Verified Student
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.studentRegNumber} • {user?.programme} (Year {user?.yearOfStudy})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user?.isPremium ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Campus Coin Plus Active
            </span>
          ) : (
            <button
              onClick={onOpenUpgrade}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs transition-colors"
            >
              Upgrade to Plus
            </button>
          )}
        </div>
      </div>

      {/* Institutional Student Details */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#0a1f44]">
            Academic Credentials & Campus Info
          </h2>
          {!user?.isHitVerified && (
            <button
              onClick={verifyHitStudent}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify HIT Student Status</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Institutional Registration #</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block font-mono">
              {user?.studentRegNumber}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Degree Programme</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {user?.programme}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Current Campus</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {user?.campus}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Student Email</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {user?.email}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <h2 className="text-base font-bold text-[#0a1f44] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0f2e69]" />
          <span>Notification & Alert Preferences</span>
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { key: 'safeToSpendDaily', label: 'Daily Safe-to-Spend morning reminder', desc: 'Receive morning prompt with your daily spending limit' },
            { key: 'budgetAlerts', label: 'Budget category threshold warnings', desc: 'Alert when food or kombi spending exceeds 80% and 100%' },
            { key: 'upcomingBills', label: 'Upcoming recurring bill reminders', desc: 'Alert 3 days before wifi, kombi passes, or fee commitments' },
            { key: 'goalMilestones', label: 'Savings goal milestone celebrations', desc: 'Notify at 25%, 50%, 75% and 100% completion milestones' },
            { key: 'campusDeals', label: 'New verified campus partner discounts', desc: 'Notify when approved discounts open in Belvedere or HIT gate' }
          ].map(item => (
            <div key={item.key} className="py-3 flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-slate-800 block">{item.label}</span>
                <span className="text-slate-500 text-[11px]">{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={notificationPrefs[item.key as keyof typeof notificationPrefs]}
                onChange={() => handleTogglePref(item.key as keyof typeof notificationPrefs)}
                className="w-4 h-4 rounded text-[#0f2e69] focus:ring-[#0f2e69]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Data Sovereignty & Export */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <h2 className="text-base font-bold text-[#0a1f44]">
          Data Sovereignty & Portability
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          You own your financial data. You can download an encrypted copy of all transactions, semester models, and goals at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={exportDataJson}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Complete Profile (JSON)</span>
          </button>

          <button
            onClick={exportTransactionsCsv}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Transactions (CSV)</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="p-5 rounded-2xl border border-red-200 bg-red-50/40 space-y-3">
        <h3 className="text-sm font-bold text-red-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>Account & Data Deletion</span>
        </h3>
        <p className="text-xs text-red-800/80 leading-relaxed">
          Permanently delete your Campus Coin profile, semester plans, transactions, and savings logs. This action cannot be reversed.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-2xs"
        >
          Delete Account & Wipe Financial Records
        </button>
      </div>

      {/* Regulatory Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-100 text-[11px] text-slate-500 leading-relaxed">
        <strong>Campus Coin Pilot Disclaimer: </strong>
        Campus Coin provides student financial tracking, semester planning calculators, and educational tools. It does not provide regulated banking services or financial investment advice. An independent student initiative piloted for Harare Institute of Technology (HIT), Zimbabwe.
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <h3 className="text-base font-black text-red-900">
              Confirm Account Deletion
            </h3>
            <p className="text-xs text-slate-600">
              Type <strong className="text-red-600">DELETE</strong> to confirm the irreversible erasure of your records.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 disabled:opacity-40"
              >
                Permanently Wipe Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
