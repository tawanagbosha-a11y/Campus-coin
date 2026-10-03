import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CampusCoinLogo } from './CampusCoinLogo';
import {
  Bell,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
  ChevronDown,
  LayoutDashboard,
  Wallet,
  PieChart,
  Target,
  Calendar,
  Tag,
  BookOpen,
  Settings
} from 'lucide-react';

interface NavbarProps {
  onOpenUpgrade?: () => void;
  onOpenAddTx?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpgrade, onOpenAddTx }) => {
  const {
    user,
    isAuthenticated,
    activeView,
    setActiveView,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    resetToDemo
  } = useAuth();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const publicNavLinks = [
    { label: 'Home', view: 'home' },
    { label: 'About', view: 'about' },
    { label: 'Students', view: 'students' },
    { label: 'Features', view: 'features' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'How It Works', view: 'how_it_works' },
    { label: 'FAQ', view: 'faq' },
    { label: 'Contact', view: 'contact' }
  ];

  const appNavLinks = [
    { label: 'Dashboard', view: 'dashboard', icon: LayoutDashboard },
    { label: 'Transactions', view: 'transactions', icon: Wallet },
    { label: 'Budget', view: 'budget', icon: PieChart },
    { label: 'Goals', view: 'goals', icon: Target },
    { label: 'Semester Plan', view: 'semester', icon: Calendar },
    { label: 'Campus Deals', view: 'deals', icon: Tag },
    { label: 'Wellness', view: 'wellness', icon: BookOpen }
  ];

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setShowMobileMenu(false);
  };

  const isInsideApp = isAuthenticated && [
    'dashboard', 'transactions', 'budget', 'goals', 'semester', 'insights', 'deals', 'wellness', 'profile', 'admin'
  ].includes(activeView);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Banner for reviewers */}
      <div className="bg-[#0a1f44] text-amber-300 text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-100">
              Pilot Deployment:
            </span>
            <span className="text-amber-300 font-medium">
              Harare Institute of Technology (HIT), Zimbabwe
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Active Demo: Tendai Moyo (2nd Year BTech IT)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetToDemo();
                setActiveView('dashboard');
              }}
              title="Reset all data back to original HIT demo state"
              className="inline-flex items-center gap-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2.5 py-0.5 rounded border border-amber-400/30 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>

            {user?.role === 'admin' ? (
              <button
                onClick={() => setActiveView(activeView === 'admin' ? 'dashboard' : 'admin')}
                className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-medium px-2 py-0.5 rounded transition-colors"
              >
                {activeView === 'admin' ? 'Exit Admin' : 'Admin Portal'}
              </button>
            ) : (
              <button
                onClick={() => setActiveView('admin')}
                className="text-[11px] text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
              >
                Admin Mode
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setActiveView(isAuthenticated ? 'dashboard' : 'home')}
            className="focus:outline-hidden text-left"
          >
            <CampusCoinLogo size="md" showTagline />
          </button>

          {/* Desktop Navigation */}
          {!isInsideApp ? (
            <nav className="hidden lg:flex items-center gap-6">
              {publicNavLinks.map(link => (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`text-sm font-medium transition-colors ${
                    activeView === link.view
                      ? 'text-[#0f2e69] font-bold border-b-2 border-[#f59e0b] pb-0.5'
                      : 'text-slate-600 hover:text-[#0f2e69]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          ) : (
            <nav className="hidden xl:flex items-center gap-1.5">
              {appNavLinks.map(link => {
                const Icon = link.icon;
                const isActive = activeView === link.view;
                return (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0f2e69] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Plus plan badge */}
                {user.isPremium ? (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Campus Coin Plus
                  </span>
                ) : (
                  <button
                    onClick={onOpenUpgrade}
                    className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    Upgrade to Plus
                  </button>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">Student Alerts</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-xs text-blue-600 hover:underline font-medium"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-500">
                            No notifications right now.
                          </div>
                        ) : (
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markNotificationRead(notif.id)}
                              className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors text-xs ${
                                !notif.read ? 'bg-amber-50/40 font-medium' : 'text-slate-600'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-semibold text-slate-900">{notif.title}</span>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1" />
                                )}
                              </div>
                              <p className="text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0f2e69] text-white flex items-center justify-center font-bold text-xs">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="hidden md:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                        {user.isHitVerified && (
                          <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                        )}
                        {user.programme.slice(0, 16)}...
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-bold text-sm text-slate-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200">
                            {user.studentRegNumber}
                          </span>
                          {user.isHitVerified && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" />
                              HIT Verified
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveView('dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Student Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setActiveView('profile');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Profile & Verification
                        </button>
                        <button
                          onClick={() => {
                            if (onOpenUpgrade) onOpenUpgrade();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <CreditCard className="w-4 h-4 text-slate-400" />
                          Subscription & Billing
                        </button>
                        <button
                          onClick={() => {
                            setActiveView('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </button>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Public header buttons */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('login')}
                  className="text-xs sm:text-sm font-semibold text-[#0f2e69] hover:text-[#1a4494] px-3 py-2 rounded-lg transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => setActiveView('register')}
                  className="text-xs sm:text-sm font-bold bg-[#0f2e69] hover:bg-[#0a1f44] text-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {isAuthenticated ? (
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              {appNavLinks.map(link => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                      activeView === link.view
                        ? 'bg-[#0f2e69] text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-1">
              {publicNavLinks.map(link => (
                <button
                  key={link.view}
                  onClick={() => handleNavClick(link.view)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    activeView === link.view
                      ? 'bg-blue-50 text-[#0f2e69] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => handleNavClick('register')}
                  className="w-full text-center py-2.5 rounded-lg font-bold text-white bg-[#0f2e69] text-sm shadow-sm"
                >
                  Start Free
                </button>
                <button
                  onClick={() => handleNavClick('login')}
                  className="w-full text-center py-2 rounded-lg font-semibold text-[#0f2e69] bg-slate-100 text-sm"
                >
                  Log in
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full py-2 rounded-lg text-xs font-semibold text-red-600 bg-red-50 text-center"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
