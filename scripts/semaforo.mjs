#!/usr/bin/env node
// Semáforo de la cohorte: estado de las entregas de todos los alumnos, en CSV.
//
// Lee los PR de cada repo de alumno, toma los que tienen etiqueta estacion-N o nivelacion-N y extrae
// el resultado del Juez de su comentario. Úsalo con la cuenta de un mentor que sea colaborador de los repos.
//
//   GITHUB_TOKEN=... node scripts/semaforo.mjs alumnos.csv > semaforo.csv
//   GITHUB_TOKEN=... node scripts/semaforo.mjs alumnos.csv --estacion estacion-3
//
// alumnos.csv tiene una línea por alumno: nombre,owner/repo (las líneas con # se ignoran).
// Con --estacion, solo muestra esa estación e incluye a quien todavía no abrió PR (estado sin-pr).

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const COLUMNAS = ['alumno', 'repo', 'etiqueta', 'pr', 'estado', 'semaforo', 'puntaje', 'actualizado'];
const ETIQUETA = /^(estacion|nivelacion)-\d+$/;

export function leerAlumnos(texto) {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const [nombre, repo] = l.split(',').map((c) => c.trim());
      if (!repo || !/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error(`Línea inválida en la lista de alumnos: "${l}"`);
      return { nombre, repo };
    });
}

/** Lee puntaje y color del comentario del Juez (ver plantilla-alumno/scripts/juez.ts). */
export function leerJuez(cuerpo) {
  const m = /<!-- juez-ai4dev puntaje=(\d+) color=(\w+)/.exec(cuerpo ?? '');
  return m ? { puntaje: Number(m[1]), semaforo: m[2] } : null;
}

export function estadoPR(pr) {
  if (pr.merged_at) return 'fusionado';
  if (pr.state === 'closed') return 'cerrado';
  return pr.draft ? 'borrador' : 'abierto';
}

function celdaCSV(valor) {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function aCSV(filas) {
  return [COLUMNAS.join(','), ...filas.map((f) => COLUMNAS.map((c) => celdaCSV(f[c])).join(','))].join('\n');
}

function cliente(token, fetchFn) {
  return async (ruta) => {
    const r = await fetchFn(`https://api.github.com${ruta}`, {
      headers: { accept: 'application/vnd.github+json', authorization: `Bearer ${token}`, 'x-github-api-version': '2022-11-28' },
    });
    if (!r.ok) throw new Error(`GitHub respondió ${r.status} en ${ruta}`);
    return r.json();
  };
}

export async function semaforoDeAlumno(alumno, { token, estacion, fetch: fetchFn = fetch }) {
  const api = cliente(token, fetchFn);
  let prs;
  try {
    prs = await api(`/repos/${alumno.repo}/pulls?state=all&per_page=100`);
  } catch (e) {
    return [{ alumno: alumno.nombre, repo: alumno.repo, estado: `error: ${e.message}` }];
  }

  const filas = [];
  for (const pr of prs) {
    const etiqueta = pr.labels.map((l) => l.name).find((n) => ETIQUETA.test(n));
    if (!etiqueta || (estacion && etiqueta !== estacion)) continue;
    const comentarios = await api(`/repos/${alumno.repo}/issues/${pr.number}/comments?per_page=100`);
    const juez = comentarios.map((c) => leerJuez(c.body)).find(Boolean);
    filas.push({
      alumno: alumno.nombre,
      repo: alumno.repo,
      etiqueta,
      pr: pr.html_url,
      estado: estadoPR(pr),
      semaforo: juez?.semaforo ?? 'sin-juez',
      puntaje: juez?.puntaje ?? '',
      actualizado: pr.updated_at,
    });
  }
  if (estacion && filas.length === 0) filas.push({ alumno: alumno.nombre, repo: alumno.repo, etiqueta: estacion, estado: 'sin-pr' });
  return filas;
}

async function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--estacion');
  const estacion = i >= 0 ? args.splice(i, 2)[1] : null;
  const archivo = args[0];
  const token = process.env.GITHUB_TOKEN;
  if (!archivo || !token || (i >= 0 && !ETIQUETA.test(estacion ?? ''))) {
    console.error('Uso: GITHUB_TOKEN=... node scripts/semaforo.mjs alumnos.csv [--estacion estacion-N]');
    process.exit(2);
  }
  const filas = [];
  for (const alumno of leerAlumnos(readFileSync(archivo, 'utf8'))) {
    filas.push(...(await semaforoDeAlumno(alumno, { token, estacion })));
  }
  console.log(aCSV(filas));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
