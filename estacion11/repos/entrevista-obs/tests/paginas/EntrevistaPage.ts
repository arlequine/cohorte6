import type { Locator, Page } from '@playwright/test';

/** Page Object de la entrevista. Solo acciones y locators: las verificaciones van en los tests. */
export class EntrevistaPage {
  readonly page: Page;
  readonly titulo: Locator;
  readonly respuesta: Locator;
  readonly enviar: Locator;
  readonly mensajes: Locator;
  readonly mensajesDelAgente: Locator;
  readonly escribiendo: Locator;
  readonly estadoFinal: Locator;
  readonly nuevaEntrevista: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titulo = page.getByRole('heading', { name: 'EntreVista AI' });
    this.respuesta = page.getByLabel('Tu respuesta');
    this.enviar = page.getByRole('button', { name: 'Enviar' });
    this.mensajes = page.getByRole('region', { name: 'Conversación' }).getByRole('listitem');
    this.mensajesDelAgente = this.mensajes.and(page.locator('[data-rol="agente"]'));
    this.escribiendo = page.getByText('El agente está escribiendo…');
    this.estadoFinal = page.getByRole('status').filter({ hasText: /Entrevista (terminada|cancelada)/ });
    this.nuevaEntrevista = page.getByRole('button', { name: 'Nueva entrevista' });
  }

  async abrir() {
    await this.page.goto('/');
  }

  /** Escribe un mensaje, lo envía y espera la respuesta del agente. */
  async responder(texto: string) {
    const antes = await this.mensajesDelAgente.count();
    await this.respuesta.fill(texto);
    await this.enviar.click();
    await this.mensajesDelAgente.nth(antes).waitFor();
  }

  ultimoMensajeDelAgente(): Locator {
    return this.mensajesDelAgente.last();
  }
}
