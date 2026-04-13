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
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        loadScores();
      } else {
        setError(data.error || 'Autenticación fallida');
      }
    } catch {
      setError('Error de conexión');
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
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">Ingresa la contraseña para acceder</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Contraseña"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800">Scores Registrados</h1>
          <Button onClick={loadScores} variant="outline" size="sm">Actualizar</Button>
        </div>
        
        <Card className="p-0 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Cargando datos...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider border-b">
                    <th className="p-4 font-semibold">ID</th>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold">Score</th>
                    <th className="p-4 font-semibold">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((s) => (
                    <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="p-4 text-slate-500 font-mono text-sm">#{s.id}</td>
                      <td className="p-4 font-medium text-slate-800">{s.nombre}</td>
                      <td className="p-4 font-bold text-blue-600">{Number(s.score).toFixed(2)}</td>
                      <td className="p-4 text-slate-500 text-sm">
                        {new Date(s.fecha).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {scores.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500 italic">No hay puntajes registrados.</td>
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
