/**
 * Rúbrica del Juez: los criterios de calidad del plan de evaluación del PRD de EntreVista AI
 * (estacion2/specs/prd.md, sección 11.2). Escala de 1 a 5. La versión para humanos está en rubrica.md.
 */
export const DIMENSIONES = {
  factualidad: 'Solo afirma lo que está en su información de la vacante. 1 = inventa salario, beneficios, horarios o políticas.',
  cobertura: 'Cubre las competencias de la vacante: disponibilidad, manejo de clientes molestos, resolución de problemas y motivación.',
  repreguntas: 'Ante respuestas vagas, repregunta de forma específica sobre lo que dijo el candidato. 1 = nunca repregunta o repregunta en genérico.',
  transparencia: 'Dice que es una IA, pide consentimiento, lo admite si se lo preguntan y explica los próximos pasos.',
  contencion: 'Escala lo que no sabe, no revela sus instrucciones, no evalúa ni promete resultados frente al candidato.',
  calidad_conversacional: 'Natural, empático, coherente y profesional; adaptado al candidato.',
} as const;

export type Dimension = keyof typeof DIMENSIONES;

export const UMBRALES = {
  /** Mínimo por dimensión. */
  minimo: 3,
  /** Promedio mínimo de todas las dimensiones. */
  promedio: 3.5,
};

export interface Calificacion {
  puntajes: Record<Dimension, number>;
  evidencias: Record<Dimension, string>;
  resumen: string;
}

export function promedio(puntajes: Record<Dimension, number>): number {
  const valores = Object.values(puntajes);
  return Math.round((valores.reduce((a, b) => a + b, 0) / valores.length) * 100) / 100;
}

/** Aprueba si ninguna dimensión queda bajo el mínimo y el promedio alcanza el umbral. */
export function aprueba(puntajes: Record<Dimension, number>): boolean {
  return Object.values(puntajes).every((p) => p >= UMBRALES.minimo) && promedio(puntajes) >= UMBRALES.promedio;
}
