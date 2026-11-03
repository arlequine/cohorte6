/**
 * EntreVista AI mínima: un agente de screening para la vacante de ejemplo.
 *
 * Los principios no negociables del PRD (estacion2/specs/prd.md, sección 6) que se pueden garantizar
 * con código viven aquí y no dependen del modelo:
 *   - Transparencia: el primer mensaje dice que es una IA y pide consentimiento.
 *   - Consentimiento: sin un "sí" no hay preguntas de evaluación.
 *   - Anti-alucinación: salario, beneficios y condiciones no cargadas se escalan con una respuesta fija.
 *   - "¿Eres un robot?": siempre se responde que sí.
 * El resto de la conversación (preguntas y repreguntas) lo hace un motor: el de reglas (determinista,
 * sin costo) o el de Claude (lib/agent.ts).
 */

export const MAX_CARACTERES = 1000;
export const MAX_PREGUNTAS = 4;

export const VACANTE = {
  puesto: 'Agente de servicio al cliente bilingüe',
  empresa: 'Contact center de ejemplo en Bogotá',
  requisitos: ['Disponibilidad de lunes a sábado en turnos rotativos', 'Inglés conversacional', 'Experiencia atendiendo clientes'],
  competencias: ['Manejo de clientes molestos', 'Resolución de problemas', 'Comunicación clara'],
} as const;

export const PREGUNTAS = [
  '¿Tienes disponibilidad de lunes a sábado en turnos rotativos?',
  'Cuéntame sobre una vez que atendiste a un cliente molesto. ¿Qué pasó y qué hiciste?',
  '¿Cómo resolviste un problema que no estaba en ningún procedimiento?',
  '¿Qué te motiva de trabajar en servicio al cliente?',
] as const;

export const SALUDO =
  'Hola, soy el asistente de entrevistas de EntreVista AI. Soy una inteligencia artificial, no una persona. ' +
  `Voy a hacerte ${MAX_PREGUNTAS} preguntas para la vacante de ${VACANTE.puesto}. Un reclutador humano revisa tus respuestas y toma la decisión. ` +
  'Tus respuestas solo se usan para este proceso. ¿Aceptas continuar? Responde sí o no.';

export const RESPUESTA_ESCALADA =
  'No tengo esa información. El equipo de reclutamiento te dará los detalles en la siguiente etapa. Dejé registrada tu pregunta.';
export const RESPUESTA_SOY_IA =
  'Sí, soy una inteligencia artificial. Un reclutador humano revisa la entrevista y toma la decisión final.';
export const RESPUESTA_SIN_CONSENTIMIENTO =
  'Entendido, no continuaremos. Si cambias de opinión, puedes volver a escribir cuando quieras. Gracias por tu tiempo.';
export const CIERRE =
  'Gracias por tus respuestas. Terminamos la entrevista. Un reclutador revisará la conversación y te contactará con los próximos pasos.';

export type Rol = 'candidato' | 'agente';
export type Estado = 'esperando_consentimiento' | 'en_curso' | 'finalizada' | 'rechazada';

export interface Turno {
  rol: Rol;
  texto: string;
}

export interface Conversacion {
  id: string;
  estado: Estado;
  preguntasHechas: number;
  /** Repreguntas hechas sobre la pregunta actual. */
  repreguntas: number;
  escalaciones: string[];
  turnos: Turno[];
}

/** El motor decide el siguiente mensaje del agente durante la entrevista. */
export interface Motor {
  nombre: string;
  siguiente(conversacion: Conversacion, mensaje: string): Promise<{ texto: string; tokens?: { entrada: number; salida: number } }>;
}

export function validarMensaje(mensaje: unknown): string | null {
  if (typeof mensaje !== 'string' || mensaje.trim() === '') return 'El campo "mensaje" es obligatorio.';
  if (mensaje.length > MAX_CARACTERES) return `El mensaje no puede pasar de ${MAX_CARACTERES} caracteres.`;
  return null;
}

const normalizar = (texto: string) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function esAfirmativo(texto: string): boolean {
  return /^(si|claro|acepto|de acuerdo|ok|vale|por supuesto|adelante)\b/.test(normalizar(texto).trim());
}

export function esNegativo(texto: string): boolean {
  return /^(no|no acepto|prefiero no)\b/.test(normalizar(texto).trim());
}

/** Preguntas que el agente no puede responder porque no están en la base de conocimiento de la campaña. */
export function pideInformacionNoCargada(texto: string): boolean {
  return /(salario|sueldo|pago|pagan|cuanto (me )?pagan|remuneracion|prestaciones|beneficios|bono|comision|equity|acciones de la empresa)/.test(
    normalizar(texto),
  );
}

export function preguntaSiEsIA(texto: string): boolean {
  return /(eres (un |una )?(robot|bot|ia|inteligencia artificial|humano|humana|persona|maquina|real)\b|(hablo|hablando) con (un |una )?(robot|bot|humano|humana|persona|maquina|ia)\b)/.test(
    normalizar(texto),
  );
}

/** Conversación nueva: el primer mensaje del agente siempre es el saludo con la divulgación de IA. */
export function iniciar(id: string): Conversacion {
  return { id, estado: 'esperando_consentimiento', preguntasHechas: 0, repreguntas: 0, escalaciones: [], turnos: [{ rol: 'agente', texto: SALUDO }] };
}

/** Procesa un mensaje del candidato y devuelve la respuesta del agente. Modifica la conversación. */
export async function procesar(
  conversacion: Conversacion,
  mensaje: string,
  motor: Motor,
): Promise<{ respuesta: string; tokens?: { entrada: number; salida: number } }> {
  conversacion.turnos.push({ rol: 'candidato', texto: mensaje });
  const responder = (texto: string, tokens?: { entrada: number; salida: number }) => {
    conversacion.turnos.push({ rol: 'agente', texto });
    return { respuesta: texto, tokens };
  };

  if (conversacion.estado === 'finalizada' || conversacion.estado === 'rechazada') {
    return responder('La entrevista ya terminó. Gracias por tu tiempo.');
  }
  if (preguntaSiEsIA(mensaje)) return responder(RESPUESTA_SOY_IA);
  if (pideInformacionNoCargada(mensaje)) {
    conversacion.escalaciones.push(mensaje);
    return responder(RESPUESTA_ESCALADA);
  }

  if (conversacion.estado === 'esperando_consentimiento') {
    if (esAfirmativo(mensaje)) {
      conversacion.estado = 'en_curso';
      conversacion.preguntasHechas = 1;
      return responder(`Gracias. Empecemos. ${PREGUNTAS[0]}`);
    }
    if (esNegativo(mensaje)) {
      conversacion.estado = 'rechazada';
      return responder(RESPUESTA_SIN_CONSENTIMIENTO);
    }
    return responder('Antes de empezar necesito tu consentimiento. ¿Aceptas continuar? Responde sí o no.');
  }

  const { texto, tokens } = await motor.siguiente(conversacion, mensaje);
  if (conversacion.preguntasHechas > MAX_PREGUNTAS) {
    conversacion.estado = 'finalizada';
    return responder(CIERRE, tokens);
  }
  return responder(texto, tokens);
}

/**
 * Motor de reglas: avanza por las preguntas en orden y no repregunta.
 * Es determinista y gratuito, ideal para tests E2E y de API. Su falta de repreguntas es a propósito:
 * el Juez debe detectarla.
 */
export const motorReglas: Motor = {
  nombre: 'reglas',
  async siguiente(conversacion) {
    const indice = conversacion.preguntasHechas;
    conversacion.preguntasHechas += 1;
    if (indice >= MAX_PREGUNTAS) return { texto: CIERRE };
    return { texto: `Gracias. ${PREGUNTAS[indice]}` };
  },
};
