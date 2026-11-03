# Estación 4 · Guía del mentor

## En una frase
El alumno sale con AI-DLC configurado en su repo y las primeras etapas de Inception aprobadas por él, sabiendo leer un artefacto antes de aprobarlo. El error más común es responder "sí, continúa" en cada puerta de aprobación sin leer lo que generó el agente.

## Preparación (48 h antes)
- [ ] Instala el CLI de AI-DLC en la versión de [`versions.md`](../versions.md) y corre `aidlc --version`
- [ ] Arma tu repo de demo: copia `estacion3/repos/walking-skeleton/` a un repo nuevo, agrega `specs/prd.md` con el [PRD de EntreVista AI](../estacion2/specs/prd.md) y verifica que `npm run verify` pasa
- [ ] En ese repo corre `aidlc config --harness claude`, `aidlc doctor` y `npm run verify` (debe seguir pasando: la plantilla ya ignora los archivos de AI-DLC en lint)
- [ ] Escribe el `technical-environment.md` de la demo (ver [runbook, Setup](runbook.md#setup-ai-dlc-en-tu-repo))
- [ ] Corre Inception completa con `/aidlc classic` en una rama `ensayo-e4` y guarda el resultado: es tu plan B y el punto de partida de la demo de la Estación 5. Toma entre una y dos horas
- [ ] Compara tu Inception con [`ejemplos/entrevista-ai/`](../ejemplos/entrevista-ai/) y anota dos diferencias para comentar en clase
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-3`: sin walking skeleton y sin PRD, el alumno no tiene sobre qué correr AI-DLC
- [ ] Recuerda a quien usa Antigravity que AI-DLC 2 no lo soporta y que traiga instalada otra herramienta

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–15 | Vibe vs. spec coding, los tres frameworks de especificación y DDD + BDD + TDD | Ubican dónde se les ha roto un proyecto por falta de especificación | Runbook "Fundamento conceptual" |
| 15–30 | Fases y perfiles de AI-DLC 2; el loop de aprobación | Preguntas | Runbook "Las fases de AI-DLC" |
| 30–45 | Demo (ver Demo, pasos 1 a 3) | Siguen en su pantalla | Repo de demo |
| 45–55 | Cómo validar requerimientos e historias: NFRs con número y `ENTONCES` verificable | Revisan un escenario Gherkin del ejemplo | Runbook 2.3 y 2.4 |
| 55–60 | Pausa | | |
| 60–100 | Circula: primero a quien no logra instalar o configurar, luego a quien el agente propone otro stack | Configuran AI-DLC y avanzan Inception | README "Tu tarea" |
| 100–115 | Arquitectura Just-in-Time: muestra el C4 y un ADR de tu ensayo | Escriben el primer borrador de `specs/arquitectura.md` | Runbook "Arquitectura Just-in-Time" |
| 115–120 | Entregable, rúbrica y conexión con E5 | Anotan dudas para el refuerzo | README "Entregable" |

## Demo
En Claude Code, que es la herramienta de referencia, sobre tu repo de demo en `main` (sin la rama del ensayo).

1. **Configurar (minuto 30).** `aidlc config --harness claude` y `aidlc doctor`. Muestra qué agregó (`git status`): `.claude/` y `aidlc/`. Corre `npm run verify` para que vean que su CI no se rompe.
2. **Contexto técnico (minuto 34).** Crea `technical-environment.md` en vivo. Explica que sin él el agente puede proponer Python o Lambda, como pasó en el ejemplo de EntreVista AI que se diseñó antes del walking skeleton.
3. **Arrancar (minuto 37).** Reinicia Claude Code y escribe `/aidlc classic Lee specs/prd.md y diseña el producto que describe, sobre el walking skeleton que ya está en este repo.` Confirma el plan en voz alta, deja correr Reverse Engineering y abre lo que escribió en `aidlc/spaces/default/codekb/`: ¿encontró el endpoint del agente y los tests? Aprueba solo después de revisarlo.

Plan B si algo falla en vivo:
- El instalador o `aidlc config` fallan: cambia a la rama `ensayo-e4` y recorre los artefactos ya generados.
- El agente tarda demasiado en Reverse Engineering: muestra el resultado del ensayo y sigue con el concepto.
- No hay red: los artefactos de [`ejemplos/entrevista-ai/`](../ejemplos/entrevista-ai/) sirven para explicar cada etapa.

## Conceptos clave
1. **Corregir en la especificación es más barato que en el código.**
   Pregunta: "¿Qué decisión de tu PRD, si fuera incorrecta, costaría más cambiar después de escribir el código?"
2. **El humano aprueba cada etapa.** La puerta de aprobación es el momento donde se mantiene el control; aprobar sin leer convierte AI-DLC en vibe coding con más pasos.
   Pregunta: "¿Qué cambiaste en el último artefacto antes de aprobarlo?"
3. **Un NFR sin número no es un NFR.** "Rápido" no se puede verificar; "P95 < 2 s" sí.
   Pregunta: "¿Cómo sabrías en producción que tu NFR se cumple?"
4. **Unidades por dominio, no por capa.** Cada unidad debe poder construirse y probarse sola.
   Pregunta: "¿Puedes describir tu unidad en una oración sin usar 'y'?"
5. **El contexto técnico se escribe, no se supone.** `technical-environment.md` evita que el agente invente el stack.
   Pregunta: "¿Qué propuso el agente que no estaba en tu stack, y qué hiciste?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `aidlc: command not found` | La terminal se abrió antes de instalar o el directorio no está en el PATH | Abrir una terminal nueva o seguir la instrucción de PATH que imprimió el instalador |
| `/aidlc` no aparece en Claude Code | La herramienta estaba abierta cuando se corrió `aidlc config` | Cerrarla y abrirla de nuevo en la raíz del repo; `aidlc doctor` lo confirma |
| `npm run lint` falla con errores en `.claude/hooks` | El repo es anterior al cambio de la plantilla que ignora los archivos de AI-DLC | Copiar los `ignores` de `plantilla-alumno/eslint.config.mjs` |
| El diseño propone Python, Lambda u otro stack | Falta `technical-environment.md` o no dice qué no usar | Escribirlo y pedir rehacer Domain Design |
| Reverse Engineering no encuentra el código | Abrieron la herramienta en una subcarpeta | Abrirla en la raíz del repo |
| El alumno aprueba todo de corrido | Prisa | Pedirle que cuente en el PR una corrección que hizo; la rúbrica lo exige |
| Unidades por capa técnica (frontend, backend, base de datos) | Costumbre | Mostrar el ejemplo de unidades por dominio del runbook y pedir rehacer Units Generation |
| Usa Antigravity | AI-DLC 2 no lo soporta | Hacer E4 a E7 con Claude Code u otra herramienta soportada |

## Preguntas frecuentes
- **¿Tengo que terminar Inception en clase?** No. En clase configuras y avanzas las primeras etapas; el resto es la tarea.
- **¿Por qué `classic` y no `feature` o `mvp`?** Porque reproduce las etapas que trabajan E4 y E5 con una aprobación por etapa. Los otros perfiles agregan Ideation y Operation, que en el programa se cubren en otras estaciones.
- **¿Los archivos de AI-DLC van al repo?** Sí: el estado, la auditoría y los artefactos son parte de la especificación. Lo que AI-DLC marca como local ya queda en `.gitignore`.
- **¿El ejemplo de EntreVista AI es igual a lo que me va a salir?** No. Se generó con AI-DLC 1 y para otro stack. Úsalo para ver la profundidad, no los nombres de archivo.
- **¿Cuánto cuesta?** Inception completa con un modelo capaz consume bastantes tokens. Con un plan de suscripción de la herramienta suele alcanzar; con API, revisa tu límite de gasto antes de empezar.

## Qué se adapta y qué no
- Fijo: AI-DLC con el perfil `classic`, la aprobación humana en cada etapa, `technical-environment.md`, el entregable y la rúbrica
- Libre: cuánto tiempo dar a los fundamentos según el grupo, qué etapas se muestran en vivo y los ejemplos de ADR

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-4` se entrega antes de la Estación 5 y que sin Inception completa no hay Construction
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-4` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, prioriza a quien no tiene AI-DLC funcionando y revisa en voz alta las unidades de dos alumnos

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
