# Estación 5 · Diseñando el CÓMO con AI-DLC

## Objetivo
Llevar la primera unidad de tu producto por la fase Construction de AI-DLC (diseño funcional, NFRs, decisiones en formato MADR e infraestructura) hasta el código con tests que trazan a tus escenarios Gherkin, en CI y desplegado.

## Antes de la clase
- Tu entrega de la Estación 4: Inception aprobada en `aidlc/`, `specs/arquitectura.md` y la primera unidad elegida
- Tu walking skeleton con CI en verde y la URL de Vercel respondiendo
- Tu coding agent con AI-DLC configurado (`aidlc doctor` sin errores)

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | De Inception a Construction: qué cambia y el viaje de una unidad | El mapa de la sesión |
| 10–30 | Diseño funcional con DDD táctico: entidades, reglas y flujos | Criterios para aprobar `entities.md`, `rules.md` y `functional-spec.md` |
| 30–45 | NFRs con número y diseño NFR con ADRs en formato MADR | Saber cuándo una decisión merece un ADR |
| 45–55 | Demo: `/aidlc --status`, retomar en Construction y aprobar el diseño funcional de una unidad | Ver el flujo sobre un repo real |
| 55–60 | Pausa | |
| 60–100 | Trabajo práctico: diseño funcional, NFRs y NFR Design de tu primera unidad | Las tres etapas aprobadas |
| 100–115 | Code Generation y pruebas: AAA vs. GWT, trazabilidad a Gherkin | Plan de código y de tests para terminar la unidad |
| 115–120 | Entregable, rúbrica y conexión con la Estación 6 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La Construction de la Unidad 1 de EntreVista AI (Auth & Session Management) está en [`ejemplos/entrevista-ai/aidlc-docs-v1/construction/auth-lambda/`](../ejemplos/entrevista-ai/aidlc-docs-v1/construction/auth-lambda/): entidades, reglas, flujos, NFRs con números, ADRs e infraestructura. Se generó con AI-DLC 1.0.1 y se diseñó para Python en AWS Lambda; tu unidad se construye en el stack de tu repo. El [runbook](runbook.md) usa este ejemplo en cada etapa.

## Tu tarea
Trabaja en tu repo personal, en una rama `estacion-5`. El [runbook](runbook.md) explica cada etapa y cómo validarla.

1. **Retoma el flujo:** `/aidlc --status` para confirmar que Inception está completa y luego `/aidlc` (en Codex, `$aidlc`).
2. **Diseño funcional (3.1)** de tu primera unidad: aprueba `entities.md`, `rules.md` y `functional-spec.md` solo si puedes leer los flujos sin términos de implementación.
3. **NFR Requirements (3.2):** cada NFR con un valor numérico verificable.
4. **NFR Design (3.3):** patrones para cada NFR significativo. Pasa al menos dos decisiones a formato MADR en `specs/adr/` con la [plantilla](../estacion4/docs/adr-template.md), cada una con alternativas y consecuencias negativas explícitas.
5. **Infrastructure Design (3.4)** para tu entorno actual: el walking skeleton en Vercel. Anota qué cambiaría en AWS; la Estación 9 lo convierte en Terraform.
6. **Code Generation (3.5):** revisa el plan de código antes de aprobarlo. Los tests usan AAA para lógica algorítmica y GWT para reglas de negocio, y cada test de integración cita el escenario Gherkin que verifica.
7. **Cierra la unidad:** `npm run verify` en verde, CI en verde y la URL de Vercel respondiendo con la unidad nueva. Si no vas a seguir con la siguiente unidad, pausa el flujo con `/aidlc park`.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-5`, antes de la Estación 6, que incluya:
- Los artefactos de Construction de tu primera unidad en `aidlc/`
- Al menos dos ADRs en formato MADR en `specs/adr/`
- El código de la unidad con sus tests, con CI en verde
- En la descripción del PR: la URL de Vercel, la tabla de escenarios Gherkin y el test que verifica cada uno

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Diseño funcional | Entidades, reglas numeradas y flujos de la unidad aprobados, con el lenguaje del dominio | Falta uno de los tres o usa términos de implementación | No hay diseño funcional |
| NFRs | NFRs de la unidad con valores numéricos verificables | NFRs con adjetivos en lugar de números | No hay NFRs |
| MADR | Al menos dos ADRs en `specs/adr/` en formato MADR, con alternativas descartadas y consecuencias negativas | Un ADR, o ADRs sin alternativas o sin consecuencias | No hay ADRs |
| Código | La unidad implementada en el stack del repo, siguiendo el diseño aprobado y desplegada | Implementación parcial o que se aparta del diseño sin un ADR | No hay código |
| Tests | Tests de reglas y de escenarios Gherkin, con la trazabilidad en el PR, y CI en verde | Hay tests, pero sin trazabilidad a Gherkin o con CI en rojo | No hay tests |

## Cómo alimenta la siguiente estación
En la Estación 6 conviertes el resto de tus unidades en un plan de tareas con criterios de aceptación y dependencias, listo para que lo ejecuten agentes. La primera unidad que terminaste hoy es la referencia de calidad para todas las demás.

## Track avanzado
- Construye también la segunda unidad del plan y deja que AI-DLC corra 3.6 Build and Test al final.
- Escribe un test de propiedades (por ejemplo, con `fast-check`) para una regla de `rules.md` y compáralo con el test GWT de la misma regla.
- Diseña la infraestructura de tu unidad en AWS como alternativa y regístrala en un ADR con estado "Propuesto": la retomas en la Estación 9.

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Versión de AI-DLC fijada en [`versions.md`](../versions.md).

- [Runbook de la estación](runbook.md)
- [AI-DLC (awslabs/aidlc-workflows)](https://github.com/awslabs/aidlc-workflows) y su [guía de manejo de sesiones](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/11-session-management.md)
- [Domain-Driven Design Reference (Evans)](https://www.domainlanguage.com/ddd/reference/)
- [MADR](https://github.com/adr/madr) y [ejemplos de ADR](https://adr.github.io)
- [Vitest](https://vitest.dev)
- Las slides en PDF de esta carpeta son de la Cohorte 4 (AI-DLC 1); el runbook y este README son los vigentes
