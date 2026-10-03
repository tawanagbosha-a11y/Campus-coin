import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Shield,
  Bus,
  Wifi,
  Coffee,
  DollarSign,
  TrendingUp,
  ChevronDown
} from 'lucide-react';

export const FinancialWellness: React.FC = () => {
  const [openGuideIndex, setOpenGuideIndex] = useState<number | null>(0);

  const guides = [
    {
      title: 'Managing Irregular Parental Allowances & Remittances',
      category: 'Allowance Strategy',
      summary: 'How to stretch lump-sum payments across 4 to 6 weeks without running out before the next transfer.',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-800',
      content: [
        'Do not leave your entire allowance in your primary mobile wallet where daily swipe and tapping feels frictionless.',
        'Split your allowance immediately upon receipt: 40% reserved for fixed obligations (rent/hostel, data bundle, lab manuals), 45% divided equally across the 4 weeks for meals and transport, and 15% tucked into your Emergency Cushion goal.',
        'Use the Campus Coin "Safe-to-Spend" daily ceiling. If you stay under $4.85/day, you will never need to borrow during the last week of the month.'
      ]
    },
    {
      title: 'Commuter Kombi & Transport Budget Optimization',
      category: 'Transport Efficiency',
      summary: 'Practical tactics to trim daily transport expenses between Harare CBD, Belvedere, and HIT gates.',
      icon: Bus,
      color: 'bg-blue-100 text-blue-900',
      content: [
        'Kombi fares fluctuate based on weather and peak morning hours ($0.75 - $1.50 per trip).',
        'Consider buying weekly punch passes or pooling with classmates living in the same neighborhood (Belvedere, Warren Park, Westlea).',
        'Take advantage of early morning campus shuttle runs that offer discounted fixed student rates with your HIT ID card.'
      ]
    },
    {
      title: 'Data Bundles vs Campus Wi-Fi Management',
      category: 'Academic Tech',
      summary: 'Avoid expensive daily ad-hoc data bundles that drain student balances.',
      icon: Wifi,
      color: 'bg-purple-100 text-purple-900',
      content: [
        'Daily $1.00 data top-ups cost $30.00/month for minimal megabytes. Instead, purchasing a dedicated 15GB or 20GB monthly student e-learning bundle at $12.00 saves over 60%.',
        'Download large lecture slide decks, PDF textbooks, and video tutorials while connected to HIT institutional Wi-Fi in campus computer laboratories.',
        'Reserve mobile private data strictly for essential WhatsApp class group updates and research on the go.'
      ]
    },
    {
      title: 'Overcoming the "Semester-Start Splurge Syndrome"',
      category: 'Behavioral Habits',
      summary: 'Why spending spikes in August and February lead to acute crises in November and May.',
      icon: TrendingUp,
      color: 'bg-amber-100 text-amber-900',
      content: [
        'When students receive fresh semester money, an optimism bias makes the term feel endless.',
        'Apply the 48-Hour Waiting Rule: When considering non-essential clothing, gadgets, or premium restaurant outings, pause for two full days.',
        'Check your Campus Coin Semester Runway first: Remember that every $15 spent on non-essentials in week 2 is $15 missing during exam revision week.'
      ]
    },
    {
      title: 'Building a $50 to $100 Starter Emergency Cushion',
      category: 'Financial Resilience',
      summary: 'The single most effective stress-reducer for Zimbabwean university students.',
      icon: Shield,
      color: 'bg-emerald-100 text-emerald-800',
      content: [
        'An emergency fund protects you when unexpected events occur: sudden illness, prescription medication, a broken phone charger, or urgent thesis re-prints.',
        'You do not need hundreds of dollars to start. Saving just $3.00 to $5.00 a week accumulates $60.00 within a single 16-week semester.',
        'Treat this reserve as untouchable except for genuine academic or health emergencies.'
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0a1f44]">
              Student Financial Wellness
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Practical money management guides grounded in the realities of Zimbabwean campus life.
            </p>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="space-y-4">
        {guides.map((guide, idx) => {
          const Icon = guide.icon;
          const isOpen = openGuideIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenGuideIndex(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${guide.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      {guide.category}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {guide.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {guide.summary}
                    </p>
                  </div>
                </div>

                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-[#0f2e69]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in">
                  <span className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                    Actionable Student Rules:
                  </span>
                  <div className="space-y-2">
                    {guide.content.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-[#0f2e69] leading-relaxed">
        <strong>Campus Coin Wellness Philosophy: </strong>
        Developing sound financial habits during university lays the foundation for lifelong wealth creation. Even when income is limited, tracking and intentionality give you control.
      </div>
    </div>
  );
};
