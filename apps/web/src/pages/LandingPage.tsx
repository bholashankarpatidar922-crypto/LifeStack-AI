import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BarChart3,
  Cpu,
  BotMessageSquare,
  SlidersHorizontal,
  Cloud,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Mail
} from 'lucide-react';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-12">
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-bold text-brand-600 dark:text-brand-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Personal Decision Intelligence</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Turn your life data into{' '}
          <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-emerald-400 bg-clip-text text-transparent">
            grounded decisions.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          LifeStack unites your personal data warehouse, empirical pattern mining, and zero-hallucination GenAI to answer real life questions: from course EMI affordability to placement branch choices.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-glow-indigo transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Demo Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/copilot"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl glass-panel hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <BotMessageSquare className="w-4 h-4 text-brand-500" />
            <span>Consult Grounded AI Copilot</span>
          </Link>
        </div>
      </section>

      {/* Four Mandatory Pillars Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            The Four Pillars of LifeStack
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Architected as a unified, production-grade intelligence system built directly on your personal star-schema warehouse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              1. Data Visualization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Interactive multi-domain dashboards, composite Life Score™ gauges, category drill-downs, cross-filtering, and visual timeline correlations.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              2. Generative AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Grounded RAG retrieval copilot with verified citations, explicit confidence scores, anti-hallucination guardrails, and Web Speech voice input.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              3. Data Mining
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empirical anomaly detection (Isolation Forest), persona clustering (K-Means), association rules (Apriori), forecasting (Holt-Winters), and classification (Random Forest).
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="glass-panel p-6 rounded-2xl glow-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              4. Cloud Computing
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Containerized microservices, automated Bronze-Silver-Gold ETL pipelines, pgvector semantic indexing, and scheduled background workers.
            </p>
          </div>
        </div>
      </section>

      {/* Free Tier & Pricing Transparency */}
      <section className="glass-panel p-8 rounded-3xl glow-card max-w-3xl mx-auto text-center space-y-4">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
          Open Transparency
        </span>
        <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Free Local & Self-Hosted Tier Forever
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          LifeStack is built with 100% permissive open-source libraries (MIT). Run it locally with zero recurring subscription fees. Cloud managed storage options remain optional for enterprise teams.
        </p>
        <div className="flex justify-center gap-6 text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> DPDP 2023 Compliant</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Data Ownership</span>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-4">
        <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs">
          <div className="glass-panel p-4 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">How does LifeStack prevent AI hallucinations?</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Every answer is synthesized strictly from retrieved records in your personal data warehouse and certified public benchmarks. If relevant data is missing, the copilot explicitly refuses to guess and itemizes the exact data gap.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-xl space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Is my financial and biometric health data private?</h4>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes. All personal warehouse facts are strictly isolated per user. Cross-user benchmarking enforces k-anonymity (k ≥ 10), ensuring no individual record is ever visible to any other user.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
