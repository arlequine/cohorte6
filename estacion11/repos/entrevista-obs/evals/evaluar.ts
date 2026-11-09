/**
 * Evaluación del agente con Persona + Juez. Es el gate de calidad del agente en CI.
 *
 *   AGENT_URL=http://localhost:3000 npm run evals            → todas las personas
 *   AGENT_URL=... npm run evals -- --persona sofia           → una persona
 *
 * Por cada persona: la Persona conversa con el agente real por HTTP, se revisan los fallos críticos
 * (criticos.ts) y el Juez califica con la rúbrica (rubrica.ts). Escribe un reporte en evals/reportes/
 * y sale con código 1 si alguna persona reprueba: así bloquea el merge.
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { clienteAnthropic, MODELO_JUEZ, MODELO_PERSONA, type ClienteLLM } from './anthropic';
import { revisarCriticos, type FalloCritico, type TurnoEval } from './criticos';
import { calificar } from './juez';
import { siguienteMensaje, type Persona } from './persona';
import { aprueba, promedio, UMBRALES, type Calificacion } from './rubrica';

const AGENT_URL = (process.env.AGENT_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const MAX_TURNOS = Number(process.env.MAX_TURNOS ?? 10);

export interface Resultado {
  persona: string;
  caso: string;
  aprobado: boolean;
  promedio: number;
  calificacion: Calificacion;
  criticos: FalloCritico[];
  turnos: TurnoEval[];
}

async function hablarConAgente(mensaje: string, conversacionId?: string) {
  const res = await fetch(`${AGENT_URL}/api/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.AGENT_ACCESS_TOKEN ? { Authorization: `Bearer ${process.env.AGENT_ACCESS_TOKEN}` } : {}),
    },
    body: JSON.stringify(conversacionId ? { mensaje, conversacionId } : { mensaje }),
  });
  if (!res.ok) throw new Error(`El agente respondió ${res.status}: ${await res.text()}`);
  return (await res.json()) as { conversacionId: string; respuesta: string; estado: string };
}

export async function evaluarPersona(cliente: ClienteLLM, persona: Persona): Promise<Resultado> {
  const turnos: TurnoEval[] = [];
  let conversacionId: string | undefined;
  for (let i = 0; i < MAX_TURNOS; i++) {
    const mensaje = await siguienteMensaje(cliente, persona, turnos);
    turnos.push({ rol: 'candidato', texto: mensaje });
    const respuesta = await hablarConAgente(mensaje, conversacionId);
    conversacionId = respuesta.conversacionId;
    turnos.push({ rol: 'agente', texto: respuesta.respuesta });
    if (respuesta.estado === 'finalizada' || respuesta.estado === 'rechazada') break;
  }
  const criticos = revisarCriticos(turnos);
  const calificacion = await calificar(cliente, turnos);
  return {
    persona: persona.id,
    caso: persona.caso,
    aprobado: criticos.length === 0 && aprueba(calificacion.puntajes),
    promedio: promedio(calificacion.puntajes),
    calificacion,
    criticos,
    turnos,
  };
}

export function resumenMarkdown(resultados: Resultado[]): string {
  const dimensiones = Object.keys(resultados[0]?.calificacion.puntajes ?? {});
  const filas = resultados.map(
    (r) =>
      `| ${r.aprobado ? '✅' : '❌'} ${r.persona} | ${r.caso} | ${dimensiones.map((d) => r.calificacion.puntajes[d as keyof typeof r.calificacion.puntajes]).join(' | ')} | ${r.promedio} | ${r.criticos.map((c) => c.caso).join(', ') || '—'} |`,
  );
  return [
    '## Evaluación del agente (Persona + Juez)',
    '',
    `Umbral: cada dimensión ≥ ${UMBRALES.minimo}, promedio ≥ ${UMBRALES.promedio} y ningún fallo crítico. Persona: \`${MODELO_PERSONA}\` · Juez: \`${MODELO_JUEZ}\``,
    '',
    `| Persona | Caso | ${dimensiones.join(' | ')} | Promedio | Críticos |`,
    `|---|---|${dimensiones.map(() => '---').join('|')}|---|---|`,
    ...filas,
  ].join('\n');
}

async function main() {
  const todas = JSON.parse(readFileSync(new URL('./personas.json', import.meta.url), 'utf8')) as Persona[];
  const i = process.argv.indexOf('--persona');
  const personas = i >= 0 ? todas.filter((p) => p.id === process.argv[i + 1]) : todas;
  if (personas.length === 0) throw new Error(`No existe la persona ${process.argv[i + 1]}.`);

  const cliente = clienteAnthropic();
  const resultados: Resultado[] = [];
  for (const persona of personas) {
    console.log(`▶ ${persona.id} (${persona.caso})`);
    const r = await evaluarPersona(cliente, persona);
    console.log(`  ${r.aprobado ? 'APROBADO' : 'REPROBADO'} · promedio ${r.promedio} · críticos: ${r.criticos.map((c) => c.caso).join(', ') || 'ninguno'}`);
    resultados.push(r);
  }

  mkdirSync(new URL('./reportes/', import.meta.url), { recursive: true });
  const archivo = new URL(`./reportes/evaluacion-${new Date().toISOString().replace(/[:.]/g, '-')}.json`, import.meta.url);
  writeFileSync(archivo, JSON.stringify({ fecha: new Date().toISOString(), agente: AGENT_URL, resultados }, null, 2));
  const resumen = resumenMarkdown(resultados);
  console.log(`\n${resumen}\n\nReporte: ${archivo.pathname}`);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${resumen}\n`);

  if (resultados.some((r) => !r.aprobado)) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
