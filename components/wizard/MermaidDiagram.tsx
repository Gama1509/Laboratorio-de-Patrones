'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  chart?: string;
  fallbackText?: string;
}

export function MermaidDiagram({ chart, fallbackText = "Diagrama no disponible" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  // Remove special chars to make a safe DOM ID
  const id = useId().replace(/:/g, ''); 

  const { theme } = useTheme();

  // Inicializar Mermaid estáticamente o reconfigurarlo al cambiar de tema
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose', // Permite renderizar click events y otros
      themeVariables: {
        fontSize: '16px',
        fontFamily: 'inherit'
      },
      flowchart: {
        nodeSpacing: 55,
        rankSpacing: 55,
        useMaxWidth: true,
      },
      // Configuración para UML Class Diagram
      class: {
        useMaxWidth: true,
      }
    });
  }, [theme]);

  useEffect(() => {
    let isCancelled = false;
    setRendered(false);

    const renderChart = async () => {
      if (!chart || !containerRef.current) return;
      
      try {
        // Limpiar el nodo previo para evitar duplicaciones
        containerRef.current.innerHTML = '';
        
        // Generar un ID único por render
        const uniqueId = `mermaid-${id}-${Math.random().toString(36).substring(2, 9)}`;
        
        const { svg } = await mermaid.render(uniqueId, chart);
        
        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRendered(true);
        }
      } catch (error) {
        console.error("Mermaid rendering failed", error);
        if (!isCancelled && containerRef.current) {
           containerRef.current.innerHTML = `<div class="text-red-500 text-sm p-4 text-center font-medium">No se pudo cargar el diagrama. Revisa la sintaxis.</div>`;
           setRendered(true);
        }
      }
    };

    if (chart) {
       renderChart();
    }

    return () => {
      isCancelled = true;
    };
  }, [chart, id, theme]);

  if (!chart) {
    return (
      <div className="w-full rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 min-h-[280px]">
         <div className="text-slate-400 font-medium">{fallbackText}</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl p-4 md:p-6 flex flex-col items-start sm:items-center justify-center shadow-inner border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[280px] overflow-x-auto transition-colors duration-300">
      {/* Transición suave y forzado de tamaño SVG mediante clases tailwind arbitárias limitando el max width para que sea la mitad de grande y cómodo */}
      <div 
        ref={containerRef} 
        className="w-full max-w-3xl flex justify-center items-center transition-opacity duration-500 py-4 mx-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:min-w-[350px]" 
        style={{ opacity: rendered ? 1 : 0 }} 
      />
    </div>
  );
}
