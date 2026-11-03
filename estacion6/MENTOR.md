# Estación 6 · Guía del mentor

## En una frase
El alumno sale con el plan completo de su producto iniciado (todas las tareas, no una de muestra) y sabe distinguir una tarea lista de una ambigua. El error más común es entregar un plan que cubre solo una feature, o tareas sin un comando real para verificarlas.

## Preparación (48 h antes)
- [ ] Lee [`fuente/guion.md`](fuente/guion.md): tiene el guion minuto a minuto de la Cohorte 4 y las notas para explicar la teoría con precisión (persistencia, compaction, hooks, EBO, auto-mejora). Esta guía lo actualiza; las notas de teoría siguen vigentes
- [ ] Ensaya la generación del plan en tu repo de demo de E4 y E5 (rama `ensayo-e5`): copia la skill a `.agents/skills/`, corre `npm run sync-skills` y usa el prompt de [`estacion7/preparacion.md`](../estacion7/preparacion.md). Guarda el resultado en una rama `ensayo-e6`
- [ ] Publica ese plan en un proyecto de Linear de tu workspace, sin orquestador observándolo, y anota el camino que usaste (skill, MCP o web)
- [ ] Abre [`estacion6.html`](estacion6.html) y revisa las slides contra este guion: son de la Cohorte 4 y algunas fechas y rutas cambiaron
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-5`: quién llega sin la primera unidad. Esos alumnos pueden planear igual con su Inception, o con el ejemplo de EntreVista AI si no la tienen
- [ ] Recuerda a los alumnos que traigan su propio workspace de Linear: el plan gratuito se queda corto si toda la cohorte publica en uno

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–5 | Muestra una tarea lista y una ambigua ("implementa autenticación") | Dicen qué le falta a la ambigua | Slides 1–2 |
| 5–18 | Alcance, contexto y ejecución; modelo y arnés; skill, contexto, MCP y hook | Ubican su herramienta en el mapa y clasifican ejemplos | Slides 3–5 |
| 18–25 | Ejemplo trabajado: regla, alcance, criterios y mapeo a Linear | Responden "¿qué falta para que esta tarea esté lista?" | Slides 6–8, `ejemplo-y-prompts.md` |
| 25–55 | Circula mientras generan el plan: primero a quien no tiene la skill instalada, luego a quien el plan le sale parcial | Reúnen artefactos, generan el paquete, revisan en parejas y anotan bloqueos | Slide 9, README "Tu tarea" |
| 55–60 | Pausa | | |
| 60–75 | Persistencia y compaction; hooks y evidencia | Cada pareja propone un hook: evento, acción, evidencia y qué no garantiza | Slides 10–12 |
| 75–90 | Comparación A/B, EBO y auto-mejora de modelo vs. arnés | Identifican variables y una conclusión inválida | Slides 13–15 |
| 90–108 | Puente a E7 y revisión cruzada del paquete | Corrigen cobertura y dependencias | Slides 16–17 |
| 108–120 | Preparación de E7: accesos a GitHub y Linear, dudas | Prueban sus accesos | Slides 18–19, `../estacion7/preparacion.md` |

## Demo
No hay demo larga: el ejemplo trabajado está escrito y la práctica es de los alumnos. En el minuto 25, en Claude Code y en tu repo de demo:

1. Muestra la skill en `.agents/skills/create-implementation-plan/` y su copia en `.claude/skills/` después de `npm run sync-skills`.
2. Pega el prompt de la preparación y deja que empiece a leer los artefactos. No esperes a que termine: cambia a `ensayo-e6` y muestra `task-package.yaml`, una tarea completa y `cobertura.md`.
3. Señala en una tarea de dónde salió cada criterio de aceptación (un escenario Gherkin o una regla de AI-DLC).

Plan B: si el agente no arranca o no hay red, todo está en `ensayo-e6` y en `ejemplo-y-prompts.md`.

## Conceptos clave
1. **Una tarea está lista cuando alguien la puede ejecutar mañana sin este chat.** Alcance, fuera de alcance, contexto, aceptación observable y un comando real de verificación.
   Pregunta: "¿Qué comando demuestra que esta tarea está terminada?"
2. **Plan completo no es plan desbloqueado.** El paquete cubre todo el alcance; solo algunas tareas se pueden ejecutar ya y las demás esperan dependencias o decisiones.
   Pregunta: "¿Cuál es tu primera tarea ejecutable y qué bloquea a la segunda?"
3. **El spec gobierna; Linear es una proyección.** Si cambia un contrato, hay que alinear archivos de tareas e issues: no hay sincronización automática.
   Pregunta: "Si cambias un criterio en Linear, ¿dónde más lo tienes que cambiar?"
4. **Un hook reacciona a un evento; no reemplaza CI ni la revisión.**
   Pregunta: "¿Qué no garantiza tu hook?"
5. **Evaluar un cambio del sistema exige comparar con control.** Una mejora en una corrida no es evidencia.
   Pregunta: "¿Qué tendría que cambiar en tu A/B para que la conclusión no sea válida?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| El plan tiene 4 o 5 tareas de una feature | El agente se quedó con una parte del alcance | Volver al prompt: "TODAS las tareas", y revisar `cobertura.md` contra `requirements.md` |
| Tareas con "correr los tests" sin comando | El agente no leyó el repo | Pedir que cite el comando real (`npm run verify`) y la ruta del test |
| La skill reescribió `AGENTS.md` | Comportamiento de la skill | Revisar el diff y quedarse solo con lo que suma |
| Tareas que repiten la primera unidad | No se marcó como evidencia existente | Actualizar `cobertura.md` y eliminar las tareas duplicadas |
| Linear rechaza crear más issues | Workspace compartido sobre el límite del plan gratuito | Usar un workspace propio |
| Al publicar, un orquestador empieza a trabajar | Se publicó en un proyecto observado | Publicar en un proyecto sin despacho y mover después |
| Ciclos en el grafo | Dependencias mutuas entre tareas | Pedir al agente que valide el grafo y parta la tarea que causa el ciclo |

## Preguntas frecuentes
- **¿Tengo que instalar OpenSymphony hoy?** No. La skill funciona sola en cualquier herramienta. OpenSymphony aparece en E7.
- **¿AI-DLC no hace esto ya?** AI-DLC define las unidades y el orden de entrega; este plan las baja a tareas que un agente ejecuta en un PR, con su contrato y su evidencia.
- **¿Puedo usar GitHub Issues en lugar de Linear?** El programa usa Linear porque OpenSymphony lo consume. Si tu empresa usa otro tracker, publica igual en Linear para E7 y anota la equivalencia.
- **¿Cuántas tareas debería tener?** Las que el alcance pida. Más importante que el número: cada una pequeña, verificable y con dependencias claras.

## Qué se adapta y qué no
- Fijo: el plan completo del alcance, la tabla de cobertura, la revisión del grafo, la publicación en un proyecto sin despacho, el entregable y la rúbrica
- Libre: el ejemplo de la tarea ambigua, cuánto tiempo dar a EBO y auto-mejora según el grupo y si la revisión cruzada es en parejas o en tríos

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-6` se entrega antes de la Estación 7 junto con el proyecto de Linear
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-6` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, revisa en voz alta dos `cobertura.md` y busca juntos un requisito sin tarea

## Notas para el siguiente mentor
El análisis del post-mortem de la Cohorte 3 que dio forma a E6 y E7 está en [`fuente/post-mortem.md`](fuente/post-mortem.md).

Pendiente: se llena al terminar la Cohorte 6.
