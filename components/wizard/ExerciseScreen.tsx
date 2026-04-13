'use client';
import React, { useState, useCallback } from 'react';
import Swal from 'sweetalert2';
import { ExerciseData, Block } from '../../data/patterns';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Timer } from '../ui/Timer';
import { cn } from '../ui/Card';
import { ProgressBar } from './ProgressBar';

// ──────────────────────────────────────────────────────────────
// Syntax highlighter (unchanged)
// ──────────────────────────────────────────────────────────────
const syntaxHighlightRealCode = (code: string): string => {
  const lines = code.split('\n');
  const highlighted = lines.map(line => {
    let processed = line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
          .replace(
            /\b(class|def|void|if|for|return|public|private|protected|interface|implements|extends|virtual|override|cout|printf|endl|pass|struct|typedef|char|int|string|String|System\.out\.println|print|cout)\b/g,
            '<span class="text-pink-400 font-bold">$1</span>',
          )
          .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, (match, p1) => {
            if (['String', 'System', 'DROPZONE'].includes(p1) || p1.startsWith('DROPZONE'))
              return match;
            return `<span class="text-blue-400 font-bold">${p1}</span>`;
          })
          .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, p1) => {
            if (['if', 'for', 'printf', 'print', 'sizeof', 'malloc'].includes(p1))
              return `<span class="text-pink-400 font-bold">${p1}</span>`;
            return `<span class="text-orange-400 font-medium">${p1}</span>`;
          })
          .replace(/\b(this|self)\b/g, '<span class="text-purple-400 font-semibold">$1</span>');
      } else {
        parts[i] = `<span class="text-red-400">${parts[i]}</span>`;
      }
    }
    codePart = parts.join('');
    if (commentPart) codePart += `<span class="text-green-400 italic">${commentPart}</span>`;
    return codePart;
  });
  return highlighted.join('\n');
};

// ──────────────────────────────────────────────────────────────
// OptionBlock
// Renders a selectable block in the "Available blocks" panel.
// Click/tap → calls onOptionClick (pure selection).
// ──────────────────────────────────────────────────────────────
interface OptionBlockProps {
  block: Block;
  disabled: boolean;
  isSelected: boolean;
  /** Called when the user taps/clicks this block to select it. */
  onOptionClick: (block: Block) => void;
}

function OptionBlock({ block, disabled, isSelected, onOptionClick }: OptionBlockProps) {
  const handleClick = () => {
    if (disabled) return;
    onOptionClick(block);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      aria-pressed={isSelected}
      aria-label={`Bloque: ${block.content.trim().slice(0, 40)}`}
      className={cn(
        'bg-slate-900 dark:bg-[#1e1e1e] border-2 p-3 rounded-lg font-mono text-[14px]',
        'shadow-sm transition-all text-slate-100 w-full break-words whitespace-pre-wrap',
        'overflow-hidden box-border select-none',
        disabled
          ? 'opacity-50 cursor-not-allowed border-indigo-200 dark:border-slate-700'
          : isSelected
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 bg-slate-800 dark:bg-[#2a2a1a] cursor-pointer scale-[1.02] shadow-yellow-400/20 shadow-lg'
            : 'cursor-pointer border-indigo-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-slate-500',
      )}
    >
      <span
        className="block w-full break-words pointer-events-none"
        dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(block.content) }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// DropzoneNode
// Renders an inline dropzone inside the code template.
// Click/tap → calls onDropzoneClick (placement happens here ONLY).
// ──────────────────────────────────────────────────────────────
interface DropzoneNodeProps {
  id: string;
  currentBlock?: Block;
  expectedBlock: Block;
  hasSubmitted: boolean;
  hasSelectedOption: boolean;
  /** Called when the user taps/clicks this dropzone to place the selected option. */
  onDropzoneClick: (dropzoneId: string) => void;
}

function DropzoneNode({
  id,
  currentBlock,
  expectedBlock,
  hasSubmitted,
  hasSelectedOption,
  onDropzoneClick,
}: DropzoneNodeProps) {
  const isCorrect = currentBlock?.id === expectedBlock.id;
  const showFeedback = hasSubmitted;

  const handleClick = () => {
    if (hasSubmitted) return;
    onDropzoneClick(id);
  };

  // ── Filled dropzone ────────────────────────────────────────
  if (currentBlock) {
    return (
      <span className="inline-flex flex-col items-start align-top mx-1 mb-2">
        <span className="flex gap-2 items-center flex-wrap">
          <span
            role={showFeedback ? undefined : 'button'}
            onClick={handleClick}
            className={cn(
              'inline-block border-2 text-slate-100 rounded px-2 py-0.5',
              'font-mono text-[13px] sm:text-[14px] shadow-sm transition-colors',
              'break-words whitespace-pre-wrap align-middle shrink-0 max-w-[220px] overflow-x-auto select-none',
              showFeedback
                ? isCorrect
                  ? 'bg-green-800/80 border-green-500 cursor-default'
                  : 'bg-red-800/80 border-red-500 opacity-70 line-through cursor-default'
                : hasSelectedOption
                  ? 'bg-slate-700 dark:bg-[#2a2a1a] border-yellow-400 cursor-pointer hover:brightness-110'
                  : 'bg-slate-800 dark:bg-[#252525] border-indigo-400 dark:border-slate-600 cursor-pointer hover:bg-slate-700 dark:hover:bg-[#333]',
            )}
            title={
              showFeedback
                ? undefined
                : hasSelectedOption
                  ? 'Toca para reemplazar con el bloque seleccionado'
                  : 'Toca para quitar este bloque'
            }
            dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(currentBlock.content) }}
          />
          {showFeedback && (
            <span
              className={cn(
                'text-[10px] sm:text-[11px] font-bold uppercase shrink-0',
                isCorrect ? 'text-green-500' : 'text-red-500',
              )}
            >
              {isCorrect ? '✓ Correcto' : '✗ Incorrecto'}
            </span>
          )}
        </span>
        {showFeedback && !isCorrect && (
          <span className="mt-1 text-xs text-slate-400 flex flex-col w-full">
            <span className="text-green-400 font-semibold mb-0.5">Solución:</span>
            <span
              className="inline-block bg-slate-800 dark:bg-[#252525] border-l-2 border-green-500 text-slate-100 rounded-r px-2 py-0.5 break-words whitespace-pre-wrap overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(expectedBlock.content) }}
            />
          </span>
        )}
      </span>
    );
  }

  // ── Submitted & empty dropzone ───────────────────────────────
  if (showFeedback) {
    return (
      <span className="inline-flex flex-col items-start align-top mx-1 mb-2">
        <span className="flex gap-2 items-center">
          <span className="inline-block min-w-[120px] sm:min-w-[140px] h-8 border-2 border-dashed rounded bg-slate-800 dark:bg-[#1e1e1e] border-red-500/70 text-red-400/80 flex items-center justify-center font-mono text-[12px] opacity-70 overflow-hidden text-ellipsis whitespace-nowrap px-2">
            (Vacío)
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold uppercase text-red-500 shrink-0">
            ✗ Incorrecto
          </span>
        </span>
        <span className="mt-1 text-xs text-slate-400 flex flex-col w-full">
          <span className="text-green-400 font-semibold mb-0.5">Solución:</span>
          <span
            className="inline-block bg-slate-800 dark:bg-[#252525] border-l-2 border-green-500 text-slate-100 rounded-r px-2 py-0.5 break-words whitespace-pre-wrap overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(expectedBlock.content) }}
          />
        </span>
      </span>
    );
  }

  // ── Empty, awaiting placement ────────────────────────────────
  return (
    <span
      role="button"
      aria-label="Espacio vacío, toca para colocar el bloque seleccionado"
      onClick={handleClick}
      className={cn(
        'inline-block min-w-[120px] sm:min-w-[140px] h-8 mx-1 border-2 border-dashed rounded',
        'bg-slate-800/50 dark:bg-[#1a1b26] align-middle transition-all select-none',
        hasSelectedOption
          ? 'border-yellow-400 bg-yellow-900/20 cursor-pointer hover:bg-yellow-800/30 animate-pulse'
          : 'border-slate-600 dark:border-slate-500',
      )}
      title={hasSelectedOption ? 'Toca para colocar aquí' : undefined}
    />
  );
}

// ──────────────────────────────────────────────────────────────
// ExerciseScreen
// ──────────────────────────────────────────────────────────────
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

  /** The currently selected option. null = nothing selected. */
  const [selectedOption, setSelectedOption] = useState<Block | null>(null);

  const [shuffledBlocks] = useState(() =>
    [...exercise.blocks].sort(() => Math.random() - 0.5),
  );

  /** Blocks that have not yet been placed in any dropzone. */
  const availableBlocks = shuffledBlocks.filter(
    b => !Object.values(answers).find(ans => ans.id === b.id),
  );

  // ── Step 1: Select an option ─────────────────────────────────
  /**
   * Selects or deselects a block.
   * Nothing is placed here — placement only happens in handleDropzoneClick.
   */
  const handleOptionClick = useCallback(
    (block: Block) => {
      if (hasSubmitted) return;
      // Toggle: clicking the already-selected block deselects it.
      setSelectedOption(prev => (prev?.id === block.id ? null : block));
    },
    [hasSubmitted],
  );

  // ── Step 2: Place the selected option into a dropzone ─────────
  /**
   * The ONLY place where an option is assigned to a dropzone.
   * - If selectedOption is null → nothing happens.
   * - If dropzone already has a block → it is replaced.
   * - If no option selected AND dropzone has content → content is removed (unplace).
   */
  const handleDropzoneClick = useCallback(
    (dropzoneId: string) => {
      if (hasSubmitted) return;

      if (!selectedOption) {
        // No option selected: clicking a filled dropzone removes its block.
        setAnswers(prev => {
          if (!prev[dropzoneId]) return prev;
          const next = { ...prev };
          delete next[dropzoneId];
          return next;
        });
        return;
      }

      // Place selectedOption into dropzoneId (replaces any existing block).
      setAnswers(prev => {
        const next = { ...prev };
        // Free the option from a previous dropzone, if it was already placed.
        const prevDropzone = Object.keys(next).find(k => next[k].id === selectedOption.id);
        if (prevDropzone) delete next[prevDropzone];
        next[dropzoneId] = selectedOption;
        return next;
      });

      // Clear selection after placing.
      setSelectedOption(null);
    },
    [hasSubmitted, selectedOption],
  );

  // ── Evaluation ───────────────────────────────────────────────
  const evaluate = useCallback(() => {
    let correct = 0;
    const total = exercise.dropzones.length;
    exercise.dropzones.forEach(dz => {
      if (answers[dz.id]?.id === dz.expectedBlockId) correct++;
    });
    setScoreStats({ correct, total });
    setHasSubmitted(true);
    setSelectedOption(null);
  }, [answers, exercise.dropzones]);

  const handleTimeout = useCallback(() => {
    if (hasSubmitted) return;
    setTimeoutOccurred(true);
    evaluate();
  }, [hasSubmitted, evaluate]);

  const handlePreSubmit = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se evaluarán tus respuestas y no podrás modificarlas después.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar respuestas',
      cancelButtonText: 'Revisar más',
      confirmButtonColor: '#2563EB',
    });
    if (result.isConfirmed) evaluate();
  };

  // ── Render the code template with inline dropzones ───────────
  const renderCode = () => {
    const parts = exercise.codeTemplate.split(/(\[DROPZONE_\d+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(DROPZONE_\d+)\]/);
      if (match) {
        const id = match[1];
        const dzConf = exercise.dropzones.find(d => d.id === id);
        const expectedBlock = exercise.blocks.find(b => b.id === dzConf?.expectedBlockId);
        return (
          <DropzoneNode
            key={i}
            id={id}
            currentBlock={answers[id]}
            expectedBlock={expectedBlock!}
            hasSubmitted={hasSubmitted}
            hasSelectedOption={!!selectedOption}
            onDropzoneClick={handleDropzoneClick}
          />
        );
      }
      return (
        <span key={i} dangerouslySetInnerHTML={{ __html: syntaxHighlightRealCode(part) }} />
      );
    });
  };

  return (
    <Card className="max-w-5xl w-full mx-auto flex flex-col gap-6 p-4 sm:p-6 mb-10">
      <ProgressBar step={step} totalSteps={totalSteps} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b dark:border-slate-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Completa el Código
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            <span className="text-yellow-500 dark:text-yellow-400 font-semibold">1.</span>{' '}
            Selecciona un bloque.{' '}
            <span className="text-yellow-500 dark:text-yellow-400 font-semibold">2.</span>{' '}
            Toca el espacio donde quieres colocarlo.
          </p>
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

      {/* Selection hint banner — only visible when an option is selected */}
      {selectedOption && !hasSubmitted && (
        <div className="flex items-start gap-3 bg-yellow-900/30 border border-yellow-500/50 rounded-lg px-4 py-2.5 text-yellow-300 text-sm animate-pulse">
          <span className="text-xl leading-none mt-0.5 shrink-0">👆</span>
          <span className="flex-1 min-w-0">
            <strong>Seleccionado:</strong>{' '}
            <code className="bg-black/30 rounded px-1 break-all">
              {selectedOption.content.trim().slice(0, 50)}
              {selectedOption.content.trim().length > 50 ? '…' : ''}
            </code>
            {' — Toca un espacio en el código para colocarlo.'}
          </span>
          <button
            onClick={() => setSelectedOption(null)}
            className="shrink-0 underline hover:text-yellow-100 cursor-pointer text-xs mt-0.5"
            aria-label="Cancelar selección"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Code panel ────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-[#1e1e1e] text-[#d4d4d4] p-4 sm:p-6 rounded-xl font-mono text-[13px] sm:text-[15px] leading-loose shadow-inner overflow-x-auto">
          <div className="min-w-0 whitespace-pre-wrap break-words">{renderCode()}</div>
        </div>

        {/* ── Blocks panel ──────────────────────────────────── */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 min-h-[350px]">
          <h3 className="font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-2 rounded shadow-sm border border-slate-100 dark:border-slate-700 text-center text-sm uppercase tracking-wider">
            Bloques Disponibles
          </h3>

          <div className="flex-1 flex flex-col gap-3 p-2">
            {availableBlocks.map(block => (
              <OptionBlock
                key={block.id}
                block={block}
                disabled={hasSubmitted}
                isSelected={selectedOption?.id === block.id}
                onOptionClick={handleOptionClick}
              />
            ))}
            {availableBlocks.length === 0 && (
              <div className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8 italic">
                No hay más bloques
              </div>
            )}
          </div>

          <div className="mt-auto pt-4 border-t dark:border-slate-800 flex flex-col gap-3">
            {hasSubmitted ? (
              <Button
                onClick={() =>
                  onComplete(
                    (scoreStats.correct / scoreStats.total) * 100,
                    scoreStats.correct,
                    scoreStats.total,
                  )
                }
                className="w-full h-14 text-lg"
                variant="primary"
              >
                Continuar al Siguiente Patrón
              </Button>
            ) : (
              <Button
                onClick={handlePreSubmit}
                className="w-full h-14 text-lg"
                variant="secondary"
              >
                Enviar Solución
              </Button>
            )}
            {onPrev && !hasSubmitted && (
              <Button
                onClick={onPrev}
                className="w-full text-slate-500 dark:text-slate-400 font-semibold"
                variant="ghost"
              >
                Anterior
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
