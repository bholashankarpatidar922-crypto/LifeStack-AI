import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  className?: string;
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ className = '', compact = false }) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-amber-500/90 dark:text-amber-400/90 ${className}`}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Statistical decision intelligence only — not certified financial, medical, or legal advice.</span>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5 ${className}`}>
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
      <div>
        <span className="font-semibold">Notice & Decision Intelligence Disclaimer: </span>
        <span>
          LifeStack provides empirical pattern mining and grounded decision modeling for educational and planning purposes only. Outputs do not constitute certified professional financial, investment, medical, or legal advice.
        </span>
      </div>
    </div>
  );
};
