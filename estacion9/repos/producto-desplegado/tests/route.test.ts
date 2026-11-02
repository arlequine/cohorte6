import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/agent', async (importarOriginal) => {
  const original = await importarOriginal<typeof import('@/lib/agent')>();
  return {
    ...original,
    responder: vi.fn().mockResolvedValue({ respuesta: 'ok', modelo: 'claude-haiku-5-5', tokens: { entrada: 1, salida: 1 } }),
  };
});

vi.mock('@/lib/historial', () => ({
  historialHabilitado: vi.fn(() => process.env.DYNAMODB_TABLE === 'conversaciones'),
  guardarConversacion: vi.fn(),
}));

const { POST } = await import('@/app/api/agent/route');
const historial = await import('@/lib/historial');

function peticion(cuerpo: unknown, encabezados: Record<string, string> = {}) {
  return new Request('http://localhost/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...encabezados },
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
  });
}

describe('POST /api/agent', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('responde 200 con un mensaje válido', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const res = await POST(peticion({ mensaje: 'Hola' }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ respuesta: 'ok' });
  });

  it('responde 400 si falta el mensaje o el cuerpo no es JSON', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    expect((await POST(peticion({}))).status).toBe(400);
    expect((await POST(peticion('no es json'))).status).toBe(400);
  });

  it('guarda en el historial cuando está configurado', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('DYNAMODB_TABLE', 'conversaciones');
    expect((await POST(peticion({ mensaje: 'Hola' }))).status).toBe(200);
    expect(historial.guardarConversacion).toHaveBeenCalledWith(expect.objectContaining({ mensaje: 'Hola', respuesta: 'ok' }));
  });

  it('responde aunque falle el historial', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('DYNAMODB_TABLE', 'conversaciones');
    vi.mocked(historial.guardarConversacion).mockRejectedValueOnce(new Error('DynamoDB caído'));
    expect((await POST(peticion({ mensaje: 'Hola' }))).status).toBe(200);
  });

  it('exige el token cuando AGENT_ACCESS_TOKEN está definido', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('AGENT_ACCESS_TOKEN', 'secreto');
    expect((await POST(peticion({ mensaje: 'Hola' }))).status).toBe(401);
    expect((await POST(peticion({ mensaje: 'Hola' }, { Authorization: 'Bearer secreto' }))).status).toBe(200);
  });
});
