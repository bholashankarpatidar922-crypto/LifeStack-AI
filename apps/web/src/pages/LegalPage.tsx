import React from 'react';
import { ShieldCheck, AlertCircle, Scale, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Scale className="w-7 h-7 text-brand-500" />
          Legal Terms, Privacy Policy & Disclaimers
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Last updated: October 2026. Aligned with India's DPDP Act 2023 and GDPR guidelines.
        </p>
      </div>

      {/* Mandatory Non-Advice Disclaimer */}
      <div className="p-6 rounded-2xl border-2 border-amber-500/40 bg-amber-500/5 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>Mandatory Disclaimer: Not Professional Financial, Medical, or Legal Advice</span>
        </div>
        <p className="leading-relaxed">
          LifeStack is an empirical decision intelligence platform designed for statistical pattern exploration, simulation, and academic/personal planning. The platform, its automated algorithms, and its Generative AI Copilot do not provide certified professional financial, investment, accounting, medical, psychiatric, or legal advice.
        </p>
        <p className="leading-relaxed">
          Always consult with licensed independent professionals (such as a SEBI-registered investment advisor or licensed medical practitioner) before executing significant financial commitments, investments, or health interventions.
        </p>
      </div>

      {/* Privacy Policy Aligned with DPDP Act 2023 */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          Privacy Policy & DPDP Act 2023 Principles
        </h2>
        <div className="space-y-3 leading-relaxed">
          <p>
            <strong>1. Purpose Limitation:</strong> Your data is ingested and processed solely for the purposes explicitly consented to in the Privacy Vault (spending analysis, health vital correlations, placement forecasting, and decision modeling).
          </p>
          <p>
            <strong>2. Data Minimization:</strong> We do not track third-party analytics cookies or sell your personal data. All processing occurs within your dedicated database schema or local environment.
          </p>
          <p>
            <strong>3. k-Anonymity for Peer Benchmarking:</strong> When comparing metrics across populations, we enforce a strict mathematical threshold of $k \ge 10$. If fewer than 10 peer profiles exist in a demographic slice, benchmarking is suppressed.
          </p>
          <p>
            <strong>4. Right to Erasure & Portability:</strong> You may download your entire structured data inventory (JSON/CSV) or trigger an irreversible permanent deletion of your account and all associated fact tables at any time from the Privacy Vault.
          </p>
        </div>
      </div>

      {/* Open Source Licenses & Brand Notice */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-500" />
          Intellectual Property & Open Source Licenses
        </h2>
        <div className="space-y-2 leading-relaxed">
          <p>
            LifeStack is released under the permissive <strong>MIT License</strong>. All underlying software libraries (FastAPI, React, Tailwind CSS, Scikit-learn, Recharts, Lucide Icons) are licensed under permissive open-source licenses (MIT, Apache-2.0, BSD, OFL).
          </p>
          <p className="text-slate-500">
            For the complete third-party license registry, please review <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">THIRD_PARTY_NOTICES.md</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
