# EntreVista AI · Observabilidad (Estación 11)

Solución de referencia de la Estación 11: la EntreVista AI de la Estación 8, instrumentada con OpenTelemetry. Cada turno del agente deja una traza, cada llamada al modelo registra tokens, latencia y costo, y cada log lleva el `trace_id` de su request. Trae un dashboard como código y una prueba de carga con k6.

Es el mismo stack que el repo de cada alumno (Next.js, Claude, walking skeleton), así que los archivos se copian tal cual.

| Pieza | Dónde |
|---|---|
| Arranque del SDK | `instrumentation.ts` → `lib/otel-node.ts` |
| Spans y métricas del agente (`gen_ai.*`) | `lib/telemetria.ts` |
| Precios y costo por llamada | `lib/precios.ts` |
| Logs con `trace_id` | `lib/logger.ts` |
| Motor simulado (sin llave, sin costo) | `lib/simulado.ts` |
| Dashboard | `grafana-dashboards/entrevista-agente.json` |
| Prueba de carga | `carga/entrevista.js` |
| Tests de la telemetría (exportadores en memoria) | `tests/telemetria.test.ts` |
| Convenciones para el coding agent | `.agents/skills/observabilidad/SKILL.md` |

## Empezar

Necesitas Docker para el stack y [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) para la prueba de carga.

```bash
# Terminal 1: el stack (Collector, Tempo, Prometheus, Loki y Grafana)
cd ../otel-stack && docker compose up -d

# Terminal 2: la app, con el motor simulado y la telemetría hacia el Collector
npm install
cp .env.example .env
# En .env, descomenta AGENT_MODE=simulado, OTEL_EXPORTER_OTLP_ENDPOINT y OTEL_METRIC_EXPORT_INTERVAL
npm run build && npm run start

# Terminal 3: tráfico
k6 run carga/entrevista.js
```

Abre Grafana en http://localhost:3001 → Dashboards → **EntreVista AI · Agente**. En un minuto de k6 aparecen latencia, tokens, costo por hora y costo por entrevista.

Sin `OTEL_EXPORTER_OTLP_ENDPOINT` la app no carga el SDK: los tests, el build y un despliegue sin Collector funcionan igual y no mandan nada.

## Los tres motores

| `AGENT_MODE` | Qué hace | Telemetría |
|---|---|---|
| `reglas` (o sin llave) | Preguntas en orden, determinista | Solo `invoke_agent`: muestra la latencia base de la app |
| `simulado` | El motor de Claude con un cliente falso: latencia, tokens y errores sintéticos | `invoke_agent` → `chat`, con costo calculado como si fuera Haiku |
| sin definir, con `ANTHROPIC_API_KEY` | Claude de verdad | `invoke_agent` → `chat` → `POST api.anthropic.com` |

El simulado existe para que la demo y la prueba de carga no dependan de una llave ni gasten. Pasa por la misma instrumentación que el real: solo la llamada HTTP es falsa. Con `SIMULADO_TASA_ERROR=0.05` el 5 % de las llamadas falla con un 529 y se ve en el panel de errores.

## Qué se registra

**Traza de un turno**

```
POST /api/agent                          (Next.js)
└─ invoke_agent entrevistador            gen_ai.agent.name, gen_ai.conversation.id, entrevista.motor, entrevista.estado
   └─ chat claude-haiku-5-5              CLIENT · gen_ai.request.model, gen_ai.response.model,
      │                                  gen_ai.usage.input_tokens, gen_ai.usage.output_tokens,
      │                                  gen_ai.response.finish_reasons, entrevista.costo.usd, error.type
      └─ POST                            (fetch a api.anthropic.com, instrumentación de undici)
```

**Métricas**

| Nombre | Tipo | Para qué |
|---|---|---|
| `gen_ai.client.operation.duration` | histograma, s | Latencia de la llamada al modelo, por modelo y `error.type` |
| `gen_ai.client.token.usage` | histograma, `{token}` | Tokens por llamada, separados en `input` y `output` |
| `gen_ai.invoke_agent.duration` | histograma, s | Latencia del turno completo, por motor |
| `entrevista.llm.costo.usd` | contador | Gasto acumulado, por modelo |
| `entrevista.conversacion.costo.usd` | histograma | Costo total de una entrevista, al terminar |
| `entrevista.conversaciones` | contador | Entrevistas terminadas, por estado final |

Las convenciones `gen_ai.*` están en estado **Development** (ver la guía de la estación). Lo que no está en ellas lleva el prefijo `entrevista.`. Ninguna convención define el costo: se calcula en `lib/precios.ts` con la tabla de precios de Anthropic.

`GET /api/conversaciones/:id` devuelve también `uso`: tokens y costo acumulados de la entrevista.

## Prueba de carga

```bash
k6 run carga/entrevista.js                    # humo: 1 usuario, 1 minuto
k6 run -e PERFIL=carga carga/entrevista.js    # rampa a 20 usuarios
k6 run -e PERFIL=rt9 carga/entrevista.js      # RT9 del PRD: 100 candidatos simultáneos
k6 run -e BASE_URL=https://tu-app -e TOKEN=... carga/entrevista.js
```

Cada iteración es una entrevista completa. Los umbrales del script fallan la corrida si:
- más del 1 % de los requests falla;
- una respuesta tarda más de 60 s, o una respuesta llega a otra conversación (RT9 del PRD);
- el P95 de un turno pasa de 5 s o el de la apertura de 500 ms (objetivos del equipo, no del PRD).

Para ver las métricas de k6 junto a las de la app, mándalas al mismo Collector:

```bash
K6_OTEL_EXPORTER_PROTOCOL=http/protobuf K6_OTEL_HTTP_EXPORTER_INSECURE=true K6_OTEL_METRIC_PREFIX=k6_ \
  k6 run -o opentelemetry carga/entrevista.js
```

**Contra Claude de verdad**, cada entrevista hace unas 5 llamadas al modelo. Corre primero el perfil `humo`, mira el costo por entrevista en el dashboard y multiplícalo por las entrevistas del perfil antes de subirlo. Fija un límite de gasto en la consola de Anthropic.

## CI

| Workflow | Qué hace |
|---|---|
| `ci.yml` | Lint, tipos, unitarias (incluidas las de telemetría), skills, build y gitleaks |
| `calidad.yml` | Playwright y Persona + Juez, como en la Estación 8 |
| `carga.yml` | k6 contra la app con el motor simulado. A mano desde Actions, o en un PR con la etiqueta `prueba-de-carga` |

## Modelos y precios

El modelo del agente se cambia con `ANTHROPIC_MODEL`. Los precios están en `lib/precios.ts` con su fecha de revisión; si usas un modelo que no está en la tabla, el costo no se registra. Valores por defecto en [`versions.md`](../../../versions.md) del repo del programa.
