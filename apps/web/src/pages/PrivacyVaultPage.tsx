import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const PrivacyVaultPage: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useStore();
  const [consents, setConsents] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadPrivacyData();
  }, []);

  const loadPrivacyData = async () => {
    try {
      const [cRes, aRes] = await Promise.all([
        api.getConsents(),
        api.getAuditLog()
      ]);
      setConsents(cRes?.consents || []);
      setAuditLogs(aRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleConsent = (category: string) => {
    setConsents(prev =>
      prev.map(c =>
        c.category === category ? { ...c, consent_granted: !c.consent_granted } : c
      )
    );
  };

  const handleSaveConsents = async () => {
    try {
      await api.updateConsents(consents);
      setSaveStatus('Consents successfully updated and recorded in the immutable audit log.');
      setTimeout(() => setSaveStatus(null), 4000);
      loadPrivacyData();
    } catch (e) {
      alert('Failed to update consent preferences.');
    }
  };

  const handleExportData = async (format: 'json' | 'csv') => {
    const data = await api.getExportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeStack_Data_Inventory_${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      alert('All personal data and warehouse records have been permanently erased.');
      logout();
      window.location.href = '/';
    } catch (e) {
      alert('Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-emerald-500" />
          Privacy Vault & Consent Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Built in accordance with India's Digital Personal Data Protection (DPDP) Act 2023 and GDPR. You maintain complete control over your personal data.
        </p>
      </div>

      {saveStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Granular Consent Toggles */}
      <div className="glass-panel p-6 rounded-2xl glow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-500" />
              Granular Purpose-Specific Consent Toggles
            </h3>
            <p className="text-xs text-slate-500">
              Revoking consent immediately excludes corresponding fact tables from data mining and copilot retrieval.
            </p>
          </div>
          <button
            id="btn-save-consents"
            onClick={handleSaveConsents}
            className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-glow-indigo transition-all"
          >
            Save Preferences
          </button>
        </div>

        <div className="space-y-3">
          {consents.map(c => (
            <div
              key={c.category}
              className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 dark:text-white capitalize block text-sm">
                  {c.category.replace('_', ' ')}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{c.purpose}</span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={c.consent_granted}
                  onChange={() => handleToggleConsent(c.category)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Export & Right-to-be-Forgotten Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-500" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Data Portability & Export
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Download your complete personal data inventory, star-schema fact rows, decision journal history, and audit trails in open structured formats.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleExportData('json')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Export JSON Package
            </button>
            <button
              onClick={() => handleExportData('csv')}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              Export CSV Package
            </button>
          </div>
        </div>

        {/* Right-to-be-Forgotten Deletion Card */}
        <div className="glass-panel p-5 rounded-2xl glow-card space-y-3 border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-500">
            <Trash2 className="w-5 h-5" />
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Right to Erasure (Delete Account)
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Permanently delete your account, dimension records, star-schema facts, vector embeddings, and all session logs. This action is irreversible.
          </p>
          <div className="pt-2">
            <button
              id="btn-delete-account"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold transition-all border border-rose-500/20"
            >
              Delete My Account & All Warehouse Data
            </button>
          </div>
        </div>
      </div>

      {/* Access Audit Trail Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Recent Data Access Audit Log</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Timestamp (UTC)</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Resource</th>
                <th className="px-5 py-3">Client / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {auditLogs.map((log, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-2.5 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-2.5 font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {log.action.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 font-mono text-[11px]">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-slate-500 font-mono text-[11px]">
                    {JSON.stringify(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-rose-500/40 space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Confirm Permanent Account Erasure
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure? This will irrevocably delete all 1,090 days of transactions, biometric sleep logs, goal records, and vector embeddings in the warehouse.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
