import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DollarSign,
  TrendingUp,
  Moon,
  Target,
  AlertTriangle,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { api } from '../services/api';
import { MetricCard } from '../components/Common/MetricCard';
import { LifeScoreWidget } from '../components/Common/LifeScoreWidget';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

const COLORS = ['#6366F1', '#10B981', '#06B6D4', '#F59E0B', '#EC4899', '#8B5CF6'];

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, timeRes] = await Promise.all([
          api.getDashboardSummary(),
          api.getTimeline()
        ]);
        setData(dashRes);
        setTimeline(timeRes?.events || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleExportCsv = () => {
    if (!data?.spending_breakdown) return;
    const headers = 'Category,Total_Amount_INR,Percentage,Transactions\n';
    const rows = data.spending_breakdown
      .map((r: any) => `"${r.category_name}",${r.total_amount},${r.percentage}%,${r.transaction_count}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeStack_Spending_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">{t('common.loading')}</p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    monthly_burn_rate: 48500,
    savings_rate_pct: 41.5,
    avg_sleep_hours: 7.4,
    goals_on_track_count: 3,
    anomalies_detected_30d: 1
  };

  const lifeScore = data?.life_score || {
    composite_score: 87.4,
    financial_score: 88.0,
    career_score: 88.0,
    health_score: 82.5,
    academic_score: 91.5,
    weekly_delta: 2.4,
    status_label: 'Optimal Momentum',
    primary_driver: 'Consistent 7+ hr sleep and 42% savings rate toward Emergency Fund.'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Regulatory Disclaimer */}
      <DisclaimerBanner />

      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-export-csv"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('dashboard.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Life Score & Primary KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LifeScoreWidget
            compositeScore={lifeScore.composite_score}
            financialScore={lifeScore.financial_score}
            careerScore={lifeScore.career_score}
            healthScore={lifeScore.health_score}
            academicScore={lifeScore.academic_score}
            weeklyDelta={lifeScore.weekly_delta}
            statusLabel={lifeScore.status_label}
            primaryDriver={lifeScore.primary_driver}
          />
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <MetricCard
            id="kpi-monthly-burn"
            title={t('dashboard.monthlyBurn')}
            value={`₹${kpis.monthly_burn_rate.toLocaleString()}`}
            subtitle="Current 30d operational burn"
            trend="-3.2%"
            isPositive={true}
            icon={DollarSign}
            accentColor="indigo"
          />
          <MetricCard
            id="kpi-savings-rate"
            title={t('dashboard.savingsRate')}
            value={`${kpis.savings_rate_pct}%`}
            subtitle="Surplus allocated to goals"
            trend="+5.1%"
            isPositive={true}
            icon={TrendingUp}
            accentColor="emerald"
          />
          <MetricCard
            id="kpi-sleep-hours"
            title={t('dashboard.avgSleep')}
            value={`${kpis.avg_sleep_hours}h`}
            subtitle="7.5h biological optimum"
            trend="+0.4h"
            isPositive={true}
            icon={Moon}
            accentColor="cyan"
          />
          <MetricCard
            id="kpi-active-anomalies"
            title={t('dashboard.anomalies30d')}
            value={kpis.anomalies_detected_30d}
            subtitle="Isolation Forest outliers"
            trend="1 Flagged"
            isPositive={false}
            icon={AlertTriangle}
            accentColor="amber"
          />
        </div>
      </div>

      {/* Charts Row: Spending Breakdown Donut & Multi-Domain Trend Line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spending Category Donut */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl glow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              {t('dashboard.spendingBreakdown')}
            </h3>
            <span className="text-xs text-slate-400">Past 90 Days</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.spending_breakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={88}
                  paddingAngle={4}
                  dataKey="total_amount"
                  nameKey="category_name"
                >
                  {(data?.spending_breakdown || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Total Spent']}
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    border: '1px solid #374151',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/80">
            {(data?.spending_breakdown || []).slice(0, 4).map((c: any, i: number) => (
              <div key={c.category_id} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="text-slate-600 dark:text-slate-400 truncate">{c.category_name}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 ml-auto">{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Domain Trend Line */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl glow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                {t('dashboard.trendTitle')}
              </h3>
              <p className="text-xs text-slate-400">Co-movement of daily spend, sleep duration, and stress levels</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${timeRange === '30d' ? 'bg-brand-500 text-white shadow' : 'text-slate-500 hover:text-slate-200'}`}
              >
                30D
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${timeRange === '90d' ? 'bg-brand-500 text-white shadow' : 'text-slate-500 hover:text-slate-200'}`}
              >
                90D
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.trend_history_90d || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis yAxisId="left" stroke="#818CF8" fontSize={11} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderRadius: '12px',
                    border: '1px solid #374151',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="spending" name="Daily Spend (₹)" stroke="#6366F1" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="sleep_hours" name="Sleep (Hours)" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Life Timeline Row */}
      <div className="glass-panel p-5 rounded-2xl glow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" />
              {t('dashboard.timelineTitle')}
            </h3>
            <p className="text-xs text-slate-400">Auto-detected lifestyle milestones, academic crunches, and career jumps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {timeline.slice(0, 3).map((event, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-brand-500 uppercase tracking-wider text-[10px]">{event.domain}</span>
                <span className="text-slate-400">{event.date}</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 text-sm">{event.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">{event.detail}</p>
              <div className="pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Impact: {event.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
