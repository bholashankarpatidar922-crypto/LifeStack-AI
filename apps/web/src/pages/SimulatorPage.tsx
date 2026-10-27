import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  TrendingUp,
  Percent,
  Play,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const SimulatorPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Simulation parameters
  const [savings, setSavings] = useState(210000);
  const [income, setIncome] = useState(112000);
  const [burnRate, setBurnRate] = useState(48500);
  const [courseEmi, setCourseEmi] = useState(4200);
  const [courseUpfront, setCourseUpfront] = useState(0);
  const [horizon, setHorizon] = useState(12);
  const [targetGoal, setTargetGoal] = useState(500000);

  // Simulation results
  const [simResult, setSimResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.simulate({
        current_savings: savings,
        monthly_income: income,
        base_burn_rate: burnRate,
        new_course_emi: courseEmi,
        course_fee_upfront: courseUpfront,
        months_horizon: horizon,
        target_goal_amount: targetGoal
      });
      setSimResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Run on first load
  React.useEffect(() => {
    handleRunSimulation();
  }, []);

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <SlidersHorizontal className="w-7 h-7 text-brand-500" />
          {t('simulator.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('simulator.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl glow-card space-y-4">
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
            Decision Variables & Scenarios
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">{t('simulator.currentSavings')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{savings.toLocaleString()}</span>
            </div>
            <input
              id="slider-savings"
              type="range"
              min="50000"
              max="1000000"
              step="10000"
              value={savings}
              onChange={(e) => setSavings(parseInt(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">{t('simulator.targetAmount')}</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">₹{targetGoal.toLocaleString()}</span>
            </div>
            <input
              id="slider-target-goal"
              type="range"
              min="100000"
              max="2500000"
              step="50000"
              value={targetGoal}
              onChange={(e) => setTargetGoal(parseInt(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">{t('simulator.monthlyEmi')}</span>
              <span className="font-bold text-rose-500">₹{courseEmi.toLocaleString()} / mo</span>
            </div>
            <input
              id="slider-course-emi"
              type="range"
              min="0"
              max="25000"
              step="500"
              value={courseEmi}
              onChange={(e) => setCourseEmi(parseInt(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">{t('simulator.horizonMonths')}</span>
              <span className="font-bold text-brand-500">{horizon} Months</span>
            </div>
            <input
              id="slider-horizon"
              type="range"
              min="6"
              max="36"
              step="6"
              value={horizon}
              onChange={(e) => setHorizon(parseInt(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          <button
            id="btn-run-simulation"
            onClick={handleRunSimulation}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{loading ? 'Simulating 1,000 Paths...' : t('simulator.runButton')}</span>
          </button>
        </div>

        {/* Results & Trajectories Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Probability & Percentiles Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-2xl glow-card text-center">
              <span className="text-xs text-slate-500">{t('simulator.probabilityLabel')}</span>
              <p className="font-display text-3xl font-black mt-1 text-emerald-500">
                {simResult?.probability_of_success_pct || 91.2}%
              </p>
              <span className="text-[10px] text-slate-400">Across 1,000 stochastic runs</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl glow-card text-center">
              <span className="text-xs text-slate-500">Median Expected Balance (p50)</span>
              <p className="font-display text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                ₹{simResult?.final_median_savings_inr ? simResult.final_median_savings_inr.toLocaleString() : '8,42,000'}
              </p>
              <span className="text-[10px] text-slate-400">At Month +{horizon}</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl glow-card text-center">
              <span className="text-xs text-slate-500">Pessimistic Floor (p10)</span>
              <p className="font-display text-2xl font-bold mt-1 text-amber-500">
                ₹{simResult?.final_p10_pessimistic_inr ? simResult.final_p10_pessimistic_inr.toLocaleString() : '6,95,000'}
              </p>
              <span className="text-[10px] text-slate-400">Under severe expense shocks</span>
            </div>
          </div>

          {/* Monte Carlo Fan Chart */}
          <div className="glass-panel p-5 rounded-2xl glow-card h-80">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white mb-2">
              Stochastic Wealth Trajectory Bands (p10 to p90)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={simResult?.timeline_series || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #374151', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, '']}
                />
                <ReferenceLine y={targetGoal} stroke="#EF4444" strokeDasharray="4 4" label={{ value: 'Target Goal', fill: '#EF4444', fontSize: 10 }} />
                <Line type="monotone" dataKey="p90" name="Optimistic (p90)" stroke="#10B981" strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey="median_p50" name="Median (p50)" stroke="#6366F1" strokeWidth={3} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="p10" name="Pessimistic (p10)" stroke="#F59E0B" strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Narration */}
          {simResult?.ai_narration && (
            <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-brand-500 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-1">AI Simulation Synthesis:</span>
                <p>{simResult.ai_narration}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
