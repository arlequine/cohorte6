# Estación 3 · Harness engineering y walking skeleton

## Objetivo
Configurar tu harness (instrucciones, skills, MCP y controles automáticos) y terminar con tu **walking skeleton** desplegado: una URL pública donde un agente responde con Claude, con tests y CI.

## Antes de la clase
- Tu repo personal creado desde la plantilla en la Nivelación 1, con `npm run verify` pasando
- Tu PRD v1 de la Estación 2 en `specs/`
- Tu coding agent funcionando. Las demos son en Claude Code; si usas otro, revisa la tabla de equivalencias de abajo
- Una llave de la API de Anthropic con un límite de gasto configurado ([console.anthropic.com](https://console.anthropic.com))
- Una cuenta de Vercel conectada a tu GitHub ([vercel.com](https://vercel.com), el plan Hobby basta)

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | La misma tarea con y sin `AGENTS.md` | Ver que el harness cambia el resultado más que el modelo |
| 10–30 | Anatomía del harness: instrucciones, skills, MCP, permisos, hooks y subagentes | Saber dónde vive cada pieza en tu herramienta |
| 30–45 | Demo en Claude Code: `AGENTS.md`, una skill y un hook que corre los tests | Ver el harness funcionando de punta a punta |
| 45–55 | Arranque del walking skeleton en tu repo | Plan de lo que vas a construir hoy |
| 55–60 | Pausa | |
| 60–105 | Trabajo práctico: agente, tests, logs, CI y deploy | Tu URL pública respondiendo |
| 105–115 | Subagentes y worktrees: dos tareas en paralelo | Una idea de cómo escalar el trabajo con agentes |
| 115–120 | Entregable y conexión con la Estación 4 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La solución de referencia está en [`repos/walking-skeleton/`](repos/walking-skeleton). Es el mismo punto de partida que tu repo, más lo que construyes hoy. Compárala con tu repo cuando termines, no antes: lo que se evalúa es cómo dirigiste a tu agente.

## Las piezas del harness

| Pieza | Qué es | En tu repo |
|---|---|---|
| Instrucciones | Lo que el agente debe saber siempre: qué es el proyecto, comandos, convenciones | `AGENTS.md` |
| Skills | Procedimientos que el agente carga cuando la tarea lo pide | `.agents/skills/<nombre>/SKILL.md` |
| MCP | Herramientas y datos externos que el agente puede usar | `mcp/README.md` explica cada herramienta |
| Permisos | Qué puede hacer el agente sin preguntarte | Configuración de tu herramienta |
| Controles automáticos | Lo que se verifica siempre, sin depender del agente | `.githooks/pre-commit` y `.github/workflows/ci.yml` |
| Subagentes | Agentes con su propio contexto para tareas acotadas | Configuración de tu herramienta |

### Equivalencias por herramienta

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Instrucciones | `CLAUDE.md` importa `AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` |
| Skills | `.claude/skills/` (copia con `npm run sync-skills`) | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` |
| MCP | `.mcp.json` | `.cursor/mcp.json` | `.codex/config.toml` | `/mcp` en `agy` | `.vscode/mcp.json` o `/mcp add` |
| Hooks propios | `.claude/settings.json` | `.cursor/hooks.json` | `.codex/hooks.json` | Hooks de Antigravity | Hooks de Copilot |

Los hooks propios de cada herramienta son opcionales. Los controles obligatorios viven en el pre-commit de git y en CI, que funcionan igual para todos.

## Tu tarea
Trabaja en tu repo personal, con tu coding agent. Pídele los cambios por partes y verifica cada una antes de seguir.

1. **Completa `AGENTS.md`.** Llena "Qué es este proyecto" con base en tu PRD y agrega las convenciones que quieras que el agente respete.
2. **Agrega el endpoint del agente.** `POST /api/agent` recibe `{ "mensaje": "..." }`, llama a Claude con `@anthropic-ai/sdk` y responde `{ "respuesta", "modelo", "tokens" }`. Requisitos:
   - Valida la entrada: mensaje obligatorio y de máximo 1000 caracteres.
   - El modelo sale de `ANTHROPIC_MODEL`.
   - Si `AGENT_ACCESS_TOKEN` está definido, exige `Authorization: Bearer <token>`.
3. **Escribe los tests.** Prueba la lógica del agente con un doble del cliente de Anthropic, sin llamar a la API real, y la ruta con un caso válido, uno inválido y el del token.
4. **Agrega logs en JSON.** Un evento por petición con el modelo, los tokens y la duración.
5. **Crea una skill propia.** Un procedimiento que vayas a repetir en tu proyecto, en `.agents/skills/`. Corre `npm run sync-skills`.
6. **Agrega secret scanning al CI.** Un job con gitleaks en `.github/workflows/ci.yml`.
7. **Despliega en Vercel.** Importa tu repo, define `ANTHROPIC_API_KEY` y `AGENT_ACCESS_TOKEN` en las variables de entorno y verifica que la URL responde. Agrega también `ANTHROPIC_API_KEY` como secreto del repo en GitHub (**Settings → Secrets and variables → Actions**): desde aquí el Juez evalúa tus entregas.

Antes de cada commit, el pre-commit corre `npm run verify`. Si no lo tienes activo, corre `npm run hooks`.

## Entregable
Un pull request en tu repo personal, con la etiqueta `estacion-3`, antes de la Estación 4, que incluya:
- Los siete puntos de la tarea, con CI en verde
- La URL de Vercel en la descripción del PR
- Dos o tres líneas sobre qué tuviste que corregirle al agente y qué cambió después de completar `AGENTS.md`

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Despliegue | La URL responde y el endpoint exige el token | La URL responde, pero el endpoint está abierto | No está desplegado |
| Agente | Valida la entrada, lee el modelo del entorno y maneja errores | Responde, pero sin validación o sin manejo de errores | No responde |
| Tests | Lógica y ruta probadas sin llamar a la API real | Hay tests, pero llaman a la API o no cubren errores | Sin tests |
| Harness | `AGENTS.md` completo y una skill propia sincronizada | Uno de los dos | Ninguno |
| CI | Verde, con verify, skills sincronizadas y secret scanning | Verde, sin secret scanning | Rojo o inexistente |
| Reflexión | Explica qué corrigió y qué cambió con el harness | Descripción superficial | No hay |

## Cómo alimenta la siguiente estación
En la Estación 4 diseñas el QUÉ de tu producto con AI-DLC dentro de este mismo repo. El agente va a leer tu `AGENTS.md`, y cada unidad que construyas después entra por el mismo CI y el mismo deploy que dejaste hoy.

## Track avanzado
- Configura un hook propio de tu herramienta que corra los tests después de cada edición del agente y compáralo con el pre-commit: ¿cuál te avisa antes?
- Resuelve dos tareas en paralelo con subagentes o con `git worktree` (por ejemplo, los logs y el job de gitleaks) y documenta cómo las integraste.
- Repite el paso 2 con otra herramienta usando el mismo `AGENTS.md`. Anota qué cambió en el resultado.

## Recursos
Enlaces revisados el 1 de noviembre de 2026. Versiones fijadas en [`versions.md`](../versions.md).

- [agents.md](https://agents.md): el formato de instrucciones compartido
- [Documentación de Claude Code](https://code.claude.com/docs): memoria, skills, hooks y subagentes
- [SDK de TypeScript de Anthropic](https://github.com/anthropics/anthropic-sdk-typescript)
- [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Vercel: variables de entorno](https://vercel.com/docs/environment-variables)
- [gitleaks-action](https://github.com/gitleaks/gitleaks-action)
