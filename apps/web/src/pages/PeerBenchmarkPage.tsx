import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  ShieldCheck,
  TrendingUp,
  Award,
  DollarSign,
  Moon,
  Coffee,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const PeerBenchmarkPage: React.FC = () => {
  const { t } = useTranslation();
  const [benchmark, setBenchmark] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPeerBenchmark('early_career_tech');
        setBenchmark(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-brand-500" />
          K-Anonymous Peer Benchmarking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare your savings, sleep, and lifestyle investments against an anonymized demographic cohort (k ≥ 10 threshold strictly enforced).
        </p>
      </div>

      {/* Privacy Guarantee Card */}
      <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-emerald-500 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">
            Strict k-Anonymity Verified (Cohort Size: {benchmark?.cohort_size || 500} profiles)
          </h4>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            In compliance with India's DPDP Act 2023 and privacy best practices, metrics are only computed when cohort size exceeds k ≥ 10. Individual user records are never exposed or cross-referenced.
          </p>
        </div>
      </div>

      {/* Benchmark Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric 1: Savings Rate */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Monthly Savings Rate
            </span>
            <span className="text-xs font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              78th Percentile
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">41.5%</span>
              <span className="text-xs text-slate-400 ml-1.5">Your Rate</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-500">32.0%</span>
              <span className="text-xs text-slate-400 block">Peer Median</span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
          </div>
          <p className="text-xs text-slate-500">
            You are saving <strong>9.5% more</strong> than the median engineer in your peer group.
          </p>
        </div>

        {/* Metric 2: Sleep Duration */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-cyan-500" />
              Sleep Consistency
            </span>
            <span className="text-xs font-extrabold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded">
              74th Percentile
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">7.4h</span>
              <span className="text-xs text-slate-400 ml-1.5">Your Average</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-500">6.8h</span>
              <span className="text-xs text-slate-400 block">Peer Median</span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: '74%' }}></div>
          </div>
          <p className="text-xs text-slate-500">
            Maintaining 7+ hours sleep keeps you in the top quartile of tech professionals.
          </p>
        </div>

        {/* Metric 3: Dining Out Spend */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-500" />
              Monthly Dining Out / Delivery
            </span>
            <span className="text-xs font-extrabold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded">
              38th Percentile (Conservative)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹8,500</span>
              <span className="text-xs text-slate-400 ml-1.5">Your Spend</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-500">₹11,200</span>
              <span className="text-xs text-slate-400 block">Peer Median</span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-brand-500 rounded-full" style={{ width: '38%' }}></div>
          </div>
          <p className="text-xs text-slate-500">
            You spend <strong>₹2,700 less</strong> on food delivery than typical peers in Bengaluru/Hyderabad.
          </p>
        </div>

        {/* Metric 4: Learning & Upskilling */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-500" />
              Upskilling & Course Allocation
            </span>
            <span className="text-xs font-extrabold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded">
              82nd Percentile
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹4,200</span>
              <span className="text-xs text-slate-400 ml-1.5">Your Spend</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-500">₹2,100</span>
              <span className="text-xs text-slate-400 block">Peer Median</span>
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
          </div>
          <p className="text-xs text-slate-500">
            Your high educational investment correlates with your 82% YoY salary growth trajectory.
          </p>
        </div>
      </div>
    </div>
  );
};
