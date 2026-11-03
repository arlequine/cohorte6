import { motorPorDefecto } from '@/lib/agent';
import { autorizado } from '@/lib/auth';
import { SALUDO, procesar, validarMensaje } from '@/lib/entrevista';
import { log } from '@/lib/logger';
import { crearConversacion, obtenerConversacion } from '@/lib/store';

/**
 * POST /api/agent  { "mensaje": "...", "conversacionId"?: "..." }
 *   →  { conversacionId, respuesta, estado, modelo, tokens }
 *
 * Sin conversacionId abre una entrevista nueva y responde con el saludo, que dice que es una IA y pide
 * consentimiento. Con conversacionId continúa la entrevista. Mantiene el contrato de la Estación 3:
 * recibe `mensaje` y responde `respuesta`, `modelo` y `tokens`.
 */
export async function POST(request: Request): Promise<Response> {
  const inicio = Date.now();
  if (!autorizado(request)) {
    log('warn', 'agente.no_autorizado');
    return Response.json({ error: 'No autorizado.' }, { status: 401 });
  }

  let cuerpo: { mensaje?: unknown; conversacionId?: unknown } | null;
  try {
    cuerpo = await request.json();
  } catch {
    return Response.json({ error: 'El cuerpo debe ser JSON.' }, { status: 400 });
  }

  const error = validarMensaje(cuerpo?.mensaje);
  if (error) {
    log('warn', 'agente.mensaje_invalido', { error });
    return Response.json({ error }, { status: 400 });
  }
  const mensaje = cuerpo!.mensaje as string;
  const motor = motorPorDefecto();

  if (cuerpo?.conversacionId === undefined) {
    const conversacion = crearConversacion();
    conversacion.turnos.unshift({ rol: 'candidato', texto: mensaje });
    log('info', 'agente.conversacion_creada', { conversacion: conversacion.id });
    return Response.json({
      conversacionId: conversacion.id,
      respuesta: SALUDO,
      estado: conversacion.estado,
      modelo: motor.nombre,
      tokens: { entrada: 0, salida: 0 },
    });
  }

  const conversacion = typeof cuerpo.conversacionId === 'string' ? obtenerConversacion(cuerpo.conversacionId) : undefined;
  if (!conversacion) return Response.json({ error: 'La conversación no existe.' }, { status: 404 });

  try {
    const { respuesta, tokens = { entrada: 0, salida: 0 } } = await procesar(conversacion, mensaje, motor);
    log('info', 'agente.respuesta', {
      conversacion: conversacion.id,
      estado: conversacion.estado,
      modelo: motor.nombre,
      tokens_entrada: tokens.entrada,
      tokens_salida: tokens.salida,
      duracion_ms: Date.now() - inicio,
    });
    return Response.json({ conversacionId: conversacion.id, respuesta, estado: conversacion.estado, modelo: motor.nombre, tokens });
  } catch (e) {
    log('error', 'agente.fallo_llm', { error: e instanceof Error ? e.message : String(e), duracion_ms: Date.now() - inicio });
    return Response.json({ error: 'El agente no pudo responder. Intenta de nuevo.' }, { status: 502 });
  }
}
