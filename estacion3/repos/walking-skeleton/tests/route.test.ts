import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/agent', async (importarOriginal) => {
  const original = await importarOriginal<typeof import('@/lib/agent')>();
  return {
    ...original,
    responder: vi.fn().mockResolvedValue({ respuesta: 'ok', modelo: 'claude-haiku-5-5', tokens: { entrada: 1, salida: 1 } }),
  };
});

const { POST } = await import('@/app/api/agent/route');

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

  it('exige el token cuando AGENT_ACCESS_TOKEN está definido', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.stubEnv('AGENT_ACCESS_TOKEN', 'secreto');
    expect((await POST(peticion({ mensaje: 'Hola' }))).status).toBe(401);
    expect((await POST(peticion({ mensaje: 'Hola' }, { Authorization: 'Bearer secreto' }))).status).toBe(200);
  });
});
