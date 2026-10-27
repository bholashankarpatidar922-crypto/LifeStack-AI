import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Moon, Sun, Globe, User, Shield, Sparkles, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useTranslation } from 'react-i18next';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme, language, setLanguage, user, isNotificationsOpen, setNotificationsOpen } = useStore();
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: '1', title: 'Unusual Expense Detected', time: '2 hours ago', detail: '₹58,500 at Apple Store was flagged 3.8σ above mean.' },
    { id: '2', title: 'Goal Milestone Achieved', time: '1 day ago', detail: 'Emergency Liquid Fund reached 84% milestone (₹2,10,000).' },
    { id: '3', title: 'Decision Follow-up Due', time: '3 days ago', detail: 'Indiranagar Relocation review scheduled for next week.' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.svg" alt="LifeStack Logo" className="w-8 h-8 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
                LifeStack
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                Decision Intelligence
              </span>
            </div>
          </Link>

          {/* Quick Life Score Indicator */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: 87.4</span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle (EN / HI) */}
          <button
            id="btn-language-toggle"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              id="btn-notifications-toggle"
              onClick={() => setNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            {/* Notification Drawer Popover */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-glass border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-brand-500" />
                    Proactive Alerts & Insights
                  </h4>
                  <button onClick={() => setNotificationsOpen(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{n.detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-2 text-center border-t border-slate-200 dark:border-slate-800">
                  <Link
                    to="/mining"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs font-semibold text-brand-500 hover:underline"
                  >
                    View All in Data Mining Lab →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              id="btn-user-profile"
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                AS
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
                {user?.full_name?.split(' ')[0] || 'Aarav'}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-glass border border-slate-200 dark:border-slate-800 p-3 z-50">
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/privacy"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Privacy Vault & Consents
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-brand-500" />
                  System Architecture & Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
