# Mi producto · AI for Developers

Repo personal para el programa AI for Developers. Aquí entregas cada estación y construyes tu producto de punta a punta.

## Empezar

```bash
npm install
npm run hooks     # activa el pre-commit que corre lint, tipos y tests
npm run dev       # http://localhost:3000
npm run verify    # lint + tipos + tests
```

Necesitas Node 22 (`nvm use` toma la versión de `.nvmrc`).

## Qué trae

| Pieza | Para qué |
|---|---|
| App Next.js con una página y `GET /api/health` | La base de tu producto |
| Vitest con un test de ejemplo | Para que cada cambio tenga tests desde el principio |
| `AGENTS.md` + `CLAUDE.md` | Instrucciones para tu coding agent, sea cual sea |
| `.agents/skills/` | Skills compartidas por todas las herramientas; `npm run sync-skills` las copia a `.claude/skills/` para Claude Code |
| `.githooks/pre-commit` | Corre `npm run verify` antes de cada commit, con cualquier herramienta |
| `.github/workflows/ci.yml` | CI: lint, tipos, tests, skills sincronizadas y build |
| `mcp/` | Cómo configurar MCP en cada herramienta |
| `docs/`, `specs/`, `nivelacion/` | Donde van tus entregables |

## Cómo crece durante el programa

| Semana | Qué agregas |
|---|---|
| 1 | Tu entrega de la Nivelación 1 en `nivelacion/` |
| 2 | Investigación en `docs/` y PRD en `specs/` |
| 3 | El walking skeleton: endpoint del agente con Claude, logs, secret scanning en CI y deploy en Vercel |
| 4 en adelante | Las especificaciones y el código de tu producto, estación por estación |
