import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/agent/route';
import { GET } from '@/app/api/conversaciones/[id]/route';
import { SALUDO } from '@/lib/entrevista';
import { reiniciarStore } from '@/lib/store';

function peticion(cuerpo: unknown, encabezados: Record<string, string> = {}) {
  return new Request('http://localhost/api/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...encabezados },
    body: typeof cuerpo === 'string' ? cuerpo : JSON.stringify(cuerpo),
  });
}

describe('POST /api/agent', () => {
  beforeEach(() => {
    vi.stubEnv('AGENT_MODE', 'reglas');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    reiniciarStore();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('abre una conversación con el saludo y mantiene el contrato de E3', async () => {
    const res = await POST(peticion({ mensaje: 'Hola' }));
    expect(res.status).toBe(200);
    const datos = await res.json();
    expect(datos).toMatchObject({ respuesta: SALUDO, estado: 'esperando_consentimiento', modelo: 'reglas' });
    expect(datos.conversacionId).toEqual(expect.any(String));
    expect(datos.tokens).toEqual({ entrada: 0, salida: 0 });
  });

  it('continúa la conversación y la transcripción queda disponible', async () => {
    const { conversacionId } = await (await POST(peticion({ mensaje: 'Hola' }))).json();
    const res = await POST(peticion({ mensaje: 'Sí', conversacionId }));
    expect((await res.json()).estado).toBe('en_curso');

    const transcripcion = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: conversacionId }) });
    const datos = await transcripcion.json();
    expect(datos.turnos.map((t: { rol: string }) => t.rol)).toEqual(['candidato', 'agente', 'candidato', 'agente']);
  });

  it('responde 400 con entrada inválida y 404 con una conversación inexistente', async () => {
    expect((await POST(peticion('no es json'))).status).toBe(400);
    expect((await POST(peticion({ mensaje: '' }))).status).toBe(400);
    expect((await POST(peticion({ mensaje: 'Hola', conversacionId: 'no-existe' }))).status).toBe(404);
  });

  it('exige el token cuando está configurado', async () => {
    vi.stubEnv('AGENT_ACCESS_TOKEN', 'secreto');
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect((await POST(peticion({ mensaje: 'Hola' }))).status).toBe(401);
    expect((await POST(peticion({ mensaje: 'Hola' }, { Authorization: 'Bearer secreto' }))).status).toBe(200);
  });
});
