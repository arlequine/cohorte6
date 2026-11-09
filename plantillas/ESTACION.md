# Estación N · <Nombre>

## Objetivo
Una frase: qué sabe hacer el alumno al terminar.

## Antes de la clase
- Qué entregable de la estación anterior debes traer
- Qué debes tener instalado o configurado

## Ruta de la sesión (120 min)
| Minutos | Actividad | Resultado |
|---|---|---|

## Ejemplo trabajado
Cómo se ve esta estación aplicada a EntreVista AI.

## Tu tarea
Pasos numerados, cada uno verificable.

### Equivalencias por herramienta
Solo si la estación usa skills, MCP, instrucciones de proyecto o hooks del agente. Una fila por cada cosa que el alumno configura y una columna por herramienta; la configuración completa de cada MCP va en `mcp/README.md` del repo de referencia, no aquí.

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Instrucciones del proyecto | `CLAUDE.md` con `@AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` |
| Skill `<nombre>` | `.claude/skills/` (copia con `npm run sync-skills`) | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` |
| MCP `<nombre>` | `.mcp.json` | `.cursor/mcp.json` | `.codex/config.toml` | `/mcp` en `agy` | `.vscode/mcp.json` |
| Controles obligatorios | `.githooks/` y CI, iguales para todas | | | | |

Si una herramienta no soporta algo, dilo en la celda y da la alternativa (por ejemplo, "No soportado: usa otra herramienta para esta estación"). Cierra con una línea sobre qué no depende de la herramienta, como el gate de CI.

## Entregable
Qué archivo o PR se entrega, en qué ruta de tu repo y para cuándo.

## Rúbrica
| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|

## Cómo alimenta la siguiente estación
Qué parte de tu entregable usa la estación N+1.

## Track avanzado
Un reto opcional para quien termina antes.

## Recursos
Enlaces con fecha de revisión.
