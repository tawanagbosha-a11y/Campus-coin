import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CampusCoinLogo } from './CampusCoinLogo';
import { MapPin, Shield, HeartHandshake, BookOpen, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useAuth();

  return (
    <footer className="bg-[#071733] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Pilot positioning */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-extrabold text-sm">
                CC
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Campus<span className="text-amber-400">Coin</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/60 text-amber-300 border border-blue-700/60">
                PILOT: HIT
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The student financial operating system built around the academic semester.
              Know your money, plan your terms, and stay financially ahead.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Harare Institute of Technology (HIT), Belvedere, Harare, Zimbabwe</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Data Isolation & Private Student Financial Analytics</span>
              </div>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('home')}
                  className="hover:text-white transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('students')}
                  className="hover:text-white transition-colors text-left"
                >
                  For Students
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('features')}
                  className="hover:text-white transition-colors text-left"
                >
                  Features & Tools
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('how_it_works')}
                  className="hover:text-white transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('pricing')}
                  className="hover:text-white transition-colors text-left"
                >
                  Pricing & Plus
                </button>
              </li>
            </ul>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
              Student Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('deals')}
                  className="hover:text-white transition-colors text-left"
                >
                  Campus Deals & Discounts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('wellness')}
                  className="hover:text-white transition-colors text-left"
                >
                  Financial Wellness Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  HIT Pilot Programme
                </button>
              </li>
            </ul>
          </div>

          {/* Institution & Trust */}
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setActiveView('contact')}
                  className="hover:text-white transition-colors text-left"
                >
                  Contact & Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('about')}
                  className="hover:text-white transition-colors text-left"
                >
                  Our Mission & Vision
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-500 text-xs">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer & Institutional Note */}
        <div className="pt-8 text-xs text-slate-400 space-y-3">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-200">Institutional & Advisory Notice: </span>
            Campus Coin is an independent student financial wellness software platform developed for pilot validation at Harare Institute of Technology (HIT), Zimbabwe. Campus Coin does not falsely claim to be an official university entity or a commercial bank. Campus Coin provides financial tracking, budgeting calculators, semester planning models, and educational resources. It does not provide regulated financial or investment advice.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-slate-500">
            <div>
              © 2026 Campus Coin. Designed for Harare Institute of Technology (HIT) Pilot. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Currency: USD (ZWL/ZiG and EcoCash compatible)</span>
              <span>•</span>
              <span>Pilot Target: HIT Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
