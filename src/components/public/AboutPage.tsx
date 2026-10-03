import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Target,
  Compass,
  Lightbulb,
  Building2,
  Shield,
  Heart,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActiveView, loginAsDemoStudent } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0f2e69] text-xs font-bold">
            <span>ABOUT CAMPUS COIN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a1f44] tracking-tight">
            Financial Confidence for Every Student
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Campus Coin was founded on a simple realization: higher education students face unique financial stresses that conventional banking apps fail to address.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#0f2e69] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To help students develop healthier financial habits, eliminate money anxiety, and make better financial decisions throughout their entire academic journey.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              A future where every university student can understand, plan and control their money with absolute clarity — graduating financially resilient and ready for life.
            </p>
          </div>
        </div>

        {/* Why Campus Coin Exists */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#0a1f44] text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>The Student Problem</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
            Why Student-Specific Financial Technology is Essential
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            University students navigate a distinct financial environment: irregular allowance remittances from parents, seasonal examination fee deadlines, fluctuating transport kombi costs, sudden equipment or lab textbook needs, and shared hostel utility contributions.
          </p>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            When students run out of money mid-semester, the stress directly impacts class attendance, study focus, nutritional health, and academic performance. Campus Coin solves this by replacing guesswork with mathematical certainty — calculating exactly what is safe to spend today while ring-fencing upcoming academic obligations.
          </p>
        </div>

        {/* Pilot Programme Section */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Pilot Programme Overview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Initial Pilot Campus</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                Harare Institute of Technology
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-500" /> Belvedere, Harare
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Country</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                Zimbabwe
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Multi-currency & EcoCash context
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">Target Users</span>
              <span className="text-lg font-bold text-slate-900 mt-1 block">
                HIT Students
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Engineering, Tech & Sciences
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed">
            <strong>Pilot Validation Notice: </strong>
            The HIT pilot is intentionally designed to validate student usability, engagement, and financial stability outcomes with real Zimbabwean university students before broader institutional expansion across Southern Africa.
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-[#0a1f44] text-center">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0f2e69] flex items-center justify-center font-bold text-sm">
                01
              </span>
              <h3 className="font-bold text-slate-900 text-base">Simplicity</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Financial tools should reduce cognitive load, not add friction. Fast 5-second transaction logging.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                02
              </span>
              <h3 className="font-bold text-slate-900 text-base">Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student financial data is completely isolated. No third-party ad brokers or intrusive banking credential demands.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
                03
              </span>
              <h3 className="font-bold text-slate-900 text-base">Innovation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pioneering semester runway forecasting and transparent safe-to-spend algorithms.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-[#0f2e69] flex items-center justify-center font-bold text-sm">
                04
              </span>
              <h3 className="font-bold text-slate-900 text-base">Financial Responsibility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encouraging emergency cushions and disciplined goal accumulation over predatory student borrowing.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 sm:col-span-2 lg:col-span-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-sm">
                05
              </span>
              <h3 className="font-bold text-slate-900 text-base">Student Empowerment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Putting students firmly in control of their future by connecting academic milestones with financial preparedness.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={loginAsDemoStudent}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-base shadow-md transition-all"
          >
            <span>Experience the Platform as Tendai Moyo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
