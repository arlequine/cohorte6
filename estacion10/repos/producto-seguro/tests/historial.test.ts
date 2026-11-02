import { afterEach, describe, expect, it, vi } from 'vitest';
import { PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { guardarConversacion, historialHabilitado, ultimasConversaciones, type ClienteDynamo } from '@/lib/historial';

function clienteFalso(respuesta: unknown = {}) {
  const send = vi.fn().mockResolvedValue(respuesta);
  return { cliente: { send } as unknown as ClienteDynamo, send };
}

describe('historial', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('está deshabilitado si no hay tabla', () => {
    vi.stubEnv('DYNAMODB_TABLE', '');
    expect(historialHabilitado()).toBe(false);
    vi.stubEnv('DYNAMODB_TABLE', 'conversaciones');
    expect(historialHabilitado()).toBe(true);
  });

  it('guarda la conversación con id, fecha y expiración a 30 días', async () => {
    vi.stubEnv('DYNAMODB_TABLE', 'conversaciones');
    const { cliente, send } = clienteFalso();
    const ahora = new Date('2026-11-02T12:00:00Z');

    const guardada = await guardarConversacion(
      { mensaje: 'Hola', respuesta: 'Hola', modelo: 'claude-haiku-5-5', tokens_entrada: 3, tokens_salida: 2 },
      cliente,
      ahora,
    );

    expect(guardada.creado_en).toBe('2026-11-02T12:00:00.000Z');
    expect(guardada.expira_en).toBe(Math.floor(ahora.getTime() / 1000) + 30 * 86400);
    const comando = send.mock.calls[0][0];
    expect(comando).toBeInstanceOf(PutCommand);
    expect(comando.input).toMatchObject({ TableName: 'conversaciones', Item: { mensaje: 'Hola', id: guardada.id } });
  });

  it('devuelve las conversaciones más recientes primero', async () => {
    vi.stubEnv('DYNAMODB_TABLE', 'conversaciones');
    const { cliente, send } = clienteFalso({
      Items: [
        { id: 'a', creado_en: '2026-11-01T00:00:00Z' },
        { id: 'b', creado_en: '2026-11-03T00:00:00Z' },
        { id: 'c', creado_en: '2026-11-02T00:00:00Z' },
      ],
    });

    const ultimas = await ultimasConversaciones(2, cliente);

    expect(send.mock.calls[0][0]).toBeInstanceOf(ScanCommand);
    expect(ultimas.map((c) => c.id)).toEqual(['b', 'c']);
  });
});
