# Estación 1 · Guía del mentor

## En una frase
El alumno sale convencido de que puede construir un producto real de punta a punta con agentes, con el producto elegido y claro en qué entrega esta semana. El error más común es salir con una idea de "usar IA para X" en lugar de un dolor concreto de un usuario concreto.

## Preparación (48 h antes)
- [ ] Corre la demo de [SkillWall Live](demo/) de punta a punta en tu cuenta siguiendo [`demo/README.md`](demo/README.md): Construction de las tres unidades, deploy en AWS y Vercel, validación y tear down. Toma 2 a 3 horas la primera vez
- [ ] Guarda ese ensayo en una rama (por ejemplo, `ensayo-e1`) con el código generado de `infra/`, `backend/` y `frontend/`: es tu plan B y lo que muestras de las unidades que no alcanzas a generar en vivo
- [ ] Deja desplegada la versión del ensayo con la sesión `LATAM2026` sembrada, para que los alumnos entren desde su teléfono durante la demo
- [ ] Configura el MCP de Playwright en Claude Code (`claude mcp add playwright npx @playwright/mcp@latest`): la allowlist de `demo/.claude/settings.json` ya lo contempla para las pruebas E2E
- [ ] Lee los problemas críticos de [`demo/troubleshooting.md`](demo/troubleshooting.md): #21, #31 y #32 en infra; #1, #2 y #3 en backend; #5, #6 y #19 en frontend
- [ ] Revisa en [`versions.md`](../versions.md) los modelos vigentes y ten Claude Code con un modelo capaz para la demo
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion nivelacion-1`: quién no tiene repo, entorno o track. Escríbeles antes de la sesión
- [ ] Ten a la mano el calendario de la cohorte (fechas, días y horario de refuerzos) para el bloque del programa

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–20 | Charla: el LLM es el motor y el agente es la capa de ingeniería; no arregles el código, arregla el sistema; el rol FDE | Escuchan y comparten en el chat qué esperan del programa | Slides bloque 1 |
| 20–40 | El programa: tracks, mapa de 12 estaciones, entregas por PR con etiqueta, el Juez y los refuerzos | Ubican cada estación en el calendario | Slides bloque 2, [`plantilla-alumno/README.md`](../plantilla-alumno/README.md) "Entregas y el Juez" |
| 40–45 | Pausa | | |
| 45–100 | Demo de SkillWall Live (ver Demo) | Observan y entran a la app desde su teléfono | [`demo/`](demo/) |
| 100–115 | Los dos templates, el banco de productos y el PVB de EntreVista AI | Eligen camino y template | [`product-vision-board.md`](product-vision-board.md), [`../estacion2/docs/pvb.md`](../estacion2/docs/pvb.md) |
| 115–120 | Entregable, rúbrica y qué traer a E2 | Anotan dudas para el refuerzo | README "Entregable" |

## Demo
En Claude Code, que es la herramienta de referencia. Lo que se muestra es el proceso, no la app: cómo se le habla al agente, qué recibe de entrada, dónde se le frena y cómo se verifica lo que devuelve.

1. **Los inputs (minuto 45, 5 min).** Abre `demo/requirement.md` (el PRD) y `demo/adr.md` (las decisiones de arquitectura). Remarca que nadie le dice al agente "hazme una app": las capas, la arquitectura y las tecnologías se decidieron antes.
2. **El flujo AI-DLC (minuto 50, 5 min).** Abre `demo/AGENTS.md` y `demo/aidlc-docs/aidlc-state.md`. Explica que Inception ya está completa (requisitos, historias, diseño y unidades) y que hoy se ejecuta Construction. Muestra que `CLAUDE.md` solo importa `AGENTS.md`: el mismo flujo funciona con cualquier coding agent.
3. **Construction en vivo (minuto 55, 25 min).** Pega el prompt de arranque de `demo/README.md`. Deja que genere el plan de la unidad `infra`, apruébalo en voz alta, deja que genere el Terraform y corre `terraform plan`. Detente en cada aprobación: es lo que los alumnos tienen que ver.
4. **El resultado (minuto 80, 15 min).** Cambia a la rama del ensayo y muestra `backend/` y `frontend/` generados, las pruebas y la app desplegada. Pide a los alumnos que se registren desde su teléfono y den likes: el wall se actualiza en vivo.
5. **La lección (minuto 95, 5 min).** Abre `demo/troubleshooting.md` y explica que cada uno de esos 33 problemas apareció en una corrida real y quedó documentado para que el agente no lo repita: eso es arreglar el sistema y no el código.

Plan B si algo falla en vivo:
- El agente tarda o se desvía en la unidad `infra`: detén la generación y muestra el resultado del ensayo; el punto es el proceso, no la velocidad.
- AWS o Vercel fallan: la app del ensayo ya está desplegada; si también falla, muestra capturas de la validación del README.
- No alcanza el tiempo: salta el paso 3 y recorre el código del ensayo explicando qué aprobaste en cada etapa.

Después de la sesión, haz el tear down del README para no dejar recursos en tu cuenta.

## Conceptos clave
1. **El LLM es el motor; el agente es la capa de ingeniería alrededor.** Tu trabajo está en esa capa: contexto, herramientas y controles.
   Pregunta: "¿Qué diferencia hay entre usar Claude en el chat y usar un coding agent en tu repo?"
2. **No arregles el código, arregla el sistema que lo produce.** Cada error del agente es una oportunidad de mejorar el contexto o los controles para que no se repita.
   Pregunta: "Si el agente comete el mismo error dos veces, ¿qué cambias?"
3. **Spec primero.** La demo funciona porque hay un PRD y decisiones de arquitectura antes de escribir código. Las estaciones 1 a 5 existen para eso.
   Pregunta: "¿Qué le diste al agente en la demo antes de pedirle código?"
4. **Saber qué construir es la nueva ventaja.** Si cualquiera puede construir, la diferencia está en elegir el problema correcto.
   Pregunta: "¿Qué dolor concreto resuelve tu producto y para quién?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| "Mi producto usa IA para mejorar la productividad" | Parte de la tecnología y no del problema | Pedirle el usuario concreto y el momento exacto en que sufre el dolor |
| Duda entre tres ideas | Miedo a elegir mal | Que elija la que tenga usuarios reales a la mano; puede cambiarla hasta E2 |
| El deep research de crítica salió suave | Le preguntó al modelo si la idea es buena | Pedir explícitamente las razones por las que fracasaría y los competidores que ya lo hacen |
| Entrega el PVB lleno de cifras sin fuente | El modelo completó los campos | Marcar como pendiente lo que no tiene fuente; la rúbrica lo penaliza |
| Viene de una empresa y no sabe qué template usar | No distingue producto propio de problema interno | Problema de su organización con un sponsor: ISB. Producto para un mercado: PVB |
| No tiene repo personal o no sabe abrir un PR | Se saltó la Nivelación 1 | Mandarlo al paso 2 de la Nivelación 1 y resolverlo en el refuerzo |

## Preguntas frecuentes
- **¿Puedo cambiar de producto después?** Sí, hasta la Estación 2 sin costo. Después cuesta más porque el PRD y el repo se construyen encima.
- **¿Tengo que usar Claude Code?** No. Cualquiera de las cinco herramientas sirve; las demos y el soporte garantizado son en Claude Code.
- **¿La demo es lo que voy a construir?** No. Es la evidencia de que el proceso funciona. Tu producto es el tuyo, y EntreVista AI es el ejemplo que verás en cada estación.
- **¿Cuánto cuesta la demo en AWS?** Con el free tier y el tear down al final, prácticamente nada. No es parte de tu tarea repetirla.

## Qué se adapta y qué no
- Fijo: los dos templates, el entregable, la rúbrica y que la demo muestre el proceso con aprobaciones humanas
- Libre: los ejemplos de la charla, cuánta Construction se hace en vivo según cómo vaya el agente y qué partes del programa se detallan según el grupo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-1` se entrega antes de la Estación 2 y que sin él la clase de E2 se ve desde la tribuna
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-1` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`. El Juez se activa en E3, así que esta revisión es tuya: usa la rúbrica
- En el refuerzo, revisa dos o tres problemas en voz alta y ayuda a convertirlos en dolores concretos

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
