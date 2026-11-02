import { responder, validarMensaje } from '@/lib/agent';
import { autorizado } from '@/lib/auth';
import { guardarConversacion, historialHabilitado } from '@/lib/historial';
import { log } from '@/lib/logger';

/** POST /api/agent  { "mensaje": "..." }  →  { respuesta, modelo, tokens } */
export async function POST(request: Request): Promise<Response> {
  const inicio = Date.now();

  if (!autorizado(request)) {
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

  let resultado;
  try {
    resultado = await responder(mensaje as string);
  } catch (e) {
    log('error', 'agente.fallo_llm', { error: e instanceof Error ? e.message : String(e), duracion_ms: Date.now() - inicio });
    return Response.json({ error: 'El agente no pudo responder. Intenta de nuevo.' }, { status: 502 });
  }

  // Guardar el historial no debe tumbar la respuesta: si falla, se registra y se sigue.
  if (historialHabilitado()) {
    try {
      await guardarConversacion({
        mensaje: mensaje as string,
        respuesta: resultado.respuesta,
        modelo: resultado.modelo,
        tokens_entrada: resultado.tokens.entrada,
        tokens_salida: resultado.tokens.salida,
      });
    } catch (e) {
      log('warn', 'historial.fallo_guardar', { error: e instanceof Error ? e.message : String(e) });
    }
  }

  log('info', 'agente.respuesta', {
    modelo: resultado.modelo,
    tokens_entrada: resultado.tokens.entrada,
    tokens_salida: resultado.tokens.salida,
    duracion_ms: Date.now() - inicio,
  });
  return Response.json(resultado);
}
