# AGENTS.md

Instrucciones para cualquier coding agent que trabaje en este repo (Claude Code, Cursor, Codex, Antigravity o GitHub Copilot).

## Qué es este proyecto
EntreVista AI mínima: un agente de entrevistas de screening construido sobre el walking skeleton del programa, con su suite de calidad completa. Es la solución de referencia de la Estación 8. El PRD del producto está en `estacion2/specs/prd.md` del repo del programa.

## Comandos
- Instalar: `npm install`
- Desarrollo: `npm run dev` (http://localhost:3000)
- Verificar todo: `npm run verify` (lint + tipos + tests)
- Tests unitarios: `npm test`
- Pruebas E2E, BDD y API: `npm run test:playwright` (levanta la app con `AGENT_MODE=reglas`)
- Evaluación del agente: `npm run evals` (necesita `ANTHROPIC_API_KEY` y la app corriendo en `AGENT_URL`)
- Calibrar al Juez: `npm run evals:calibrar`
- Sincronizar skills para Claude Code: `npm run sync-skills`

## Estructura
- `app/` páginas y rutas de API (App Router de Next.js)
- `lib/` lógica sin dependencias de Next.js: `entrevista.ts` (flujo y guardrails del PRD), `agent.ts` (motor con Claude), `store.ts` (conversaciones en memoria), `logger.ts`
- `tests/` unitarias (Vitest), `e2e/`, `features/`, `steps/`, `api/`, `paginas/` y `fixtures/` (Playwright)
- `evals/` Persona + Juez: personas, rúbrica, fallos críticos y golden dataset
- `docs/` investigación y contexto del producto; `specs/` PRD y especificaciones
- `.agents/skills/` skills compartidas por todas las herramientas

## Convenciones
- TypeScript estricto; nada de `any`.
- La lógica va en `lib/` y se prueba con dobles: nunca llames a la API real del LLM en los tests.
- Toda ruta de API valida su entrada y responde errores como `{ "error": "..." }` con el código HTTP correcto.
- Registra eventos con `log()` de `lib/logger.ts`, nunca con `console.log` suelto.
- Los textos que ve el usuario van en español.
- El modelo se lee de `ANTHROPIC_MODEL`; no lo escribas fijo en el código.
- Los principios del PRD que se pueden garantizar con código (divulgación de IA, consentimiento, escalar lo que no está en la información de la vacante) viven en `lib/entrevista.ts`, no en el prompt.
- Las convenciones de pruebas están en la skill `qa-testing`.

## Antes de dar una tarea por terminada
1. Corre `npm run verify` y asegúrate de que pase.
2. Si agregaste una ruta o una función en `lib/`, agrega sus tests. Si cambiaste la interfaz, corre `npm run test:playwright`.
3. Si tocaste `.agents/skills/`, corre `npm run sync-skills`.
4. No subas secretos: las llaves van en `.env` (ignorado por git) y en las variables de entorno de Vercel.
