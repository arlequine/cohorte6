# Estación 6 · Del spec al plan de implementación

## Objetivo
Convertir el alcance que diseñaste con AI-DLC en un plan completo de tareas (milestones, dependencias, criterios de aceptación y cobertura de requisitos), listo para que lo ejecuten agentes y publicado en Linear.

## Antes de la clase
- Tu entrega de la Estación 5: Inception completa y la primera unidad construida, con CI en verde
- Una cuenta de [Linear](https://linear.app) con un workspace propio. El plan gratuito permite 250 issues y dos equipos, así que cada alumno usa el suyo y no uno compartido por la cohorte
- Tu coding agent funcionando en tu repo. Las demos son en Claude Code

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–5 | Ver una tarea lista y otra ambigua | Reconocer la diferencia |
| 5–18 | Alcance, contexto y ejecución; modelo y arnés; skill, contexto, MCP y hook | Un mapa común |
| 18–25 | Ejemplo trabajado: del spec a una tarea | Entender alcance, pruebas y el mapeo a Linear |
| 25–55 | Generación del plan con la skill `create-implementation-plan` y revisión en parejas | Paquete de tareas iniciado y vacíos identificados |
| 55–60 | Pausa | |
| 60–75 | Persistencia, hooks y evidencia | Cómo evitar repetir errores entre sesiones |
| 75–90 | Benchmarks, observabilidad del agente y auto-mejora | Cómo evaluar un cambio del sistema |
| 90–108 | Revisión cruzada de cobertura y dependencias | Plan revisado |
| 108–120 | Preparación de la Estación 7 y preguntas | Accesos y siguiente paso claros |

## Ejemplo trabajado
[`ejemplo-y-prompts.md`](ejemplo-y-prompts.md) lleva una regla real de EntreVista AI (la política de contraseñas de su primera unidad, en [`ejemplos/entrevista-ai/`](../ejemplos/entrevista-ai/)) a una tarea lista para ejecutar: alcance, fuera de alcance, criterios de aceptación, pendientes y evidencia. Incluye los prompts para revisar tareas en clase.

Material de apoyo:
- [Presentación HTML](estacion6.html) y [PDF](estacion6.pdf)
- [Recursos y lecturas de E6 y E7](recursos.md)
- [Preparación para la Estación 7](../estacion7/preparacion.md): la guía detallada de esta tarea

## Tu tarea
Trabaja en tu repo personal, en una rama `estacion-6`. La [preparación para la Estación 7](../estacion7/preparacion.md) tiene el prompt completo y el detalle de cada paso.

1. **Instala la skill.** Copia [`skills/create-implementation-plan/`](skills/create-implementation-plan/) a `.agents/skills/` de tu repo y corre `npm run sync-skills`. Así la usan las cinco herramientas.
2. **Genera el plan completo** con el prompt de la preparación. El agente lee tu PRD, `specs/`, los artefactos de AI-DLC en `aidlc/` (sobre todo las unidades y el plan de entrega) y el código actual, y crea `docs/tasks/task-package.yaml`, `docs/tasks/milestones.md` y un archivo por tarea.
3. **Revisa lo que cambió fuera de `docs/tasks/`.** La skill puede proponer cambios a `AGENTS.md` o crear `docs/architecture.md`: acepta solo lo que no duplica `specs/arquitectura.md` ni contradice tus instrucciones.
4. **Comprueba la cobertura** en `docs/tasks/cobertura.md`: cada requisito apunta a tareas o a evidencia de que ya existe. La primera unidad que terminaste en E5 aparece como evidencia, no como tareas nuevas.
5. **Revisa el grafo:** IDs únicos, archivos que existen, milestones y dependencias válidos, sin ciclos, y al menos una tarea ejecutable desde ya.
6. **Publica en Linear** en un proyecto sin despacho automático. Tres caminos, de más a menos automático: la skill `convert-tasks-to-linear` de OpenSymphony (con su dry-run), el [MCP de Linear](https://linear.app/docs/mcp) desde tu agente o la interfaz web. Guarda la correspondencia entre IDs locales e issues.

### Equivalencias por herramienta

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Skill `create-implementation-plan` | `.claude/skills/` (copia con `npm run sync-skills`) | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` |
| MCP de Linear (`https://mcp.linear.app/mcp`) | `claude mcp add --transport http linear https://mcp.linear.app/mcp` | `.cursor/mcp.json` | `.codex/config.toml` | `/mcp` en `agy` | `.vscode/mcp.json` |

La configuración de cada herramienta está en `mcp/README.md` de tu repo. Antigravity no ejecuta AI-DLC 2, pero esta estación no lo necesita: puede generar el plan si los artefactos de E4 y E5 ya están en el repo.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-6`, antes de la Estación 7, que incluya:
- `docs/tasks/` con el manifest, los milestones, **todos** los archivos de tareas y `cobertura.md`
- En la descripción del PR: el enlace al proyecto de Linear con la correspondencia de IDs (o "publicación pendiente" con el bloqueo), la primera tarea ejecutable y el resultado de la revisión del grafo

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Cobertura | `cobertura.md` vincula cada requisito del alcance con tareas o con evidencia existente, y los vacíos están explícitos | Hay requisitos sin tarea ni evidencia, o el plan cubre solo una parte del alcance | No hay tabla de cobertura |
| Tareas | Cada tarea tiene alcance, fuera de alcance, criterios de aceptación observables y un plan de validación con comandos reales | Tareas con criterios vagos o sin plan de validación | Tareas de una línea o sin archivo propio |
| Grafo | IDs únicos, milestones y dependencias válidos, sin ciclos, con tareas ejecutables identificadas y bloqueos explícitos | Errores de referencias o bloqueos sin explicar | No hay dependencias |
| Trazabilidad | Las tareas citan los artefactos de AI-DLC y `specs/` de los que salen | Algunas tareas sin referencia a la especificación | Las tareas no se relacionan con el diseño |
| Publicación | Publicado en Linear con correspondencia de IDs, o bloqueo documentado | Publicado sin correspondencia de IDs | No se intentó publicar ni se explica por qué |

## Cómo alimenta la siguiente estación
En la Estación 7 los agentes ejecutan tareas de este plan: las despachas por dependencias, revisas sus PR y las integras. Una tarea mal especificada hoy es un PR que no se puede revisar mañana.

## Track avanzado
- Configura un hook de tu herramienta que registre cada comando de prueba que corre el agente y úsalo como evidencia en la revisión de una tarea.
- Diseña una comparación A/B de un cambio en tu harness (por ejemplo, con y sin una skill) y define qué resultado te haría aceptarlo.
- Pide a un subagente que revise la cobertura mientras otro revisa las dependencias, y compara sus hallazgos.

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Lista completa en [`recursos.md`](recursos.md).

- [OpenSymphony](https://github.com/kumanday/OpenSymphony) y sus skills [`create-implementation-plan`](https://github.com/kumanday/OpenSymphony/tree/main/.agents/skills/create-implementation-plan) y [`convert-tasks-to-linear`](https://github.com/kumanday/OpenSymphony/tree/main/.agents/skills/convert-tasks-to-linear)
- [MCP de Linear](https://linear.app/docs/mcp)
- [Claude Code: hooks](https://code.claude.com/docs/en/hooks-guide)
- Las slides y el PDF de esta carpeta son de la Cohorte 4; este README es el vigente
