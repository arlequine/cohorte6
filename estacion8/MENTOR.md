# Estación 8 · Guía del mentor

## En una frase
El alumno sale con su suite de Playwright corriendo en CI y su primera persona evaluada por un Juez, y entiende que a un agente no se le prueba con `toBe('texto exacto')` sino con rúbricas, casos adversariales y verificaciones mecánicas. El error más común es pedirle al agente "hazme los tests" y aceptar pruebas que pasan porque no verifican nada.

## Preparación (48 h antes)
- [ ] Corre la solución de referencia: `cd estacion8/repos/entrevista-qa && npm install && npx playwright install chromium && npm run verify && npm run test:playwright`
- [ ] Con tu llave de Anthropic, levanta la app con Claude (`npm run build && npm run start`) y corre `AGENT_URL=http://localhost:3000 npm run evals`. Guarda el reporte de `evals/reportes/`: es tu plan B
- [ ] Corre `npm run evals:calibrar` y anota la concordancia del Juez con los modelos vigentes de [`versions.md`](../versions.md)
- [ ] Prepara el contraste para la demo: `AGENT_MODE=reglas npm run start` y `npm run evals -- --persona sofia`. El motor de reglas no repregunta y el Juez debería reprobarlo en `repreguntas`; si con el modelo vigente no pasa, usa el reporte del ensayo
- [ ] En un repo de demo (fork de la solución), abre un PR que rompa algo del agente (por ejemplo, quita la escalación de salario en `lib/entrevista.ts`) y deja el job `evaluacion` en rojo: es la demo del gate
- [ ] Configura el MCP de Playwright en Claude Code: `claude mcp add playwright npx @playwright/mcp@latest`
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-7`: quién no tiene tareas integradas ni CI en verde

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | La tesis: Gherkin, POM y rúbricas nacieron para coordinar humanos con texto; hoy coordinan agentes | Ubican qué artefactos de texto ya tienen (PRD, Gherkin de E4) | Slides 1–5 |
| 10–20 | Pirámide de pruebas y cono de helado | Ubican sus pruebas actuales en la pirámide | Slides 6–8 |
| 20–35 | TDD, BDD y Gherkin. Demo 1 (ver Demo) | Siguen en su pantalla | Slides 9–12, `tests/features/` |
| 35–45 | POM, Screenplay y request builders. Demo 2 | Siguen en su pantalla | Slides 13–16, `tests/paginas/`, `tests/fixtures/` |
| 45–55 | Persona + Juez, golden datasets y por qué los fallos críticos van en código | Leen la rúbrica de EntreVista AI y la comparan con su segmento 11 | Slides 17–20, `evals/rubrica.md` |
| 55–60 | Pausa | | |
| 60–70 | Demo 3: evaluación y gate en CI | Observan | `evals/`, `calidad.yml` |
| 70–110 | Circula: primero a quien no logra instalar Playwright, luego a quien su app no tiene modo determinista | Pasos 1 a 6 de la tarea | README "Tu tarea" |
| 110–120 | Entregable, rúbrica y conexión con E9 | Anotan dudas para el refuerzo | README "Entregable" |

## Demo
En Claude Code, que es la herramienta de referencia, sobre `estacion8/repos/entrevista-qa`.

1. **El `.feature` como prompt (minuto 25).** Borra `tests/steps/entrevista.steps.ts` en una rama. Pídele a Claude Code: *"Usa la skill qa-testing. Implementa los steps de tests/features/entrevista.feature con el Page Object existente"*. Corre `npm run test:bdd`. El punto: la especificación fue el prompt.
2. **Locators desde el DOM real (minuto 38).** Con el MCP de Playwright y la app corriendo, pide: *"Abre http://localhost:3000, inspecciona la página y dime qué locators usarías para el campo de respuesta y el botón"*. Compara con `tests/paginas/EntrevistaPage.ts`: `getByLabel` y `getByRole`, no CSS.
3. **Evaluación y gate (minuto 60).** Muestra el reporte de una evaluación con Claude (todas las personas aprueban) y después la de `sofia` contra el motor de reglas (reprueba en `repreguntas`). Abre el PR de demo con el job `evaluacion` en rojo y muestra el resumen en la pestaña del job.

Plan B si algo falla en vivo:
- Playwright no descarga Chromium: muestra los reportes HTML guardados del ensayo.
- La API de Anthropic falla o tarda: usa el reporte guardado en la preparación.

## Conceptos clave
1. **El texto estructurado es la interfaz del agente.** Un `.feature` o un Page Object le dicen al agente exactamente qué construir y cómo verificarlo.
   Pregunta: "¿Qué artefacto de tu proyecto ya sirve como especificación ejecutable?"
2. **Pirámide, no cono.** Muchas unitarias, algunas de API, pocas E2E; la evaluación con LLM, solo para lo que no se puede verificar de otra forma.
   Pregunta: "¿Qué prueba E2E tuya podría ser una de API?"
3. **Lo crítico se verifica con código.** Divulgar que es IA o no inventar salario no se deja al Juez: se garantiza en el flujo y se comprueba con una verificación mecánica.
   Pregunta: "¿Qué regla de tu PRD es tan crítica que no la dejarías en manos de un LLM?"
4. **Medir al medidor.** Un Juez sin calibrar no es evidencia. En MT-Bench, los jueces LLM fuertes coincidieron con humanos en torno al 80 %, el mismo nivel que dos humanos entre sí; por eso el umbral de calibración.
   Pregunta: "¿Qué conversación de tu golden dataset es la más difícil de calificar, y por qué?"
5. **Un gate solo bloquea si es obligatorio.** Un workflow en rojo que no es check obligatorio es un aviso, no un gate.
   Pregunta: "¿Qué pasa con tu job de evaluación cuando el PR no toca el agente?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `npx playwright install` falla en la red de su empresa | Proxy o descargas bloqueadas | Instalar desde otra red o correr las pruebas solo en CI |
| Las pruebas E2E fallan de forma intermitente | La app llama al LLM durante las pruebas | Darle a la app un modo determinista (como `AGENT_MODE=reglas`) para Playwright |
| Pruebas que pasan con cualquier respuesta | El agente escribió verificaciones débiles (`toBeTruthy`) | Pedir que cada test verifique un criterio de aceptación concreto |
| El agente inventa locators que no existen | No usó el MCP de Playwright | Reforzar la regla en la skill y pedirle que inspeccione el DOM |
| El Juez aprueba todo | Rúbrica vaga o sin exigir evidencia | Pedir evidencia por turno y bajar a 3 los puntajes sin evidencia, como en `juez.ts` |
| La calibración no llega a 80 % | Golden dataset con puntajes del propio Juez | Los puntajes esperados los pone el alumno, no el Juez |
| El job `evaluacion` queda pendiente y traba el merge | Filtró el workflow por rutas con `paths:` | Decidir dentro del job, como en `calidad.yml`, y terminar en verde si no hay nada que evaluar |
| La evaluación gasta más de lo esperado | Muchas personas o turnos | Bajar `MAX_TURNOS` y evaluar solo cuando cambia el agente |

## Preguntas frecuentes
- **¿Mi producto necesita evaluación de agente si casi no usa LLM?** Sí, para la parte que lo use. Si no hay agente, la evaluación se reemplaza por más pruebas de API y lo dices en el PR.
- **¿Por qué Claude para la Persona y el Juez?** Porque ya tienes la llave desde E3. Los modelos se cambian con variables; el Juez conviene que sea más capaz que el agente que evalúa.
- **¿Cuánto cuesta cada evaluación?** Con cuatro personas y modelos pequeños, centavos por corrida. Por eso el gate solo evalúa cuando cambia el agente.
- **¿Las slides hablan de `qa-e2e`, `qa-api` y `qa-agent-eval`?** Son los repos de la Cohorte 4. Hoy todo está en `entrevista-qa`, con la misma separación en carpetas.

## Qué se adapta y qué no
- Fijo: las cuatro capas (E2E, BDD, API y evaluación), los fallos críticos en código, la calibración del Juez, el gate en CI, el entregable y la rúbrica
- Libre: cuánto tiempo dar a TDD y Screenplay según el grupo, los ejemplos de la demo y si el Kahoot se hace

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-8` se entrega antes de la Estación 9, con la calibración y los checks obligatorios en la descripción
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-8` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, revisa en voz alta la rúbrica de dos alumnos contra su PRD: es donde más se nota si la evaluación mide lo que importa

## Notas para el siguiente mentor
En la Cohorte 4 la estación usaba tres repos con un asistente de soporte genérico y la evaluación con OpenAI, sin gate en CI. En la Cohorte 6 se unificó en `entrevista-qa`, sobre EntreVista AI y con Claude.

Pendiente: se llena al terminar la Cohorte 6.
