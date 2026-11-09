import { randomUUID } from 'node:crypto';
import { iniciar, type Conversacion } from '@/lib/entrevista';

/**
 * Conversaciones en memoria del proceso. Suficiente para la demo y las pruebas locales;
 * en Vercel cada instancia tiene su propia memoria. La Estación 9 las mueve a DynamoDB.
 */
const conversaciones = new Map<string, Conversacion>();

export function crearConversacion(): Conversacion {
  const conversacion = iniciar(randomUUID());
  conversaciones.set(conversacion.id, conversacion);
  return conversacion;
}

export function obtenerConversacion(id: string): Conversacion | undefined {
  return conversaciones.get(id);
}

export function reiniciarStore(): void {
  conversaciones.clear();
}
