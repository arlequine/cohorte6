import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { concordancia, type CasoDorado } from '@/evals/calibrar';
import { revisarCriticos } from '@/evals/criticos';
import { evaluarPersona } from '@/evals/evaluar';
import { calificar, normalizar } from '@/evals/juez';
import { aprueba, promedio } from '@/evals/rubrica';
import type { ClienteLLM } from '@/evals/anthropic';

const golden = JSON.parse(readFileSync(new URL('../evals/golden-dataset.json', import.meta.url), 'utf8')) as CasoDorado[];
const todo = (n: number) => ({ factualidad: n, cobertura: n, repreguntas: n, transparencia: n, contencion: n, calidad_conversacional: n });

describe('fallos críticos mecánicos', () => {
  it.each(golden.map((c) => [c.id, c]))('detecta exactamente los críticos esperados en "%s"', (_, caso) => {
    expect(revisarCriticos(caso.turnos).map((f) => f.caso).sort()).toEqual([...caso.criticos_esperados].sort());
  });

  it('el saludo de la app pasa la verificación de transparencia', async () => {
    const { SALUDO } = await import('@/lib/entrevista');
    expect(revisarCriticos([{ rol: 'agente', texto: SALUDO }])).toEqual([]);
  });
});

describe('rúbrica', () => {
  it('aprueba con todo en 4 y reprueba con una dimensión bajo el mínimo', () => {
    expect(aprueba(todo(4))).toBe(true);
    expect(aprueba({ ...todo(5), repreguntas: 2 })).toBe(false);
    expect(promedio({ ...todo(4), repreguntas: 1 })).toBe(3.5);
  });

  it('una dimensión omitida por el Juez cuenta como 1', () => {
    const c = normalizar({ evaluaciones: [{ dimension: 'factualidad', puntaje: 5, evidencia: '[2]' }], resumen: 'ok' });
    expect(c.puntajes.factualidad).toBe(5);
    expect(c.puntajes.repreguntas).toBe(1);
    expect(aprueba(c.puntajes)).toBe(false);
  });

  it('concordancia tolera una diferencia de 1 punto', () => {
    expect(concordancia({ factualidad: 5, repreguntas: 1 }, { ...todo(4), repreguntas: 3 })).toBe(0.5);
  });
});

describe('evaluarPersona', () => {
  it('conversa con el agente por HTTP, revisa críticos y llama al Juez', async () => {
    const create = vi.fn().mockImplementation(async (args: { tools: { name: string }[] }) => {
      const herramienta = args.tools[0].name;
      const input =
        herramienta === 'enviar_mensaje'
          ? { mensaje: 'Sí' }
          : { evaluaciones: Object.keys(todo(4)).map((d) => ({ dimension: d, puntaje: 4, evidencia: '[2]' })), resumen: 'Bien' };
      return { content: [{ type: 'tool_use', id: 't', name: herramienta, input }], usage: { input_tokens: 1, output_tokens: 1 } };
    });
    const cliente = { messages: { create } } as unknown as ClienteLLM;
    const respuestas = [
      { conversacionId: 'c1', respuesta: 'Soy una inteligencia artificial. ¿Aceptas continuar?', estado: 'esperando_consentimiento' },
      { conversacionId: 'c1', respuesta: 'Gracias por tus respuestas.', estado: 'finalizada' },
    ];
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify(respuestas.shift()), { status: 200 })));

    const persona = { id: 'p', nombre: 'P', perfil: '', estilo: '', objetivo: '', caso: 'prueba' };
    const r = await evaluarPersona(cliente, persona);
    expect(r.turnos).toHaveLength(4);
    expect(r.criticos).toEqual([]);
    expect(r.aprobado).toBe(true);
    vi.unstubAllGlobals();
  });

  it('el Juez recibe la transcripción numerada', async () => {
    const create = vi.fn().mockResolvedValue({
      content: [{ type: 'tool_use', id: 't', name: 'registrar_calificacion', input: { evaluaciones: [], resumen: '' } }],
      usage: { input_tokens: 1, output_tokens: 1 },
    });
    await calificar({ messages: { create } } as unknown as ClienteLLM, [{ rol: 'candidato', texto: 'Hola' }]);
    expect(create.mock.calls[0][0].messages[0].content).toContain('[1] CANDIDATO: Hola');
  });
});
