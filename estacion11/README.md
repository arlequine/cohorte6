# Estación 11 · Observabilidad

## Objetivo
Ver qué hace tu agente en producción y cuánto cuesta: trazas de cada turno con atributos `gen_ai.*`, métricas de latencia, tokens y costo por conversación, logs correlacionados con su traza, un dashboard versionado como código y una prueba de carga reproducible con k6.

## Antes de la clase
- Tu producto desplegado con el pipeline de la Estación 9 y los hallazgos de la Estación 10 cerrados
- Docker funcionando: `docker ps` y `docker compose version` responden
- [k6 instalado](https://grafana.com/docs/k6/latest/set-up/install-k6/): `k6 version` responde (2.x)
- Las métricas de éxito y el segmento de red teaming de tu PRD (Estación 2) a la mano: de ahí salen los umbrales de la prueba de carga
- Opcional, 10 minutos: la página de [señales de OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/)

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | De "funciona" a "sigue funcionando": por qué un HTTP 200 no dice nada de un agente | La pregunta de la sesión |
| 10–25 | OpenTelemetry: traces, métricas, logs, el Collector y la correlación por `trace_id` | Saber qué pregunta responde cada señal |
| 25–40 | Lo propio de un agente: los spans `invoke_agent` y `chat`, las convenciones `gen_ai.*` y por qué el costo lo calculas tú | El modelo de datos de la telemetría |
| 40–55 | Demo: el stack en un comando, la app con el motor simulado y una traza de punta a punta | Ver un turno del agente en Tempo, sus métricas y sus logs |
| 55–60 | Pausa | |
| 60–70 | Demo: k6 contra la app y el dashboard moviéndose; el costo por entrevista y la proyección mensual | Un número de costo para el pitch |
| 70–110 | Trabajo práctico en tu repo | Tu agente instrumentado y una traza en tu Grafana local |
| 110–120 | Entregable, rúbrica y preparación del Demo Day | Claridad sobre lo que sigue |

## Ejemplo trabajado
La solución de referencia es [`repos/entrevista-obs/`](repos/entrevista-obs): la EntreVista AI de la Estación 8 con OpenTelemetry. Es el mismo stack de tu repo, así que sus archivos se copian casi tal cual:

- [`instrumentation.ts`](repos/entrevista-obs/instrumentation.ts) y [`lib/otel-node.ts`](repos/entrevista-obs/lib/otel-node.ts): el SDK arranca solo si hay `OTEL_EXPORTER_OTLP_ENDPOINT`, y se configura con variables `OTEL_*` estándar.
- [`lib/telemetria.ts`](repos/entrevista-obs/lib/telemetria.ts): los spans `invoke_agent entrevistador` y `chat {modelo}`, las métricas y **todos** los nombres en un solo archivo.
- [`lib/precios.ts`](repos/entrevista-obs/lib/precios.ts): la tabla de precios por modelo y el costo de cada llamada.
- [`grafana-dashboards/entrevista-agente.json`](repos/entrevista-obs/grafana-dashboards/entrevista-agente.json): latencia, tokens, costo por hora, costo por entrevista, errores y los turnos más lentos.
- [`carga/entrevista.js`](repos/entrevista-obs/carga/entrevista.js): cada iteración de k6 es una entrevista completa, con los umbrales del caso RT9 del [PRD](../estacion2/specs/prd.md) (100 candidatos simultáneos, ninguna respuesta de más de 60 s, ninguna respuesta cruzada entre conversaciones).

El stack de observabilidad (Collector, Tempo, Prometheus, Loki y Grafana) está en [`repos/otel-stack/`](repos/otel-stack) y monta los dashboards de `entrevista-obs` por defecto.

En la referencia las conversaciones viven en memoria; en tu repo ya están en DynamoDB desde la Estación 9. Guarda el `uso` (tokens y costo acumulados) en el mismo registro de la conversación.

`repos/requirement-hr-ia/` es la app completa de la Cohorte 4 (OpenAI, Telegram, atributos `llm.*`). Se conserva para el track avanzado. El material de apoyo [`clase-11.pdf`](clase-11.pdf) y [`clase-11-estudiante.md`](clase-11-estudiante.md) también es de la Cohorte 4; este README es el vigente.

### Las convenciones `gen_ai.*` no son estables
Las convenciones semánticas de GenAI de OpenTelemetry están en estado **Development**: los nombres pueden cambiar entre versiones sin período de deprecación. En junio de 2026 pasaron a su propio repositorio, [`open-telemetry/semantic-conventions-genai`](https://github.com/open-telemetry/semantic-conventions-genai). Tres consecuencias para tu código:
1. Pon todos los nombres en un solo archivo, como `lib/telemetria.ts`. Si cambian, cambias un archivo.
2. Lo que no está en las convenciones (costo, estado de la entrevista, motor) va con un prefijo propio, como `entrevista.`. Nunca inventes un `gen_ai.*`.
3. Ninguna convención define el costo. Lo calculas tú con los tokens que reporta la API y la tabla de precios del proveedor, y anotas la fecha en que revisaste los precios.

## Tu tarea
Trabaja en tu repo personal, en una rama `estacion-11`. Pídele los cambios a tu agente por partes y usa la solución de referencia como modelo.

1. **Instala la skill.** Copia [`observabilidad`](repos/entrevista-obs/.agents/skills/observabilidad/SKILL.md) a `.agents/skills/`, ajústala a tu producto y corre `npm run sync-skills`.
2. **Levanta el stack.** Copia `estacion11/repos/otel-stack` junto a tu repo o úsalo desde el repo del programa con `DASHBOARDS_DIR=<tu repo>/grafana-dashboards docker compose up -d`. Corre `scripts/test-telemetry.sh` y comprueba que llegan las tres señales.
3. **Arranca el SDK.** Agrega `instrumentation.ts` y el módulo que arranca el SDK, con las dependencias de OpenTelemetry de [`versions.md`](../versions.md). Sin `OTEL_EXPORTER_OTLP_ENDPOINT` tu app debe funcionar igual que antes: comprueba que `npm run verify` y el build siguen en verde.
4. **Instrumenta el agente.** Un span `invoke_agent` por turno y un span `chat` (CLIENT) por cada llamada al modelo, con al menos `gen_ai.operation.name`, `gen_ai.provider.name`, `gen_ai.request.model`, `gen_ai.response.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens` y `error.type` cuando falla. Si tu agente usa herramientas, agrega un span `execute_tool` por herramienta.
5. **Métricas.** `gen_ai.client.operation.duration`, `gen_ai.client.token.usage` (separada por `gen_ai.token.type`) y el costo: un contador del gasto y un histograma del costo por conversación, que se registra cuando la conversación termina.
6. **Logs correlacionados.** Que tu `log()` escriba `trace_id` y `span_id` y mande cada evento a la API de logs de OpenTelemetry. Comprueba en Grafana que desde un log de Loki saltas a su traza en Tempo.
7. **Tests de la telemetría.** Con exportadores en memoria, como en [`tests/telemetria.test.ts`](repos/entrevista-obs/tests/telemetria.test.ts): que el span `chat` cuelgue del `invoke_agent`, que tenga los atributos de tokens y que el costo se calcule bien.
8. **Dashboard como código.** Al menos un JSON en `grafana-dashboards/` con latencia, tokens, costo por conversación y errores. Cada panel con su `description`.
9. **Prueba de carga.** Un script de k6 en `carga/` que recorra una conversación completa, con umbrales que salgan de tu PRD y los objetivos de tu equipo. Si tu agente llama a un LLM, dale un modo sin costo para la carga (como `AGENT_MODE=simulado`) que pase por la misma instrumentación.
10. **Calcula tu número.** Corre la prueba de carga y anota en `docs/observabilidad.md` el costo por conversación (P50 y P95), la latencia P95 de un turno y la proyección de costo mensual para el volumen de tu PRD. Ese número va en tu speech del Demo Day.

### Equivalencias por herramienta

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Skill `observabilidad` | `.claude/skills/` (copia con `npm run sync-skills`) | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` |
| Instrucciones del proyecto | `CLAUDE.md` → `@AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` | `AGENTS.md` |

Esta estación no usa MCP. El stack corre en Docker y k6 en tu terminal o en GitHub Actions, igual con cualquier herramienta.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-11`, antes de la Estación 12, que incluya:
- La skill `observabilidad` adaptada a tu producto
- `instrumentation.ts`, los spans `invoke_agent` y `chat` con atributos `gen_ai.*`, las métricas de latencia, tokens y costo, y los logs con `trace_id`
- Los tests de la telemetría, en verde en CI
- Al menos un dashboard en `grafana-dashboards/`
- El script de k6 en `carga/` con sus umbrales
- `docs/observabilidad.md` con el costo por conversación, la latencia P95 y la proyección mensual
- En la descripción del PR: una captura del dashboard durante la prueba de carga, una captura de una traza de un turno en Tempo y el resumen de k6

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Instrumentación | SDK que arranca solo con `OTEL_EXPORTER_OTLP_ENDPOINT`; spans `invoke_agent` y `chat` anidados con los atributos `gen_ai.*` de la tarea y `error.type` en los fallos | Spans del modelo sin el `invoke_agent`, con atributos incompletos o con nombres `gen_ai.*` inventados | No hay spans del agente |
| Métricas y costo | Latencia y tokens con los nombres de las convenciones, contador de gasto e histograma de costo por conversación calculados con una tabla de precios fechada | Latencia y tokens sin costo, o costo sin fuente de precios | No hay métricas del agente |
| Logs | Logs con `trace_id` y `span_id` que llegan a Loki y saltan a su traza | Logs estructurados sin correlación con la traza | Logs sueltos con `console.log` |
| Tests de telemetría | Tests con exportadores en memoria que verifican la jerarquía de spans, los atributos de tokens y el cálculo de costo | Tests solo del cálculo de costo | No hay tests de la telemetría |
| Dashboard | JSON versionado con latencia, tokens, costo por conversación y errores, con descripción en cada panel | Dashboard sin costo o creado a mano sin JSON en el repo | No hay dashboard |
| Prueba de carga | Script de k6 que recorre una conversación completa, con umbrales del PRD y un modo sin costo; resumen en el PR | Script que solo golpea un endpoint, o sin umbrales | No hay prueba de carga |
| Costo para el pitch | `docs/observabilidad.md` con costo por conversación P50 y P95, latencia P95 y proyección mensual con el volumen del PRD | Solo el costo de una conversación o sin proyección | No hay cifras |

## Cómo alimenta la siguiente estación
En el Demo Day cuentas qué hace tu producto y cuánto cuesta operarlo. El costo por conversación y la proyección mensual de `docs/observabilidad.md` son la cifra de la parte 4 de tu speech ("Cómo lo construiste"), y el dashboard es tu plan B si la demo en vivo falla. Prepara el speech con la [guía de la Estación 12](../estacion12/README.md).

## Track avanzado
- Manda la telemetría de tu producto desplegado a un backend OTLP administrado (por ejemplo, el plan gratuito de Grafana Cloud) con `OTEL_EXPORTER_OTLP_ENDPOINT` y `OTEL_EXPORTER_OTLP_HEADERS` en las variables de tu despliegue, administradas por tu Terraform de la Estación 9.
- Agrega una alerta en Grafana cuando el costo por hora o la tasa de error del modelo pasen un umbral, y pruébala con `SIMULADO_TASA_ERROR`.
- Manda las métricas de k6 al mismo Collector (`k6 run -o opentelemetry`) y ponlas en el dashboard junto a las de la app.
- Compara la instrumentación de `repos/requirement-hr-ia` (atributos `llm.*`, OpenAI) con la de `entrevista-obs` y migra uno de sus spans a `gen_ai.*`.
- Corre el perfil `rt9` contra tu producto con el motor real durante un minuto y compara el costo con tu proyección.

## Recursos
Enlaces revisados el 9 de noviembre de 2026. Versiones fijadas en [`versions.md`](../versions.md).

- [Señales de OpenTelemetry](https://opentelemetry.io/docs/concepts/signals/) y [el Collector](https://opentelemetry.io/docs/collector/)
- [Convenciones semánticas de GenAI](https://github.com/open-telemetry/semantic-conventions-genai) (estado Development)
- [Anuncio del SDK de JavaScript 3.0](https://opentelemetry.io/blog/2026/otel-js-sdk-3-0/): Node.js 22.15 o más y la API de logs dentro de `@opentelemetry/api`
- [OpenTelemetry en Next.js](https://nextjs.org/docs/app/guides/open-telemetry)
- [k6](https://grafana.com/docs/k6/latest/), [umbrales](https://grafana.com/docs/k6/latest/using-k6/thresholds/) y [salida a OpenTelemetry](https://grafana.com/docs/k6/latest/results-output/real-time/opentelemetry/)
- [Precios de la API de Claude](https://platform.claude.com/docs/en/about-claude/pricing)
- [Grafana Tempo y TraceQL](https://grafana.com/docs/tempo/latest/)
