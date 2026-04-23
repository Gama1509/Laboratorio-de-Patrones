import React from 'react';
import { Card } from '../ui/Card';
import { patternsData } from '../../data/patterns';
import { Button } from '../ui/Button';

interface FinalScreenProps {
  score: number;
  isSubmitting: boolean;
}

export function FinalScreen({ score, isSubmitting }: FinalScreenProps) {
  const maxPossibleScore = patternsData.length * 100;
  // Calculate average out of 100 for display or just show total out of 300
  const finalScoreDisplay = score.toFixed(1);

  return (
    <Card className="max-w-3xl w-full mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">¡Felicidades!</h2>
        <p className="text-xl text-slate-600 dark:text-slate-300">Has completado el Laboratorio de Patrones.</p>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-2xl border border-blue-100 dark:border-slate-800 my-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Puntuación Final</p>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 mt-2">
            {finalScoreDisplay} <span className="text-2xl text-slate-400">/ {maxPossibleScore}</span>
          </div>
        </div>

        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-8 pt-4">
          ¡Gracias por participar!
        </p>

        {isSubmitting && (
          <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse mt-2">
            Guardando tus resultados...
          </p>
        )}
      </div>

      <div className="pt-6 text-center border-t dark:border-slate-800">
        <Button
          onClick={() => window.location.reload()}
          variant="primary"
          size="lg"
          disabled={isSubmitting}
        >
          Volver a Jugar
        </Button>
      </div>
    </Card>
  );
}

