import type { APIRequestContext } from '@playwright/test';

/** Request builders: toda llamada a la API de las pruebas pasa por aquí. */
export class PeticionAgente {
  private cuerpo: Record<string, unknown> = { mensaje: 'Hola' };
  private encabezados: Record<string, string> = {};

  constructor(private readonly request: APIRequestContext) {}

  conMensaje(mensaje: unknown) {
    this.cuerpo.mensaje = mensaje;
    return this;
  }

  enConversacion(conversacionId: string) {
    this.cuerpo.conversacionId = conversacionId;
    return this;
  }

  sinMensaje() {
    delete this.cuerpo.mensaje;
    return this;
  }

  conToken(token: string) {
    this.encabezados.Authorization = `Bearer ${token}`;
    return this;
  }

  enviar() {
    return this.request.post('/api/agent', { data: this.cuerpo, headers: this.encabezados });
  }
}

/** Abre una conversación y devuelve su id. */
export async function abrirConversacion(request: APIRequestContext): Promise<string> {
  const res = await new PeticionAgente(request).conMensaje('Hola').enviar();
  return (await res.json()).conversacionId;
}

/** Abre una conversación ya con consentimiento. */
export async function conversacionEnCurso(request: APIRequestContext): Promise<string> {
  const id = await abrirConversacion(request);
  await new PeticionAgente(request).conMensaje('Sí').enConversacion(id).enviar();
  return id;
}
