"use client";

import { useState } from 'react';
import { HomeScreen } from '../components/wizard/HomeScreen';
import { PatternWizard } from '../components/wizard/PatternWizard';
import { ThemeToggle } from '../components/theme/ThemeToggle';

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex items-center justify-center p-4 py-12">
      {/* Toggle global: siempre visible en todas las pantallas */}
      {!userName && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}
      <div className="w-full max-w-7xl mx-auto">
        {!userName ? (
          <HomeScreen onStart={setUserName} />
        ) : (
          <PatternWizard userName={userName} />
        )}
      </div>
    </main>
  );
}
