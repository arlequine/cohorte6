# AGENTS.md

Instrucciones para cualquier coding agent que trabaje en este repo (Claude Code, Cursor, Codex, Antigravity o GitHub Copilot). Todas lo leen; Claude Code lo importa desde `CLAUDE.md`.

> Este archivo es tuyo: complétalo y mantenlo al día. Un agente con buen contexto trabaja mejor que uno con un buen modelo y sin contexto.

## Qué es este proyecto
<!-- Estación 1 y 2: en dos o tres líneas, qué producto es, para quién y qué problema resuelve. -->
Pendiente.

## Comandos
- Instalar: `npm install`
- Desarrollo: `npm run dev` (http://localhost:3000)
- Verificar todo: `npm run verify` (lint + tipos + tests)
- Tests: `npm test`
- Sincronizar skills para Claude Code: `npm run sync-skills`

## Estructura
- `app/` páginas y rutas de API (App Router de Next.js)
- `tests/` tests de Vitest
- `docs/` investigación y contexto del producto; `specs/` PRD y especificaciones
- `nivelacion/` entrega de la Nivelación 1
- `.agents/skills/` skills compartidas por todas las herramientas
- `mcp/` configuración de MCP para cada herramienta

## Convenciones
- TypeScript estricto; nada de `any`.
- Toda ruta de API valida su entrada y responde errores como `{ "error": "..." }` con el código HTTP correcto.
- Los textos que ve el usuario van en español.
<!-- Agrega aquí las convenciones que vayas decidiendo. -->

## Antes de dar una tarea por terminada
1. Corre `npm run verify` y asegúrate de que pase.
2. Si agregaste código, agrega sus tests.
3. Si tocaste `.agents/skills/`, corre `npm run sync-skills`.
4. No subas secretos: las llaves van en `.env` (ignorado por git) y en las variables de entorno de Vercel.
