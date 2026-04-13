import React from 'react';

interface Props {
  step: number;
  totalSteps: number;
}

export function ProgressBar({ step, totalSteps }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
        Paso {step} de {totalSteps}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i + 1 === step 
                ? 'w-6 bg-blue-600 dark:bg-blue-500' 
                : i + 1 < step 
                  ? 'w-2 bg-blue-400 dark:bg-blue-400/80' 
                  : 'w-2 bg-slate-200 dark:bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
