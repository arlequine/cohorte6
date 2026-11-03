# Estación 5 · Guía del mentor

## En una frase
El alumno sale con la primera unidad de su producto diseñada y en camino a CI, sabiendo que cada línea de código y cada test tienen que trazarse a una regla o a un escenario aprobado. El error más común es saltar al código antes de aprobar el diseño funcional, o aceptar tests que verifican la implementación y no el comportamiento.

## Preparación (48 h antes)
- [ ] Usa tu repo de demo de la Estación 4 con la rama `ensayo-e4` (Inception completa). Si no la tienes, sigue la preparación de [`estacion4/MENTOR.md`](../estacion4/MENTOR.md)
- [ ] Desde `ensayo-e4`, corre Construction de la primera unidad completa en una rama `ensayo-e5`: diseño funcional, NFRs, NFR Design, infraestructura y código con tests, hasta CI en verde. Es tu plan B y lo que muestras en el bloque de código
- [ ] Ten abierto el ejemplo de [`ejemplos/entrevista-ai/aidlc-docs-v1/construction/auth-lambda/`](../ejemplos/entrevista-ai/aidlc-docs-v1/construction/auth-lambda/) para comparar profundidad
- [ ] Prepara dos ADRs en formato MADR de tu ensayo con la [plantilla](../estacion4/docs/adr-template.md)
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-4`: quién llega sin Inception completa. Esos alumnos dedican la práctica a terminarla

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | De Inception a Construction y el viaje de una unidad | Ubican su primera unidad | Runbook "Fundamento conceptual" |
| 10–30 | DDD táctico con el ejemplo de EntreVista AI: entidades, reglas y flujos | Leen `business-rules.md` del ejemplo y encuentran una regla mal escrita | Runbook 3.1 |
| 30–45 | NFRs con número; cuándo un NFR merece un ADR; formato MADR | Escriben un NFR de su unidad con número | Runbook 3.2 y 3.3, `adr-template.md` |
| 45–55 | Demo (ver Demo, pasos 1 y 2) | Siguen en su pantalla | Repo de demo |
| 55–60 | Pausa | | |
| 60–100 | Circula: primero a quien no logra retomar el flujo, luego a quien el diseño se aparta del stack | Diseño funcional, NFRs y NFR Design de su unidad | README "Tu tarea" |
| 100–115 | Demo del paso 3 y pruebas: AAA vs. GWT, trazabilidad a Gherkin | Planean sus tests | Runbook 3.5 y "Pruebas" |
| 115–120 | Entregable, rúbrica y conexión con E6 | Anotan dudas para el refuerzo | README "Entregable" |

## Demo
En Claude Code, que es la herramienta de referencia, sobre tu repo de demo en la rama `ensayo-e4`.

1. **Retomar (minuto 45).** `/aidlc --status` y luego `/aidlc`. Muestra que el flujo sabe dónde quedó y que la siguiente etapa es el diseño funcional de la primera unidad.
2. **Diseño funcional (minuto 48).** Deja que genere `entities.md`, `rules.md` y `functional-spec.md`. Antes de aprobar, lee en voz alta un flujo y pregunta al grupo si lo entendería alguien de negocio. Pide un cambio y apruébalo después.
3. **Código y tests (minuto 100).** Cambia a `ensayo-e5` y muestra el plan de código aprobado, un test GWT que cita su escenario Gherkin y el CI en verde. Explica que 3.6 Build and Test corre al final de todas las unidades y que para el entregable basta con el CI del repo.

Plan B si algo falla en vivo:
- AI-DLC no retoma o tarda demasiado: muestra los artefactos de `ensayo-e5`.
- No hay red: usa el ejemplo de EntreVista AI para cada etapa.

## Conceptos clave
1. **El diseño funcional se lee sin saber programar.** Si un flujo menciona clases o tablas, no está listo.
   Pregunta: "¿Podría tu usuario de negocio validar este `functional-spec.md`?"
2. **Toda decisión tiene un costo.** Un ADR sin consecuencias negativas está incompleto.
   Pregunta: "¿Qué empeora con la opción que elegiste?"
3. **Test de comportamiento, no de implementación.** Un test que falla al renombrar una variable interna prueba la implementación.
   Pregunta: "¿Qué escenario Gherkin verifica este test?"
4. **La primera unidad es el esqueleto real.** Debe extender el walking skeleton, no construirse al lado.
   Pregunta: "¿Qué parte de tu URL de Vercel cambia con esta unidad?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `/aidlc --status` dice que Inception no está completa | Quedaron etapas sin aprobar en E4 | Terminar Inception antes de seguir; es la prioridad del refuerzo |
| El diseño de infraestructura propone Lambda, VPC o MongoDB | Copió el ejemplo de EntreVista AI o falta `technical-environment.md` | Diseñar para Vercel y anotar la alternativa AWS en un ADR "Propuesto" |
| Los tests llaman a la API de Anthropic | El agente no usó dobles | Recordar la convención de E3: inyectar un doble del cliente |
| Los ADRs quedan solo dentro de `aidlc/` | No los pasó a MADR | Copiar los significativos a `specs/adr/` con la plantilla |
| CI falla por lint en archivos de AI-DLC | Repo anterior al cambio de la plantilla | Copiar los `ignores` de `plantilla-alumno/eslint.config.mjs` |
| `npm run sync-skills` reporta skills `aidlc-*` | Versión vieja del script | Copiar `scripts/sync-skills.sh` de la plantilla, que omite las skills de AI-DLC |
| El agente genera todo el código de una vez | Aprobó el plan sin pedir bloques | Pedir que genere y verifique por bloques, como en el runbook |

## Preguntas frecuentes
- **¿Tengo que construir todas las unidades?** No. El entregable es la primera unidad completa; las demás se planean en E6 y se ejecutan en E7.
- **¿Por qué MADR si AI-DLC ya escribe ADRs?** Porque `specs/adr/` es el registro de decisiones del repo, independiente de la herramienta, y MADR es un formato que cualquier equipo reconoce.
- **¿Y si mi unidad necesita base de datos?** Decídelo en un ADR. Si cabe en lo que ya tienes, úsalo; la infraestructura en AWS con Terraform llega en la Estación 9.
- **¿Por qué el ejemplo está en Python?** EntreVista AI se diseñó antes del walking skeleton. Úsalo para ver la profundidad de los artefactos, no el stack.

## Qué se adapta y qué no
- Fijo: el orden de las etapas, la aprobación humana, los ADRs en MADR, la trazabilidad de tests a Gherkin, el entregable y la rúbrica
- Libre: qué parte del ejemplo se analiza en clase, cuánto tiempo dar a DDD táctico según el grupo y si se muestra la generación de código en vivo o desde el ensayo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-5` se entrega antes de la Estación 6, con la URL de Vercel y la tabla de trazabilidad en la descripción
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-5` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, revisa en voz alta la tabla de trazabilidad de dos alumnos: es la forma más rápida de ver si los tests verifican comportamiento

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
