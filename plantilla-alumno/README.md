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
| `.github/workflows/juez.yml` + `scripts/juez.ts` | El Juez: primera revisión de cada entrega contra la rúbrica |
| `mcp/` | Cómo configurar MCP en cada herramienta |
| `docs/`, `specs/`, `nivelacion/` | Donde van tus entregables |

## Cómo crece durante el programa

| Semana | Qué agregas |
|---|---|
| 1 | Tu entrega de la Nivelación 1 en `nivelacion/` |
| 2 | Investigación en `docs/` y PRD en `specs/` |
| 3 | El walking skeleton: endpoint del agente con Claude, logs, secret scanning en CI y deploy en Vercel |
| 3 y 4 | AI-DLC en las Estaciones 4 y 5: la especificación en `aidlc/` y `specs/`, y tu primera unidad con tests |
| 4 en adelante | El resto de tu producto, estación por estación |

## Entregas y el Juez

1. Trabaja la entrega en una rama.
2. Antes de abrir el PR, pídele a tu agente que use la skill `autoevaluar-entrega`: revisa tu entrega con la misma rúbrica que el Juez.
3. Abre el PR con el título `<etiqueta>: <resumen>` y ponle la etiqueta de la estación: `nivelacion-1`, `nivelacion-2` o `estacion-N`. Crea la etiqueta la primera vez.
4. El Juez comenta el resultado por criterio y pone un semáforo (`semaforo-verde`, `-amarillo` o `-rojo`). Cada push al PR lo actualiza.
5. Un mentor revisa tu entrega; el Juez no reemplaza esa revisión ni bloquea el merge.

El Juez usa tu llave de Anthropic. En la Estación 3 la agregas como secreto del repo (**Settings → Secrets and variables → Actions**, nombre `ANTHROPIC_API_KEY`); antes de eso el Juez solo deja un aviso. Cada evaluación usa `claude-haiku-5-5` y cuesta centavos; puedes cambiar el modelo con la variable de repo `JUEZ_MODELO`.

Agrega a tus mentores como colaboradores del repo (**Settings → Collaborators**) para que puedan revisar tus entregas.
