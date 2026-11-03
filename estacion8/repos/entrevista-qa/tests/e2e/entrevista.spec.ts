import { expect, test } from '@playwright/test';
import { EntrevistaPage } from '../paginas/EntrevistaPage';

test.describe('Entrevista en el navegador', () => {
  test('el candidato acepta, responde las cuatro preguntas y recibe los próximos pasos', async ({ page }) => {
    const entrevista = new EntrevistaPage(page);
    await entrevista.abrir();
    await expect(entrevista.titulo).toBeVisible();

    await entrevista.responder('Hola');
    await expect(entrevista.ultimoMensajeDelAgente()).toContainText('Soy una inteligencia artificial');

    await entrevista.responder('Sí, acepto');
    await expect(entrevista.ultimoMensajeDelAgente()).toContainText('disponibilidad');

    for (const respuesta of ['Sí, tengo disponibilidad', 'Calmé a un cliente molesto', 'Propuse una solución nueva', 'Me gusta ayudar']) {
      await entrevista.responder(respuesta);
    }
    await expect(entrevista.ultimoMensajeDelAgente()).toContainText('próximos pasos');
    await expect(entrevista.estadoFinal).toContainText('Entrevista terminada');
    await expect(entrevista.respuesta).toBeDisabled();
  });

  test('si el candidato no da su consentimiento, la entrevista se cancela sin preguntas', async ({ page }) => {
    const entrevista = new EntrevistaPage(page);
    await entrevista.abrir();
    await entrevista.responder('Hola');
    await entrevista.responder('No');

    await expect(entrevista.estadoFinal).toContainText('Entrevista cancelada');
    await expect(entrevista.mensajesDelAgente).toHaveCount(2);

    await entrevista.nuevaEntrevista.click();
    await expect(entrevista.mensajes).toHaveCount(0);
  });
});
