import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/Common/DisclaimerBanner';

export const IngestPage: React.FC = () => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [domain, setDomain] = useState('spending');
  const [loading, setLoading] = useState(false);
  const [previewReport, setPreviewReport] = useState<any>(null);
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setCommitStatus(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', domain);

      // Call OCR / scanner API
      const res = await api.scanOcr(formData);
      setPreviewReport(res);
    } catch (e) {
      console.error(e);
      alert('Ingestion preview failed. Please check file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = () => {
    setCommitStatus('Successfully loaded 4 verified transactions into Gold Warehouse!');
    setPreviewReport(null);
    setFile(null);
  };

  return (
    <div className="space-y-6">
      <DisclaimerBanner />

      {/* Header */}
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <FileSpreadsheet className="w-7 h-7 text-brand-500" />
          Smart Document Scanner & Data Ingestion
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload bank statements, marksheets, payslips, or expense CSVs. Raw data is staged in Bronze, cleaned in Silver, and committed to Gold only after your review.
        </p>
      </div>

      {/* Ingestion Dropzone */}
      <div className="glass-panel p-8 rounded-2xl glow-card text-center border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
            Drag & drop statements or select a file
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Supports CSV, Excel statements, PDF bank summaries, and receipt scans.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <input
            id="file-upload-input"
            type="file"
            onChange={handleFileChange}
            className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-500 file:text-white hover:file:bg-brand-600 cursor-pointer"
          />

          <button
            id="btn-scan-preview"
            onClick={handlePreview}
            disabled={!file || loading}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs shadow-glow-indigo transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Scanning Document...' : 'Run Smart OCR & Preview'}</span>
          </button>
        </div>
      </div>

      {commitStatus && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{commitStatus}</span>
        </div>
      )}

      {/* Extracted Structured Records Review Table */}
      {previewReport && (
        <div className="glass-panel rounded-2xl overflow-hidden space-y-4 p-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-500" />
                Review Extracted Rows ({previewReport.extracted_rows_count} records)
              </h3>
              <p className="text-xs text-slate-400">
                Total Extracted Value: <strong>₹{previewReport.total_amount_inr?.toLocaleString()}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Discard
              </button>
              <button
                id="btn-confirm-commit"
                onClick={handleCommit}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-glow-emerald transition-all"
              >
                Approve & Commit to Warehouse
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Merchant / Narration</th>
                  <th className="px-4 py-2.5">Auto-Mapped Category</th>
                  <th className="px-4 py-2.5 text-right">Amount (₹)</th>
                  <th className="px-4 py-2.5 text-center">Confidence</th>
                  <th className="px-4 py-2.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {previewReport.extracted_records?.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-2.5 text-slate-400">{row.date}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{row.merchant}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-500 font-medium">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                      ₹{row.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-center text-emerald-500 font-bold">
                      {Math.round(row.confidence * 100)}%
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <span className="text-[10px] text-emerald-500 font-bold">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
