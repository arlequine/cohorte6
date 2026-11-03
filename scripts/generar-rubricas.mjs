#!/usr/bin/env node
// Genera rubricas/<etiqueta>.json a partir de las secciones "Rúbrica" y "Entregable" de cada guía.
// La guía (README.md) es la única fuente; el Juez de los repos de los alumnos lee los JSON generados.
//
// Uso:
//   node scripts/generar-rubricas.mjs           regenera los JSON
//   node scripts/generar-rubricas.mjs --check   falla si algún JSON no coincide con su guía (para CI)

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = new URL('..', import.meta.url).pathname;
const SALIDA = join(RAIZ, 'rubricas');

/** nivelacion1 → nivelacion-1, estacion10 → estacion-10 */
function etiqueta(carpeta) {
  const m = carpeta.match(/^(nivelacion|estacion)(\d+)$/);
  return m ? `${m[1]}-${m[2]}` : null;
}

/** Texto de una sección "## Título" hasta la siguiente "## ". */
export function seccion(markdown, titulo) {
  const lineas = markdown.split('\n');
  const inicio = lineas.findIndex((l) => l.trim() === `## ${titulo}`);
  if (inicio === -1) return null;
  const fin = lineas.findIndex((l, i) => i > inicio && l.startsWith('## '));
  return lineas.slice(inicio + 1, fin === -1 ? undefined : fin).join('\n').trim();
}

function celdas(fila) {
  return fila.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
}

/** Lee la tabla Criterio | Cumple | Parcial | No cumple. */
export function criterios(textoRubrica) {
  const filas = textoRubrica.split('\n').filter((l) => l.trim().startsWith('|'));
  if (filas.length < 3) return [];
  const encabezado = celdas(filas[0]).map((c) => c.toLowerCase());
  const esperado = ['criterio', 'cumple', 'parcial', 'no cumple'];
  if (esperado.some((e, i) => encabezado[i] !== e)) {
    throw new Error(`Encabezado de rúbrica inesperado: ${filas[0]}`);
  }
  return filas.slice(2).map((f) => {
    const [nombre, cumple, parcial, noCumple] = celdas(f);
    return { nombre, cumple, parcial: parcial === '—' ? null : parcial, no_cumple: noCumple };
  });
}

export function construir(carpeta, markdown) {
  const textoRubrica = seccion(markdown, 'Rúbrica');
  if (!textoRubrica) return null;
  const titulo = (markdown.match(/^# (.+)$/m) ?? [])[1] ?? carpeta;
  const notas = textoRubrica.split('\n').filter((l) => l.trim() && !l.trim().startsWith('|')).join(' ').trim();
  return {
    etiqueta: etiqueta(carpeta),
    titulo,
    fuente: `${carpeta}/README.md`,
    entregable: seccion(markdown, 'Entregable') ?? seccion(markdown, 'Tu tarea'),
    notas: notas || null,
    criterios: criterios(textoRubrica),
  };
}

function generar() {
  const resultado = {};
  for (const carpeta of readdirSync(RAIZ).sort()) {
    if (!etiqueta(carpeta)) continue;
    const readme = join(RAIZ, carpeta, 'README.md');
    if (!existsSync(readme)) continue;
    const rubrica = construir(carpeta, readFileSync(readme, 'utf8'));
    if (rubrica) resultado[`${rubrica.etiqueta}.json`] = JSON.stringify(rubrica, null, 2) + '\n';
  }
  return resultado;
}

function main() {
const archivos = generar();
if (process.argv.includes('--check')) {
  const desactualizados = Object.entries(archivos).filter(([nombre, contenido]) => {
    const ruta = join(SALIDA, nombre);
    return !existsSync(ruta) || readFileSync(ruta, 'utf8') !== contenido;
  });
  const sobrantes = existsSync(SALIDA) ? readdirSync(SALIDA).filter((n) => n.endsWith('.json') && !archivos[n]) : [];
  if (desactualizados.length || sobrantes.length) {
    for (const [n] of desactualizados) console.error(`Desactualizada: rubricas/${n}`);
    for (const n of sobrantes) console.error(`Sin guía de origen: rubricas/${n}`);
    console.error('Corre: node scripts/generar-rubricas.mjs');
    process.exit(1);
  }
  console.log(`Rúbricas sincronizadas: ${Object.keys(archivos).length}`);
} else {
  mkdirSync(SALIDA, { recursive: true });
  for (const [nombre, contenido] of Object.entries(archivos)) writeFileSync(join(SALIDA, nombre), contenido);
  console.log(`Generadas: ${Object.keys(archivos).join(', ')}`);
}
}

if (import.meta.url === new URL(`file://${process.argv[1]}`).href) main();
