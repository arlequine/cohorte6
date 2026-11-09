# Estación 11 · Guía del mentor

## En una frase
El alumno sale con su agente instrumentado (una traza por turno con `invoke_agent` → `chat`, métricas de tokens, latencia y costo, logs que saltan a su traza) y con una cifra de costo por conversación que puede defender en el Demo Day. El error más común es instrumentar solo HTTP y creer que eso es observar un agente: un 200 en 3 s no dice cuántos tokens se gastaron ni si el modelo falló y se reintentó.

## Preparación (48 h antes)
- [ ] Instala Docker y [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) (`k6 version` debe decir 2.x)
- [ ] Levanta el stack: `cd estacion11/repos/otel-stack && docker compose up -d && ./scripts/test-telemetry.sh`. Las tres señales deben aparecer en http://localhost:3001
- [ ] Corre la solución de referencia: `cd ../entrevista-obs && npm install && npm run verify`
- [ ] Ensaya la demo completa (ver Demo) con el motor simulado. Toma capturas del dashboard con datos y de una traza abierta en Tempo: son el plan B
- [ ] Si vas a mostrar Claude de verdad, corre una entrevista con tu llave y guarda la traza (en Tempo: **Share** → copiar el enlace o exportar el JSON). Con Haiku 5.5, una entrevista cuesta menos de un centavo de dólar
- [ ] Revisa los precios de [`lib/precios.ts`](repos/entrevista-obs/lib/precios.ts) contra la [página de precios](https://platform.claude.com/docs/en/about-claude/pricing). Si cambiaron, actualiza la tabla y [`versions.md`](../versions.md)
- [ ] Revisa si cambiaron las convenciones `gen_ai.*` en [su repo](https://github.com/open-telemetry/semantic-conventions-genai). Si algún nombre cambió, ajústalo en `lib/telemetria.ts` y en el dashboard
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-10`: quién no tiene su producto desplegado

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | La pregunta: "tu agente respondió 200 en 3 s; ¿cuánto costó y qué dijo el modelo?" | Responden con lo que hoy pueden saber de su producto | — |
| 10–25 | Las señales y el Collector. Un request es una traza; las métricas cuentan; los logs cuentan qué pasó; el `trace_id` los une | Ubican cada señal en su producto | `clase-11.pdf` (C4), `repos/otel-stack/README.md` |
| 25–40 | Lo propio de un agente: `invoke_agent` y `chat`, atributos `gen_ai.*`, estado Development y por qué el costo lo calculas tú | Leen `lib/telemetria.ts` | README "Las convenciones no son estables" |
| 40–55 | Demo 1 y 2 (ver Demo) | Siguen en su pantalla | `entrevista-obs/` |
| 55–60 | Pausa | | |
| 60–70 | Demo 3: k6 y el dashboard; el costo por entrevista y la proyección | Calculan en voz alta el costo de su producto con el volumen de su PRD | `carga/entrevista.js`, dashboard |
| 70–110 | Circula: primero a quien no levanta Docker, luego a quien no ve trazas | Pasos 1 a 6 de la tarea | README "Tu tarea" |
| 110–120 | Entregable, rúbrica y el puente al Demo Day | Anotan su cifra de costo para el speech | README "Entregable", `estacion12/README.md` |

## Demo
En Claude Code, que es la herramienta de referencia, sobre `estacion11/repos/entrevista-obs`, con el stack ya levantado.

1. **Una traza de punta a punta (minuto 40).**
   ```bash
   cp .env.example .env
   # descomenta AGENT_MODE=simulado, OTEL_EXPORTER_OTLP_ENDPOINT y OTEL_METRIC_EXPORT_INTERVAL
   npm run build && npm run start
   ```
   Abre http://localhost:3000 y haz una entrevista de tres o cuatro turnos. En Grafana → Explore → Tempo, busca `{ span.gen_ai.operation.name = "invoke_agent" }` y abre una traza. Debe verse `POST /api/agent` → `invoke_agent entrevistador` → `chat claude-haiku-5-5`. Abre el span `chat` y muestra `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens` y `entrevista.costo.usd`.
   El punto: los tokens de entrada crecen turno a turno porque se reenvía el historial. Eso es costo.
2. **De la traza al log y de vuelta (minuto 48).** Desde el span, **Logs for this span** abre Loki con el mismo `trace_id`. Muestra la línea `agente.respuesta` con `costo_usd_conversacion`. Después, en Loki, `{service_name="entrevista-ai"}` y salta de un log a su traza con el enlace del `trace_id`.
3. **Carga y costo (minuto 60).** En otra terminal: `k6 run -e PAUSA_S=0.3 carga/entrevista.js`. Abre el dashboard **EntreVista AI · Agente** y muestra cómo se llenan los paneles. Termina en **Costo por entrevista** y **Proyección mensual**.
   Para mostrar errores: reinicia la app con `SIMULADO_TASA_ERROR=0.1` y vuelve a correr k6. El panel de errores muestra `529` y el umbral de `http_req_failed` hace fallar a k6.
   Si quieres contrastar, corre una vez con `AGENT_MODE=reglas`: el turno baja a milisegundos y no hay span `chat`. Es la latencia base de la app sin el modelo.

Salida esperada de k6 en el perfil `humo`: todos los `checks` en 100 % y `entrevistas_completas` mayor que cero.

Plan B si algo falla en vivo:
- Docker no levanta o no descarga imágenes: muestra las capturas del ensayo y las de `repos/otel-stack/docs/screenshots/`.
- No llegan trazas: corre `../otel-stack/scripts/test-telemetry.sh`. Si el script llega y la app no, falta `OTEL_EXPORTER_OTLP_ENDPOINT` en `.env` o la app se construyó antes de agregarlo (reinicia `npm run start`).
- k6 no está instalado: genera tráfico con unas cuantas entrevistas en el navegador.

## Conceptos clave
1. **Un 200 no es un éxito.** En un agente, la respuesta puede ser correcta, tardía, cara o un reintento después de un 529. Solo la telemetría del modelo lo dice.
   Pregunta: "¿Qué tres números de tu agente no ves hoy en tu producto desplegado?"
2. **Dos spans, dos preguntas.** `invoke_agent` responde "¿cuánto tardó el turno?" y `chat` responde "¿cuánto tardó y costó el modelo?". La diferencia entre los dos es tu código.
   Pregunta: "Si el turno tarda 4 s y el `chat` 3,8 s, ¿dónde optimizas?"
3. **Las convenciones `gen_ai.*` son un acuerdo en construcción.** Están en Development: se usan, pero con los nombres en un solo archivo y lo propio con prefijo propio.
   Pregunta: "¿Qué pasa en tu repo si mañana `gen_ai.usage.input_tokens` cambia de nombre?"
4. **El costo es una métrica de producto.** Tokens × precio, por conversación, con fecha de la tabla de precios. Es la cifra que convierte la demo en un negocio.
   Pregunta: "¿Cuánto cuesta un mes de tu producto con el volumen que pusiste en tu PRD?"
5. **La carga se mide con lo que el PRD promete.** Los umbrales de k6 salen del PRD (en EntreVista AI, RT9) y de los objetivos del equipo, no de un número bonito.
   Pregunta: "¿Qué caso de tu PRD se rompe primero con 100 usuarios simultáneos?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| La app arranca pero no llega nada a Grafana | Falta `OTEL_EXPORTER_OTLP_ENDPOINT`, o se agregó al `.env` después del build | Agregarla y reiniciar `npm run start`; verificar con `scripts/test-telemetry.sh` |
| Las métricas no aparecen aunque las trazas sí | Los instrumentos se crearon al importar el módulo, antes de que arrancara el SDK | Crearlos en el primer uso, como `medir()` en `lib/telemetria.ts` |
| Aparecen trazas pero el span `chat` no cuelga del `invoke_agent` | La llamada al modelo no se hace dentro del callback de `startActiveSpan` | Envolver con `startActiveSpan` y llamar al modelo dentro |
| `next build` falla al agregar el SDK | Next intenta empaquetar el SDK | `serverExternalPackages` en `next.config.ts` y el `import()` dinámico en `instrumentation.ts` |
| Error de versión de Node.js al instalar OpenTelemetry | El SDK 3.x pide Node.js 22.15 o más | `nvm install 22` y revisar `.nvmrc` |
| Un panel del dashboard queda vacío | El nombre en Prometheus no es el del código | Buscar el nombre real en Explore → Prometheus → Metrics browser; ver la tabla de la skill |
| Prometheus se pone lento o el Collector descarta datos | Un atributo de alta cardinalidad (ID de conversación, email) en una métrica | Sacarlo de la métrica y dejarlo solo en el span |
| El costo da cero | El modelo no está en la tabla de precios, o se está usando el motor de reglas | Agregar el modelo con su fecha de revisión; usar el motor simulado o el real |
| La prueba de carga gasta más de lo esperado | Se corrió contra el motor real con el perfil `carga` o `rt9` | Correr primero `humo`, multiplicar el costo por entrevista y fijar un límite de gasto en la consola |
| Prompts o datos del candidato en los spans | Se registró `messages` como atributo | Quitarlo: solo conteos, modelos, IDs y costo |

## Preguntas frecuentes
- **¿Por qué no uso la instrumentación automática de Anthropic u OpenLLMetry?** Puedes, en el track avanzado. Aquí se escribe a mano para que entiendas qué es cada atributo, y porque las librerías de terceros siguen versiones distintas de unas convenciones que todavía cambian.
- **¿Mi producto desplegado manda telemetría?** No con el stack local: el Collector corre en tu máquina. Para producción, apunta `OTEL_EXPORTER_OTLP_ENDPOINT` a un backend OTLP administrado (track avanzado).
- **¿Por qué un motor simulado y no Claude?** Para que la demo y la prueba de carga no dependan de una llave ni gasten. Pasa por la misma instrumentación: lo único falso es la llamada HTTP.
- **¿El costo del dashboard es exacto?** Es una estimación con la tabla de precios. La factura real está en la consola de Anthropic; si difieren mucho, revisa la tabla y los tokens de caché.
- **¿Qué es `requirement-hr-ia`?** La app completa de la Cohorte 4, con OpenAI y atributos `llm.*`. Se conserva para el track avanzado.
- **¿Las slides dicen `llm.model` y `llm.tokens.*`?** Son de la Cohorte 4. Los nombres vigentes son los `gen_ai.*` del README.

## Qué se adapta y qué no
- Fijo: los spans `invoke_agent` y `chat` con `gen_ai.*`, las métricas de tokens, latencia y costo, los logs con `trace_id`, el dashboard como código, la prueba de carga con umbrales del PRD, el entregable y la rúbrica
- Libre: el backend (el stack local o uno administrado), cuánto tiempo dar a la teoría de señales según el grupo, y si la demo usa el motor simulado o Claude

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-11` se entrega antes del Demo Day, con las capturas y el resumen de k6 en la descripción, y que la cifra de costo va en el speech
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-11` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`
- En el refuerzo, abre la traza de un turno de dos alumnos y pregunta dónde se va el tiempo y el costo: es donde más se nota si la instrumentación sirve

## Notas para el siguiente mentor
En la Cohorte 4 la estación era una demo de 1 h sobre la app completa (`requirement-hr-ia`, con OpenAI y atributos `llm.*`), sin práctica en el repo del alumno, sin costo y sin k6, aunque el deck prometía pruebas con k6. En la Cohorte 6 se agregó `entrevista-obs`, sobre el stack del alumno, con `gen_ai.*`, costo por conversación, motor simulado y k6 con los umbrales de RT9.

Pendiente: se llena al terminar la Cohorte 6.
