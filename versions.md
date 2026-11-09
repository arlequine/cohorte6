# Versiones fijadas para la Cohorte 6

Fuente única de modelos, SDKs y herramientas. El resto del repo referencia este archivo y no repite números. Revisar antes de cada cohorte.

Última revisión de modelos: 31 de octubre de 2026. Precios de Claude y herramientas de observabilidad: 9 de noviembre de 2026. Resto de frameworks y herramientas: pendiente (issue #12).

## Modelos

OpenAI retira `gpt-4o`, `gpt-4o-mini`, `gpt-4.1` y `gpt-4.1-mini` de la API el 14 de enero de 2027 y recomienda `gpt-6-luna` como reemplazo ([deprecations de OpenAI](https://developers.openai.com/api/docs/deprecations)). `gpt-6-sol` es la opción más capaz y más cara para tareas complejas.

| Uso | Modelo por defecto | Variable de entorno | Dónde |
|---|---|---|---|
| Agente conversacional de EntreVista AI | `gpt-6-luna` | `CONVERSATION_MODEL` | E11 `requirement-hr-ia` |
| Evaluador de EntreVista AI | `gpt-6-luna` | `EVALUATOR_MODEL` | E11 `requirement-hr-ia` |
| Persona simulada | `claude-haiku-5-5` | `PERSONA_MODEL` | E8 `entrevista-qa` |
| Juez | `claude-sonnet-5-5` (más capaz que el agente que evalúa) | `JUDGE_MODEL` | E8 `entrevista-qa` |
| Agente bajo prueba | `claude-haiku-5-5` | `ANTHROPIC_MODEL` | E8 `entrevista-qa` |
| Ejemplos de diseño (Claude Agent SDK) | `claude-opus-5-5` / `claude-sonnet-5-5` | — | `ejemplos/entrevista-ai` (E4, E5) |
| Coding agent para AI-DLC en E4 y E5 | Un modelo capaz de razonamiento, por ejemplo `claude-opus-5-5` | — | E4, E5 |
| Agente del walking skeleton | `claude-haiku-5-5` | `ANTHROPIC_MODEL` | `plantilla-alumno`, E3 `walking-skeleton` |
| Agente de EntreVista AI instrumentado | `claude-haiku-5-5` | `ANTHROPIC_MODEL` | E11 `entrevista-obs` |

## Precios de Claude (para la métrica de costo)

USD por millón de tokens, de la [página de precios](https://platform.claude.com/docs/en/about-claude/pricing), revisados el 9 de noviembre de 2026. La tabla que usa el código está en `estacion11/repos/entrevista-obs/lib/precios.ts`; si cambian, se actualizan los dos lugares.

| Modelo | Entrada | Salida | Escritura de caché (5 min) | Lectura de caché |
|---|---|---|---|---|
| `claude-haiku-5-5` (prompt de hasta 100 000 tokens) | 0.10 | 0.50 | 0.125 | 0.01 |
| `claude-haiku-5-5` (prompt de más de 100 000 tokens) | 0.50 | 2.50 | 0.625 | 0.05 |
| `claude-sonnet-5-5` | 2 | 10 | 2.50 | 0.10 |
| `claude-opus-5-5` | 4 | 20 | 5 | 0.20 |

## Frameworks y herramientas

| Herramienta | Versión | Dónde se usa |
|---|---|---|
| Node.js | 22 (`.nvmrc`); 22.15 o más donde se usa el SDK 3.x de OpenTelemetry | Todos los proyectos |
| Next.js | ^16.4 | `plantilla-alumno`, E3 (C4 usaba 15 y 16.1 en otros ejemplos) |
| React | ^19.3 | `plantilla-alumno`, E3 |
| `@anthropic-ai/sdk` | ^1.3 | `plantilla-alumno`, E3 |
| TypeScript | ^6.0 | `plantilla-alumno`, E3 |
| Vitest | ^5.0 | `plantilla-alumno`, E3 (C4 usaba 2 y 4 en otros ejemplos) |
| ESLint + `eslint-config-next` | ^9 / ^16.4 | `plantilla-alumno`, E3 |
| AI-DLC (awslabs/aidlc-workflows) | 2.11.2 (CLI `aidlc`, perfil `classic`), revisado el 3 de noviembre de 2026. La demo de E1 y el ejemplo `ejemplos/entrevista-ai/aidlc-docs-v1` usan las reglas 1.0.1 | E1 (demo), E4, E5 |
| `@playwright/test` | ^1.64.1 | E8 `entrevista-qa` (C4 usaba ^1.48) |
| playwright-bdd | ^9.2.1 | E8 `entrevista-qa` |
| `@playwright/mcp` | `@latest` (0.0.84 al 3 de noviembre de 2026) | E8, MCP de cada herramienta |
| openai SDK | ^6.29 | Solo E11 `requirement-hr-ia` (track avanzado); el resto del programa usa Claude |
| Terraform | >= 1.10 (backend S3 con `use_lockfile`) | E9 `producto-desplegado` |
| Provider `hashicorp/aws` | ~> 6.0 (validado con 6.71) | E9 |
| Provider `vercel/vercel` | ~> 5.24 | E9 |
| `@aws-sdk/client-dynamodb` y `lib-dynamodb` | ^3 | E9 `producto-desplegado` |
| Semgrep | Imagen `semgrep/semgrep` (última), reglas `p/default` y `p/terraform` | E10 |
| Terraform (material de C4, ruta solo AWS) | >= 1.5, AWS provider ~> 5.0 | E9 `iac-infra` |
| OpenTelemetry SDK (Node) | `@opentelemetry/sdk-node` ^0.301 con los paquetes estables ^3.1 (SDK 3.0) y `@opentelemetry/api` ^1.10, que incluye la API de logs | E11 `entrevista-obs` |
| `@opentelemetry/instrumentation-undici` | ^0.35 | E11 `entrevista-obs` |
| Convenciones semánticas GenAI (`gen_ai.*`) | Estado Development, repo `open-telemetry/semantic-conventions-genai` (schema `gen-ai/1.42.0`), revisado el 9 de noviembre de 2026 | E11 `lib/telemetria.ts` |
| k6 | 2.x | E11 `carga/` |
| Stack de observabilidad | Collector contrib 0.127.0, Tempo 2.7.2, Prometheus 3.4.1, Loki 3.5.0, Grafana 12.2.0 | E11 `otel-stack` |
| OpenTelemetry SDK (app de la Cohorte 4) | `@opentelemetry/sdk-node` ^0.213 (SDK 2.x) | E11 `requirement-hr-ia` (track avanzado) |
