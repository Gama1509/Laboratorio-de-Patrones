"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface UserScore {
  id: number;
  nombre: string;
  score: number;
  fecha: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === '123') {
      setIsAuthenticated(true);
      loadScores();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const loadScores = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ranking');
      const data = await res.json();
      setScores(data);
    } catch {
      console.error("Error al cargar scores.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
        <Card className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Ingresa la contraseña para acceder</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Contraseña"
                required
              />
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-12 transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Scores Registrados</h1>
          <Button onClick={loadScores} variant="outline" size="sm">Actualizar</Button>
        </div>
        
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider border-b dark:border-slate-700">
                    <th className="p-4 font-semibold">Lugar</th>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s, index) => (
                    <tr key={s.id} className="border-b dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-base font-bold">{index + 1}</td>
                      <td className="p-4 font-medium text-slate-800 dark:text-slate-200">{s.nombre}</td>
                      <td className="p-4 font-bold text-blue-600 dark:text-blue-400">{Number(s.score).toFixed(2)}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 text-sm">
                        {new Date(s.fecha).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {scores.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500 dark:text-slate-400 italic">No hay puntajes registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
