import { defineConfig, devices } from '@playwright/test';
import { defineBddProject } from 'playwright-bdd';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

/**
 * Tres proyectos sobre la misma app:
 *   e2e  → flujos del candidato en el navegador, con Page Objects
 *   bdd  → los escenarios Gherkin de tests/features/, generados con playwright-bdd
 *   api  → contratos y comportamiento de /api/agent, sin navegador
 * Sin BASE_URL, Playwright construye y levanta la app con el motor de reglas: las pruebas son
 * deterministas y no gastan tokens. La evaluación con LLM vive aparte, en evals/.
 */
export default defineConfig({
  fullyParallel: false,
  workers: 1, // las conversaciones viven en la memoria del servidor
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: 'e2e', testDir: 'tests/e2e', use: { ...devices['Desktop Chrome'] } },
    {
      ...defineBddProject({ name: 'bdd', features: 'tests/features/*.feature', steps: 'tests/steps/*.ts', language: 'es' }),
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'api', testDir: 'tests/api' },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run build && npm run start',
        url: `${BASE_URL}/api/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        env: { AGENT_MODE: 'reglas', AGENT_ACCESS_TOKEN: '' },
      },
});
