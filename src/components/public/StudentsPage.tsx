import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Target,
  Calendar,
  Zap,
  BarChart3,
  BookOpen,
  Tag,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { setActiveView, loginAsDemoStudent } = useAuth();

  const studentFeatures = [
    {
      icon: LayoutDashboard,
      title: 'Central Financial Dashboard',
      description: 'Your real-time command centre displaying cash on hand, daily safe-to-spend allowance, budget health status, and upcoming semester commitments at a glance.',
      color: 'bg-blue-100 text-blue-900',
      actionView: 'dashboard'
    },
    {
      icon: Zap,
      title: 'Safe-to-Spend Calculation',
      description: 'Answers the critical daily question: "How much can I safely spend today?" ring-fencing upcoming fees and savings before calculating your daily living limit.',
      color: 'bg-amber-100 text-amber-900',
      actionView: 'dashboard'
    },
    {
      icon: Calendar,
      title: 'Semester Financial Planner',
      description: 'Built around the 16-week HIT university term. Plan expected remittances, fee payment deadlines, hostel contributions, and kombi budgets across the academic calendar.',
      color: 'bg-blue-100 text-[#0f2e69]',
      actionView: 'semester'
    },
    {
      icon: Wallet,
      title: 'My Money & Fast Transactions',
      description: 'Log cash, EcoCash, bank, and card transactions in 5 seconds. Custom categories for kombis, campus cafeteria, printing, and monthly data bundles.',
      color: 'bg-emerald-100 text-emerald-900',
      actionView: 'transactions'
    },
    {
      icon: PieChart,
      title: 'My Budget & Warning Limits',
      description: 'Track monthly and semester living categories with dynamic progress bars and instant warnings before you exceed your food or transport ceilings.',
      color: 'bg-purple-100 text-purple-900',
      actionView: 'budget'
    },
    {
      icon: Target,
      title: 'Financial Goals & Weekly Pace',
      description: 'Save toward project laptops, emergency funds, or equipment. Campus Coin calculates exactly how much you need to contribute each week to reach your target.',
      color: 'bg-amber-100 text-amber-900',
      actionView: 'goals'
    },
    {
      icon: BarChart3,
      title: 'Rule-Based Spending Insights',
      description: 'Clear, transparent observations generated directly from your spending pace. Alerts you to budget overruns and heavy recurring obligations without fake AI.',
      color: 'bg-blue-100 text-blue-900',
      actionView: 'insights'
    },
    {
      icon: BookOpen,
      title: 'Student Financial Wellness',
      description: 'Practical guides tailored to Zimbabwean university life: kombi fare optimization, managing irregular allowances, and building a starter emergency cushion.',
      color: 'bg-emerald-100 text-emerald-900',
      actionView: 'wellness'
    },
    {
      icon: Tag,
      title: 'Campus Deals & Discounts',
      description: 'Verified student discounts at approved partner merchants around HIT campus and Belvedere: cafeterias, report printing, shuttle passes, and tech repairs.',
      color: 'bg-amber-100 text-amber-900',
      actionView: 'deals'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0f2e69] text-xs font-bold">
            <span>DESIGNED FOR STUDENT LIFE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a1f44] tracking-tight">
            The Student Financial Operating System
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every feature in Campus Coin was engineered specifically to answer the questions Zimbabwean university students ask every day.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100">
                  <button
                    onClick={loginAsDemoStudent}
                    className="text-xs font-bold text-[#0f2e69] hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>Try in Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Highlight */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900 to-[#0a1f44] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>HIT Verified Student Badge</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Verify your institutional registration number
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              HIT students with verified registration credentials unlock partner student discounts, semester timeline syncing, and priority student support.
            </p>
          </div>

          <button
            onClick={() => setActiveView('register')}
            className="shrink-0 px-6 py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-sm shadow-md"
          >
            Create Student Account
          </button>
        </div>
      </div>
    </div>
  );
};
