type Nivel = 'info' | 'warn' | 'error';

/**
 * Escribe un log estructurado en JSON, una línea por evento.
 * Vercel y cualquier backend de logs (Loki, Datadog, CloudWatch) los pueden filtrar por campo.
 */
export function log(nivel: Nivel, mensaje: string, campos: Record<string, unknown> = {}): void {
  const linea = JSON.stringify({ ts: new Date().toISOString(), nivel, mensaje, ...campos });
  if (nivel === 'error') console.error(linea);
  else console.log(linea);
}
