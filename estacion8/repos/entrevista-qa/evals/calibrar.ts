/**
 * Calibración del Juez: medir al medidor. Califica las conversaciones del golden dataset, cuyos
 * puntajes esperados pusieron personas, y compara. Falla si el Juez se aleja de las personas.
 *
 *   npm run evals:calibrar
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { clienteAnthropic } from './anthropic';
import { revisarCriticos, type TurnoEval } from './criticos';
import { calificar } from './juez';
import type { Dimension } from './rubrica';

export interface CasoDorado {
  id: string;
  descripcion: string;
  turnos: TurnoEval[];
  esperado: Partial<Record<Dimension, number>>;
  criticos_esperados: string[];
}

/** Concordancia: proporción de puntajes esperados que el Juez reproduce con una diferencia de 1 o menos. */
export function concordancia(esperado: Partial<Record<Dimension, number>>, obtenido: Record<Dimension, number>): number {
  const dims = Object.keys(esperado) as Dimension[];
  if (dims.length === 0) return 1;
  return dims.filter((d) => Math.abs((esperado[d] ?? 0) - obtenido[d]) <= 1).length / dims.length;
}

export const CONCORDANCIA_MINIMA = 0.8;

async function main() {
  const casos = JSON.parse(readFileSync(new URL('./golden-dataset.json', import.meta.url), 'utf8')) as CasoDorado[];
  const cliente = clienteAnthropic();
  let total = 0;
  let fallas = 0;
  for (const caso of casos) {
    const { puntajes } = await calificar(cliente, caso.turnos);
    const c = concordancia(caso.esperado, puntajes);
    const criticos = revisarCriticos(caso.turnos).map((f) => f.caso).sort();
    const criticosOk = JSON.stringify(criticos) === JSON.stringify([...caso.criticos_esperados].sort());
    total += c;
    if (!criticosOk) fallas += 1;
    console.log(`${c >= CONCORDANCIA_MINIMA && criticosOk ? '✅' : '❌'} ${caso.id}: concordancia ${(c * 100).toFixed(0)} %, críticos ${criticos.join(', ') || '—'} (esperados ${caso.criticos_esperados.join(', ') || '—'})`);
    for (const [d, esperado] of Object.entries(caso.esperado)) {
      console.log(`     ${d.padEnd(24)} esperado ${esperado} · Juez ${puntajes[d as Dimension]}`);
    }
  }
  const media = total / casos.length;
  console.log(`\nConcordancia media: ${(media * 100).toFixed(0)} % (mínimo ${CONCORDANCIA_MINIMA * 100} %)`);
  if (media < CONCORDANCIA_MINIMA || fallas > 0) process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
