import { responder, validarMensaje } from '@/lib/agent';
import { log } from '@/lib/logger';

/**
 * POST /api/agent  { "mensaje": "..." }  →  { respuesta, modelo, tokens }
 *
 * Si AGENT_ACCESS_TOKEN está definido, exige el encabezado Authorization: Bearer <token>.
 * Defínelo en Vercel: sin él, cualquiera con la URL puede gastar tu saldo de la API.
 */
export async function POST(request: Request): Promise<Response> {
  const inicio = Date.now();
  const tokenEsperado = process.env.AGENT_ACCESS_TOKEN;

  if (tokenEsperado && request.headers.get('authorization') !== `Bearer ${tokenEsperado}`) {
    log('warn', 'agente.no_autorizado');
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  let cuerpo: unknown;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: 'El cuerpo debe ser JSON.' }, { status: 400 });
  }

  const mensaje = (cuerpo as { mensaje?: unknown } | null)?.mensaje;
  const error = validarMensaje(mensaje);
  if (error) {
    log('warn', 'agente.mensaje_invalido', { error });
    return Response.json({ error }, { status: 400 });
  }

  try {
    const resultado = await responder(mensaje as string);
    log('info', 'agente.respuesta', {
      modelo: resultado.modelo,
      tokens_entrada: resultado.tokens.entrada,
      tokens_salida: resultado.tokens.salida,
      duracion_ms: Date.now() - inicio,
    });
    return Response.json(resultado);
  } catch (e) {
    log('error', 'agente.fallo_llm', { error: e instanceof Error ? e.message : String(e), duracion_ms: Date.now() - inicio });
    return Response.json({ error: 'El agente no pudo responder. Intenta de nuevo.' }, { status: 502 });
  }
}
