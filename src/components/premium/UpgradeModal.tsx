import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PaymentService } from '../../services/paymentService';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  X,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Check
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { user, subscriptionConfig, refreshData } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semester'>('semester');
  const [provider, setProvider] = useState<'EcoCash' | 'Paynow' | 'Card'>('EcoCash');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '+263 77 123 4567');
  const [step, setStep] = useState<'plan_select' | 'payment_process' | 'success'>('plan_select');
  const [statusMessage, setStatusMessage] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  if (!isOpen) return null;

  const currentPrice =
    selectedPlan === 'monthly'
      ? subscriptionConfig.monthlyPrice
      : subscriptionConfig.semesterPrice;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment_process');
    setStatusMessage('Initiating transaction with Zimbabwe payment gateway...');

    try {
      // 1. Initiate payment request
      const response = await PaymentService.createPayment({
        userId: user?.id || 'usr_demo',
        planId: selectedPlan,
        amount: currentPrice,
        currency: 'USD',
        provider,
        phoneNumber,
        email: user?.email
      });

      setPaymentRef(response.reference);

      if (provider === 'EcoCash') {
        setStatusMessage(`Sending EcoCash USSD prompt to ${phoneNumber}... Please approve with your PIN.`);
      } else {
        setStatusMessage(`Connecting to ${provider} secure checkout...`);
      }

      // 2. Simulate payment completion
      const result = await PaymentService.simulatePaymentSuccess(response.paymentId);

      if (result.success) {
        setStatusMessage('Payment confirmed! Activating Campus Coin Plus subscription...');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
        refreshData();
        setStep('success');
      }
    } catch (err) {
      setStatusMessage('Payment encounterd an error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-6 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#0a1f44]">
                Campus Coin Plus
              </h2>
              <span className="text-xs text-slate-500">
                Premium Student Financial Experience • HIT Pilot Pricing
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'plan_select' && (
          <div className="space-y-6">
            {/* Plan Choice Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-[#0f2e69] bg-blue-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Pass</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${subscriptionConfig.monthlyPrice.toFixed(2)}
                  <span className="text-xs font-normal text-slate-500">/mo</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Cancel anytime</span>
              </div>

              <div
                onClick={() => setSelectedPlan('semester')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                  selectedPlan === 'semester'
                    ? 'border-amber-400 bg-amber-50/40 shadow-sm ring-1 ring-amber-400/50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="absolute top-2 right-2 text-[9px] font-black uppercase bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                  Best Value
                </div>
                <span className="text-[10px] font-bold text-amber-900 uppercase">Semester Pass</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ${subscriptionConfig.semesterPrice.toFixed(2)}
                  <span className="text-xs font-normal text-slate-500">/term</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">Covers all 16 weeks</span>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                Included in Campus Coin Plus:
              </span>
              {[
                'Full Academic Semester Runway Planner & Forecasting',
                'Real-Time Daily & Weekly Safe-to-Spend Ceiling',
                'Unlimited Savings Goals with Weekly Pace Tracking',
                'Automated Recurring Expense Reminders & Commitments Ring-Fencing',
                'Smart Rule-Based Spending Warnings & Overrun Alerts',
                'Verified Sponsored Partner Deals (Cafeteria, Printing & Transport)',
                'Export Detailed CSV & Financial Summary Statements'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 block">
                Select Zimbabwean Payment Method:
              </span>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EcoCash', label: 'EcoCash', icon: Smartphone },
                  { id: 'Paynow', label: 'Paynow', icon: Zap },
                  { id: 'Card', label: 'Bank / Card', icon: CreditCard }
                ].map(p => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id as any)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        provider === p.id
                          ? 'border-[#0f2e69] bg-[#0f2e69] text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {provider === 'EcoCash' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    EcoCash Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+263 77 123 4567"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-[#0f2e69]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    You will receive a USSD prompt on your phone to authorize ${currentPrice.toFixed(2)}.
                  </span>
                </div>
              )}
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={handleStartPayment}
                className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md text-sm flex items-center justify-center gap-2"
              >
                <span>Authorize ${currentPrice.toFixed(2)} via {provider}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Simulated sandbox transaction for pilot demonstration. No actual funds deducted.
              </p>
            </div>
          </div>
        )}

        {/* Step: Processing Simulation */}
        {step === 'payment_process' && (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 border-4 border-[#0f2e69] border-t-transparent animate-spin mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">
              Processing Payment...
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              {statusMessage}
            </p>
            <div className="text-[11px] font-mono text-slate-400">
              Ref: {paymentRef || 'PENDING'}
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3px]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Welcome to Campus Coin Plus!
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Your payment of ${currentPrice.toFixed(2)} has been successfully validated.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-slate-800 capitalize">{selectedPlan} Pass</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-bold text-slate-800">{paymentRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="font-bold text-slate-800">{provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student Status:</span>
                <span className="font-bold text-emerald-700">Active Plus Subscriber</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs transition-colors"
            >
              Back to My Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
