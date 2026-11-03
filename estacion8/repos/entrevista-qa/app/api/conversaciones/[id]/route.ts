import { autorizado } from '@/lib/auth';
import { obtenerConversacion } from '@/lib/store';

/** GET /api/conversaciones/:id → la transcripción completa, para el reclutador y para el Juez. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  if (!autorizado(request)) return Response.json({ error: 'No autorizado.' }, { status: 401 });
  const conversacion = obtenerConversacion((await params).id);
  if (!conversacion) return Response.json({ error: 'La conversación no existe.' }, { status: 404 });
  return Response.json(conversacion);
}
