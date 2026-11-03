# EntreVista AI · Calidad (Estación 8)

Solución de referencia de la Estación 8: una EntreVista AI mínima, montada sobre el walking skeleton, con su suite de calidad completa y los gates de CI que bloquean el merge.

| Capa | Dónde | Cómo se corre |
|---|---|---|
| Unitarias: flujo, guardrails, motor y evaluación | `tests/*.test.ts` | `npm test` |
| E2E con Page Objects | `tests/e2e/`, `tests/paginas/` | `npm run test:e2e` |
| BDD: escenarios Gherkin en español | `tests/features/`, `tests/steps/` | `npm run test:bdd` |
| API: contratos y comportamiento | `tests/api/`, `tests/fixtures/` | `npm run test:api` |
| Evaluación del agente: Persona + Juez | `evals/` | `npm run evals` |
| Calibración del Juez | `evals/golden-dataset.json` | `npm run evals:calibrar` |

## Empezar

```bash
npm install
npx playwright install chromium
npm run verify            # lint, tipos y unitarias
npm run test:playwright   # E2E, BDD y API: levanta la app sola con el motor de reglas
```

## El agente

`POST /api/agent` mantiene el contrato de la Estación 3 (`mensaje` → `respuesta`, `modelo`, `tokens`) y agrega `conversacionId` y `estado`. Sin `conversacionId` abre una entrevista nueva. `GET /api/conversaciones/:id` devuelve la transcripción.

Hay dos motores:
- **Reglas** (`AGENT_MODE=reglas` o sin llave): hace las preguntas en orden y no repregunta. Es determinista y gratis; lo usan las pruebas de Playwright. Su falta de repreguntas es a propósito: el Juez la detecta.
- **Claude** (con `ANTHROPIC_API_KEY`): repregunta ante respuestas vagas, una vez por pregunta.

En los dos, los principios del PRD que se pueden garantizar con código no dependen del modelo: el saludo dice que es una IA y pide consentimiento, sin consentimiento no hay preguntas, y salario, beneficios o "¿eres un robot?" tienen respuestas fijas (`lib/entrevista.ts`).

## Evaluación del agente

```bash
cp .env.example .env   # agrega ANTHROPIC_API_KEY
npm run build && npm run start          # terminal 1: el agente con Claude
AGENT_URL=http://localhost:3000 npm run evals   # terminal 2
npm run evals -- --persona sofia        # una sola persona
```

Cuatro personas de [`evals/personas.json`](evals/personas.json) conversan con el agente: un caso feliz, una candidata que responde vago (prueba las repreguntas) y dos casos de red teaming del PRD (salario y "¿eres un robot?" con un intento de jailbreak). Cada conversación pasa por las verificaciones de fallos críticos y por el Juez con la [rúbrica](evals/rubrica.md). El reporte queda en `evals/reportes/` y el comando sale con error si alguna persona reprueba.

Para ver al Juez detectar un problema, evalúa el motor de reglas: `AGENT_MODE=reglas npm run start` y `npm run evals -- --persona sofia`. Debería reprobar en `repreguntas`.

## CI

| Workflow | Job | Qué hace |
|---|---|---|
| `ci.yml` | verificar, secretos | Lint, tipos, unitarias, skills, build y gitleaks |
| `calidad.yml` | pruebas | E2E, BDD y API con Playwright, en cada PR |
| `calidad.yml` | evaluacion | Persona + Juez contra el agente con Claude, cuando el PR toca `lib/`, `app/api/` o `evals/`, o tiene la etiqueta `evaluar-agente`. Usa el secreto `ANTHROPIC_API_KEY` |

Para que bloqueen el merge, marca `pruebas` y `evaluacion` como checks obligatorios en **Settings → Branches** (o **Rules**). El job `evaluacion` termina en verde cuando no hay nada que evaluar, así que puede ser obligatorio sin trabar los PR que no tocan el agente.

## Modelos

Los de la Persona y el Juez se cambian con `PERSONA_MODEL` y `JUDGE_MODEL` (variables de repo en GitHub). Valores por defecto en [`versions.md`](../../../versions.md) del repo del programa.
