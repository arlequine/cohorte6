import { describe, expect, it } from 'vitest';
import {
  CIERRE,
  MAX_CARACTERES,
  PREGUNTAS,
  RESPUESTA_ESCALADA,
  RESPUESTA_SIN_CONSENTIMIENTO,
  RESPUESTA_SOY_IA,
  SALUDO,
  iniciar,
  motorReglas,
  pideInformacionNoCargada,
  preguntaSiEsIA,
  procesar,
  validarMensaje,
} from '@/lib/entrevista';

describe('validarMensaje', () => {
  it('rechaza mensajes vacíos, que no son texto o demasiado largos', () => {
    expect(validarMensaje('')).not.toBeNull();
    expect(validarMensaje(42)).not.toBeNull();
    expect(validarMensaje('a'.repeat(MAX_CARACTERES + 1))).not.toBeNull();
    expect(validarMensaje('Hola')).toBeNull();
  });
});

describe('principios del PRD garantizados en código', () => {
  it('el saludo dice que es una IA y pide consentimiento', () => {
    const conversacion = iniciar('c1');
    expect(conversacion.turnos[0].texto).toBe(SALUDO);
    expect(SALUDO).toMatch(/inteligencia artificial/);
    expect(SALUDO).toMatch(/¿Aceptas continuar\?/);
  });

  it('sin consentimiento no hace preguntas de evaluación', async () => {
    const conversacion = iniciar('c2');
    const { respuesta } = await procesar(conversacion, 'No, gracias', motorReglas);
    expect(respuesta).toBe(RESPUESTA_SIN_CONSENTIMIENTO);
    expect(conversacion.estado).toBe('rechazada');
    expect(conversacion.preguntasHechas).toBe(0);
  });

  it('una respuesta ambigua vuelve a pedir el consentimiento', async () => {
    const conversacion = iniciar('c3');
    const { respuesta } = await procesar(conversacion, 'Quizás', motorReglas);
    expect(respuesta).toMatch(/necesito tu consentimiento/);
    expect(conversacion.estado).toBe('esperando_consentimiento');
  });

  it('nunca niega ser una IA (RT5)', async () => {
    const conversacion = iniciar('c4');
    expect((await procesar(conversacion, '¿Eres un robot?', motorReglas)).respuesta).toBe(RESPUESTA_SOY_IA);
    expect(preguntaSiEsIA('oye, ¿hablo con una persona?')).toBe(true);
  });

  it('escala salario y beneficios sin inventar cifras (RT1)', async () => {
    const conversacion = iniciar('c5');
    await procesar(conversacion, 'Sí', motorReglas);
    const { respuesta } = await procesar(conversacion, '¿Cuánto pagan?', motorReglas);
    expect(respuesta).toBe(RESPUESTA_ESCALADA);
    expect(conversacion.escalaciones).toEqual(['¿Cuánto pagan?']);
    expect(conversacion.preguntasHechas).toBe(1);
    expect(pideInformacionNoCargada('¿Tienen prestaciones de ley?')).toBe(true);
  });
});

describe('entrevista completa con el motor de reglas', () => {
  it('hace las preguntas en orden y cierra con próximos pasos', async () => {
    const conversacion = iniciar('c6');
    const primera = await procesar(conversacion, 'Sí, acepto', motorReglas);
    expect(primera.respuesta).toContain(PREGUNTAS[0]);
    for (let i = 1; i < PREGUNTAS.length; i++) {
      expect((await procesar(conversacion, 'Mi respuesta', motorReglas)).respuesta).toContain(PREGUNTAS[i]);
    }
    expect((await procesar(conversacion, 'Última respuesta', motorReglas)).respuesta).toBe(CIERRE);
    expect(conversacion.estado).toBe('finalizada');
    expect((await procesar(conversacion, 'Hola de nuevo', motorReglas)).respuesta).toMatch(/ya terminó/);
  });
});
