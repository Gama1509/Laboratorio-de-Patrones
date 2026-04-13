import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { patternsData } from '../../data/patterns';
import { Button } from '../ui/Button';

interface FinalScreenProps {
  score: number;
  isSubmitting: boolean;
}

interface RankingUser {
  id: number;
  nombre: string;
  score: number;
}

export function FinalScreen({ score, isSubmitting }: FinalScreenProps) {
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  const maxPossibleScore = patternsData.length * 100;
  // Calculate average out of 100 for display or just show total out of 300
  const finalScoreDisplay = score.toFixed(1);

  useEffect(() => {
    if (!isSubmitting) {
      fetch('/api/ranking')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRanking(data);
          } else {
            console.error('Ranking API returned non-array data:', data);
            setRanking([]);
          }
          setLoadingRanking(false);
        })
        .catch(() => {
          setRanking([]);
          setLoadingRanking(false);
        });
    }
  }, [isSubmitting]);

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
      </div>

      <div className="mt-8 border-t dark:border-slate-800 pt-8">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center mb-6">Ranking Global</h3>
        
        {loadingRanking || isSubmitting ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider border-b dark:border-slate-800">
                  <th className="p-4 font-semibold">Pos.</th>
                  <th className="p-4 font-semibold">Nombre</th>
                  <th className="p-4 font-semibold text-right">Puntuación</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(ranking) && ranking.map((user, idx) => (
                  <tr key={user.id} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-400 dark:text-slate-500">#{idx + 1}</td>
                    <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{user.nombre}</td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400 text-right">{Number(user.score).toFixed(1)}</td>
                  </tr>
                ))}
                {ranking.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-slate-500 italic">No hay puntajes aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="pt-6 text-center">
        <Button onClick={() => window.location.reload()} variant="primary" size="lg">
          Volver a Jugar
        </Button>
      </div>
    </Card>
  );
}
