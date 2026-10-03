import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { X, Check, DollarSign, Sparkles } from 'lucide-react';

interface ContributeModalProps {
  goalId: string | null;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ goalId, onClose }) => {
  const { goals, contributeToGoal } = useAuth();
  const [amount, setAmount] = useState<string>('15');
  const [note, setNote] = useState<string>('');

  const targetGoal = goals.find(g => g.id === goalId);
  if (!goalId || !targetGoal) return null;

  const quickAmounts = [5, 10, 15, 25, 50];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    contributeToGoal(targetGoal.id, parsed, note || 'Manual savings deposit');

    const newTotal = targetGoal.currentAmount + parsed;
    if (newTotal >= targetGoal.targetAmount) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } else {
      confetti({ particleCount: 40, spread: 50 });
    }

    onClose();
  };

  const parsedAmt = parseFloat(amount) || 0;
  const newProjected = targetGoal.currentAmount + parsedAmt;
  const isTargetAchieved = newProjected >= targetGoal.targetAmount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Contribute to Goal</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500 block">Goal Target:</span>
          <span className="font-black text-slate-900 text-sm">{targetGoal.name}</span>
          <div className="flex justify-between mt-1 text-slate-600">
            <span>Currently saved: ${targetGoal.currentAmount.toFixed(2)}</span>
            <span>Target: ${targetGoal.targetAmount.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Contribution Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-base font-black text-slate-400">$</span>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 text-lg font-black rounded-xl border border-slate-300 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
              />
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-1.5 mt-2">
              {quickAmounts.map(val => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-bold transition-colors ${
                    amount === val.toString()
                      ? 'bg-[#0f2e69] text-white border-[#0f2e69]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  +${val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Source / Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Tutoring session earnings, lunch money saved"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
            />
          </div>

          {isTargetAchieved && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
              <span>🎉 This deposit completes your goal!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] transition-colors shadow-xs"
            >
              Save ${parsedAmt.toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
