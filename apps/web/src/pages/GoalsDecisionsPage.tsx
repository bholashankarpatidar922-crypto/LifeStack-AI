import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Target,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Sparkles,
  Award,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const GoalsDecisionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [goals, setGoals] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [accuracyRate, setAccuracyRate] = useState<number>(88.5);
  const [loading, setLoading] = useState(true);

  // New goal form modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDomain, setNewGoalDomain] = useState('finance');

  // New decision modal state
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decTitle, setDecTitle] = useState('');
  const [decDetails, setDecDetails] = useState('');
  const [decChosen, setDecChosen] = useState('');
  const [decPrediction, setDecPrediction] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsRes, decRes] = await Promise.all([
        api.getGoals(),
        api.getDecisions()
      ]);
      setGoals(goalsRes || []);
      setDecisions(decRes?.decisions || []);
      if (decRes?.accuracy_rate_pct) {
        setAccuracyRate(decRes.accuracy_rate_pct);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle || !newGoalTarget) return;
    await api.createGoal({
      domain: newGoalDomain,
      title: newGoalTitle,
      target_amount_or_metric: parseFloat(newGoalTarget),
      current_amount_or_metric: 0.0,
      target_date: '2027-12-31',
      monthly_savings_allocated: 5000.0
    });
    setShowGoalModal(false);
    setNewGoalTitle('');
    setNewGoalTarget('');
    loadData();
  };

  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decTitle || !decChosen) return;
    await api.createDecision({
      category: 'career',
      title: decTitle,
      details: decDetails || decTitle,
      options_considered: [decChosen, 'Alternative option'],
      chosen_option: decChosen,
      predicted_outcome: decPrediction || 'Positive growth trajectory.',
      confidence_score: 0.88,
      review_scheduled_date: '2027-04-15'
    });
    setShowDecisionModal(false);
    setDecTitle('');
    setDecDetails('');
    setDecChosen('');
    setDecPrediction('');
    loadData();
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Target className="w-7 h-7 text-brand-500" />
            Goal Planner & Decision Journal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track multi-year aspirations and log predictions to calibrate your life-decision accuracy over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-add-goal"
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow-indigo transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Goal</span>
          </button>
          <button
            id="btn-add-decision"
            onClick={() => setShowDecisionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Log Decision</span>
          </button>
        </div>
      </div>

      {/* Section 1: Active Goals Roadmap */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" />
          Active Strategic Milestones
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {goals.map((g) => (
            <div key={g.goal_id} className="glass-panel p-5 rounded-2xl glow-card space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-500 uppercase tracking-wider text-[10px]">{g.domain}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  g.status === 'achieved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-brand-500/10 text-brand-500'
                }`}>
                  {g.status === 'achieved' ? 'Achieved' : 'In Progress'}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{g.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{g.description}</p>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-slate-900 dark:text-white">{g.progress_pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${g.progress_pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/50 dark:border-slate-800/80">
                <span className="text-slate-400">Target Date:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{g.target_date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Decision Journal with Accuracy Calibration */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-500" />
              Decision Journal & Prediction Calibration
            </h3>
            <p className="text-xs text-slate-400">
              Comparing your predicted AI outcomes vs real validated life outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-500">
            <Award className="w-4 h-4" />
            <span>Calibration Accuracy: {accuracyRate}%</span>
          </div>
        </div>

        <div className="space-y-3">
          {decisions.map((d) => (
            <div key={d.decision_id} className="glass-panel p-5 rounded-2xl glow-card space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/15 text-brand-500 uppercase">
                    {d.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{d.title}</h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">{d.date}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    d.status === 'validated'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {d.status === 'validated' ? 'Validated by Actuals' : 'Pending Review'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-slate-400 block mb-1">Predicted Hypothesis (AI Confidence: {Math.round(d.confidence_score * 100)}%):</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{d.predicted_outcome}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                  <span className="font-bold text-emerald-500 block mb-1">Actual Observed Outcome:</span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {d.actual_outcome || `Review scheduled for ${d.review_scheduled_date}. System follow-up notification primed.`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateGoal} className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Create New Strategic Goal</h3>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Goal Title</label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={e => setNewGoalTitle(e.target.value)}
                placeholder="e.g. MS Abroad Fund, Cloud Certification"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Target Amount (₹ or Metric)</label>
              <input
                type="number"
                value={newGoalTarget}
                onChange={e => setNewGoalTarget(e.target.value)}
                placeholder="250000"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowGoalModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
              >
                Save Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Decision Modal */}
      {showDecisionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateDecision} className="glass-panel p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Log Decision & AI Prediction</h3>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Decision Title</label>
              <input
                type="text"
                value={decTitle}
                onChange={e => setDecTitle(e.target.value)}
                placeholder="e.g. Switch from Enterprise to AI Startup"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Chosen Option</label>
              <input
                type="text"
                value={decChosen}
                onChange={e => setDecChosen(e.target.value)}
                placeholder="AI Startup Offer (₹8.5 LPA + Equity)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Expected / Predicted Outcome</label>
              <textarea
                value={decPrediction}
                onChange={e => setDecPrediction(e.target.value)}
                placeholder="Hands-on LLM experience will position candidate for 60%+ market premium in Year 2."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white h-20"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDecisionModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
              >
                Log Prediction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
