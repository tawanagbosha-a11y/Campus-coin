import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Wallet, PieChart, Target, Plus, Menu } from 'lucide-react';

interface MobileNavProps {
  onOpenAddTx: () => void;
  onOpenMore: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenAddTx, onOpenMore }) => {
  const { activeView, setActiveView, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    { label: 'Home', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Spending', view: 'transactions', icon: Wallet },
    { label: 'Budget', view: 'budget', icon: PieChart },
    { label: 'Goals', view: 'goals', icon: Target }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around relative">
        {navItems.slice(0, 2).map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-[#0f2e69]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Center Floating Add Button */}
        <div className="relative -top-4">
          <button
            onClick={onOpenAddTx}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#0a1f44] to-[#1a4494] text-amber-400 p-0 flex items-center justify-center shadow-lg shadow-blue-950/30 border-2 border-white hover:scale-105 active:scale-95 transition-all"
            aria-label="Add transaction"
          >
            <Plus className="w-6 h-6 stroke-[3px]" />
          </button>
        </div>

        {navItems.slice(2, 4).map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive ? 'text-[#0f2e69]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* More Tab */}
        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors ${
            ['semester', 'deals', 'wellness', 'insights', 'profile', 'admin'].includes(activeView)
              ? 'text-[#0f2e69] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">More</span>
        </button>
      </div>
    </div>
  );
};
