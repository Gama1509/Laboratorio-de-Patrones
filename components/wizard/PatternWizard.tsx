'use client'
import React, { useState, useEffect } from 'react';
import { patternsData, Language } from '../../data/patterns';
import { ConceptScreen, DetailScreen, ContextScreen, PseudoScreen } from './TheoryScreens';
import { LanguageSelectScreen } from './LanguageSelectScreen';
import { ExerciseScreen } from './ExerciseScreen';
import Swal from 'sweetalert2';
import { FinalScreen } from './FinalScreen';
import { PatternHeader } from './PatternHeader';

type StepType = 'concept' | 'details' | 'theory' | 'pseudo' | 'language' | 'exercise' | 'final';

interface Props {
  userName: string;
}

export function PatternWizard({ userName }: Props) {
  const [patternIndex, setPatternIndex] = useState(0);
  const [stepType, setStepType] = useState<StepType>('concept');
  const [language, setLanguage] = useState<Language>('Java');
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on every screen change (step or pattern).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stepType, patternIndex]);

  const pattern = patternsData[patternIndex];
  const totalSteps = 6;

  const handleNextStep = () => {
    switch(stepType) {
      case 'concept': setStepType('details'); break;
      case 'details': setStepType('theory'); break;
      case 'theory': setStepType('pseudo'); break;
      case 'pseudo': setStepType('language'); break;
      case 'language': setStepType('exercise'); break;
    }
  };

  const handlePrevStep = () => {
    switch(stepType) {
      case 'details': setStepType('concept'); break;
      case 'theory': setStepType('details'); break;
      case 'pseudo': setStepType('theory'); break;
      case 'language': setStepType('pseudo'); break;
      case 'exercise': setStepType('language'); break;
    }
  };

  const handleExerciseComplete = async (score: number, correct: number, total: number) => {
    const newTotalScore = totalScore + score;
    setTotalScore(newTotalScore);

    await Swal.fire({
      title: score === 100 ? '¡Excelente!' : (score > 50 ? '¡Buen trabajo!' : 'Sigue practicando'),
      text: `Obtuviste ${correct} de ${total} bloques correctos en el patrón ${pattern.name}.`,
      icon: score === 100 ? 'success' : (score > 50 ? 'info' : 'warning'),
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#2563EB',
    });

    if (patternIndex < patternsData.length - 1) {
      setPatternIndex(patternIndex + 1);
      setStepType('concept');
    } else {
      setStepType('final');
      submitScore(newTotalScore);
    }
  };

  const submitScore = async (finalScore: number) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: userName, score: parseFloat(finalScore.toFixed(2)) }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (stepType === 'final') {
    return <FinalScreen score={totalScore} isSubmitting={isSubmitting} />;
  }

  return (
    <div className="w-full animation-fade-in pb-10">
      <PatternHeader patternName={pattern.name} />
      {stepType === 'concept' && (
        <ConceptScreen 
          pattern={pattern} 
          step={1} 
          totalSteps={totalSteps} 
          onNext={handleNextStep} 
        />
      )}
      {stepType === 'details' && (
        <DetailScreen 
          pattern={pattern} 
          step={2} 
          totalSteps={totalSteps} 
          onNext={handleNextStep} 
          onPrev={handlePrevStep}
        />
      )}
      {stepType === 'theory' && (
        <ContextScreen 
          pattern={pattern} 
          step={3} 
          totalSteps={totalSteps} 
          onNext={handleNextStep} 
          onPrev={handlePrevStep}
        />
      )}
      {stepType === 'pseudo' && (
        <PseudoScreen 
          pattern={pattern} 
          step={4} 
          totalSteps={totalSteps} 
          onNext={handleNextStep} 
          onPrev={handlePrevStep}
        />
      )}
      {stepType === 'language' && (
        <LanguageSelectScreen 
          step={5}
          totalSteps={totalSteps}
          onSelect={(lang) => { setLanguage(lang); handleNextStep(); }} 
          onPrev={handlePrevStep}
        />
      )}
      {stepType === 'exercise' && (
        <ExerciseScreen 
          exercise={pattern.exercises[language]} 
          onComplete={handleExerciseComplete} 
          step={6}
          totalSteps={totalSteps}
        />
      )}
    </div>
  );
}
