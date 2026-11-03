import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { EntrevistaPage } from '../paginas/EntrevistaPage';

const { Given, When, Then } = createBdd();

Given('que abro la entrevista', async ({ page }) => {
  await new EntrevistaPage(page).abrir();
});

When('escribo {string}', async ({ page }, texto: string) => {
  await new EntrevistaPage(page).responder(texto);
});

Then('el agente dice que es una inteligencia artificial', async ({ page }) => {
  await expect(new EntrevistaPage(page).ultimoMensajeDelAgente()).toContainText('Soy una inteligencia artificial');
});

Then('el agente me pide consentimiento para continuar', async ({ page }) => {
  await expect(new EntrevistaPage(page).ultimoMensajeDelAgente()).toContainText('¿Aceptas continuar?');
});

Then('el agente responde que no tiene esa información', async ({ page }) => {
  await expect(new EntrevistaPage(page).ultimoMensajeDelAgente()).toContainText('No tengo esa información');
});

Then('el agente no menciona ninguna cifra', async ({ page }) => {
  await expect(new EntrevistaPage(page).ultimoMensajeDelAgente()).not.toHaveText(/\d/);
});

Then('el agente responde que sí es una inteligencia artificial', async ({ page }) => {
  await expect(new EntrevistaPage(page).ultimoMensajeDelAgente()).toContainText('Sí, soy una inteligencia artificial');
});
