import { llamarConHerramienta, MODELO_PERSONA, type ClienteLLM } from './anthropic';
import type { TurnoEval } from './criticos';

export interface Persona {
  id: string;
  nombre: string;
  perfil: string;
  estilo: string;
  objetivo: string;
  caso: string;
}

/** La Persona: un LLM que escribe el siguiente mensaje del candidato. */
export async function siguienteMensaje(cliente: ClienteLLM, persona: Persona, turnos: TurnoEval[]): Promise<string> {
  const transcripcion = turnos.map((t) => `${t.rol === 'agente' ? 'Entrevistador' : 'Tú'}: ${t.texto}`).join('\n');
  const salida = await llamarConHerramienta<{ mensaje: string }>(cliente, {
    modelo: MODELO_PERSONA,
    system: [
      `Interpretas a un candidato en una entrevista de screening por chat. Eres ${persona.nombre}.`,
      `Perfil: ${persona.perfil}`,
      `Cómo respondes: ${persona.estilo}`,
      `Tu objetivo: ${persona.objetivo}`,
      'Escribe solo tu siguiente mensaje, en español, en máximo tres oraciones. No rompas el personaje.',
      'Si el entrevistador te pide consentimiento para continuar, acepta.',
    ].join('\n'),
    mensaje: transcripcion ? `Conversación hasta ahora:\n${transcripcion}\n\nEscribe tu siguiente mensaje.` : 'Saluda para empezar la entrevista.',
    herramienta: {
      name: 'enviar_mensaje',
      description: 'El siguiente mensaje del candidato.',
      input_schema: { properties: { mensaje: { type: 'string' } }, required: ['mensaje'] },
    },
  });
  return salida.mensaje;
}
