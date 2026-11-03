# Estación 7 · Conceptos de orquestación

Guía de la primera parte de la sesión. Cinco ideas, en el orden en que las vas a usar al despachar tu plan: dónde corre cada cosa, qué problemas resuelve un orquestador, qué patrones existen, cómo lo especifica Symphony y cómo se decide que una tarea está terminada. Cada sección cierra con una pregunta para tu proyecto y sus fuentes.

Fuentes revisadas el 3 de noviembre de 2026.

---

## 1. Las capas: modelo, arnés, meta-arnés y orquestador

| Capa | Qué hace | Ejemplos |
|---|---|---|
| **Modelo** | Interpreta la información y propone respuestas o acciones | Claude, GPT, Gemini |
| **Arnés** (*harness*) | Conecta el modelo con herramientas y entorno: archivos, terminal, permisos, contexto, skills, hooks, subagentes | Claude Code, Cursor, Codex, Antigravity, GitHub Copilot, OpenHands |
| **Meta-arnés** | Opera sobre uno o varios arneses: los lanza, administra sus sesiones y workspaces, los supervisa | El host de agentes de OpenSymphony (OpenHands, Codex app-server o ACP) |
| **Orquestador de trabajo** | Gobierna el ciclo de vida de las tareas: cuáles son elegibles, quién las toma, reintentos, revisión y cierre | Symphony y OpenSymphony, con Linear como tracker |

Las capas describen responsabilidades, no una pila obligatoria. En la ruta B de esta estación tú haces de orquestador y tu coding agent es el arnés. En la ruta A, OpenSymphony es el orquestador y el meta-arnés.

Una distinción que conviene no perder: **estado** es la situación vigente; **memoria** es lo que se conserva para actuar después. Cada uno tiene una autoridad: el tracker gobierna el estado de la tarea, el repo gobierna el código y las notas o resúmenes son vistas derivadas.

**Para tu proyecto:** en tu ruta, ¿quién ejecuta las herramientas, quién conserva la sesión y quién decide qué tarea sigue?

Fuentes: [Anthropic, *Demystifying evals for AI agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) (definición de arnés), [OpenSymphony](https://github.com/kumanday/OpenSymphony).

---

## 2. Los tres problemas que resuelve un orquestador

1. **Alcance:** convertir el alcance aprobado en todas las tareas necesarias, con prioridades, dependencias y límites. Lo resolviste en la Estación 6 con el paquete de tareas.
2. **Contexto:** dar a cada ejecución la información que necesita y conservar decisiones, resultados y aprendizajes entre sesiones, compactaciones y relevos.
3. **Ejecución:** elegir el trabajo elegible, asignarlo, aislarlo, observar su progreso, validar el resultado y recuperarse de fallos o bloqueos.

Los tres existen con un solo agente que trabaja por etapas. Con varios agentes en paralelo se agregan aislamiento, coordinación e integración.

**Para tu proyecto:** ¿cuál de los tres te costó más en las Estaciones 4 a 6?

---

## 3. Patrones de coordinación

### Bucle con estado fuera de la conversación
Un controlador invoca al agente una y otra vez; en cada vuelta el agente lee el estado desde archivos, hace una porción acotada del trabajo, valida y deja registro. El contexto se reinicia, pero el progreso no se pierde porque vive en disco. Es la idea detrás de **Ralph** y de los arneses para tareas largas que describe Anthropic: una lista de funcionalidades marcadas como pendientes, un archivo de progreso, commits frecuentes y una prueba básica al inicio de cada sesión.

Su riesgo es avanzar sin progreso real. Una implementación robusta incorpora límites de iteración, detección de falta de avance y criterios de salida.

### Especialización: planificar, generar y evaluar por separado
Distintos agentes, o subagentes, con objetivo y contexto propios: uno planea, otro implementa y otro evalúa. Separar la evaluación importa porque un agente tiende a calificar bien su propio trabajo. La delegación necesita un contrato de entrada, límites y un resultado que se pueda integrar.

### Orquestador conectado al tracker
Un servicio lee las tareas del tracker, crea un espacio de trabajo aislado por tarea y ejecuta un agente en cada uno, con concurrencia acotada. El estado del trabajo vive en el tracker y la política vive en el repo. Es el patrón de Symphony y OpenSymphony (sección 4).

**Antes de adoptar uno:** sigue tareas reales hasta su integración y registra dónde necesitaron corrección humana. Más estructura de coordinación no garantiza mejores resultados; la que uses debe corresponder al trabajo que quieres sostener.

**Para tu proyecto:** ¿qué patrón se parece más a cómo trabajaste en la Estación 5 con AI-DLC?

Fuentes: [Ralph (Geoffrey Huntley)](https://github.com/ghuntley/how-to-ralph-wiggum), [Anthropic, *Effective harnesses for long-running agents*](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents), [Anthropic, *Harness design for long-running application development*](https://www.anthropic.com/engineering/harness-design-long-running-apps), [Anthropic, *Building effective agents*](https://www.anthropic.com/engineering/building-effective-agents).

---

## 4. Symphony: la especificación de un orquestador

OpenAI publicó Symphony como una especificación (`SPEC.md`) más una implementación de referencia; OpenSymphony es otra implementación, en Rust. La especificación define un servicio que lee trabajo de un tracker, crea un workspace aislado por issue y corre una sesión de un coding agent dentro de él. Las piezas que vas a ver en la demo:

| Pieza | Qué define | Por qué importa |
|---|---|---|
| `WORKFLOW.md` | El contrato del repo: prompt del agente y configuración, versionados con el código | La política de cómo trabajan los agentes se revisa en PR como cualquier código |
| Workspace por issue | Un directorio determinista por tarea; el agente solo corre dentro de él | Dos tareas no pisan los mismos archivos |
| Despacho | Sondeo periódico del tracker, selección de issues elegibles y concurrencia acotada | Solo corre lo que está listo, y no más de lo que puedes revisar |
| Reintentos | Espera creciente ante fallos transitorios | Un fallo de red no se convierte en trabajo perdido |
| Reconciliación | Si el estado del issue cambia, el orquestador detiene o retoma la ejecución | El tracker manda; una ejecución huérfana no sigue gastando |
| Estado de entrega | Una ejecución exitosa puede terminar en un estado como *Human Review*, no en *Done* | Terminar la ejecución no es cerrar la tarea |

OpenSymphony agrega, entre otras cosas, el grafo de tareas con dependencias, la revisión por agentes, la memoria de tareas completadas y el grafo de código.

**Para tu proyecto:** ¿a qué estado de Linear debería llegar una tarea cuando el agente termina, y quién la mueve a *Done*?

Fuentes: [Symphony y su `SPEC.md`](https://github.com/openai/symphony/blob/main/SPEC.md) (secciones 1, 5, 7, 8 y 9), [documentación de OpenSymphony](https://github.com/kumanday/OpenSymphony/tree/main/docs).

---

## 5. Gobernanza: cuándo una tarea está terminada

- **Lista para ejecutar:** dependencias resueltas, alcance acotado, criterios de aceptación observables y un comando real de verificación (la *Definition of Ready* de tus tareas de la Estación 6).
- **Terminada:** la evidencia lo demuestra. Diff, comandos de prueba con su resultado, CI en verde y los criterios de aceptación marcados. Que el agente diga "listo" no es evidencia.
- **Revisada:** un agente distinto del que implementó revisa el PR, y tú revisas el diff y la evidencia antes de integrar.
- **Controles:** un hook reacciona a un evento del arnés (observar, modificar o bloquear son capacidades distintas); CI y la revisión controlan el merge. Ninguno reemplaza a los otros.
- **Continuidad:** compaction resume el historial para seguir en la misma sesión; un reinicio con nota de handoff empieza limpio y depende de que la nota tenga lo necesario. La memoria sirve si la siguiente tarea la consulta y comprueba sus fuentes.

**Para tu proyecto:** ¿qué evidencia necesitas ver en un PR de agente para integrarlo sin miedo?

Fuentes: [Claude Code: hooks](https://code.claude.com/docs/en/hooks-guide), [OpenAI, persistencia y compaction en ARC-AGI-3](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/), [Engineering Behavior Observatory](https://github.com/trilogy-group/engineering-behavior-observatory).

---

## Para profundizar

Lecturas opcionales, sin instalaciones obligatorias. La lista de herramientas y artículos de E6 y E7 está en [`../estacion6/recursos.md`](../estacion6/recursos.md).

- [OpenAI, *Harness engineering*](https://openai.com/index/harness-engineering/)
- [Anthropic, *Effective context engineering for AI agents*](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Steve Yegge, *The Shape of Things to Come*](https://yegge.ai/essays/the-shape-of-things-to-come/), sobre Gas Town, un orquestador multiagente con roles y memoria persistente, y la [crítica reportada en AI News](https://www.latent.space/p/ainews-reality-checks-on-ai-news) sobre su confiabilidad
