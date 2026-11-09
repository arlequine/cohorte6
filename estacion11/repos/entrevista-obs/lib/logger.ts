import { SeverityNumber, logs, type Attributes } from '@opentelemetry/api';
import { contextoDeTraza } from '@/lib/telemetria';

type Nivel = 'info' | 'warn' | 'error';

const SEVERIDAD: Record<Nivel, SeverityNumber> = {
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
  error: SeverityNumber.ERROR,
};

/**
 * Escribe un log estructurado en JSON, una línea por evento, con el `trace_id` y el `span_id` activos.
 *
 * El mismo evento sale por dos caminos:
 *   - stdout, que leen Vercel, CloudWatch o cualquier backend de logs;
 *   - la API de logs de OpenTelemetry, que lo manda al Collector (y a Loki) correlacionado con el trace.
 *     Sin SDK registrado, este camino no hace nada.
 */
export function log(nivel: Nivel, mensaje: string, campos: Record<string, unknown> = {}): void {
  const traza = contextoDeTraza();
  const linea = JSON.stringify({ ts: new Date().toISOString(), nivel, mensaje, ...traza, ...campos });
  if (nivel === 'error') console.error(linea);
  else console.log(linea);

  // El trace_id y el span_id viajan solos: el SDK los toma del contexto activo.
  logs.getLogger('entrevista-ai').emit({
    severityNumber: SEVERIDAD[nivel],
    severityText: nivel.toUpperCase(),
    body: mensaje,
    attributes: campos as Attributes,
  });
}
