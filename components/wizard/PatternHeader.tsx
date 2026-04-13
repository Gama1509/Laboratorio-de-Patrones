import React from 'react';
import { BookOpen } from 'lucide-react';
import { ThemeToggle } from '../theme/ThemeToggle';

interface Props {
  patternName: string;
}

export function PatternHeader({ patternName }: Props) {
  return (
    <div className="sticky top-0 z-50 w-full mb-6 relative">
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b dark:border-slate-800 shadow-sm transition-colors duration-300"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-center gap-3">
        <BookOpen className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent flex-1 text-center sm:flex-none">
          Patrón Actual: <span className="text-indigo-600 dark:text-indigo-400 ml-1">{patternName}</span>
        </h1>
        <div className="absolute right-4 sm:right-6">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
