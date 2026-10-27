import React from 'react';
import { Server, Activity, Database, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const AdminPage: React.FC = () => {
  const pipelines = [
    { name: 'Bronze-to-Silver ETL Cleaning', status: 'Healthy', lastRun: '12 min ago', duration: '1.2s' },
    { name: 'Silver-to-Gold Fact Aggregation', status: 'Healthy', lastRun: '12 min ago', duration: '2.4s' },
    { name: 'Isolation Forest Anomaly Scan', status: 'Active', lastRun: '1 hour ago', duration: '4.8s' },
    { name: 'K-Means Persona Segmentation (k=4)', status: 'Active', lastRun: '6 hours ago', duration: '3.1s' },
    { name: 'Vector Store Sync (768-dim Embeddings)', status: 'Active', lastRun: 'Just now', duration: '0.8s' },
  ];

  const models = [
    { id: 'mod_1', name: 'Isolation Forest (Spending Outliers)', version: 'v2.1', accuracy: '3.8σ boundary', status: 'Production' },
    { id: 'mod_2', name: 'K-Means Persona Archetypes', version: 'v1.4', accuracy: 'Silhouette 0.44', status: 'Production' },
    { id: 'mod_3', name: 'Random Forest Goal Predictor', version: 'v3.0', accuracy: 'ROC-AUC 0.91', status: 'Production' },
    { id: 'mod_4', name: 'Grounded RAG Retriever (HNSW Cosine)', version: 'v1.0', accuracy: '100% Grounded', status: 'Production' },
  ];

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Server className="w-7 h-7 text-brand-500" />
          Admin & Data Architecture Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor scheduled ETL pipelines, data quality checks, and production machine learning model registries.
        </p>
      </div>

      {/* Pipeline Status Cards */}
      <div className="glass-panel rounded-2xl overflow-hidden p-5 space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          Scheduled Warehouse Pipelines
        </h3>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {pipelines.map((p, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm block">{p.name}</span>
                <span className="text-slate-400">Last executed: {p.lastRun} (Runtime: {p.duration})</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Registry */}
      <div className="glass-panel rounded-2xl overflow-hidden p-5 space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-4 h-4 text-brand-500" />
          Production Model Registry & Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-4 py-2.5">Model Name</th>
                <th className="px-4 py-2.5">Version</th>
                <th className="px-4 py-2.5">Evaluation Metric</th>
                <th className="px-4 py-2.5">Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{m.name}</td>
                  <td className="px-4 py-2.5 font-mono text-slate-400">{m.version}</td>
                  <td className="px-4 py-2.5 font-semibold text-emerald-500">{m.accuracy}</td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 font-bold">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
