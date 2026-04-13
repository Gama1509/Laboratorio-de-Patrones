import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-blue-50/50 dark:border-slate-700 p-6 md:p-8 animate-in fade-in zoom-in-95 duration-500 transition-colors",
        className
      )}
    >
      {children}
    </div>
  );
}
