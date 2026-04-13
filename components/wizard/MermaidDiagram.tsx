'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  chart?: string;
  fallbackText?: string;
  type?: 'uml' | 'flow';
  orientation?: 'LR' | 'TD';
}
export function MermaidDiagram({
  chart,
  fallbackText = "Diagrama no disponible",
  type = 'flow',
  orientation = 'LR',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  const id = useId().replace(/:/g, '');
  const { theme } = useTheme();

  // Inicializar Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      themeVariables: {
        fontSize: '16px',
        fontFamily: 'inherit',
      },
      flowchart: {
        nodeSpacing: 55,
        rankSpacing: 55,
        useMaxWidth: true,
      },
      class: {
        useMaxWidth: true,
      },
    });
  }, [theme]);

  // Render del diagrama
  useEffect(() => {
    let isCancelled = false;
    setRendered(false);

    const renderChart = async () => {
      if (!chart || !containerRef.current) return;

      try {
        containerRef.current.innerHTML = '';

        const uniqueId = `mermaid-${id}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;

        const { svg } = await mermaid.render(uniqueId, chart);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (error) {
        console.error('Mermaid rendering failed', error);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="text-red-500 text-sm p-4 text-center font-medium">
              No se pudo cargar el diagrama. Revisa la sintaxis.
            </div>
          `;
          setRendered(true);
        }
      }
    };

    if (chart) renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, id, theme]);

  // Fallback
  if (!chart) {
    return (
      <div className="w-full rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 min-h-[280px]">
        <div className="text-slate-400 font-medium">{fallbackText}</div>
      </div>
    );
  }

  // 🎯 Tamaños por tipo + orientación
  const svgClass =
    orientation === 'TD'
      ? '[&>svg]:min-w-[500px] [&>svg]:scale-110'
      : type === 'uml'
        ? '[&>svg]:min-w-[300px] [&>svg]:scale-120'
        : '[&>svg]:min-w-[850px] [&>svg]:scale-112';

  return (
    <div
      className={`w-full rounded-2xl p-4 md:p-6 flex flex-col items-start sm:items-center justify-center shadow-inner border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto transition-colors duration-300`}
    >
      <div
        ref={containerRef}
        className={`w-full max-w-3xl flex justify-center items-center transition-opacity duration-500 py-6 mx-auto ${svgClass}`}
        style={{ opacity: rendered ? 1 : 0 }}
      />
    </div>
  );
}