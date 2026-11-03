# Estación 7 · Orquestación de agentes de código

## Objetivo
Pasar del plan a la ejecución: despachar tareas de tu plan a agentes respetando sus dependencias, revisar sus PR con otro agente y contigo, e integrarlas, dejando memoria para la siguiente tarea.

## Antes de la clase
- Tu entrega de la Estación 6: el plan completo en `docs/tasks/` y publicado en tu proyecto de Linear
- La [preparación](preparacion.md) terminada: accesos a GitHub y Linear comprobados y tu primera tarea ejecutable identificada
- Si vas a usar OpenSymphony: Rust 1.97.1 o más nuevo (`rustup update stable`), `cargo install opensymphony` y una clave personal de Linear en `LINEAR_API_KEY` (ver [la guía de OpenSymphony](https://github.com/kumanday/OpenSymphony#quick-start)). Si no, trae tu coding agent con el MCP de Linear configurado

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | Del plan a la ejecución: modelo, arnés, meta-arnés y orquestador | Saber quién hace qué en una ejecución |
| 10–35 | Patrones de coordinación y la especificación de Symphony: workspaces, despacho, reintentos y reconciliación | Criterios para elegir y operar un orquestador |
| 35–65 | Demo de OpenSymphony: init, despacho de una tarea, revisión por agentes, integración de una tarea revisada, grafos y memoria | Ver el ciclo completo funcionando |
| 65–70 | Pausa | |
| 70–110 | Práctica: despachas tu primera tarea ejecutable y revisas su PR | Una tarea en revisión o integrada |
| 110–120 | Entregable, rúbrica y preguntas | Claridad sobre lo que sigue |

## Ejemplo trabajado
La demo usa un plan de EntreVista AI publicado en Linear: una tarea nueva para mostrar el despacho y otra que ya pasó por varias rondas de revisión para mostrar la integración.

Material de apoyo:
- [`conceptos.md`](conceptos.md): la guía de la primera parte (capas, problemas, patrones, Symphony y gobernanza), con fuentes y una pregunta por sección para tu proyecto
- Slides en [HTML](estacion7.html) y [PDF](estacion7.pdf). Las capturas de la app son de la documentación de OpenSymphony y tienen datos de ejemplo

## Tu tarea
Trabaja en tu repo personal. Elige una de dos rutas; las dos cuentan igual.

**Ruta A: OpenSymphony.** Orquesta las tareas de Linear con el arnés que elijas.
1. En la raíz de tu repo: `opensymphony init --target-branch main` (el valor por defecto es `develop`). Si ya tienes `AGENTS.md`, lo deja intacto y escribe una propuesta en `AGENTS-example.md`: incorpora lo que sume.
2. Elige el arnés (tabla de abajo) y corre `opensymphony run`. En otra terminal, `opensymphony tui` para supervisar.
3. Mueve a un estado activo solo las tareas sin dependencias pendientes.

**Ruta B: despacho manual.** Tú haces de orquestador con tu coding agent y el MCP de Linear.
1. Una tarea por rama. Para trabajar dos en paralelo, usa `git worktree add ../<repo>-<tarea> -b <tarea>` y una sesión del agente en cada carpeta.
2. Usa el prompt "Dispatch manual" de [`../estacion6/ejemplo-y-prompts.md`](../estacion6/ejemplo-y-prompts.md) y pide al agente que actualice el estado del issue en Linear.

**En las dos rutas:**
4. **Cierra al menos tres tareas del plan**, en el orden que permiten sus dependencias. Cada una en su propio PR que cita el issue de Linear.
5. **Revisión por un agente:** el revisor de OpenSymphony, una revisión de Codex o un subagente con el prompt "Revisión cruzada" de E6. Atiende o responde cada comentario.
6. **Revisión humana:** tú lees el diff y la evidencia (comandos y resultados) antes de integrar. CI en verde y la URL de Vercel respondiendo.
7. **Deja memoria:** una nota de handoff por tarea (prompt "Handoff" de E6) o la memoria de OpenSymphony, y úsala al empezar la siguiente.
8. **Escribe la bitácora** en `docs/tasks/ejecucion-e7.md`: por tarea, el issue, el PR, quién revisó, qué corregiste y la evidencia.

### Arnés por herramienta

| Tu herramienta | Ruta A: arnés en OpenSymphony | Ruta B |
|---|---|---|
| Claude Code (referencia) | OpenHands con un modelo de Anthropic (`LLM_MODEL` y `LLM_API_KEY`) | Claude Code, worktrees y un subagente revisor |
| Codex | Codex app-server con tu sesión de ChatGPT (`OPENSYMPHONY_HARNESS=codex_app_server`) | Codex |
| Cursor | Perfil ACP con el CLI de Cursor (`agent acp`), calificado por OpenSymphony | Cursor |
| GitHub Copilot | OpenHands con el proveedor de modelos que tengas | Copilot |
| Antigravity | OpenHands con el proveedor de modelos que tengas | Antigravity |

OpenHands es el arnés por defecto de OpenSymphony y necesita Python 3.13 con `uv` (`opensymphony install openhands`). La configuración de cada arnés está en [la documentación de OpenSymphony](https://github.com/kumanday/OpenSymphony/tree/main/docs).

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-7`, antes de la Estación 8, que incluya `docs/tasks/ejecucion-e7.md` con:
- Al menos tres tareas del plan cerradas, cada una con su issue de Linear y su PR integrado
- Por PR: la revisión del agente, lo que corregiste y la evidencia de validación
- La ruta que usaste (A o B) y el arnés
- Dos o tres líneas sobre qué cambiarías en tus tareas o en tu harness después de verlas ejecutarse

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Tareas | Al menos tres tareas del plan cerradas, cada una en su PR integrado | Una o dos tareas cerradas | Ninguna tarea cerrada |
| Revisión | Cada PR tiene revisión de un agente y revisión humana, con los comentarios atendidos | Falta una de las dos revisiones en algún PR | Los PR se integraron sin revisión |
| Evidencia | Cada PR muestra comandos y resultados de validación y los criterios de aceptación cumplidos, con CI en verde | Evidencia incompleta en algún PR | Sin evidencia |
| Dependencias | Las tareas se despacharon en el orden que permite el grafo y Linear refleja su estado | Alguna tarea fuera de orden o Linear desactualizado | No se respetaron dependencias |
| Memoria | Hay handoff o memoria por tarea y la bitácora muestra cómo se usó en la siguiente | Handoff sin uso posterior | No hay handoff ni memoria |

## Cómo alimenta la siguiente estación
En la Estación 8 automatizas la calidad: pruebas E2E con Playwright y evaluaciones de tu agente que bloquean el merge. Las tareas que integraste hoy son lo primero que esas pruebas van a cubrir.

## Track avanzado
- Corre dos tareas independientes en paralelo y documenta cómo resolviste la integración.
- Prueba las dos rutas con la misma tarea y compara: tiempo, intervenciones humanas y calidad del PR.
- Explora el grafo de conocimiento y el de código de OpenSymphony y usa una consulta para preparar la siguiente tarea.

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Lista completa en [`../estacion6/recursos.md`](../estacion6/recursos.md).

- [OpenSymphony](https://github.com/kumanday/OpenSymphony): instalación, arneses y [ACP](https://github.com/kumanday/OpenSymphony/blob/main/docs/acp.md)
- [OpenAI Symphony](https://github.com/openai/symphony): la especificación que implementa
- [MCP de Linear](https://linear.app/docs/mcp)
- [Git worktree](https://git-scm.com/docs/git-worktree)
- [Conceptos de la estación](conceptos.md)
