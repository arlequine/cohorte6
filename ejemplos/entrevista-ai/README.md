# EntreVista AI · Artefactos de diseño

EntreVista AI es el producto de referencia del programa: un agente que hace entrevistas de screening por Telegram para empresas de alto volumen en América Latina. Su PRD está en [`estacion2/specs/prd.md`](../../estacion2/specs/prd.md).

Esta carpeta guarda los artefactos que generó AI-DLC a partir de ese PRD: la fase Inception completa y la fase Construction de la primera unidad (`auth-lambda`). Los usan las Estaciones 4, 5 y 6.

## Versión de AI-DLC

Estos artefactos se generaron con **AI-DLC 1.0.1**. Desde la Cohorte 6 el programa usa AI-DLC 2 (ver [`versions.md`](../../versions.md)), que cambia los nombres de algunas etapas y la carpeta donde se guardan. El contenido sirve igual como referencia de profundidad: lo que cambia es dónde vive cada cosa.

| Artefacto en esta carpeta (v1) | Etapa en AI-DLC 2 | Dónde queda en tu repo con AI-DLC 2 |
|---|---|---|
| `inception/requirements/requirements.md` | 2.3 Requirements Analysis | `inception/requirements-analysis/requirements.md` |
| `inception/user-stories/personas.md`, `stories.md` | 2.4 User Stories | `inception/user-stories/` |
| `inception/application-design/components.md`, `services.md`, `component-*.md` | 2.6 Domain Design | `inception/domain-design/components.md` y `decisions.md` |
| `inception/application-design/unit-of-work*.md` | 2.7 Units Generation | `inception/units-generation/` |
| `inception/plans/execution-plan.md` | 2.9 Delivery Planning | `inception/delivery-planning/` |
| `construction/auth-lambda/functional-design/` | 3.1 Functional Design | `construction/<unidad>/functional-design/` |
| `construction/auth-lambda/nfr-requirements/` | 3.2 NFR Requirements | `construction/<unidad>/nfr-requirements/` |
| `construction/auth-lambda/nfr-design/` | 3.3 NFR Design | `construction/<unidad>/nfr-design/` |
| `construction/auth-lambda/infrastructure-design/` | 3.4 Infrastructure Design | `construction/<unidad>/infrastructure-design/` |

En AI-DLC 2 todas esas rutas cuelgan de la carpeta de la intención: `aidlc/spaces/default/intents/<fecha>-<nombre>/`.

Las rutas absolutas y los nombres de archivo que aparecen dentro de `audit.md` y `aidlc-state.md` son los del equipo que generó el ejemplo; no hace falta replicarlos.

**Pendiente:** regenerar estos artefactos con AI-DLC 2 durante la validación final de la cohorte.
