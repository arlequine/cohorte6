# Estación 4 · Diseñando el QUÉ con AI-DLC

## Objetivo
Convertir tu PRD en una especificación técnica con AI-DLC: requerimientos, historias con escenarios Gherkin, diseño de dominio y unidades de trabajo, más la arquitectura Just-in-Time (C4, NFRs y ADR), aprobando cada etapa tú y no el agente.

## Antes de la clase
- Tu PRD de la Estación 2 en `specs/prd.md`
- Tu walking skeleton de la Estación 3 desplegado, con CI en verde
- El CLI de AI-DLC instalado y `aidlc --version` funcionando (ver [runbook, Setup](runbook.md#setup-ai-dlc-en-tu-repo))
- Tu coding agent con un modelo capaz de razonamiento (ver [`versions.md`](../versions.md)). AI-DLC 2 funciona con Claude Code, Cursor, Codex y GitHub Copilot; **no con Antigravity**: si usas Antigravity, haz las Estaciones 4 a 7 con otra de las cuatro

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–15 | Vibe coding vs. spec coding; DDD + BDD + TDD | Saber por qué se especifica antes de generar código |
| 15–30 | AI-DLC 2: fases, perfiles y el loop de aprobación | Saber qué hace el agente y qué decides tú |
| 30–45 | Demo: `aidlc config`, `technical-environment.md` y arranque con el perfil `classic` | Ver el flujo funcionando sobre un repo con walking skeleton |
| 45–55 | Requerimientos e historias: NFRs con número y escenarios Gherkin verificables | Criterios para aprobar o rechazar lo que genera el agente |
| 55–60 | Pausa | |
| 60–100 | Trabajo práctico: configuras AI-DLC en tu repo y avanzas Inception | Reverse Engineering, Practices Discovery y Requirements aprobados |
| 100–115 | Arquitectura Just-in-Time: C4, NFRs y ADR | El filtro de los tres pasos: dibuja, cuestiona, registra |
| 115–120 | Entregable, rúbrica y conexión con la Estación 5 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La fase Inception completa de EntreVista AI está en [`ejemplos/entrevista-ai/`](../ejemplos/entrevista-ai/), generada a partir de su [PRD](../estacion2/specs/prd.md). Muestra la profundidad esperada en requerimientos, historias con Gherkin, componentes y unidades. Se generó con AI-DLC 1.0.1, así que algunos nombres de archivo cambian; el README de esa carpeta trae la equivalencia.

## Tu tarea
Trabaja en tu repo personal, en una rama `estacion-4`. El [runbook](runbook.md) explica cada etapa y cómo validarla.

1. **Configura AI-DLC** para tu herramienta: `aidlc config --harness claude` (o `codex`, `cursor`, `copilot`) y `aidlc doctor`.
2. **Describe tu stack** en `aidlc/spaces/default/knowledge/aidlc-shared/technical-environment.md`: el del walking skeleton y lo que no se debe usar. Sin esto, el agente propone otro stack.
3. **Arranca el flujo:** `/aidlc classic Lee specs/prd.md y diseña el producto que describe, sobre el walking skeleton que ya está en este repo.` (en Codex, `$aidlc`). Confirma el plan.
4. **Recorre Inception** respondiendo las preguntas y aprobando cada etapa solo después de leer su artefacto: Reverse Engineering, Practices Discovery, Requirements Analysis, User Stories, Domain Design, Units Generation, Contract Design (si aplica) y Delivery Planning.
5. **Escribe tu arquitectura Just-in-Time** en `specs/arquitectura.md`: C4 nivel 1 y 2 en Mermaid y tus NFRs traducidos a tácticas con su forma de verificarlas. Usa los prompts de [`docs/prompts-ajit-arquitectura.md`](docs/prompts-ajit-arquitectura.md).
6. **Documenta al menos un ADR** de una decisión difícil de revertir. Puede quedar en `decisions.md` de AI-DLC o en `specs/adr/` con la [plantilla](docs/adr-template.md).
7. **Corre `npm run verify`** antes de hacer commit. AI-DLC agrega archivos en `aidlc/` y en la carpeta de tu herramienta; súbelos al repo con el resto.

### Equivalencias por herramienta

| | Claude Code (referencia) | Cursor | Codex | GitHub Copilot |
|---|---|---|---|---|
| Configurar | `aidlc config --harness claude` | `aidlc config --harness cursor` | `aidlc config --harness codex` | `aidlc config --harness copilot` |
| Iniciar o retomar | `/aidlc` | `/aidlc` | `$aidlc` | `/aidlc` (Copilot CLI o VS Code) |
| Dónde instala el flujo | `.claude/` | `.cursor/` | `.codex/` y `.agents/skills/aidlc*` | `.github/` |

Antigravity no tiene integración con AI-DLC 2. Las skills `aidlc*` las administra AI-DLC: `npm run sync-skills` no las copia entre herramientas.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-4`, antes de la Estación 5, que incluya:
- La carpeta `aidlc/` con la fase Inception aprobada
- `specs/arquitectura.md` con el C4 y los NFRs
- Al menos un ADR
- En la descripción del PR: qué unidad vas a construir primero y una corrección que le hiciste al agente en alguna etapa

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Requerimientos | `requirements.md` con requerimientos funcionales, NFRs con valores numéricos y criterios de éxito del MVP | NFRs sin números o sin criterios de éxito | No hay requerimientos |
| Historias | Historias con escenarios Gherkin de camino feliz y alternativo, con un `ENTONCES` verificable | Historias sin escenarios alternativos o con `ENTONCES` vagos | No hay historias |
| Unidades | Al menos tres unidades por dominio de negocio, con dependencias y la primera unidad elegida | Unidades por capa técnica o sin dependencias | No hay unidades |
| Arquitectura | `specs/arquitectura.md` con C4 nivel 1 y 2 en Mermaid y NFRs traducidos a tácticas verificables | Solo el C4 o solo los NFRs | No hay arquitectura |
| Decisiones | Al menos un ADR de una decisión difícil de revertir, con alternativas y consecuencias | ADR sin alternativas o sin consecuencias | No hay ADR |
| Control humano | Inception completa en `aidlc-state.md`, coherente con el stack del walking skeleton, y el PR cuenta una corrección al agente | Inception incompleta o el diseño ignora el walking skeleton | No se usó AI-DLC |

## Cómo alimenta la siguiente estación
En la Estación 5 retomas el mismo flujo en Construction: la primera unidad de tu plan pasa por diseño funcional, NFRs, ADRs, infraestructura y código con tests, hasta quedar en CI. Los escenarios Gherkin de hoy se convierten en sus tests.

## Track avanzado
- Corre la etapa de Domain Design dos veces con modelos distintos (`/aidlc` permite rehacer una etapa) y compara las decisiones de `decisions.md`.
- Lee la etapa 2.2 Practices Discovery de tu repo y agrega a tu `AGENTS.md` una regla que haya detectado y que no tenías escrita.
- Prueba el perfil `express` en una rama aparte con la misma entrada y anota qué se pierde respecto a `classic`.

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Versión de AI-DLC fijada en [`versions.md`](../versions.md).

- [Runbook de la estación](runbook.md)
- [AI-DLC (awslabs/aidlc-workflows)](https://github.com/awslabs/aidlc-workflows): instalación, guías por herramienta y [perfiles de flujo](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/workflow-profiles.md)
- [Cómo escribir el documento de entorno técnico](https://github.com/awslabs/aidlc-workflows/blob/main/docs/guide/writing-inputs/technical-environment-guide.md)
- [C4 Model](https://c4model.com), [ADR](https://adr.github.io) y [referencia de Gherkin](https://cucumber.io/docs/gherkin/reference/)
- Las slides en PDF de esta carpeta son de la Cohorte 4 (AI-DLC 1); el runbook y este README son los vigentes
