import { describe, expect, it, vi } from 'vitest';
import { MAX_CARACTERES, responder, validarMensaje, type ClienteLLM } from '@/lib/agent';

function clienteFalso(texto: string) {
  const create = vi.fn().mockResolvedValue({
    model: 'claude-haiku-5-5',
    content: [{ type: 'text', text: texto }],
    usage: { input_tokens: 12, output_tokens: 7 },
  });
  return { cliente: { messages: { create } } as unknown as ClienteLLM, create };
}

describe('validarMensaje', () => {
  it('rechaza mensajes vacíos o que no son texto', () => {
    expect(validarMensaje('')).not.toBeNull();
    expect(validarMensaje('   ')).not.toBeNull();
    expect(validarMensaje(42)).not.toBeNull();
    expect(validarMensaje(undefined)).not.toBeNull();
  });

  it('rechaza mensajes demasiado largos', () => {
    expect(validarMensaje('a'.repeat(MAX_CARACTERES + 1))).not.toBeNull();
  });

  it('acepta un mensaje normal', () => {
    expect(validarMensaje('Hola')).toBeNull();
  });
});

describe('responder', () => {
  it('devuelve el texto, el modelo y los tokens del LLM', async () => {
    const { cliente, create } = clienteFalso('Hola, soy el agente.');
    const resultado = await responder('Hola', cliente, 'modelo-de-prueba');

    expect(resultado).toEqual({ respuesta: 'Hola, soy el agente.', modelo: 'claude-haiku-5-5', tokens: { entrada: 12, salida: 7 } });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'modelo-de-prueba', messages: [{ role: 'user', content: 'Hola' }] }),
    );
  });
});
