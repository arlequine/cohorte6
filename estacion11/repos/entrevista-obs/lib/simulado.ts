import type { ClienteLLM } from '@/lib/agent';
import { PREGUNTAS } from '@/lib/entrevista';

/**
 * Cliente falso de la API de Anthropic para `AGENT_MODE=simulado`.
 *
 * Sirve para ver el dashboard del agente con datos realistas sin llave y sin gastar: el motor de Claude
 * y su instrumentación corren igual que en producción y solo la llamada HTTP a la API es falsa.
 * Los tokens crecen con el historial, como en una conversación real, y la latencia varía.
 *
 * Variables (opcionales):
 *   SIMULADO_LATENCIA_MS   latencia media por llamada (por defecto 800)
 *   SIMULADO_TASA_ERROR    fracción de llamadas que fallan con un 529, de 0 a 1 (por defecto 0)
 *   SIMULADO_TASA_REPREGUNTA fracción de respuestas que son repregunta (por defecto 0.3)
 */

const numero = (valor: string | undefined, porDefecto: number) => {
  const n = Number(valor);
  return valor !== undefined && Number.isFinite(n) ? n : porDefecto;
};

export class ErrorSimulado extends Error {
  readonly status = 529;
  constructor() {
    super('Sobrecarga simulada de la API (529).');
  }
}

export interface OpcionesSimulado {
  latenciaMs?: number;
  tasaError?: number;
  tasaRepregunta?: number;
  aleatorio?: () => number;
  esperar?: (ms: number) => Promise<void>;
}

export function crearClienteSimulado(opciones: OpcionesSimulado = {}): ClienteLLM {
  const latencia = opciones.latenciaMs ?? numero(process.env.SIMULADO_LATENCIA_MS, 800);
  const tasaError = opciones.tasaError ?? numero(process.env.SIMULADO_TASA_ERROR, 0);
  const tasaRepregunta = opciones.tasaRepregunta ?? numero(process.env.SIMULADO_TASA_REPREGUNTA, 0.3);
  const azar = opciones.aleatorio ?? Math.random;
  const esperar = opciones.esperar ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));

  const create = async (params: { model: string; system?: unknown; messages: { content: unknown }[] }) => {
    await esperar(Math.round(latencia * (0.5 + azar())));
    if (azar() < tasaError) throw new ErrorSimulado();

    const sistema = typeof params.system === 'string' ? params.system : '';
    const actual = Number(/Vas en la pregunta (\d+)/.exec(sistema)?.[1] ?? 1);
    const forzarAvance = sistema.includes('Ya repreguntaste');
    const repregunta = !forzarAvance && azar() < tasaRepregunta;
    const texto = repregunta
      ? '¿Puedes darme un ejemplo concreto de lo que hiciste tú en esa situación?'
      : `Gracias. ${PREGUNTAS[actual] ?? 'Eso es todo por mi parte.'}`;

    const caracteres = sistema.length + params.messages.reduce((n, m) => n + String(m.content).length, 0);
    return {
      id: `msg_simulado_${Math.floor(azar() * 1e9)}`,
      type: 'message',
      role: 'assistant',
      model: params.model,
      stop_reason: 'tool_use',
      content: [{ type: 'tool_use', id: 'toolu_simulado', name: 'responder_candidato', input: { tipo: repregunta ? 'repregunta' : 'siguiente_pregunta', texto } }],
      // Unos 4 caracteres por token, más el esquema de la herramienta.
      usage: { input_tokens: Math.round(caracteres / 4) + 350, output_tokens: 40 + Math.round(azar() * 50), cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    };
  };

  return { messages: { create } } as unknown as ClienteLLM;
}
