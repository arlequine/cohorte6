# Estación 2 · De la idea a la definición

## Objetivo
Pasar de tu Product Vision Board (o Internal Solution Brief) a un **PRD v1** co-creado con tu agente, con métricas de éxito y un plan para evaluar al agente, después de resolver las contradicciones de tu propia investigación.

## Antes de la clase
- Tu entrega de la Estación 1 en tu repo personal: el PVB o ISB en `docs/` y tu investigación de validación y de crítica en Markdown
- Tu coding agent funcionando dentro de tu repo, o una cuenta de Claude. Las demos son en Claude Code
- Si puedes, al menos una conversación con un usuario o cliente real, transcrita en `docs/`

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | ¿Es un prompt o es un proceso? Tres casos: Chegg, Jasper y Duolingo | Una primera prueba de durabilidad para tu idea |
| 10–25 | Founder y FDE; Job to be Done; test de durabilidad | Saber desde qué perfil construyes |
| 25–45 | Cinco preguntas de oportunidad, tres trampas y tres moats | Tu moat elegido, uno solo |
| 45–55 | Refina tu PVB con lo de hoy | PVB ajustado en `docs/pvb.md` |
| 55–60 | Pausa | |
| 60–75 | Setup: `docs/` como insumos y `specs/` como output; demo del Paso 0 con EntreVista AI | Ver el análisis de conflictos funcionando |
| 75–110 | Tu Paso 0 y tus primeros segmentos del PRD | Conflictos decididos y segmentos 1 a 3 aprobados |
| 110–120 | Entregable, rúbrica y conexión con la Estación 3 | Claridad sobre lo que sigue |

## Ejemplo trabajado
EntreVista AI, el producto de referencia del programa, con todo el camino de esta estación:

| Archivo | Qué es |
|---|---|
| [`docs/pvb.md`](docs/pvb.md) | Product Vision Board refinado |
| [`docs/overview.md`](docs/overview.md), [`docs/mercado.md`](docs/mercado.md), [`docs/icp.md`](docs/icp.md) | Deep research de validación |
| [`docs/critica.md`](docs/critica.md) | Deep research de crítica |
| [`docs/conflictos.md`](docs/conflictos.md) | Resultado del Paso 0: conflictos y decisiones |
| [`specs/prd.md`](specs/prd.md) | El PRD que salió de esos documentos |

Mira la profundidad de cada documento antes de escribir los tuyos. Observa también los TBD del PRD: donde faltaba información, se dejó explícito en lugar de inventarla.

Material de apoyo:
- [`manual-estudiante.md`](manual-estudiante.md): los frameworks de la primera hora, el refinamiento del PVB campo por campo y el paso a paso del PRD. Los PDF de esta carpeta son la versión de la Cohorte 4; el Markdown es el vigente.
- [`prompts-especificacion.md`](prompts-especificacion.md): el Prompt 1, que genera el PRD.

## Tu tarea
Trabaja en tu repo personal. Si usas tu coding agent dentro del repo, puede leer `docs/` directamente; si usas Claude en el navegador, adjunta todos los archivos.

1. **Refina tu PVB** con los frameworks de la clase (manual, Parte III). Todo campo queda lleno o con su pregunta de investigación anotada.
2. **Completa `docs/`.** Tu PVB, tu investigación de validación, tu crítica y, sobre todo, transcripciones de conversaciones con usuarios reales. Todo en Markdown.
3. **Corre el Paso 0.** Pega el Prompt 1 de [`prompts-especificacion.md`](prompts-especificacion.md). Decide cada conflicto que encuentre y guarda la tabla con tus decisiones en `docs/conflictos.md`.
4. **Construye el PRD segmento por segmento.** No avances sin aprobar el segmento actual. Si el modelo se adelanta, abre una sesión nueva con un modelo más capaz (por ejemplo, `claude-opus-5-5`) o pídele todo de una vez y refínalo después.
5. **Revisa las métricas y la evaluación del agente.** El segmento 10 tiene una North Star, KPIs con meta y métricas de calidad del agente; el segmento 11 tiene un dataset de prueba, umbrales y casos adversariales. Las Estaciones 8 y 10 parten de aquí.
6. **Guarda el PRD** en `specs/prd.md`.
7. **Solo FDE:** agrega tu Stakeholder Map en `docs/stakeholders.md`: sponsor, usuario final, veto holder y aliado técnico, con nombre y cargo.

Regla de oro: un campo en blanco honesto vale más que una respuesta inventada.

### Equivalencias por herramienta
El PRD se puede construir en cualquier herramienta. Lo único que cambia es cómo retomas la sesión al día siguiente:

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Retomar la sesión del PRD | `/rename` hoy y `/resume` mañana | Historial de chats del agente | `codex resume` | Historial de conversaciones | Historial de chats |

Si tu herramienta pierde el hilo, pídele que relea `docs/conflictos.md` y lo que lleves de `specs/prd.md` antes de seguir.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-2`, antes de la Estación 3, que incluya:
- `docs/` con tu PVB refinado y tu investigación
- `docs/conflictos.md` con los conflictos y tus decisiones
- `specs/prd.md` con los 13 segmentos
- Solo FDE: `docs/stakeholders.md`

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Conflictos | `docs/conflictos.md` lista las contradicciones de tus documentos y la decisión tomada en cada una | Lista conflictos, pero sin decisiones o con decisiones sin justificar | No hay análisis de conflictos |
| PRD | `specs/prd.md` tiene los 13 segmentos y se apoya en lo que hay en `docs/` | Faltan segmentos o hay contenido genérico que no sale de tus documentos | No hay PRD |
| Métricas | Una North Star, KPIs con meta y métricas de calidad del agente con su forma de medirlas | Métricas sin meta o sin las del agente | No hay métricas |
| Evaluación del agente | Dataset de prueba, criterios con umbral y casos adversariales | Plan sin umbrales o sin casos adversariales | No hay plan de evaluación |
| Alcance | MVP en MoSCoW con un Must acotado y los Won't Have justificados | Todo es Must o no hay Won't Have | No hay alcance |
| Honestidad | Lo que no se sabe está marcado como TBD con cómo averiguarlo | Algunas cifras o afirmaciones sin fuente | El PRD inventa datos que no están en `docs/` |

## Cómo alimenta la siguiente estación
En la Estación 3 completas el `AGENTS.md` de tu repo con base en este PRD y construyes el walking skeleton de tu producto. En la Estación 4, el flujo AI-DLC parte de `specs/prd.md` para generar requerimientos e historias de usuario.

## Track avanzado
- Corre el Paso 0 con dos modelos distintos y compara qué conflictos encontró cada uno.
- Pídele a tu agente una versión HTML del PRD con los diagramas Mermaid renderizados, para compartir con un stakeholder.
- Escribe cinco casos adversariales más para el plan de evaluación del agente, inspirados en los de EntreVista AI (segmento 11.4).

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Modelos fijados en [`versions.md`](../versions.md).

- [Manual de la estación](manual-estudiante.md)
- [Prompt 1: PRD](prompts-especificacion.md)
- [Gemini Deep Research](https://gemini.google/overview/deep-research/), [Perplexity](https://www.perplexity.ai) y [NotebookLM](https://notebooklm.google) para armar `docs/`
- [Documentación de Claude Code: sesiones](https://code.claude.com/docs)
