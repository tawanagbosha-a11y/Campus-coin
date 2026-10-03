import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Tag,
  BookOpen,
  Sparkles,
  User,
  Settings,
  X,
  CreditCard,
  LogOut,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpgrade: () => void;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onOpenUpgrade
}) => {
  const { user, activeView, setActiveView, logout, resetToDemo } = useAuth();

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Semester Financial Planner', view: 'semester', icon: Calendar, tag: 'Key Feature' },
    { label: 'Campus Deals & Discounts', view: 'deals', icon: Tag, tag: 'Partner Offers' },
    { label: 'Student Financial Wellness', view: 'wellness', icon: BookOpen, tag: 'Guides' },
    { label: 'Spending Insights Engine', view: 'insights', icon: Sparkles, tag: 'Analytics' },
    { label: 'Student Profile & Verification', view: 'profile', icon: User, tag: 'Account' },
    { label: 'Admin Command Console', view: 'admin', icon: Settings, tag: 'Pilot Admin' }
  ];

  const handleItemClick = (view: string) => {
    setActiveView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in slide-in-from-bottom duration-200 space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-base">Campus Coin Menu</span>
            {user?.isHitVerified && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                HIT Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upgrade Callout if not premium */}
        {!user?.isPremium && (
          <div
            onClick={() => {
              onClose();
              onOpenUpgrade();
            }}
            className="p-3.5 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-between cursor-pointer hover:bg-amber-400/30 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span className="font-bold text-amber-950">Upgrade to Campus Coin Plus</span>
            </div>
            <span className="text-xs font-bold text-amber-900 underline">View Plan</span>
          </div>
        )}

        <div className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleItemClick(item.view)}
                className={`w-full p-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0f2e69] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 space-y-2">
          <button
            onClick={() => {
              resetToDemo();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial HIT State</span>
          </button>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
