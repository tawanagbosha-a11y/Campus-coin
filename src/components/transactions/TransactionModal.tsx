import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Transaction, PaymentMethod, TransactionType } from '../../types';
import { X, Check, Plus, DollarSign, Calendar, Tag, CreditCard } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  editingTransaction
}) => {
  const { user, categories, addTransaction, updateTransaction } = useAuth();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('EcoCash');
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setMerchant(editingTransaction.merchant);
      setDate(editingTransaction.date);
      setPaymentMethod(editingTransaction.paymentMethod);
      setNotes(editingTransaction.notes || '');
      setIsRecurring(editingTransaction.isRecurring);
    } else {
      setType('expense');
      setAmount('');
      const defaultCat = categories.find(c => c.type === 'expense');
      setCategory(defaultCat ? defaultCat.name : 'Food & Meals');
      setMerchant('');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('EcoCash');
      setNotes('');
      setIsRecurring(false);
    }
  }, [editingTransaction, categories, isOpen]);

  if (!isOpen) return null;

  const relevantCategories = categories.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    if (!merchant.trim()) return;

    if (editingTransaction) {
      updateTransaction({
        ...editingTransaction,
        type,
        amount: parsedAmount,
        category: category || (relevantCategories[0]?.name || 'General'),
        merchant: merchant.trim(),
        date,
        paymentMethod,
        notes: notes.trim(),
        isRecurring
      });
    } else {
      addTransaction({
        userId: user?.id || 'usr_demo',
        type,
        amount: parsedAmount,
        category: category || (relevantCategories[0]?.name || 'General'),
        merchant: merchant.trim(),
        date,
        paymentMethod,
        notes: notes.trim(),
        isRecurring
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-black text-[#0a1f44]">
            {editingTransaction ? 'Edit Transaction' : 'Record New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense / Income Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                const cat = categories.find(c => c.type === 'expense');
                if (cat) setCategory(cat.name);
              }}
              className={`py-2 rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              - Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                const cat = categories.find(c => c.type === 'income');
                if (cat) setCategory(cat.name);
              }}
              className={`py-2 rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Income / Allowance
            </button>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-base font-black text-slate-400">$</span>
              <input
                type="number"
                step="0.01"
                min="0.05"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2 text-lg font-black rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
              />
            </div>
          </div>

          {/* Merchant / Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {type === 'expense' ? 'Merchant / Item Description' : 'Income Source / Sender'}
            </label>
            <input
              type="text"
              required
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder={
                type === 'expense'
                  ? 'e.g. HIT Cafeteria lunch, Kombi fare, Econet bundle'
                  : 'e.g. Monthly Parent Remittance, Coding Tutoring'
              }
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          {/* Category & Payment Method Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
              >
                {relevantCategories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
              >
                <option value="EcoCash">EcoCash</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Swipe / Card</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Optional Student Note
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Split with room 4 mates, exam study snack"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          {/* Recurring Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800">
              Is this a recurring student obligation?
            </span>
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={e => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded text-[#0f2e69] focus:ring-[#0f2e69]"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] transition-colors shadow-xs"
            >
              {editingTransaction ? 'Save Changes' : 'Record Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
