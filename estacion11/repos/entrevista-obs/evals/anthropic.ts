import Anthropic from '@anthropic-ai/sdk';

export type ClienteLLM = Pick<Anthropic, 'messages'>;

export const MODELO_PERSONA = process.env.PERSONA_MODEL || 'claude-haiku-5-5';
export const MODELO_JUEZ = process.env.JUDGE_MODEL || 'claude-sonnet-5-5';

export function clienteAnthropic(): ClienteLLM {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta ANTHROPIC_API_KEY: la Persona y el Juez usan Claude.');
    process.exit(2);
  }
  return new Anthropic();
}

/** Llama al modelo con una herramienta obligatoria y devuelve su entrada: salida estructurada. */
export async function llamarConHerramienta<T>(
  cliente: ClienteLLM,
  opciones: { modelo: string; system: string; mensaje: string; herramienta: { name: string; description: string; input_schema: Record<string, unknown> } },
): Promise<T> {
  const resultado = await cliente.messages.create({
    model: opciones.modelo,
    max_tokens: 1500,
    system: opciones.system,
    messages: [{ role: 'user', content: opciones.mensaje }],
    tools: [{ ...opciones.herramienta, input_schema: { type: 'object', ...opciones.herramienta.input_schema } }],
    tool_choice: { type: 'tool', name: opciones.herramienta.name },
  });
  const bloque = resultado.content.find((b) => b.type === 'tool_use');
  if (!bloque || !('input' in bloque)) throw new Error('El modelo no devolvió la salida estructurada.');
  return bloque.input as T;
}
