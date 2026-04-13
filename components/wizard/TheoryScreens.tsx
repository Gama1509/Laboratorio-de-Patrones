import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PatternData } from '../../data/patterns';
import { Lightbulb, Network, Laptop, Binary } from 'lucide-react';
import { MermaidDiagram } from './MermaidDiagram';

const umlDiagrams: Record<string, string> = {
  adapter: `classDiagram
    class Cliente
    class ConexionMexicana {
        <<interface>>
        +conectarDispositivo()
    }
    class AdaptadorCorriente {
        -enchufe: EnchufeEuropeo
        +conectarDispositivo()
    }
    class EnchufeEuropeo {
        +getTipo()
        +conectarEuropeo()
    }

    Cliente --> ConexionMexicana
    AdaptadorCorriente ..|> ConexionMexicana
    AdaptadorCorriente --> EnchufeEuropeo`,

  bridge: `classDiagram
    class Cliente
    class ControlRemoto {
        -tv: Televisor
        +encenderTV()
    }
    class Televisor {
        <<interface>>
        +encender()
    }
    class TVSamsung {
        +encender()
    }
    class TVLG {
        +encender()
    }

    Cliente --> ControlRemoto
    ControlRemoto --> Televisor : usa
    TVSamsung ..|> Televisor
    TVLG ..|> Televisor`,

  composite: `classDiagram
    class Pedido {
        <<interface>>
        +procesar()
    }
    class Producto {
        -nombre
        +procesar()
    }
    class Combo {
        -pedidos: List~Pedido~
        +procesar()
    }
    
    Cliente --> Pedido
    Producto ..|> Pedido
    Combo ..|> Pedido
    Combo o-- Pedido`
};

const flowDiagrams: Record<string, string> = {
  adapter: `flowchart LR
    A[Cliente] --> B{Validar\\ndispositivo}
    B -- OK --> C[Convertir conexión]
    C --> D[Conectar]
    D --> E((Fin))
    B -- Error --> E`,

  bridge: `flowchart LR
    A[Usuario usa\\ncontrol] --> B{Validar\\ntelevisor}
    B -- OK --> C[Enviar señal]
    C --> D[Televisor\\nejecuta]
    D --> E((Fin))`,

  composite: `flowchart TD
    A[Cliente\\nhace orden] --> B{¿Es producto\\no combo?}
    B -- Producto --> C[Ejecutar directamente]
    B -- Combo --> D[Iterar sobre elementos]
    D --> E[Ejecutar cada elemento]`
};

interface ScreenProps {
  pattern: PatternData;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev?: () => void;
}

import { ProgressBar } from './ProgressBar';

function ImagePlaceholder({
  icon: Icon,
  title,
  subtitle,
  gradient
}: {
  icon: React.ElementType,
  title: string,
  subtitle: string,
  gradient: string
}) {
  return (
    <div className={`w-full rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-inner border border-slate-200/60 ${gradient} min-h-[240px]`}>
      <div className="p-4 bg-white/80 rounded-full shadow-sm mb-4 backdrop-blur-sm">
        <Icon className="w-8 h-8 text-slate-700" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm">{subtitle}</p>
    </div>
  );
}

export function ConceptScreen({ pattern, step, totalSteps, onNext }: ScreenProps) {
  return (
    <Card className="max-w-4xl w-full mx-auto">
      <ProgressBar step={step} totalSteps={totalSteps} />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
        <span className="text-blue-600 dark:text-blue-400">¿Qué es</span> {pattern.name}?
      </h2>

      <div className="space-y-6">
        <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900">
          <div className="w-full h-[450px] md:h-[450px] flex items-center justify-center bg-white dark:bg-slate-900">
            <img
              src={pattern.conceptImage}
              alt="Ejemplo práctico"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-medium border-l-4 border-blue-500 pl-4 py-1">
            {pattern.concept.definition}
          </p>

          {pattern.concept.analogy && (
            <div className="mt-5 bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/50 rounded-xl p-4 flex items-center shadow-sm">
              <p className="text-amber-900 dark:text-amber-200 text-[15px] font-medium">
                {pattern.concept.analogy}
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-red-50/50 dark:bg-red-900/20 p-5 rounded-xl border border-red-100 dark:border-red-900/50">
              <h4 className="flex items-center text-red-800 dark:text-red-400 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-500/80 mr-2"></span> El Problema
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-400">{pattern.concept.problem}</p>
            </div>

            <div className="bg-emerald-50/50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
              <h4 className="flex items-center text-emerald-800 dark:text-emerald-400 font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-500/80 mr-2"></span> La Solución
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-400">{pattern.concept.solution}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Ventajas clave:</h4>
            <ul className="space-y-2">
              {pattern.concept.advantages.map((adv, i) => (
                <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-400">
                  <span className="mr-2 text-green-500 dark:text-green-400 mt-0.5">✓</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Desventajas clave:</h4>
            <ul className="space-y-2">
              {pattern.concept.disadvantages.map((adv, i) => (
                <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-400">
                  <span className="mr-2 text-red-500 dark:text-red-400 mt-0.5">X</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-end items-center border-t border-slate-100/60 dark:border-slate-800 gap-4">
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">Siguiente</Button>
      </div>
    </Card>
  );
}

export function DetailScreen({ pattern, step, totalSteps, onNext, onPrev }: ScreenProps) {
  return (
    <Card className="max-w-5xl w-full mx-auto">
      <ProgressBar step={step} totalSteps={totalSteps} />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">Explicación Detallada</h2>

      <div className="space-y-6">
        <MermaidDiagram
          chart={umlDiagrams[pattern.id]}
          fallbackText="Diagrama UML no interactivo disponible para este patrón en este momento."
        />

        <div className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
          {pattern.details.explanation}
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Estructura del Patrón</h3>
          <div className="grid gap-3">
            {pattern.details.structure.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {pattern.details.flow && (
            <div className="mt-6 bg-blue-50/60 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-xl flex items-center justify-center shadow-sm">
              <p className="font-bold text-blue-900 dark:text-blue-200 text-[15px] tracking-wide">
                {pattern.details.flow}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 pt-6 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100/60 dark:border-slate-800 gap-4">
        {onPrev && (
          <Button onClick={onPrev} size="lg" variant="outline" className="w-full sm:w-auto">
            Anterior
          </Button>
        )}
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">Siguiente</Button>
      </div>
    </Card>
  );
}

export function ContextScreen({ pattern, step, totalSteps, onNext, onPrev }: ScreenProps) {
  return (
    <Card className="max-w-3xl w-full mx-auto">
      <ProgressBar step={step} totalSteps={totalSteps} />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">Ejemplo Práctico</h2>

      <div className="space-y-6">
        <div className="w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200/60 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="w-full h-[400px] md:h-[400px] flex items-center justify-center bg-white dark:bg-slate-900">
            <img
              src={pattern.exampleImage}
              alt="Ejemplo práctico"
              className="w-full h-full object-cover object-center mix-blend-normal"
            />
          </div>
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50">
          <h3 className="text-xl font-bold text-blue-900 dark:text-blue-200 mb-3">{pattern.exampleTheory.title}</h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {pattern.exampleTheory.description}
          </p>
        </div>
      </div>

      <div className="mt-10 pt-6 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100/60 dark:border-slate-800 gap-4">
        {onPrev && (
          <Button onClick={onPrev} size="lg" variant="outline" className="w-full sm:w-auto">
            Anterior
          </Button>
        )}
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">Siguiente</Button>
      </div>
    </Card>
  );
}

const syntaxHighlight = (code: string) => {
  const lines = code.split('\n');
  const highlighted = lines.map(line => {
    const commentIndex = line.indexOf('//');
    let codePart = line;
    let commentPart = '';

    if (commentIndex !== -1) {
      codePart = line.substring(0, commentIndex);
      commentPart = line.substring(commentIndex);
    }

    codePart = codePart.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const parts = codePart.split(/("[^"]*")/g);

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        parts[i] = parts[i]
          .replace(/\b(Clase|Interfaz|implementa)\b/g, '<span class="text-fuchsia-400 font-bold">$1</span>')
          .replace(/\b(metodo|atributo|lista)\b/g, '<span class="text-sky-400 font-bold">$1</span>')
          .replace(/\b(mostrar|retornar|si|para cada|en)\b/g, '<span class="text-rose-400 font-semibold">$1</span>')
          .replace(/\b(es|nulo|inválido|verdadero|falso|null)\b/g, '<span class="text-amber-400">$1</span>')
          .replace(/([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="text-yellow-200 font-medium">$1</span>')
          .replace(/(←)/g, '<span class="text-indigo-400 font-bold">$1</span>');
      } else {
        parts[i] = `<span class="text-emerald-400">${parts[i]}</span>`;
      }
    }
    codePart = parts.join('');

    if (commentPart) {
      commentPart = commentPart.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      codePart += `<span class="text-slate-400 italic font-medium">${commentPart}</span>`;
    }

    return codePart;
  });

  return { __html: highlighted.join('\n') };
};

export function PseudoScreen({ pattern, step, totalSteps, onNext, onPrev }: ScreenProps) {
  return (
    <Card className="max-w-5xl w-full mx-auto">
      <ProgressBar step={step} totalSteps={totalSteps} />

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">Pseudocódigo</h2>

      <div className="space-y-6">
        <MermaidDiagram
          chart={flowDiagrams[pattern.id]}
          fallbackText="Diagrama de flujo lógico no disponible para este patrón en este momento."
        />

        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 dark:bg-[#1a1b26] rounded-t-xl flex items-center px-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-4 text-xs text-slate-400 font-mono">pseudocodigo.txt</span>
          </div>
          <pre className="bg-slate-900 dark:bg-[#1e1e1e] text-slate-50 p-6 pt-12 rounded-xl overflow-x-auto font-mono text-[15px] shadow-xl leading-relaxed">
            <code dangerouslySetInnerHTML={syntaxHighlight(pattern.examplePseudo)} />
          </pre>
        </div>

        {pattern.pseudoAnalysis && pattern.pseudoAnalysis.length > 0 && (
          <div className="mt-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl overflow-hidden">
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center gap-2">
              <span className="text-lg">🔍</span>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">Qué observar:</h4>
            </div>
            <div className="p-4">
              <ul className="space-y-3">
                {pattern.pseudoAnalysis.map((item, i) => (
                  <li key={i} className="flex items-start text-[14px] text-slate-700 dark:text-slate-300 font-medium">
                    <span className="mr-3 mt-0.5 w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs shrink-0">{i + 1}</span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {pattern.pseudoExplanation && (
          <div className="mt-4 text-[15px] font-medium text-indigo-900 dark:text-indigo-200 bg-indigo-50/70 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-xl p-4 shadow-sm">
            {pattern.pseudoExplanation}
          </div>
        )}

        <div className="mt-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
            <span className="font-bold text-xl">✅</span>
          </div>
          <p className="text-[15px] text-emerald-900 dark:text-emerald-100 font-medium leading-relaxed">
            Ya comprendiste la teoría y la implementación. Ahora construye tú mismo el patrón <strong>{pattern.name}</strong> en el ejercicio interactivo.
          </p>
        </div>
      </div>

      <div className="mt-10 pt-6 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-slate-100/60 dark:border-slate-800 gap-4">
        {onPrev && (
          <Button onClick={onPrev} size="lg" variant="outline" className="w-full sm:w-auto">
            Anterior
          </Button>
        )}
        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">Siguiente</Button>
      </div>
    </Card>
  );
}


