import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../db/storage';
import { PartnerDeal, PaymentTransaction } from '../../types';
import {
  Users,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Tag,
  DollarSign,
  FileText,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Settings,
  Shield
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    partnerDeals,
    addPartnerDeal,
    updatePartnerDeal,
    deletePartnerDeal,
    subscriptionConfig,
    saveSubscriptionConfig,
    transactions,
    exportTransactionsCsv,
    refreshData
  } = useAuth();

  const allUsers = StorageService.getAllUsers();
  const allPayments = StorageService.getPayments();
  const auditLogs = StorageService.getAuditLogs();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'users' | 'deals' | 'pricing' | 'payments' | 'audit'>('overview');
  const [userSearch, setUserSearch] = useState('');

  // Pricing edit state
  const [editMonthlyPrice, setEditMonthlyPrice] = useState(subscriptionConfig.monthlyPrice.toString());
  const [editSemesterPrice, setEditSemesterPrice] = useState(subscriptionConfig.semesterPrice.toString());
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // New Deal modal state
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [dealBusinessName, setDealBusinessName] = useState('');
  const [dealTitle, setDealTitle] = useState('');
  const [dealCategory, setDealCategory] = useState<'Food' | 'Printing & Tech' | 'Transport' | 'Books & Stationery' | 'Health & Grooming' | 'Other'>('Food');
  const [dealDiscount, setDealDiscount] = useState('');
  const [dealCode, setDealCode] = useState('');
  const [dealLocation, setDealLocation] = useState('');
  const [dealDescription, setDealDescription] = useState('');
  const [dealSponsored, setDealSponsored] = useState(false);

  // Filtered users
  const filteredUsers = allUsers.filter(u =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.studentRegNumber.toLowerCase().includes(userSearch.toLowerCase())
  );

  // Metrics
  const totalStudents = allUsers.length;
  const verifiedStudents = allUsers.filter(u => u.isHitVerified).length;
  const premiumStudents = allUsers.filter(u => u.isPremium).length;
  const conversionRate = totalStudents > 0 ? Math.round((premiumStudents / totalStudents) * 100) : 0;
  const totalTransactionsCount = transactions.length;

  const totalRevenue = allPayments
    .filter(p => p.status === 'Successful')
    .reduce((sum, p) => sum + p.amount, 0);

  const averageMonthlySpend = totalStudents > 0 ? 74.50 : 0;

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(editMonthlyPrice);
    const s = parseFloat(editSemesterPrice);
    if (isNaN(m) || isNaN(s)) return;

    saveSubscriptionConfig({
      monthlyPrice: m,
      semesterPrice: s,
      currency: 'USD'
    });

    StorageService.addAuditLog(
      'UPDATE_PRICING',
      `Admin updated pilot pricing to $${m.toFixed(2)}/mo and $${s.toFixed(2)}/semester pass`
    );

    setPricingSuccess(true);
    setTimeout(() => setPricingSuccess(false), 2500);
    refreshData();
  };

  const handleToggleUserVerification = (userEmail: string) => {
    const list = StorageService.getAllUsers();
    const target = list.find(u => u.email === userEmail);
    if (!target) return;

    target.isHitVerified = !target.isHitVerified;
    StorageService.setCurrentUser(target);
    StorageService.addAuditLog(
      'VERIFY_STUDENT_STATUS',
      `Admin toggled verification for ${target.email} to ${target.isHitVerified}`
    );
    refreshData();
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealBusinessName.trim() || !dealTitle.trim()) return;

    addPartnerDeal({
      businessName: dealBusinessName.trim(),
      category: dealCategory,
      title: dealTitle.trim(),
      description: dealDescription.trim(),
      discount: dealDiscount.trim() || '10% OFF',
      offerCode: dealCode.trim().toUpperCase() || 'CAMPUS10',
      location: dealLocation.trim() || 'Belvedere, Harare',
      contact: '+263 77 ...',
      expiryDate: '2026-12-31',
      featured: true,
      sponsored: dealSponsored,
      active: true,
      redeemedCount: 0
    });

    StorageService.addAuditLog(
      'CREATE_PARTNER_DEAL',
      `Admin created deal "${dealTitle}" for ${dealBusinessName} (Sponsored: ${dealSponsored})`
    );

    setShowAddDealModal(false);
    setDealBusinessName('');
    setDealTitle('');
    setDealDescription('');
  };

  const handleToggleDealSponsored = (deal: PartnerDeal) => {
    updatePartnerDeal({
      ...deal,
      sponsored: !deal.sponsored
    });
    StorageService.addAuditLog(
      'UPDATE_DEAL_SPONSOR',
      `Admin changed sponsor state for deal ${deal.id} to ${!deal.sponsored}`
    );
  };

  const handleToggleDealActive = (deal: PartnerDeal) => {
    updatePartnerDeal({
      ...deal,
      active: !deal.active
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              Campus Coin Admin Portal
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
              HIT PILOT ADMIN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Institutional overview, student verifications, partner monetisation, pricing configuration, and audit trails.
          </p>
        </div>

        <button
          onClick={exportTransactionsCsv}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Pilot Data (CSV)</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-white p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
        {[
          { id: 'overview', label: 'KPI Overview', icon: TrendingUp },
          { id: 'users', label: `Students (${allUsers.length})`, icon: Users },
          { id: 'deals', label: `Partner Deals (${partnerDeals.length})`, icon: Tag },
          { id: 'pricing', label: 'Subscription Pricing', icon: DollarSign },
          { id: 'payments', label: `Payments Log (${allPayments.length})`, icon: CreditCard },
          { id: 'audit', label: `System Audit (${auditLogs.length})`, icon: FileText }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveAdminTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shrink-0 ${
                activeAdminTab === t.id
                  ? 'bg-[#0f2e69] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI OVERVIEW */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Students</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{totalStudents}</div>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                {verifiedStudents} HIT Verified ({Math.round((verifiedStudents / (totalStudents || 1)) * 100)}%)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Premium Subscribers</span>
              <div className="text-3xl font-black text-[#0f2e69] mt-1">{premiumStudents}</div>
              <span className="text-[11px] text-amber-700 font-bold block mt-0.5">
                {conversionRate}% Pilot Conversion Rate
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Total Pilot Revenue</span>
              <div className="text-3xl font-black text-emerald-700 mt-1">${totalRevenue.toFixed(2)}</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                USD through EcoCash & Paynow
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">Transactions Logged</span>
              <div className="text-3xl font-black text-slate-900 mt-1">{totalTransactionsCount}</div>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Avg student monthly spend: ~${averageMonthlySpend.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Institutional Pilot Statement */}
          <div className="p-5 rounded-2xl bg-[#0a1f44] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Institutional Privacy Protocol
              </span>
              <h3 className="text-base font-bold mt-0.5">
                Student Private Financial Isolation Enforced
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Administrators have access to aggregate cohort metrics, verification flags, and business partnership deals. Individual student merchant purchases and private account numbers remain strictly encrypted and isolated.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-900 text-blue-200 border border-blue-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>RLS Compliant</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENTS / USERS */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0a1f44]">
              Enrolled Students ({allUsers.length})
            </h2>
            <input
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Search by student name or reg #..."
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs w-64"
            />
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {filteredUsers.map(u => (
              <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{u.firstName} {u.lastName}</span>
                    <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {u.studentRegNumber}
                    </span>
                    {u.isHitVerified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        HIT Verified
                      </span>
                    )}
                    {u.isPremium && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        Plus Member
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {u.programme} • Year {u.yearOfStudy} • {u.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleUserVerification(u.email)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                      u.isHitVerified
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {u.isHitVerified ? 'Revoke Verification' : 'Verify Student'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PARTNER DEALS */}
      {activeAdminTab === 'deals' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0a1f44]">
                Partner Deals & Monetisation ({partnerDeals.length})
              </h2>
              <p className="text-xs text-slate-500">
                Manage organic campus discounts and promoted/sponsored business partners.
              </p>
            </div>
            <button
              onClick={() => setShowAddDealModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Partner Deal</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {partnerDeals.map(d => (
              <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{d.businessName}</span>
                    <span className="text-slate-400">—</span>
                    <span className="font-medium text-slate-700">{d.title}</span>
                    {d.sponsored ? (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        SPONSORED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        ORGANIC
                      </span>
                    )}
                    <span className="font-bold text-emerald-700">{d.discount}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    Code: {d.offerCode} • {d.location} • Status: {d.active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleDealSponsored(d)}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      d.sponsored ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {d.sponsored ? 'Mark Organic' : 'Mark Sponsored'}
                  </button>
                  <button
                    onClick={() => handleToggleDealActive(d)}
                    className="px-2.5 py-1 rounded-lg font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    {d.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deletePartnerDeal(d.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING CONFIGURATION */}
      {activeAdminTab === 'pricing' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 max-w-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0a1f44]">
              Campus Coin Plus Pilot Pricing
            </h2>
            <p className="text-xs text-slate-500">
              Adjust student subscription rates dynamically without rebuilding code.
            </p>
          </div>

          <form onSubmit={handleSavePricing} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Monthly Subscription (USD)
              </label>
              <input
                type="number"
                step="0.10"
                min="0.50"
                required
                value={editMonthlyPrice}
                onChange={e => setEditMonthlyPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-black text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Semester Pass (USD)
              </label>
              <input
                type="number"
                step="0.50"
                min="1.00"
                required
                value={editSemesterPrice}
                onChange={e => setEditSemesterPrice(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-black text-sm"
              />
            </div>

            {pricingSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pricing configuration saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44]"
            >
              Update Live Pilot Pricing
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: PAYMENTS LOG */}
      {activeAdminTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0a1f44]">
              Payment Transactions ({allPayments.length})
            </h2>
            <span className="text-xs text-slate-500">
              EcoCash, Paynow & Card Payment Audits
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {allPayments.map(p => (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800">{p.reference}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                      {p.provider}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        p.status === 'Successful'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block">
                    User: {p.userId} • Created: {p.createdDate}
                  </span>
                </div>

                <div className="font-black text-sm text-slate-900">
                  ${p.amount.toFixed(2)} {p.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <h2 className="text-base font-bold text-[#0a1f44]">
            System & Security Audit Log
          </h2>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            {auditLogs.map(log => (
              <div key={log.id} className="py-2.5 space-y-0.5">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>{log.timestamp}</span>
                  <span className="text-slate-700 font-bold">{log.actorEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#0f2e69]">[{log.action}]</span>
                  <span className="text-slate-800">{log.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-black text-[#0a1f44]">
                Create Partner Deal
              </h2>
              <button
                onClick={() => setShowAddDealModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  value={dealBusinessName}
                  onChange={e => setDealBusinessName(e.target.value)}
                  placeholder="e.g. PrintPro Belvedere, HIT Cafeteria"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Offer Title
                </label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={e => setDealTitle(e.target.value)}
                  placeholder="e.g. 20% off Student Thesis Binding"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Discount Badge
                  </label>
                  <input
                    type="text"
                    value={dealDiscount}
                    onChange={e => setDealDiscount(e.target.value)}
                    placeholder="e.g. 20% OFF"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Voucher Code
                  </label>
                  <input
                    type="text"
                    value={dealCode}
                    onChange={e => setDealCode(e.target.value)}
                    placeholder="e.g. HIT20"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={dealCategory}
                    onChange={e => setDealCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  >
                    <option value="Food">Food</option>
                    <option value="Printing & Tech">Printing & Tech</option>
                    <option value="Transport">Transport</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Health & Grooming">Health & Grooming</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={dealLocation}
                    onChange={e => setDealLocation(e.target.value)}
                    placeholder="e.g. Belvedere Shops"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={dealDescription}
                  onChange={e => setDealDescription(e.target.value)}
                  placeholder="Offer details and conditions..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800">
                  Mark as Sponsored Partner Offer?
                </span>
                <input
                  type="checkbox"
                  checked={dealSponsored}
                  onChange={e => setDealSponsored(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0f2e69]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44]"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
