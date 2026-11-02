# AGENTS.md

Instrucciones para cualquier coding agent que trabaje en este repo (Claude Code, Cursor, Codex, Antigravity o GitHub Copilot).

## Qué es este proyecto
Walking skeleton del programa AI for Developers: una app Next.js con una página, un endpoint `/api/agent` que responde con Claude y CI en GitHub Actions. Se despliega en Vercel. Sobre esta base se construye el producto del alumno.

## Comandos
- Instalar: `npm install`
- Desarrollo: `npm run dev` (http://localhost:3000)
- Verificar todo: `npm run verify` (lint + tipos + tests)
- Tests: `npm test`
- Sincronizar skills para Claude Code: `npm run sync-skills`

## Estructura
- `app/` páginas y rutas de API (App Router de Next.js)
- `lib/` lógica sin dependencias de Next.js: `agent.ts` (llamada al LLM) y `logger.ts` (logs JSON)
- `tests/` tests de Vitest
- `docs/` investigación y contexto del producto; `specs/` PRD y especificaciones
- `.agents/skills/` skills compartidas por todas las herramientas

## Convenciones
- TypeScript estricto; nada de `any`.
- La lógica va en `lib/` y se prueba con dobles: nunca llames a la API real del LLM en los tests.
- Toda ruta de API valida su entrada y responde errores como `{ "error": "..." }` con el código HTTP correcto.
- Registra eventos con `log()` de `lib/logger.ts`, nunca con `console.log` suelto.
- Los textos que ve el usuario van en español.
- El modelo se lee de `ANTHROPIC_MODEL`; no lo escribas fijo en el código.

## Antes de dar una tarea por terminada
1. Corre `npm run verify` y asegúrate de que pase.
2. Si agregaste una ruta o una función en `lib/`, agrega sus tests.
3. Si tocaste `.agents/skills/`, corre `npm run sync-skills`.
4. No subas secretos: las llaves van en `.env` (ignorado por git) y en las variables de entorno de Vercel.
