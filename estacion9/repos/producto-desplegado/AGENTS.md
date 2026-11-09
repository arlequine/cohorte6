# AGENTS.md

Instrucciones para cualquier coding agent que trabaje en este repo (Claude Code, Cursor, Codex, Antigravity o GitHub Copilot).

## Qué es este proyecto
Producto de referencia de la Estación 9 del programa AI for Developers: una app Next.js con un agente que responde con Claude y guarda el historial en DynamoDB. La app vive en Vercel y la infraestructura (DynamoDB, IAM y las variables de Vercel) se gestiona con Terraform en `infra/`. Se despliega solo desde el pipeline de GitHub Actions.

## Comandos
- Instalar: `npm install`
- Desarrollo: `npm run dev` (http://localhost:3000)
- Verificar todo: `npm run verify` (lint + tipos + tests)
- Tests: `npm test`
- Sincronizar skills para Claude Code: `npm run sync-skills`
- Infraestructura en LocalStack: `bash scripts/tf-local.sh plan` o `apply`

## Estructura
- `app/` páginas y rutas de API (App Router de Next.js)
- `lib/` lógica sin dependencias de Next.js: `agent.ts` (llamada al LLM), `historial.ts` (DynamoDB), `auth.ts` (token) y `logger.ts` (logs JSON)
- `infra/` Terraform: `main.tf` (recursos), `bootstrap/` (bucket del estado y rol OIDC, se aplica una vez a mano)
- `tests/` tests de Vitest
- `docs/` investigación y contexto del producto; `specs/` PRD y especificaciones
- `.agents/skills/` skills compartidas por todas las herramientas (`iac` para todo lo de `infra/`)
- `mcp/` configuración de los MCP de Terraform, AWS Documentation y LocalStack para cada herramienta

## Convenciones
- TypeScript estricto; nada de `any`.
- La lógica va en `lib/` y se prueba con dobles: nunca llames a la API real del LLM en los tests.
- Toda ruta de API valida su entrada y responde errores como `{ "error": "..." }` con el código HTTP correcto.
- Registra eventos con `log()` de `lib/logger.ts`, nunca con `console.log` suelto.
- Los textos que ve el usuario van en español.
- El modelo se lee de `ANTHROPIC_MODEL`; no lo escribas fijo en el código.
- Toda la infraestructura va en `infra/`. Nunca crees ni cambies recursos desde la consola de AWS o el dashboard de Vercel.
- Corre `terraform fmt -recursive` en `infra/` antes de terminar si tocaste Terraform.
- Vercel reserva los nombres `AWS_*`: las variables de la app usan el prefijo `APP_AWS_`.

## Antes de dar una tarea por terminada
1. Corre `npm run verify` y asegúrate de que pase.
2. Si agregaste una ruta o una función en `lib/`, agrega sus tests.
3. Si tocaste `.agents/skills/`, corre `npm run sync-skills`.
4. No subas secretos: las llaves van en `.env` (ignorado por git) y en las variables de entorno de Vercel.
