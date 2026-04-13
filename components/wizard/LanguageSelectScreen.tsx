import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Language } from '../../data/patterns';

import { ProgressBar } from './ProgressBar';

interface Props {
  onSelect: (lang: Language) => void;
  step: number;
  totalSteps: number;
  onPrev?: () => void;
}

const languages: Language[] = ['Java', 'Python', 'C++', 'C'];

export function LanguageSelectScreen({ onSelect, step, totalSteps, onPrev }: Props) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSelect = async (lang: Language) => {
    setIsConfirming(true);
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Elige este lenguaje para continuar. No podrás cambiarlo después.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563EB',
    });

    if (result.isConfirmed) {
      onSelect(lang);
    } else {
      setIsConfirming(false);
    }
  };

  return (
    <Card className="max-w-xl w-full mx-auto text-center space-y-6">
      <ProgressBar step={step} totalSteps={totalSteps} />
      <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Selecciona tu Lenguaje</h2>
      <p className="text-slate-600 dark:text-slate-400">Elige el lenguaje de programación para el siguiente ejercicio práctico.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {languages.map(lang => (
          <Button
            key={lang}
            variant="outline"
            className="h-16 text-xl hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSelect(lang)}
            disabled={isConfirming}
          >
            {lang}
          </Button>
        ))}
      </div>
      
      {onPrev && (
        <div className="mt-10 pt-6 flex justify-start items-center border-t border-slate-100/60 dark:border-slate-800">
          <Button onClick={onPrev} size="lg" variant="outline" className="w-full sm:w-auto" disabled={isConfirming}>
            Anterior
          </Button>
        </div>
      )}
    </Card>
  );
}
