import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici';
import { startNodeSdk } from '@opentelemetry/sdk-node';

/**
 * Arranca el SDK de OpenTelemetry para Node.js. Lo importa `instrumentation.ts`.
 *
 * Todo lo configurable sale de variables de entorno estándar de OpenTelemetry, así que el mismo código
 * manda a un Collector local, a Grafana Cloud o a cualquier backend compatible con OTLP:
 *   OTEL_EXPORTER_OTLP_ENDPOINT   http://localhost:4318 con el otel-stack de la Estación 11
 *   OTEL_SERVICE_NAME             entrevista-ai (valor por defecto abajo)
 *   OTEL_METRIC_EXPORT_INTERVAL   cada cuántos ms se mandan las métricas (el estándar es 60000)
 *   OTEL_EXPORTER_OTLP_HEADERS    autenticación para backends en la nube
 * Traces, métricas y logs usan el exportador OTLP por defecto (`OTEL_*_EXPORTER=otlp`).
 *
 * Next.js ya crea spans por cada request y ruta. Aquí se agrega la instrumentación de `fetch` (undici),
 * que deja un span por cada llamada HTTP saliente, incluida la de la API de Anthropic.
 */
const sdk = startNodeSdk({
  resourceAttributes: {
    'service.name': process.env.OTEL_SERVICE_NAME ?? 'entrevista-ai',
    'service.version': process.env.npm_package_version ?? '0.1.0',
    'deployment.environment.name': process.env.NODE_ENV ?? 'development',
  },
  instrumentations: [new UndiciInstrumentation()],
});

// Manda lo pendiente antes de que el proceso termine.
process.once('SIGTERM', () => {
  void sdk.shutdown().finally(() => process.exit(0));
});
