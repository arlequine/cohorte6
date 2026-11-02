import Anthropic from '@anthropic-ai/sdk';

export const MODELO_POR_DEFECTO = 'claude-haiku-5-5';
export const MAX_CARACTERES = 1000;
const MAX_TOKENS = 300;

const INSTRUCCIONES = [
  'Eres el agente de un walking skeleton del programa AI for Developers.',
  'Responde en español, en máximo tres oraciones.',
  'Si no sabes algo, dilo en lugar de inventarlo.',
].join(' ');

export interface RespuestaAgente {
  respuesta: string;
  modelo: string;
  tokens: { entrada: number; salida: number };
}

/** La parte del cliente de Anthropic que usa el agente. Permite inyectar un doble en los tests. */
export type ClienteLLM = Pick<Anthropic, 'messages'>;

let clientePorDefecto: ClienteLLM | null = null;
function obtenerCliente(): ClienteLLM {
  clientePorDefecto ??= new Anthropic();
  return clientePorDefecto;
}

/** Valida el mensaje del usuario. Devuelve un texto de error, o null si es válido. */
export function validarMensaje(mensaje: unknown): string | null {
  if (typeof mensaje !== 'string' || mensaje.trim() === '') return 'El campo "mensaje" es obligatorio.';
  if (mensaje.length > MAX_CARACTERES) return `El mensaje no puede pasar de ${MAX_CARACTERES} caracteres.`;
  return null;
}

export async function responder(
  mensaje: string,
  cliente: ClienteLLM = obtenerCliente(),
  modelo: string = process.env.ANTHROPIC_MODEL ?? MODELO_POR_DEFECTO,
): Promise<RespuestaAgente> {
  const resultado = await cliente.messages.create({
    model: modelo,
    max_tokens: MAX_TOKENS,
    system: INSTRUCCIONES,
    messages: [{ role: 'user', content: mensaje }],
  });

  const respuesta = resultado.content
    .flatMap((bloque) => (bloque.type === 'text' ? [bloque.text] : []))
    .join('\n')
    .trim();

  return {
    respuesta,
    modelo: resultado.model,
    tokens: { entrada: resultado.usage.input_tokens, salida: resultado.usage.output_tokens },
  };
}
