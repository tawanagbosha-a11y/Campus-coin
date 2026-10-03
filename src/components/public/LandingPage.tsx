import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Target,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
  Zap,
  DollarSign,
  Coffee,
  Bus,
  Wifi,
  Laptop
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, loginAsDemoStudent, subscriptionConfig } = useAuth();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why not just use a notebook or a generic banking app?',
      a: 'Generic banking apps track what you already spent in a standard calendar month, but they do not understand the student semester calendar. Campus Coin is built around semester start and end dates, irregular allowances, kombi transport budgeting, exam registration deadlines, and calculates your exact daily "Safe to Spend" so you never run out of money mid-semester.'
    },
    {
      q: 'Does Campus Coin require access to my bank account or EcoCash PIN?',
      a: 'Never. Campus Coin will NEVER ask for your banking passwords or EcoCash PINs. You log your transactions quickly or review scheduled commitments. Your financial security and privacy are top priority.'
    },
    {
      q: 'Is Campus Coin officially run by Harare Institute of Technology (HIT)?',
      a: 'Campus Coin is an independent student financial wellness platform initially piloted for HIT students. We use HIT-aligned institutional styling for familiar student navigation, but the pilot aims to test student usability and financial wellness outcomes before broader institutional rollout.'
    },
    {
      q: 'What is the "Safe-to-Spend" calculation?',
      a: 'Safe-to-Spend takes your current cash on hand, subtracts your upcoming committed fixed expenses (like upcoming fees, hostel bills, or weekly kombi passes) and planned goal savings, then divides the remainder by the days left in your allowance cycle. This gives you a clear daily and weekly spending limit you can trust.'
    },
    {
      q: 'How does Campus Coin Plus work?',
      a: 'Campus Coin has a comprehensive free tier for transaction tracking and basic budgeting. Campus Coin Plus ($1.50/month or $6/semester pilot price) unlocks advanced semester runway forecasting, unlimited savings goals, automated recurring bills tracking, and exclusive sponsored partner discounts around Harare.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setContactSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-slate-50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200/90 text-[#0f2e69] text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Pilot: Harare Institute of Technology (HIT), Zimbabwe</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0a1f44] tracking-tight leading-[1.12]">
              Your Money. <br />
              <span className="text-[#0f2e69]">Your Semester.</span>{' '}
              <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">
                Your Control.
              </span>
            </h1>

            {/* Supporting text */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Campus Coin helps students track spending, plan their semester, build savings and make
              smarter financial decisions — all in one student-first platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={loginAsDemoStudent}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-[#0f2e69] bg-amber-400 hover:bg-amber-500 text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-900" />
                <span>Explore Live Demo (Tendai - HIT)</span>
              </button>
            </div>

            {/* Statement */}
            <p className="text-xs text-slate-500 font-medium tracking-wide pt-1">
              Built for student life. Designed around the semester.
            </p>
          </div>

          {/* Premium Dashboard Preview */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-2xl bg-white p-3 sm:p-6 shadow-2xl border border-slate-200/90 ring-1 ring-slate-900/5">
              {/* Window Controls bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    Campus Coin — Student Financial Command Centre
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    HIT Verified
                  </span>
                </div>
              </div>

              {/* Preview Dashboard Content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Available Balance */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-semibold text-slate-500 block">Available Cash</span>
                  <div className="text-2xl font-black text-[#0a1f44] mt-1">$185.00</div>
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> +$45 tutoring this week
                  </span>
                </div>

                {/* Safe to Spend */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900">Safe to Spend Today</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                      ON TRACK
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-950 mt-1">$4.85<span className="text-xs font-normal text-amber-800">/day</span></div>
                  <span className="text-[11px] text-amber-800 font-medium block mt-1">
                    Safe for meals & kombis
                  </span>
                </div>

                {/* Monthly Budget */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">October Budget</span>
                    <span className="text-[11px] font-bold text-slate-700">38% used</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">$74.50 <span className="text-xs font-normal text-slate-400">/ $195</span></div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#0f2e69] h-full rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>

                {/* Semester Runway */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">Semester Runway</span>
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div className="text-2xl font-black text-[#0f2e69] mt-1">64 Days</div>
                  <span className="text-[11px] text-blue-800 font-medium block mt-1">
                    Through Dec 12 exam week
                  </span>
                </div>
              </div>

              {/* Sub-preview: Goal & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Savings Goal Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 md:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-blue-700" /> ThinkPad Project Laptop
                    </span>
                    <span className="text-xs font-bold text-blue-700">46%</span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs text-slate-600 mb-1.5">
                    <span>$195 saved</span>
                    <span className="text-slate-400">Target: $420</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '46%' }} />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    $15/week contribution pace on schedule
                  </span>
                </div>

                {/* Upcoming Commitments Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Protected Student Commitments
                    </span>
                    <span className="text-[11px] text-slate-500">Auto-deducted in Safe-to-Spend</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                      <span className="text-slate-500 text-[10px] block">Weekly Kombi Pass</span>
                      <span className="font-bold text-slate-800">$8.50</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                      <span className="text-slate-500 text-[10px] block">Econet 15GB Bundle</span>
                      <span className="font-bold text-slate-800">$12.00</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                      <span className="text-slate-500 text-[10px] block">Exam Balance</span>
                      <span className="font-bold text-slate-800">$35.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f44] tracking-tight">
              Student money is different. <br />
              <span className="text-[#0f2e69]">Your financial tools should be too.</span>
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Standard personal finance software assumes a stable 9-to-5 monthly salary and regular household bills. University life in Zimbabwe does not work that way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Money disappears without knowing where it went
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Small daily expenses — cafeteria lunches, kombi commuter fares, printing charges, and quick airtime top-ups — slip by unrecorded until balances hit zero.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Allowances arrive at irregular intervals
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Parents send remittances when available, side hustles and tutoring income fluctuate, and bursaries arrive in lump sums that must be stretched over months.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Food and transport spending spiral quickly
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Without a clear daily spending ceiling, students spend heavily during the first two weeks of the month and face severe austerity during exam study periods.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Institutional fees & lab costs are easy to forget
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Semester fees, lab coat deposits, thesis binding, and exam registration deadlines loom at the end of term when money is at its tightest.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                05
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Difficulty knowing what is actually safe to spend
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A student seeing $60 in their EcoCash wallet might spend $15 on an outing, forgetting that $45 is already committed for rent, data, and next week’s transport.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                06
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Generic tools ignore the academic calendar
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Conventional banking applications have no awareness of reading weeks, semester breaks, exam registration windows, or university terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f44] tracking-tight">
              Meet your financial command centre.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Five core capabilities designed specifically for higher education students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0f2e69] transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2e69] mx-auto flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Track</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Log cash, EcoCash, bank, and card transactions in seconds with student-specific categories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0f2e69] transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Plan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Structure budgets around the 16-week academic semester and monthly living categories.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0f2e69] transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2e69] mx-auto flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Predict</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate your exact daily safe-to-spend limit and forecast your end-of-semester runway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0f2e69] transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center font-black text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Save</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Set achievable goals for project laptops, fees, and emergency cushions with weekly micro-contributions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#0f2e69] transition-all text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 mx-auto flex items-center justify-center font-black text-lg mb-4">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Improve</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive transparent, rule-based spending guidance and unlock verified campus partner discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USP Comparison Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f44] tracking-tight">
              Not just an expense tracker.
            </h2>
            <p className="mt-4 text-base text-slate-700 font-medium">
              Campus Coin combines everyday expense tracking with academic-semester planning and personalised financial guidance for students.
            </p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <div className="grid grid-cols-2 bg-[#0a1f44] text-white p-4 sm:p-6">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">Standard Tools</span>
                <h3 className="text-base sm:text-xl font-bold text-slate-200 mt-1">Generic Expense Tracker</h3>
              </div>
              <div className="pl-4 sm:pl-6 border-l border-blue-900">
                <span className="text-xs text-amber-400 uppercase tracking-wider block font-bold">The Student Difference</span>
                <h3 className="text-base sm:text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                  Campus Coin <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
                </h3>
              </div>
            </div>

            <div className="divide-y divide-slate-100 bg-white text-sm">
              {[
                { feature: 'Records spending transactions', generic: true, campus: true },
                { feature: 'Understands semester dates & academic calendar', generic: false, campus: true },
                { feature: 'Calculates real-time daily Safe-to-Spend limit', generic: false, campus: true },
                { feature: 'Forecasts balance until end of semester', generic: false, campus: true },
                { feature: 'Separates living money from committed student fees', generic: false, campus: true },
                { feature: 'Student savings goals with weekly pace tracking', generic: false, campus: true },
                { feature: 'Warns before financial depletion happens', generic: false, campus: true },
                { feature: 'Connects students to campus deals (Cafeteria, Printing)', generic: false, campus: true },
                { feature: 'Zimbabwe student payment methods (EcoCash, Cash, Bank)', generic: false, campus: true }
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-2 p-3 sm:p-4 items-center hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2 pr-4 text-slate-600 font-medium text-xs sm:text-sm">
                    {row.generic ? (
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span>{row.feature}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-4 sm:pl-6 border-l border-slate-100 text-[#0f2e69] font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Included in Campus Coin</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-3">
              <span>TEST PRICES FOR HIT PILOT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a1f44] tracking-tight">
              Accessible student pricing.
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Campus Coin is built to empower students. Get started completely free, or unlock advanced semester planning with Campus Coin Plus.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* FREE PLAN */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Basic Tier
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-1">Campus Coin Free</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">$0</span>
                  <span className="text-sm font-semibold text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Essential tools for daily student expense tracking and basic budgeting.
                </p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transaction tracking (Cash, EcoCash, Card)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Monthly budget vs actual tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic dashboard & spending categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1 Active savings goal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Browse student campus deals</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('register')}
                className="mt-8 w-full py-3 rounded-xl font-bold text-[#0f2e69] bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Get Started Free
              </button>
            </div>

            {/* CAMPUS COIN PLUS */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-[#0a1f44] text-white border-2 border-amber-400 shadow-xl flex flex-col justify-between">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wide shadow-md">
                RECOMMENDED PILOT TIER
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Premium Experience
                </span>
                <h3 className="text-2xl font-black text-white mt-1">Campus Coin Plus</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">
                    ${subscriptionConfig.monthlyPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">/ month</span>
                  <span className="text-xs text-amber-200 ml-2 font-medium">
                    or ${subscriptionConfig.semesterPrice.toFixed(2)} / semester
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Complete peace of mind with predictive semester runway planning and safe spending.
                </p>

                <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Advanced Semester Financial Planner & Runway</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Real-time daily & weekly Safe-to-Spend limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Unlimited savings goals with milestone alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Automated recurring expenses & fee cushion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Smart rule-based spending warnings & insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Export CSV & JSON reports for records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Exclusive sponsored campus partner discounts</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('register')}
                className="mt-8 w-full py-3 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-sm shadow-md"
              >
                Upgrade to Campus Coin Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#0a1f44] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Clear answers to student financial management and the HIT pilot programme.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        isOpen ? 'rotate-180 text-amber-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#0a1f44] tracking-tight">
              Connect with the Pilot Team
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Questions, partner enquiries, or student feedback on the HIT pilot deployment?
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {contactSent ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for reaching out to Campus Coin. Our Harare pilot support team will reply to {contactEmail} shortly.
                </p>
                <button
                  onClick={() => {
                    setContactSent(false);
                    setContactMessage('');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      placeholder="e.g. Tendai Moyo"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      placeholder="student@hit.ac.zw or personal"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Feedback / Partnership Enquiry
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    placeholder="Tell us your questions, thoughts on the pilot, or student discount merchant offer..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0f2e69]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Pilot Team</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
