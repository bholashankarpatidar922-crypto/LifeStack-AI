import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  BotMessageSquare,
  SlidersHorizontal,
  Target,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  Server,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: LayoutDashboard, id: 'nav-dashboard' },
    { to: '/mining', label: t('nav.miningLab'), icon: Cpu, id: 'nav-mining' },
    { to: '/copilot', label: t('nav.copilot'), icon: BotMessageSquare, id: 'nav-copilot' },
    { to: '/simulator', label: t('nav.simulator'), icon: SlidersHorizontal, id: 'nav-simulator' },
    { to: '/goals', label: t('nav.goals'), icon: Target, id: 'nav-goals' },
    { to: '/ingest', label: t('nav.ingest'), icon: FileSpreadsheet, id: 'nav-ingest' },
    { to: '/benchmarks', label: t('nav.benchmarks'), icon: Users, id: 'nav-benchmarks' },
    { to: '/privacy', label: t('nav.privacy'), icon: ShieldAlert, id: 'nav-privacy' },
    { to: '/admin', label: t('nav.admin'), icon: Server, id: 'nav-admin' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block border-r border-slate-200/50 dark:border-slate-800/80 p-4 space-y-6">
      <div>
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Decision Intelligence
        </p>
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                id={item.id}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-glow-indigo font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* DPDP & Ethics Shield Badge */}
      <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 px-2">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            DPDP 2023 & GDPR Guard
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
            Zero third-party tracking. All cross-user comparisons enforced with k-anonymity (k ≥ 10).
          </p>
          <div className="mt-2 text-right">
            <NavLink to="/legal" className="text-[10px] font-medium text-brand-500 hover:underline">
              Legal & Disclaimers →
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  );
};
