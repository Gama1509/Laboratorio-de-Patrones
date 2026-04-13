import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from './Card';

interface TimerProps {
  initialSeconds: number;
  onTimeout: () => void;
  className?: string;
}

export function Timer({ initialSeconds, onTimeout, className }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeout]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const isWarning = seconds <= 30;

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-lg font-bold transition-colors",
      isWarning ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse" : "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      className
    )}>
      <Clock className="w-5 h-5" />
      <span>{mins}:{secs.toString().padStart(2, '0')}</span>
    </div>
  );
}
