"use client";
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface HomeScreenProps {
  onStart: (name: string) => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-orange-500 pb-2">
          Laboratorio de Patrones
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Aprende y pon a prueba tus conocimientos sobre patrones de diseño de software: Adapter, Bridge y Composite.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-left">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ingresa tu nombre para comenzar:
          </label>
          <input
            type="text"
            id="name"
            required
            autoComplete="off"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white dark:bg-slate-950 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <Button
          type="submit"
          disabled={name.trim().length === 0}
          className="w-full h-12 text-lg"
        >
          ¡Comenzar Experiencia!
        </Button>
      </form>
    </Card>
  );
}
