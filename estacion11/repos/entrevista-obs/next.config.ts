import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // El SDK de OpenTelemetry se carga desde node_modules en tiempo de ejecución, sin empaquetarlo.
  serverExternalPackages: ['@opentelemetry/sdk-node', '@opentelemetry/instrumentation-undici'],
};

export default nextConfig;
