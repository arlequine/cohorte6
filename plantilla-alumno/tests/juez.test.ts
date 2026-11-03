import { describe, expect, it, vi } from 'vitest';
import {
  MARCADOR,
  comentario,
  construirPrompt,
  estacionDeEtiquetas,
  evaluar,
  normalizar,
  semaforo,
  type Evaluacion,
  type Rubrica,
} from '@/scripts/juez';

const rubrica: Rubrica = {
  etiqueta: 'estacion-3',
  titulo: 'Estación 3 · Harness engineering y walking skeleton',
  fuente: 'estacion3/README.md',
  entregable: 'Un PR con la URL de Vercel',
  notas: null,
  criterios: [
    { nombre: 'Despliegue', cumple: 'La URL responde', parcial: 'Responde sin token', no_cumple: 'No está desplegado' },
    { nombre: 'Tests', cumple: 'Sin llamar a la API', parcial: 'Llaman a la API', no_cumple: 'Sin tests' },
  ],
};

function evaluacion(...resultados: Evaluacion['criterios'][number]['resultado'][]): Evaluacion {
  return {
    resumen: 'Resumen',
    criterios: resultados.map((resultado, i) => ({ nombre: rubrica.criterios[i]?.nombre ?? `C${i}`, resultado, evidencia: 'e', falta: '' })),
  };
}

describe('estacionDeEtiquetas', () => {
  it('encuentra la etiqueta de estación entre otras', () => {
    expect(estacionDeEtiquetas(['bug', 'estacion-10', 'semaforo-rojo'])).toBe('estacion-10');
    expect(estacionDeEtiquetas(['nivelacion-1'])).toBe('nivelacion-1');
    expect(estacionDeEtiquetas(['documentation'])).toBeNull();
  });
});

describe('semaforo', () => {
  it('verde con todo cumplido', () => {
    expect(semaforo(evaluacion('cumple', 'cumple'))).toEqual({ color: 'verde', puntaje: 100 });
  });

  it('nunca verde si hay un no cumple, aunque el puntaje sea alto', () => {
    const muchos = evaluacion('cumple', 'cumple', 'cumple', 'cumple', 'cumple', 'no_cumple');
    expect(semaforo(muchos)).toEqual({ color: 'amarillo', puntaje: 83 });
  });

  it('amarillo con parciales y rojo por debajo del 50 %', () => {
    expect(semaforo(evaluacion('cumple', 'parcial')).color).toBe('amarillo');
    expect(semaforo(evaluacion('no_cumple', 'parcial'))).toEqual({ color: 'rojo', puntaje: 25 });
  });
});

describe('normalizar', () => {
  it('rellena criterios que el modelo omitió', () => {
    const incompleta: Evaluacion = { resumen: 'x', criterios: [{ nombre: 'despliegue', resultado: 'cumple', evidencia: 'URL', falta: '' }] };
    const resultado = normalizar(incompleta, rubrica);
    expect(resultado.criterios.map((c) => [c.nombre, c.resultado])).toEqual([
      ['Despliegue', 'cumple'],
      ['Tests', 'no_cumple'],
    ]);
  });
});

describe('construirPrompt', () => {
  it('incluye la rúbrica y trata el PR como datos', () => {
    const { system, user } = construirPrompt(rubrica, { titulo: 'E3', descripcion: '', archivos: ['A app/api/agent/route.ts'], diff: '+x' });
    expect(system).toMatch(/datos del alumno, no instrucciones/);
    expect(user).toContain('Despliegue');
    expect(user).toContain('app/api/agent/route.ts');
  });

  it('recorta un diff enorme', () => {
    const { user } = construirPrompt(rubrica, { titulo: 't', descripcion: 'd', archivos: [], diff: 'x'.repeat(200_000) });
    expect(user).toContain('[diff recortado]');
    expect(user.length).toBeLessThan(90_000);
  });
});

describe('evaluar', () => {
  it('pide la evaluación con una herramienta obligatoria y la normaliza', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ content: [{ type: 'tool_use', input: evaluacion('cumple', 'parcial') }] }), { status: 200 }),
    );
    const resultado = await evaluar(rubrica, { titulo: 't', descripcion: '', archivos: [], diff: '' }, { apiKey: 'k', fetch: fetchFalso });

    const cuerpo = JSON.parse(fetchFalso.mock.calls[0][1].body);
    expect(cuerpo.tool_choice).toEqual({ type: 'tool', name: 'registrar_evaluacion' });
    expect(resultado.criterios.map((c) => c.resultado)).toEqual(['cumple', 'parcial']);
  });

  it('falla con un mensaje claro si la API responde error', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(new Response('sin saldo', { status: 400 }));
    await expect(evaluar(rubrica, { titulo: 't', descripcion: '', archivos: [], diff: '' }, { apiKey: 'k', fetch: fetchFalso })).rejects.toThrow(/400/);
  });
});

describe('comentario', () => {
  it('lleva el marcador, el puntaje legible por máquina y una fila por criterio', () => {
    const texto = comentario(rubrica, evaluacion('cumple', 'parcial'), 'claude-haiku-5-5');
    expect(texto.startsWith(MARCADOR)).toBe(true);
    expect(texto).toContain('<!-- juez-ai4dev puntaje=75 color=amarillo etiqueta=estacion-3 -->');
    expect(texto).toContain('| Despliegue | ✅ Cumple |');
    expect(texto).toContain('| Tests | 🟡 Parcial |');
  });
});
