# Estación 7 · Guía del mentor

## En una frase
El alumno sale con su primera tarea del plan despachada a un agente y en revisión, y entiende que terminar una ejecución no es resolver la tarea: la revisión y las pruebas lo confirman. El error más común es integrar el PR del agente sin leer el diff ni la evidencia.

## Preparación (48 h antes)
- [ ] Instala OpenSymphony en la versión vigente (`cargo install opensymphony`, Rust 1.97.1 o más nuevo) y el arnés de la demo. La forma más directa es Codex con tu sesión de ChatGPT; OpenHands necesita Python 3.13, `uv` y una llave de un proveedor de modelos
- [ ] En tu repo de demo (rama `ensayo-e6`, con el plan publicado en Linear) corre `opensymphony init --target-branch main` y revisa qué agregó: `WORKFLOW.md`, `config.yaml`, skills en `.agents/skills/` y `.opensymphony/`. Corre `npm run sync-skills` y `npm run verify`
- [ ] Despacha una tarea de punta a punta, hasta que la revisión por agentes pase varias rondas, y déjala lista para integrar en la demo. Prepara otra tarea nueva, sin dependencias, para despacharla en vivo
- [ ] Repasa las slides 2 a 8 ([`estacion7.html`](estacion7.html)): resumen las 23 lecciones del curso de Parlina usado en la Cohorte 4. Si tienes acceso al curso, úsalo para preparar los ejemplos; si no, las slides bastan para el bloque de conceptos
- [ ] Ensaya la ruta B con Claude Code: una tarea en un worktree, el prompt "Dispatch manual" y una revisión con un subagente. Es el plan B de la demo y la ruta de quien no logre instalar OpenSymphony
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-6`: quién llega sin plan o sin publicarlo en Linear

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | Taxonomía: modelo, arnés, meta-arnés, superficie cliente y orquestador | Ubican su herramienta y la de la demo en el mapa | Slides 1–3 |
| 10–35 | Patrones de coordinación (Ralph, Gas Town, GSD) y especificación de Symphony: `WORKFLOW.md`, workspaces, despacho y reconciliación | Preguntas; eligen qué patrón se parece a cómo trabajan hoy | Slides 4–8 |
| 35–65 | Demo de OpenSymphony (ver Demo) | Observan y anotan dudas | Repo de demo |
| 65–70 | Pausa | | |
| 70–110 | Circula: primero a quien no logra instalar (pásalo a la ruta B), luego a quien el agente se trabó | Despachan su primera tarea y revisan su PR | README "Tu tarea" |
| 110–120 | Entregable, rúbrica y conexión con E8 | Preguntas | README "Entregable" |

## Demo
1. **Setup (minuto 35, 5 min).** Muestra lo que agregó `opensymphony init` y el `WORKFLOW.md`: es el contrato de despacho.
2. **Despacho (minuto 40, 10 min).** `opensymphony run` y, en otra terminal, `opensymphony tui`. Mueve la tarea nueva a un estado activo en Linear y muestra cómo se crea su workspace y empieza el agente. No esperes a que termine.
3. **Revisión e integración (minuto 50, 10 min).** Cambia a la tarea preparada: muestra las rondas de revisión del agente, los comentarios atendidos y la evidencia. Integra con la skill `land` o a mano, explicando qué verificas tú antes.
4. **Grafos y memoria (minuto 60, 5 min).** Muestra el grafo de tareas con el camino crítico y la memoria que dejó la tarea integrada para la siguiente.

Plan B si algo falla en vivo:
- OpenSymphony no arranca o Linear limita las peticiones: haz la ruta B con Claude Code sobre la tarea nueva.
- El agente se traba en la tarea nueva: muestra solo la tarea preparada y su historial.

## Conceptos clave
1. **Terminar una ejecución no es resolver la tarea.** La evidencia y la revisión lo confirman.
   Pregunta: "¿Qué viste en el PR que te convenció de que la tarea está resuelta?"
2. **El orquestador decide qué se puede ejecutar; el grafo lo hace posible.** Despachar fuera de orden produce PR que no se pueden integrar.
   Pregunta: "¿Qué tarea desbloquea más trabajo si la cierras hoy?"
3. **Aislamiento por tarea.** Un workspace o worktree por tarea evita que dos agentes pisen el mismo archivo.
   Pregunta: "¿Qué pasa si dos tareas editan el mismo módulo al mismo tiempo?"
4. **Una sola fuente gobierna cada estado.** El tracker manda en el estado de la tarea; el repo, en el código. Los resúmenes son vistas derivadas.
   Pregunta: "Si Linear dice 'Done' y el PR no está integrado, ¿qué es cierto?"
5. **La memoria es para la siguiente tarea.** Si nadie la lee, no sirve.
   Pregunta: "¿Qué aprendiste en la primera tarea que le diste al agente en la segunda?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `cargo install opensymphony` falla | Rust anterior a 1.97.1 | `rustup update stable` y `cargo +stable install opensymphony --locked` |
| Los PR del agente apuntan a `develop` | `init` sin `--target-branch` | `opensymphony update --target-branch main` |
| El agente empieza tareas bloqueadas | Se movieron a un estado activo antes de tiempo | Activar solo las tareas sin dependencias pendientes |
| `init` no tocó `AGENTS.md` | Ya existía | Revisar `AGENTS-example.md` e incorporar lo útil |
| Linear devuelve error de cuota | La clave personal tiene un límite de peticiones por hora | Esperar a que se renueve; para más cuota, una app OAuth de Linear (ver la guía de OpenSymphony) |
| PR integrado con CI en rojo | Se integró sin revisar | Revertir, corregir y explicarlo en la bitácora |
| No puede instalar nada en su máquina del trabajo | Políticas de su empresa | Ruta B: solo necesita su coding agent y el MCP de Linear |

## Preguntas frecuentes
- **¿Tengo que usar OpenSymphony?** No. Las dos rutas cuentan igual. OpenSymphony automatiza lo que en la ruta B haces a mano, y verlo en las dos formas ayuda a entender qué automatiza.
- **¿Por qué mi herramienta no aparece como arnés de OpenSymphony?** OpenSymphony ejecuta con OpenHands, Codex o agentes ACP (Cursor está calificado). Si usas Claude Code, Copilot o Antigravity, en la ruta A el arnés es OpenHands con tu proveedor de modelos.
- **¿Cuánto cuesta?** Depende del arnés: Codex usa tu suscripción de ChatGPT; OpenHands, la llave de tu proveedor. Despacha pocas tareas a la vez y revisa el gasto.
- **¿Y las demás tareas del plan?** Siguen después de la estación. Las Estaciones 8 a 11 agregan calidad, despliegue, seguridad y observabilidad sobre el mismo repo.

## Qué se adapta y qué no
- Fijo: al menos tres tareas cerradas con revisión de agente y humana, el respeto del grafo, la bitácora, el entregable y la rúbrica
- Libre: cuánto tiempo dar a cada patrón de coordinación, el arnés de la demo y si la práctica es individual o en parejas

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-7` (la bitácora) se entrega antes de la Estación 8
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-7` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, revisa en voz alta un PR de agente con el grupo: qué comentarios hizo el revisor, cuáles eran correctos y qué se le escapó

## Notas para el siguiente mentor
En la Cohorte 4 esta estación fue 50 minutos de conceptos, 60 de demo y 10 de preguntas, sin práctica. Para la Cohorte 6 se acortaron los conceptos para dar 40 minutos de práctica, como pidió el post-mortem de la Cohorte 3 ([`../estacion6/fuente/post-mortem.md`](../estacion6/fuente/post-mortem.md)).

Pendiente: se llena al terminar la Cohorte 6.
