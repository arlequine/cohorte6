import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aCSV, estadoPR, leerAlumnos, leerJuez, semaforoDeAlumno } from './semaforo.mjs';

test('leerAlumnos ignora comentarios y valida el repo', () => {
  assert.deepEqual(leerAlumnos('# lista\nAna López, ana/producto\n\n'), [{ nombre: 'Ana López', repo: 'ana/producto' }]);
  assert.throws(() => leerAlumnos('Ana, no-es-un-repo'), /inválida/);
});

test('leerJuez extrae puntaje y color del marcador', () => {
  assert.deepEqual(leerJuez('<!-- juez-ai4dev -->\n<!-- juez-ai4dev puntaje=75 color=amarillo etiqueta=estacion-3 -->'), { puntaje: 75, semaforo: 'amarillo' });
  assert.equal(leerJuez('LGTM'), null);
});

test('estadoPR', () => {
  assert.equal(estadoPR({ state: 'closed', merged_at: '2026-11-01' }), 'fusionado');
  assert.equal(estadoPR({ state: 'closed', merged_at: null }), 'cerrado');
  assert.equal(estadoPR({ state: 'open', draft: true }), 'borrador');
});

test('aCSV escapa comas y comillas', () => {
  assert.equal(aCSV([{ alumno: 'López, Ana', estado: 'abierto' }]).split('\n')[1], '"López, Ana",,,,abierto,,,');
});

function fetchFalso(respuestas) {
  return async (url) => {
    const ruta = new URL(url).pathname;
    const datos = respuestas[ruta];
    return datos === undefined ? new Response('', { status: 404 }) : new Response(JSON.stringify(datos), { status: 200 });
  };
}

const respuestas = {
  '/repos/ana/producto/pulls': [
    { number: 3, html_url: 'https://github.com/ana/producto/pull/3', state: 'open', draft: false, merged_at: null, updated_at: '2026-11-02', labels: [{ name: 'estacion-3' }, { name: 'semaforo-verde' }] },
    { number: 2, html_url: 'https://github.com/ana/producto/pull/2', state: 'closed', merged_at: '2026-10-20', updated_at: '2026-10-20', labels: [{ name: 'nivelacion-2' }] },
    { number: 1, html_url: 'https://github.com/ana/producto/pull/1', state: 'closed', merged_at: null, updated_at: '2026-10-10', labels: [{ name: 'chore' }] },
  ],
  '/repos/ana/producto/issues/3/comments': [{ body: '<!-- juez-ai4dev -->\n<!-- juez-ai4dev puntaje=90 color=verde etiqueta=estacion-3 -->' }],
  '/repos/ana/producto/issues/2/comments': [],
};

test('semaforoDeAlumno lista las entregas con el resultado del Juez', async () => {
  const filas = await semaforoDeAlumno({ nombre: 'Ana', repo: 'ana/producto' }, { token: 't', fetch: fetchFalso(respuestas) });
  assert.deepEqual(
    filas.map((f) => [f.etiqueta, f.estado, f.semaforo, f.puntaje]),
    [
      ['estacion-3', 'abierto', 'verde', 90],
      ['nivelacion-2', 'fusionado', 'sin-juez', ''],
    ],
  );
});

test('con --estacion marca a quien no ha abierto PR', async () => {
  const filas = await semaforoDeAlumno({ nombre: 'Ana', repo: 'ana/producto' }, { token: 't', estacion: 'estacion-4', fetch: fetchFalso(respuestas) });
  assert.deepEqual(filas, [{ alumno: 'Ana', repo: 'ana/producto', etiqueta: 'estacion-4', estado: 'sin-pr' }]);
});

test('un repo inaccesible no detiene el reporte', async () => {
  const filas = await semaforoDeAlumno({ nombre: 'Beto', repo: 'beto/privado' }, { token: 't', fetch: fetchFalso({}) });
  assert.match(filas[0].estado, /error: GitHub respondió 404/);
});
