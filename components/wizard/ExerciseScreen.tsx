import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { DndContext, useDraggable, useDroppable, DragEndEvent } from '@dnd-kit/core';
import { ExerciseData, Block } from '../../data/patterns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer } from '../ui/Timer';
import { cn } from '../ui/Card';
import { ProgressBar } from './ProgressBar';

function DraggableBlock({ block, disabled }: { block: Block, disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
    data: block,
    disabled
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn("bg-slate-900 dark:bg-[#1e1e1e] border-2 border-indigo-200 dark:border-slate-700 p-3 rounded-lg font-mono text-[14px] shadow-sm transition-shadow text-slate-100 w-full break-words whitespace-pre-wrap overflow-hidden box-border", disabled ? "opacity-50 cursor-not-allowed" : "cursor-grab active:cursor-grabbing hover:border-indigo-400 dark:hover:border-slate-500")}
    >
      <span dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(block.content) }} className="block w-full break-words" />
    </div>
  );
}

function DropzoneNode({ id, currentBlock, expectedBlock, hasSubmitted, onRemove }: { id: string, currentBlock?: Block, expectedBlock: Block, hasSubmitted: boolean, onRemove?: () => void }) {
  const { isOver, setNodeRef } = useDroppable({ id, disabled: hasSubmitted });
  const isCorrect = currentBlock?.id === expectedBlock.id;
  const showFeedback = hasSubmitted;

  if (currentBlock) {
    return (
      <div className="inline-flex flex-col items-start align-top mx-1 mb-2">
        <div className="flex gap-2 items-center">
          <span 
            className={cn(
               "inline-block border-2 text-slate-100 rounded px-2 py-0.5 font-mono text-[13px] sm:text-[14px] shadow-sm transition-colors max-w-[100%] break-words whitespace-normal align-middle shrink-0",
               showFeedback 
                 ? (isCorrect ? "bg-green-800/80 border-green-500" : "bg-red-800/80 border-red-500 opacity-70 line-through")
                 : "bg-slate-800 dark:bg-[#252525] border-indigo-400 dark:border-slate-600 cursor-pointer hover:bg-slate-700 dark:hover:bg-[#333]"
            )} 
            onClick={showFeedback ? undefined : onRemove} 
            title={showFeedback ? undefined : "Click para regresar el bloque"}
            dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(currentBlock.content) }}
          />
          {showFeedback && (
            <span className={cn("text-[10px] sm:text-[11px] font-bold uppercase", isCorrect ? "text-green-500" : "text-red-500")}>
              {isCorrect ? "✓ Correcto" : "✗ Incorrecto"}
            </span>
          )}
        </div>
        {showFeedback && !isCorrect && (
          <div className="mt-1 text-xs text-slate-400 flex flex-col w-full">
            <span className="text-green-400 font-semibold mb-0.5">Solución:</span>
            <span className="inline-block bg-slate-800 dark:bg-[#252525] border-l-2 border-green-500 text-slate-100 rounded-r px-2 py-0.5" dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(expectedBlock.content) }} />
          </div>
        )}
      </div>
    );
  }

  // Si está vacío y ya se envió
  if (showFeedback) {
     return (
       <div className="inline-flex flex-col items-start align-top mx-1 mb-2">
          <div className="flex gap-2 items-center">
             <span className="inline-block min-w-[120px] max-w-[100%] sm:min-w-[140px] h-8 border-2 border-dashed rounded bg-slate-800 dark:bg-[#1e1e1e] border-red-500/70 text-red-400/80 flex items-center justify-center font-mono text-[12px] opacity-70 overflow-hidden text-ellipsis whitespace-nowrap px-2">
                (Vacío)
             </span>
             <span className="text-[10px] sm:text-[11px] font-bold uppercase text-red-500">✗ Incorrecto</span>
          </div>
          <div className="mt-1 text-xs text-slate-400 flex flex-col w-full">
             <span className="text-green-400 font-semibold mb-0.5">Solución:</span>
             <span className="inline-block bg-slate-800 dark:bg-[#252525] border-l-2 border-green-500 text-slate-100 rounded-r px-2 py-0.5" dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(expectedBlock.content) }} />
          </div>
       </div>
     )
  }

  return (
    <span
      ref={setNodeRef}
      className={cn(
        "inline-block min-w-[120px] max-w-full sm:min-w-[140px] h-8 mx-1 border-2 border-dashed rounded bg-slate-800/50 dark:bg-[#1a1b26] align-middle transition-colors",
        isOver ? "border-indigo-400 bg-indigo-900/50" : "border-slate-600 dark:border-slate-500"
      )}
    />
  );
}

const syntaxHighlightRealCode = (code: string) => {
  const lines = code.split('\n');
  const highlighted = lines.map(line => {
    let processed = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let codePart = processed;
    let commentPart = '';
    const commentMatch = processed.match(/(\/\/.*|#\s.*)/);
    if (commentMatch && commentMatch.index !== undefined) {
      codePart = processed.substring(0, commentMatch.index);
      commentPart = processed.substring(commentMatch.index);
    }
    
    const parts = codePart.split(/("[^"]*"|'[^']*')/g);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            parts[i] = parts[i]
                .replace(/\b(class|def|void|if|for|return|public|private|protected|interface|implements|extends|virtual|override|cout|printf|endl|pass|struct|typedef|char|int|string|String|System\.out\.println|print|cout)\b/g, '<span class="text-pink-400 font-bold">$1</span>')
                .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, (match, p1) => {
                     if (['String', 'System', 'DROPZONE'].includes(p1) || p1.startsWith('DROPZONE')) return match;
                     return `<span class="text-blue-400 font-bold">${p1}</span>`;
                })
                .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, p1) => {
                     if (['if', 'for', 'printf', 'print', 'sizeof', 'malloc'].includes(p1)) return `<span class="text-pink-400 font-bold">${p1}</span>`;
                     return `<span class="text-orange-400 font-medium">${p1}</span>`;
                })
                .replace(/\b(this|self)\b/g, '<span class="text-purple-400 font-semibold">$1</span>');
        } else {
            parts[i] = `<span class="text-red-400">${parts[i]}</span>`;
        }
    }
    codePart = parts.join('');
    
    if (commentPart) {
      codePart += `<span class="text-green-400 italic">${commentPart}</span>`;
    }
    
    return codePart;
  });
  
  return highlighted.join('\n');
};

interface Props {
  exercise: ExerciseData;
  onComplete: (score: number, correctBlocks: number, totalBlocks: number) => void;
  onPrev?: () => void;
  step: number;
  totalSteps: number;
}

export function ExerciseScreen({ exercise, onComplete, onPrev, step, totalSteps }: Props) {
  const [answers, setAnswers] = useState<Record<string, Block>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [scoreStats, setScoreStats] = useState({ correct: 0, total: 0 });
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);

  const [shuffledBlocks] = useState(() => 
    [...exercise.blocks].sort(() => Math.random() - 0.5)
  );
  
  const availableBlocks = shuffledBlocks.filter(b => !Object.values(answers).find(ans => ans.id === b.id));

  const handleDragEnd = (event: DragEndEvent) => {
    if (hasSubmitted) return;
    const { active, over } = event;
    if (over && over.id) {
      const dropzoneId = String(over.id);
      const block = active.data.current as Block;
      // Only set if dropzone is empty
      if (!answers[dropzoneId]) {
         setAnswers(prev => ({ ...prev, [dropzoneId]: block }));
      }
    }
  };

  const removeAnswer = (dropzoneId: string) => {
    if (hasSubmitted) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[dropzoneId];
      return next;
    });
  };

  const evaluate = () => {
    let correct = 0;
    const total = exercise.dropzones.length;
    exercise.dropzones.forEach(dz => {
      if (answers[dz.id]?.id === dz.expectedBlockId) {
        correct++;
      }
    });
    setScoreStats({ correct, total });
    setHasSubmitted(true);
  };

  const handleTimeout = () => {
    if (hasSubmitted) return;
    setTimeoutOccurred(true);
    evaluate();
  };

  const handlePreSubmit = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se evaluarán tus respuestas y no podrás modificarlas después.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar respuestas',
      cancelButtonText: 'Revisar más',
      confirmButtonColor: '#2563EB',
    });

    if (result.isConfirmed) {
      evaluate();
    }
  };

  const renderCode = () => {
    const parts = exercise.codeTemplate.split(/(\[DROPZONE_\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(DROPZONE_\d+)\]/);
      if (match) {
        const id = match[1];
        const dzConf = exercise.dropzones.find(d => d.id === id);
        const expectedBlock = exercise.blocks.find(b => b.id === dzConf?.expectedBlockId);
        
        return <DropzoneNode 
          key={i} 
          id={id} 
          currentBlock={answers[id]} 
          expectedBlock={expectedBlock!} 
          hasSubmitted={hasSubmitted}
          onRemove={() => removeAnswer(id)} 
        />;
      }
      return <span key={i} dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(part) }} />;
    });
  };

  return (
    <Card className="max-w-5xl w-full mx-auto flex flex-col gap-6 p-4 sm:p-6 mb-10">
      <ProgressBar step={step} totalSteps={totalSteps} />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b dark:border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Completa el Código</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Arrastra los bloques a los espacios vacíos.</p>
        </div>
        {hasSubmitted ? (
          <div className="flex flex-col gap-2 items-start sm:items-end w-full sm:w-auto mt-3 sm:mt-0">
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg text-indigo-800 dark:text-indigo-200 font-bold w-full sm:w-auto text-center shadow-sm">
              Resultado: {scoreStats.correct} de {scoreStats.total} correctas
            </div>
            {timeoutOccurred && (
              <span className="text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded border border-red-200 dark:border-red-900/50 w-full sm:w-auto text-center shadow-sm">
                Tiempo agotado. Se enviaron tus respuestas automáticamente.
              </span>
            )}
          </div>
        ) : (
          <Timer initialSeconds={120} onTimeout={handleTimeout} />
        )}
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#1e1e1e] text-[#d4d4d4] p-6 rounded-xl font-mono text-[15px] leading-loose shadow-inner overflow-x-auto whitespace-pre-wrap">
            {renderCode()}
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 min-h-[350px]">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-2 rounded shadow-sm border border-slate-100 dark:border-slate-700 text-center text-sm uppercase tracking-wider">
              Bloques Disponibles
            </h3>
            <div className="flex-1 flex flex-col gap-3 p-2">
              {availableBlocks.map(block => (
                <DraggableBlock key={block.id} block={block} disabled={hasSubmitted} />
              ))}
              {availableBlocks.length === 0 && (
                <div className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8 italic">No hay más bloques</div>
              )}
            </div>
            <div className="mt-auto pt-4 border-t dark:border-slate-800 flex flex-col gap-3">
               {hasSubmitted ? (
                 <Button onClick={() => onComplete((scoreStats.correct / scoreStats.total) * 100, scoreStats.correct, scoreStats.total)} className="w-full h-14 text-lg" variant="primary">
                   Continuar al Siguiente Patrón
                 </Button>
               ) : (
                 <Button onClick={handlePreSubmit} className="w-full h-14 text-lg" variant="secondary">Enviar Solución</Button>
               )}
               {onPrev && !hasSubmitted && (
                 <Button onClick={onPrev} className="w-full text-slate-500 dark:text-slate-400 font-semibold" variant="ghost">Anterior</Button>
               )}
            </div>
          </div>
        </div>
      </DndContext>
    </Card>
  );
}
