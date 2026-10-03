import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Transaction, PaymentMethod, TransactionType } from '../../types';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Tag
} from 'lucide-react';

interface TransactionManagerProps {
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export const TransactionManager: React.FC<TransactionManagerProps> = ({
  onOpenAddModal,
  onEditTransaction
}) => {
  const {
    transactions,
    categories,
    deleteTransaction,
    exportTransactionsCsv,
    user
  } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [viewTimeframe, setViewTimeframe] = useState<'all' | 'this_month' | 'this_week'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const matchesSearch =
        tx.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      // Type filter
      const matchesType = filterType === 'all' || tx.type === filterType;

      // Category filter
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;

      // Method filter
      const matchesMethod = filterMethod === 'all' || tx.paymentMethod === filterMethod;

      // Timeframe filter
      let matchesTimeframe = true;
      if (viewTimeframe === 'this_month') {
        const currentMonth = new Date().toISOString().substring(0, 7);
        matchesTimeframe = tx.date.startsWith(currentMonth);
      } else if (viewTimeframe === 'this_week') {
        const txDate = new Date(tx.date);
        const now = new Date();
        const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
        matchesTimeframe = diffDays >= 0 && diffDays <= 7;
      }

      return matchesSearch && matchesType && matchesCategory && matchesMethod && matchesTimeframe;
    });
  }, [transactions, searchTerm, filterType, filterCategory, filterMethod, viewTimeframe]);

  // Function to export custom transaction arrays to CSV
  const handleExportCsv = (txList: Transaction[], label: string) => {
    const headers = [
      'Transaction ID',
      'Date',
      'Type',
      'Amount (USD)',
      'Category',
      'Merchant / Description',
      'Payment Method',
      'Recurring',
      'Notes'
    ];

    const rows = txList.map(t => [
      `"${t.id}"`,
      `"${t.date}"`,
      `"${t.type}"`,
      t.amount.toFixed(2),
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.merchant.replace(/"/g, '""')}"`,
      `"${t.paymentMethod}"`,
      t.isRecurring ? '"Yes"' : '"No"',
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    const reg = user?.studentRegNumber || 'student';
    const filename = `CampusCoin_Transactions_${reg}_${label}_${dateStr}.csv`;
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setShowExportMenu(false);
    setExportNotice(`Exported ${txList.length} transactions to ${filename}`);
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Totals for filtered set
  const totalFilteredIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const paymentMethodBadges: { [key: string]: string } = {
    EcoCash: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Cash: 'bg-amber-50 text-amber-800 border-amber-200',
    Bank: 'bg-blue-50 text-blue-800 border-blue-200',
    Card: 'bg-purple-50 text-purple-800 border-purple-200',
    Other: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
            Transaction Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track student living expenses, parental allowances, and tutoring income.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative">
          {/* Export CSV Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 shadow-2xs transition-all active:scale-95"
              title="Export transactions as CSV spreadsheet file for record keeping"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-md font-mono">
                {filteredTransactions.length}
              </span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  Export CSV for Record Keeping
                </div>
                <button
                  onClick={() => handleExportCsv(filteredTransactions, 'filtered')}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">Export Current View</span>
                    <span className="text-[10px] text-slate-500">
                      Based on active filters & search ({filteredTransactions.length} items)
                    </span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleExportCsv(transactions, 'all')}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-slate-800 hover:bg-slate-50 flex items-center justify-between border-t border-slate-100"
                >
                  <div className="flex flex-col">
                    <span className="font-bold">Export All Records</span>
                    <span className="text-[10px] text-slate-500">
                      Complete student transaction history ({transactions.length} items)
                    </span>
                  </div>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Export Success Notice Banner */}
      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => setExportNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Chips for Filtered Set */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Filtered Total Income</span>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1">
            <ArrowDownLeft className="w-5 h-5" />
            +${totalFilteredIncome.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Filtered Total Spending</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5 text-amber-600" />
            -${totalFilteredExpense.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Net Filtered Flow</span>
          <div className={`text-2xl font-black mt-1 ${
            totalFilteredIncome - totalFilteredExpense >= 0 ? 'text-emerald-700' : 'text-amber-700'
          }`}>
            ${(totalFilteredIncome - totalFilteredExpense).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search merchant, category, or note (e.g. Kombi, Sadza, Econet)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          {/* Type filter */}
          <div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            >
              <option value="all">All Types (Income & Expense)</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <div>
            <select
              value={filterMethod}
              onChange={e => setFilterMethod(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            >
              <option value="all">All Payment Methods</option>
              <option value="EcoCash">EcoCash</option>
              <option value="Cash">Cash</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Card">Swipe / Card</option>
            </select>
          </div>
        </div>

        {/* Sub-bar: Category chips and timeframe toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <button
              onClick={() => setFilterCategory('all')}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === 'all'
                  ? 'bg-[#0f2e69] text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            {categories.slice(0, 6).map(c => (
              <button
                key={c.id}
                onClick={() => setFilterCategory(c.name)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 ${
                  filterCategory === c.name
                    ? 'bg-[#0f2e69] text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewTimeframe('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewTimeframe === 'all' ? 'bg-white text-[#0f2e69] shadow-xs' : 'text-slate-600'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setViewTimeframe('this_month')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewTimeframe === 'this_month' ? 'bg-white text-[#0f2e69] shadow-xs' : 'text-slate-600'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setViewTimeframe('this_week')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                viewTimeframe === 'this_week' ? 'bg-white text-[#0f2e69] shadow-xs' : 'text-slate-600'
              }`}
            >
              This Week
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Your financial story starts here.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No transactions match your current search or filter criteria. Add a new expense or clear filters.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-2 px-4 py-2 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs transition-colors"
            >
              + Add Transaction
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {filteredTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                        tx.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-amber-600" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{tx.merchant}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            paymentMethodBadges[tx.paymentMethod] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tx.paymentMethod}
                        </span>
                        {tx.isRecurring && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-slate-500 text-[11px] flex-wrap">
                        <span className="font-medium text-slate-700">{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="italic text-slate-500">"{tx.notes}"</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-12 sm:pl-0">
                    <div className="text-right">
                      <span
                        className={`text-base font-black ${
                          tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400">
                      <button
                        onClick={() => onEditTransaction(tx)}
                        className="p-1.5 hover:text-[#0f2e69] hover:bg-slate-200/60 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete transaction "${tx.merchant}"?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table Footer with Summary and CSV Export link */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                Showing <strong className="text-slate-800">{filteredTransactions.length}</strong> of{' '}
                <strong className="text-slate-800">{transactions.length}</strong> total records
              </span>
              <button
                onClick={() => handleExportCsv(filteredTransactions, 'view')}
                className="text-[#0f2e69] font-bold hover:underline flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Download CSV File for Records</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
