import { expect, test } from '@playwright/test';
import { PeticionAgente, abrirConversacion } from '../fixtures/peticiones';

test.describe('Contrato de POST /api/agent', () => {
  test('una conversación nueva responde con el contrato completo', async ({ request }) => {
    const inicio = Date.now();
    const res = await new PeticionAgente(request).conMensaje('Hola').enviar();
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('application/json');
    expect(Date.now() - inicio).toBeLessThan(2000);

    const cuerpo = await res.json();
    expect(cuerpo).toEqual({
      conversacionId: expect.any(String),
      respuesta: expect.any(String),
      estado: 'esperando_consentimiento',
      modelo: expect.any(String),
      tokens: { entrada: expect.any(Number), salida: expect.any(Number) },
    });
  });

  test('los errores siguen el formato { error } con el código correcto', async ({ request }) => {
    const sinMensaje = await new PeticionAgente(request).sinMensaje().enviar();
    expect(sinMensaje.status()).toBe(400);
    expect(await sinMensaje.json()).toEqual({ error: expect.any(String) });

    const demasiadoLargo = await new PeticionAgente(request).conMensaje('a'.repeat(1001)).enviar();
    expect(demasiadoLargo.status()).toBe(400);

    const inexistente = await new PeticionAgente(request).conMensaje('Hola').enConversacion('no-existe').enviar();
    expect(inexistente.status()).toBe(404);
  });

  test('la transcripción de una conversación está disponible para el reclutador', async ({ request }) => {
    const id = await abrirConversacion(request);
    const res = await request.get(`/api/conversaciones/${id}`);
    expect(res.status()).toBe(200);
    const conversacion = await res.json();
    expect(conversacion).toMatchObject({ id, estado: 'esperando_consentimiento', escalaciones: [] });
    expect(conversacion.turnos).toHaveLength(2);
  });
});
