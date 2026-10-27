import React from 'react';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

interface LifeScoreProps {
  compositeScore: number;
  financialScore: number;
  careerScore: number;
  healthScore: number;
  academicScore: number;
  weeklyDelta: number;
  statusLabel: string;
  primaryDriver: string;
}

export const LifeScoreWidget: React.FC<LifeScoreProps> = ({
  compositeScore = 87.4,
  financialScore = 88.0,
  careerScore = 88.0,
  healthScore = 82.5,
  academicScore = 91.5,
  weeklyDelta = 2.4,
  statusLabel = "Optimal Momentum",
  primaryDriver = "Consistent 7+ hr sleep and 42% savings rate toward Emergency Fund."
}) => {
  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (compositeScore / 100) * circumference;

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group glow-card">
      {/* Background soft ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/15 transition-all"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Life Score™</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Holistic Multi-Domain Equilibrium</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{weeklyDelta}% this week</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* SVG Radial Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="text-brand-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#scoreGrad)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {Math.round(compositeScore)}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                Out of 100
              </span>
            </div>
          </div>
          <span className="mt-2 text-xs font-medium px-3 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
            {statusLabel}
          </span>
        </div>

        {/* Domain Metrics Bars */}
        <div className="md:col-span-7 space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">Financial Runway</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{financialScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${financialScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">Career Velocity</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{careerScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all duration-700" style={{ width: `${careerScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">Sleep & Health Vitals</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{healthScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full transition-all duration-700" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-slate-600 dark:text-slate-400">Academic & Skills Mastery</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{academicScore}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${academicScore}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
        <ShieldCheck className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
        <span><strong className="text-slate-700 dark:text-slate-300">Dominant Catalyst: </strong>{primaryDriver}</span>
      </div>
    </div>
  );
};
