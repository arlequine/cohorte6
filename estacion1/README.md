# Estación 1 · Introducción y demostración

## Objetivo
Entender cómo cambia el trabajo del desarrollador con agentes, ver de punta a punta lo que vas a poder construir al final del programa y salir con tu producto elegido y el plan para tu primer artefacto: un Product Vision Board o un Internal Solution Brief.

## Antes de la clase
- La Nivelación 1 terminada: tu entorno funcionando, tu repo personal creado desde la plantilla y tu track asignado
- La Nivelación 2 terminada: tu primer agente con MCP y una skill
- Si ya tienes una idea o un problema de tu empresa en mente, tráelo anotado en dos líneas

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–20 | Charla: por qué este momento es distinto y qué significa ser un gran desarrollador hoy | La idea central: no arregles el código, arregla el sistema que lo produce |
| 20–40 | El programa: dos tracks, doce estaciones, cómo se entrega y cómo te acompañamos | Saber qué se espera de ti cada semana |
| 40–45 | Pausa | |
| 45–100 | Demo de punta a punta: una aplicación real construida con un agente y AI-DLC, de la especificación al deploy | Ver el proceso que vas a aprender estación por estación |
| 100–120 | Tu primer artefacto: los dos templates, el banco de productos y el ejemplo de EntreVista AI | Tu camino elegido y los pasos para esta semana |

## Ejemplo trabajado
**EntreVista AI** es el producto de referencia del programa: un agente que hace entrevistas de screening por Telegram para empresas de alto volumen en América Latina. Lo vas a ver evolucionar en cada estación.

Su Product Vision Board está en [`estacion2/docs/pvb.md`](../estacion2/docs/pvb.md), junto con la investigación de validación (`overview.md`, `mercado.md`, `icp.md`) y la de crítica (`critica.md`) que lo respaldan. Es el nivel de detalle que buscamos en tu entrega.

La demo de la clase usa otra aplicación, [SkillWall Live](demo/), porque está pensada para mostrar el proceso completo en una sesión. Puedes repetirla por tu cuenta siguiendo su README.

## Tu tarea
Trabaja en tu repo personal. Todo lo que produzcas va en `docs/`, en Markdown.

1. **Elige qué vas a construir.** Una idea propia, un problema interno de tu empresa o un producto del [banco de productos](banco-productos.md). Si eliges del banco, toma aquel donde te sea más fácil hablar con usuarios reales durante el programa.
2. **Elige tu template.**
   - Producto propio, startup o producto del banco: [Product Vision Board](product-vision-board.md), que guardas como `docs/pvb.md`.
   - Problema interno de tu empresa: [Internal Solution Brief](internal-solution-brief.md), que guardas como `docs/isb.md`.
3. **Lee el template completo antes de empezar.** Cada sección explica qué se espera y qué errores evitar.
4. **Haz un deep research de validación.** Si tu idea tiene fundamento, cómo otros resolvieron problemas parecidos y qué tecnologías aplican. Guárdalo en `docs/` en uno o varios archivos; el ejemplo lo divide en `overview.md`, `mercado.md` e `icp.md`.
5. **Haz un deep research de crítica.** Las debilidades, los riesgos y por qué fracasan productos parecidos. Guárdalo en `docs/critica.md`. Es el que más te va a servir: estúdialo y deja que cambie tu template.
6. **Completa tu template** con base en las dos investigaciones. Donde no tengas el dato, márcalo como pendiente con lo que te falta investigar.
7. **Si puedes, habla con un usuario real** y guarda la transcripción o tus notas en `docs/`. Es el insumo más valioso para la Estación 2.

Tu coding agent puede ayudarte a ordenar la investigación y a pasarla a Markdown. No le pidas que llene el template por ti: las decisiones de producto son tuyas.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-1`, antes de la Estación 2, que incluya:
- `docs/pvb.md` o `docs/isb.md`
- Tu investigación de validación en `docs/`
- `docs/critica.md`

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Template | PVB o ISB con todas las secciones llenas o marcadas como pendientes con lo que falta investigar | Secciones vacías sin explicación o con respuestas genéricas | No hay PVB ni ISB |
| Problema | Un dolor concreto de un usuario o área concreta, cuantificado, con un análisis de por qué sobrevive al próximo modelo | Problema general o sin análisis de durabilidad | No hay problema definido |
| Validación | Deep research de validación en Markdown, con fuentes | Investigación sin fuentes o fuera de `docs/` | No hay investigación de validación |
| Crítica | `docs/critica.md` con riesgos concretos y por qué fracasan productos parecidos, y el template refleja lo que encontró | Hay crítica, pero el template no cambió con ella | No hay crítica |
| Honestidad | Las cifras tienen fuente y lo que no se sabe está marcado como pendiente | Algunas cifras sin fuente | El template inventa datos que no están en la investigación |

## Cómo alimenta la siguiente estación
En la Estación 2 refinas tu PVB o ISB con nuevos frameworks y le das todo tu `docs/` a tu agente para co-crear el PRD. Primero va a buscar contradicciones entre tus documentos: cuanto más honesta y completa sea tu investigación, mejores decisiones vas a tomar ahí.

## Track avanzado
- Haz el deep research de validación y el de crítica con dos herramientas distintas (por ejemplo, Gemini y Perplexity) y anota qué encontró cada una que la otra no.
- Repite la demo de [SkillWall Live](demo/) en tu cuenta con tu coding agent y anota en qué puntos tuviste que intervenir.

## Recursos
Enlaces revisados el 3 de noviembre de 2026.

- [Product Vision Board](product-vision-board.md), [Internal Solution Brief](internal-solution-brief.md) y [banco de productos](banco-productos.md). La guía en PDF y las slides de esta carpeta son la versión de la Cohorte 4; los Markdown son los vigentes.
- [Patrick Debois: Coding Agents Don't Scale Themselves, Neither Do Your Teams](https://www.youtube.com/watch?v=zCJtYuqwm7E)
- [AI-DLC (awslabs/aidlc-workflows)](https://github.com/awslabs/aidlc-workflows): el flujo que usa la demo y que trabajas en las Estaciones 4 y 5
- [Gemini Deep Research](https://gemini.google/overview/deep-research/), [Perplexity](https://www.perplexity.ai) y [NotebookLM](https://notebooklm.google) para la investigación
