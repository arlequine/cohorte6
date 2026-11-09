---
name: observabilidad
description: Convenciones de observabilidad con OpenTelemetry de este proyecto — instrumentation.ts, spans invoke_agent y chat con atributos gen_ai.*, métricas de tokens, latencia y costo, logs con trace_id y dashboards de Grafana como código. Úsala al tocar instrumentation.ts, lib/otel-node.ts, lib/telemetria.ts, lib/precios.ts, lib/logger.ts, una llamada al modelo o un JSON de grafana-dashboards/.
---

# Observabilidad

## Dónde va cada cosa

```
instrumentation.ts        → hook de Next.js: carga lib/otel-node.ts solo si hay OTEL_EXPORTER_OTLP_ENDPOINT
lib/otel-node.ts          → arranca el SDK (startNodeSdk) con variables OTEL_* estándar
lib/telemetria.ts         → ÚNICO lugar con nombres de spans, atributos y métricas
lib/precios.ts            → tabla de precios por modelo y costoUSD()
lib/logger.ts             → log() a stdout y a la API de logs de OTel, con trace_id y span_id
grafana-dashboards/*.json → dashboards como código; el otel-stack los monta en Grafana
carga/*.js                → pruebas de carga con k6
```

## Reglas

1. **Nombres solo en `lib/telemetria.ts`.** Las convenciones `gen_ai.*` están en estado Development y pueden cambiar. Si cambian, se cambian en un archivo.
2. **Toda llamada a un modelo pasa por `conSpanDeModelo()`.** Crea el span `chat {modelo}` (CLIENT), registra tokens, latencia, costo y `error.type`. No llames a `cliente.messages.create` sin envolverla.
3. **Todo turno del agente pasa por `conSpanDeAgente()`.** Crea el span `invoke_agent entrevistador` y suma tokens y costo a `conversacion.uso`.
4. **Lo propio va con prefijo `entrevista.`** (costo, motor, estado). Nunca inventes un atributo `gen_ai.*`.
5. **`gen_ai.usage.input_tokens` incluye la caché.** La API de Anthropic reporta `input_tokens` sin caché; usa `tokensDeEntrada()`.
6. **Métricas sin alta cardinalidad.** Nada de `conversacionId`, emails ni texto en los atributos de una métrica: eso va en el span.
7. **Nada sensible en la telemetría.** Ni prompts, ni respuestas, ni datos del candidato, ni llaves. Solo conteos, latencias, modelos, IDs y costo.
8. **Logs con `log()`.** Nunca `console.log`: sin el `trace_id` no se puede saltar del log a la traza.
9. **Si cambias un precio,** cambia `lib/precios.ts` y `versions.md` del repo del programa, con la fecha de revisión.

## Cómo llegan los nombres a Prometheus

El Collector cambia los puntos por guiones bajos, agrega la unidad (salvo las que van entre llaves) y `_total` a los contadores.

| En el código | En Prometheus |
|---|---|
| `gen_ai.client.operation.duration` (s) | `gen_ai_client_operation_duration_seconds_{bucket,sum,count}` |
| `gen_ai.client.token.usage` ({token}) | `gen_ai_client_token_usage_{bucket,sum,count}` |
| `gen_ai.invoke_agent.duration` (s) | `gen_ai_invoke_agent_duration_seconds_*` |
| `entrevista.llm.costo.usd` (contador) | `entrevista_llm_costo_usd_total` |
| `entrevista.conversacion.costo.usd` | `entrevista_conversacion_costo_usd_*` |
| atributo `gen_ai.token.type` | etiqueta `gen_ai_token_type` |

Antes de escribir un panel, confirma el nombre en Grafana → Explore → Prometheus → Metrics browser.

## Dashboards como código

- Un JSON por dashboard, con `uid` estable e `id: null`.
- Datasources por `uid`: `prometheus`, `tempo`, `loki`.
- Cada panel con `description`.
- Grafana recarga la carpeta cada 10 s. Si no aparece: `docker compose logs grafana | grep provisioning`.

## Verificar de punta a punta

1. `npm run verify` (los tests de `tests/telemetria.test.ts` usan exportadores en memoria).
2. Con el otel-stack arriba y las variables `OTEL_*` de `.env.example` en tu `.env`: `npm run dev`, conversa con el agente y busca en Grafana → Explore → Tempo `{ span.gen_ai.operation.name = "invoke_agent" }`.
3. Si no llega nada, corre `../otel-stack/scripts/test-telemetry.sh`. Si el script llega y la app no, revisa `OTEL_EXPORTER_OTLP_ENDPOINT`.
