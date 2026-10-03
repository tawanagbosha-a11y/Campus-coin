import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CampusCoinLogo } from '../common/CampusCoinLogo';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthPagesProps {
  mode: 'login' | 'register';
}

export const AuthPages: React.FC<AuthPagesProps> = ({ mode }) => {
  const { login, register, loginAsDemoStudent, signInWithGoogle, setActiveView } = useAuth();

  // Registration state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [studentRegNumber, setStudentRegNumber] = useState('');
  const [programme, setProgramme] = useState('BTech Information Technology');
  const [yearOfStudy, setYearOfStudy] = useState<number>(1);
  const [gender, setGender] = useState('Prefer not to say');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [campus, setCampus] = useState('Harare Institute of Technology (HIT)');
  const [password, setPassword] = useState('');

  // Password reset flow state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleNotice, setGoogleNotice] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg('');
    setGoogleNotice(null);
    try {
      const success = await signInWithGoogle();
      if (!success) {
        // User closed or dismissed the popup window
        setGoogleNotice('Google sign-in was dismissed. You can try again or use the Instant Demo / Email login below.');
      }
    } catch {
      setGoogleNotice('Sign-in popup closed. Please try again or use Student Email.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await login(email, password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    await register({
      firstName,
      lastName,
      email,
      studentRegNumber: studentRegNumber || `H240${Math.floor(100 + Math.random() * 900)}T`,
      programme,
      yearOfStudy,
      gender,
      phoneNumber,
      campus
    });
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Logo and Pilot badge */}
        <div className="text-center space-y-2">
          <div className="inline-block">
            <CampusCoinLogo size="lg" />
          </div>
          <h2 className="text-2xl font-black text-[#0a1f44]">
            {isResetMode
              ? 'Reset Account Password'
              : mode === 'login'
              ? 'Welcome Back to Campus Coin'
              : 'Create Your Student Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Log in to access your semester runway and safe-to-spend limit'
              : 'Pilot Deployment for Harare Institute of Technology (HIT), Zimbabwe'}
          </p>
        </div>

        {/* Demo Student Fast Access Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
              Instant Reviewer Demo Access
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              HIT Verified
            </span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Jump directly into the fully-loaded HIT pilot environment with sample student finances:
          </p>
          <button
            onClick={loginAsDemoStudent}
            className="w-full py-2.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Continue as Tendai Moyo (2nd Year BTech IT)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Form Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-md">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isResetMode && (
            <div className="mb-6 space-y-3">
              <button
                type="button"
                disabled={googleLoading}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google (Firebase Auth)'}</span>
              </button>

              {googleNotice && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-center justify-between">
                  <span>{googleNotice}</span>
                  <button
                    type="button"
                    onClick={() => setGoogleNotice(null)}
                    className="ml-2 font-bold text-amber-900"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[11px] uppercase font-semibold">Or with student email</span>
                <div className="grow border-t border-slate-200"></div>
              </div>
            </div>
          )}

          {isResetMode ? (
            resetSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-slate-900 text-sm">Reset Link Dispatched</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We sent instructions to <strong>{email}</strong>. Check your inbox or institutional student email.
                </p>
                <button
                  onClick={() => setIsResetMode(false)}
                  className="text-xs font-bold text-[#0f2e69] hover:underline"
                >
                  Return to Log in
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="student@hit.ac.zw or personal"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f2e69]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs transition-colors"
                >
                  Send Password Reset Instructions
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResetMode(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Back to Log in
                  </button>
                </div>
              </form>
            )
          ) : mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tendai.moyo@hit.ac.zw or your email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f2e69]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] font-semibold text-blue-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-[#0f2e69]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Sign In to Campus Coin</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                New to Campus Coin?{' '}
                <button
                  type="button"
                  onClick={() => setActiveView('register')}
                  className="font-bold text-[#0f2e69] hover:underline"
                >
                  Create an account
                </button>
              </div>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Tendai"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0f2e69]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Moyo"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0f2e69]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@hit.ac.zw or personal"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0f2e69]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  HIT emails automatically receive the institutional verified badge.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Reg # *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentRegNumber}
                    onChange={e => setStudentRegNumber(e.target.value)}
                    placeholder="e.g. H230489T"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3 (Internship)</option>
                    <option value={4}>Year 4 (Final)</option>
                    <option value={5}>Postgraduate / Masters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Degree Programme
                </label>
                <input
                  type="text"
                  value={programme}
                  onChange={e => setProgramme(e.target.value)}
                  placeholder="e.g. BTech Information Technology, Computer Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone (EcoCash)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+263 77 ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Campus
                  </label>
                  <input
                    type="text"
                    disabled
                    value={campus}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-white bg-[#0f2e69] hover:bg-[#0a1f44] text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 mt-2"
              >
                <span>Complete Student Registration</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setActiveView('login')}
                  className="font-bold text-[#0f2e69] hover:underline"
                >
                  Log in here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
