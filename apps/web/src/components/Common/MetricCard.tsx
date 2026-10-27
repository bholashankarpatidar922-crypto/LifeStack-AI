import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  trend,
  isPositive = true,
  icon: Icon,
  accentColor = 'indigo',
  onClick
}) => {
  const colorMap = {
    indigo: 'bg-brand-500/10 text-brand-500 border-brand-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className="glass-panel p-5 rounded-2xl glow-card cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${colorMap[accentColor]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
            isPositive ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};
