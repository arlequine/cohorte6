import { autorizado } from '@/lib/auth';
import { historialHabilitado, ultimasConversaciones } from '@/lib/historial';
import { log } from '@/lib/logger';

/** GET /api/historial  →  { conversaciones: [...] } con las 10 más recientes. */
export async function GET(request: Request): Promise<Response> {
  if (!autorizado(request)) {
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }
  if (!historialHabilitado()) {
    return Response.json({ error: 'El historial no está configurado (falta DYNAMODB_TABLE).' }, { status: 503 });
  }
  try {
    const conversaciones = await ultimasConversaciones();
    return Response.json({ conversaciones });
  } catch (e) {
    log('error', 'historial.fallo_leer', { error: e instanceof Error ? e.message : String(e) });
    return Response.json({ error: 'No se pudo leer el historial.' }, { status: 502 });
  }
}
