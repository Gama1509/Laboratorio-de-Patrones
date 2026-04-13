import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface InfoScreenProps {
  title: string;
  content: string;
  image?: string;
  buttonText?: string;
  onNext: () => void;
}

export function InfoScreen({ title, content, image, buttonText = "Siguiente", onNext }: InfoScreenProps) {
  return (
    <Card className="max-w-2xl w-full mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-slate-800 border-b pb-4">{title}</h2>
      
      <div className="text-slate-600 text-lg leading-relaxed space-y-4">
        <p>{content}</p>
        
        {image && (
          <div className="mt-6 p-4 bg-slate-100 rounded-xl flex items-center justify-center italic text-sm text-slate-500">
            [Ilustración: {image}]
          </div>
        )}
      </div>

      <div className="pt-6 flex justify-end">
        <Button onClick={onNext} size="lg">{buttonText}</Button>
      </div>
    </Card>
  );
}
