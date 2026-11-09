/**
 * Next.js llama a `register()` una vez, al arrancar el servidor y antes de atender requests.
 * https://nextjs.org/docs/app/guides/open-telemetry
 *
 * El SDK solo se carga en el runtime de Node.js (no en Edge) y solo si hay a dónde mandar la telemetría:
 * sin `OTEL_EXPORTER_OTLP_ENDPOINT` la app funciona igual y los spans no van a ningún lado.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    await import('./lib/otel-node');
  }
}
