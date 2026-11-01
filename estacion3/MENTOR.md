# Estación 3 · Guía del mentor

## En una frase
El alumno sale con una URL pública donde su agente responde, con tests y CI, y entiende que la calidad de lo que produce un agente depende sobre todo del contexto y los controles que le pones. El error más común es pedirle al agente "hazme el endpoint, los tests y el deploy" en un solo prompt y no verificar nada.

## Preparación (48 h antes)
- [ ] Clona `cohorte6` y corre la solución de referencia: `cd estacion3/repos/walking-skeleton && npm install && npm run verify`
- [ ] Crea un repo de demo desde `plantilla-alumno/` (paso 2 de la Nivelación 1) y conéctalo a Vercel: es tu punto de partida en vivo
- [ ] Ten a la mano una llave de Anthropic con límite de gasto y un `AGENT_ACCESS_TOKEN` generado
- [ ] Prepara la demo del minuto 0: la misma petición al agente en un repo sin `AGENTS.md` y en otro con `AGENTS.md` (ver Demo, paso 1)
- [ ] Revisa en `versions.md` el modelo vigente y que la URL de la solución de referencia en Vercel responde
- [ ] Revisa el semáforo: quién no tiene su repo creado desde la plantilla o no entregó el PRD

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | Demo "con y sin `AGENTS.md`": la misma petición, dos resultados | Observan y anotan las diferencias | Slides 1–3 |
| 10–30 | Explica las piezas del harness con la tabla de equivalencias | Ubican cada pieza en su herramienta | Slides 4–9, README "Las piezas del harness" |
| 30–45 | Demo en Claude Code: completa `AGENTS.md`, crea una skill y un hook | Siguen en su pantalla | Slides 10–12 |
| 45–55 | Muestra cómo partir la tarea en pasos verificables | Escriben su plan de 7 pasos | Slide 13, README "Tu tarea" |
| 55–60 | Pausa | | |
| 60–105 | Circula y destraba: primero a quien no tiene el entorno, luego a quien está en el deploy | Construyen los pasos 1 a 7 | README "Tu tarea" |
| 105–115 | Demo de dos tareas en paralelo con subagentes o `git worktree` | Observan | Slides 14–15 |
| 115–120 | Entregable, rúbrica y conexión con E4 | Anotan dudas para el refuerzo | Slides 16–17 |

## Demo
Todo en Claude Code, que es la herramienta de referencia.

1. **Con y sin `AGENTS.md` (minuto 0).** En una carpeta con solo la plantilla y `AGENTS.md` vacío, pide: *"Agrega un endpoint POST /api/agent que responda con Claude"*. Repite en otra carpeta con el `AGENTS.md` de la solución de referencia. Compara: validación, manejo de errores, uso de `ANTHROPIC_MODEL`, tests. No hace falta que el primero salga mal; basta con mostrar que el segundo sigue las convenciones sin pedírselas.
2. **Harness (minuto 30).** En tu repo de demo:
   - Completa "Qué es este proyecto" en `AGENTS.md` y muestra que `CLAUDE.md` solo contiene `@AGENTS.md`.
   - Copia la skill `nuevo-endpoint` de la solución a `.agents/skills/`, corre `npm run sync-skills` y pídele a Claude Code una ruta nueva para que la skill se active.
   - Muestra `npm run hooks` y un commit que falla porque un test no pasa.
3. **Paralelo (minuto 105).** Con `git worktree add ../demo-logs` abre una segunda sesión: en una, el job de gitleaks; en la otra, los logs. Integra ambas ramas.

Plan B si algo falla en vivo:
- La API de Anthropic no responde: muestra los tests, que usan un doble y no necesitan red.
- Vercel falla o tarda: usa la URL ya desplegada de la solución de referencia y explica los pasos en `repos/walking-skeleton/README.md`.
- No alcanza el tiempo: salta el paso 3 de la demo; el track avanzado lo cubre.

## Conceptos clave
1. **El harness pesa más que el modelo.** El mismo modelo con buen contexto y buenos controles produce mejor código.
   Pregunta: "¿Qué le dijiste a tu agente en `AGENTS.md` que no tuviste que repetirle en el prompt?"
2. **Instrucciones siempre, skills cuando hacen falta.** Lo que aplica a todo va en `AGENTS.md`; un procedimiento específico va en una skill, que solo se carga cuando la tarea lo pide.
   Pregunta: "¿Por qué el paso a paso para crear un endpoint es una skill y no va en `AGENTS.md`?"
3. **Lo obligatorio no depende del agente.** El pre-commit y CI corren siempre, con cualquier herramienta y aunque el agente se olvide.
   Pregunta: "Si tu agente se salta los tests, ¿qué lo detiene?"
4. **El skeleton existe para que lo siguiente sea incremental.** Desde hoy cada cambio pasa por los mismos tests, el mismo CI y el mismo deploy.
   Pregunta: "¿Qué tendrías que hacer para desplegar un cambio de una línea?" (Respuesta: un push.)

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| Los tests gastan saldo o fallan sin red | El test llama a la API real | Inyectar un doble del cliente, como en `tests/agent.test.ts` de la solución |
| En Vercel el endpoint responde 502 | Falta `ANTHROPIC_API_KEY` en las variables de entorno de Vercel, o se agregó después del deploy | Agregarla y volver a desplegar |
| El endpoint responde 401 desde la página | Definió `AGENT_ACCESS_TOKEN` en Vercel pero no lo escribió en el formulario | Escribir el token en el campo de la página |
| CI falla en "Skills sincronizadas" | Editó `.agents/skills/` sin correr `npm run sync-skills` | Correrlo y hacer commit de `.claude/skills/` |
| El job de gitleaks pide licencia | El repo es de una organización de GitHub | Usar un repo personal o configurar `GITLEAKS_LICENSE` |
| `next build` falla en Vercel pero no en local | Versión de Node distinta | Revisar que `.nvmrc` diga 22 y que Vercel use Node 22 |
| El agente de Cursor, Codex o Copilot no sigue `AGENTS.md` | El archivo no está en la raíz del repo abierto | Abrir la carpeta raíz del repo, no una subcarpeta |
| El alumno no usa Claude Code y se atora con su herramienta | Configuración específica de la herramienta | Sugerir hacer este ejercicio en Claude Code; el soporte garantizado es ahí |

## Preguntas frecuentes
- **¿Puedo usar OpenAI u otro proveedor en lugar de Claude?** Para esta estación usamos Claude para que todos lleguen al mismo resultado. En tu producto puedes cambiarlo después; la lógica está aislada en `lib/agent.ts`.
- **¿Cuánto cuesta?** Con `claude-haiku-5-5`, `max_tokens` en 300 y el límite de gasto, unas cuantas pruebas cuestan centavos. Por eso el límite y el token no son opcionales en producción.
- **¿Por qué Vercel y no AWS?** Porque hoy importa tener una URL en minutos. La infraestructura como código en AWS llega en la Estación 9.
- **¿Tengo que usar subagentes?** No. Es una vista previa; lo obligatorio son los siete pasos.

## Qué se adapta y qué no
- Fijo: los siete pasos de la tarea, el entregable, la rúbrica, Claude como LLM y Vercel como destino del deploy
- Libre: el ejemplo de la demo del minuto 0, el orden de las piezas del harness y cuánto tiempo dedicar a subagentes según el grupo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-3` y la URL de Vercel se entrega antes de la Estación 4
- En el refuerzo, prioriza a quien no tiene la URL funcionando: sin skeleton, la Estación 4 no tiene dónde aterrizar
- Revisa en el refuerzo un par de `AGENTS.md` en voz alta: es la forma más rápida de que el grupo vea qué es buen contexto

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
