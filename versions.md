# Versiones fijadas para la Cohorte 6

Fuente única de modelos, SDKs y herramientas. El resto del repo referencia este archivo y no repite números. Revisar antes de cada cohorte.

Última revisión de modelos: 31 de octubre de 2026. Frameworks y herramientas: pendiente (issue #12).

## Modelos

OpenAI retira `gpt-4o`, `gpt-4o-mini`, `gpt-4.1` y `gpt-4.1-mini` de la API el 14 de enero de 2027 y recomienda `gpt-6-luna` como reemplazo ([deprecations de OpenAI](https://developers.openai.com/api/docs/deprecations)). `gpt-6-sol` es la opción más capaz y más cara para tareas complejas.

| Uso | Modelo por defecto | Variable de entorno | Dónde |
|---|---|---|---|
| Agente conversacional de EntreVista AI | `gpt-6-luna` | `CONVERSATION_MODEL` | E11 `requirement-hr-ia` |
| Evaluador de EntreVista AI | `gpt-6-luna` | `EVALUATOR_MODEL` | E11 `requirement-hr-ia` |
| Persona simulada | `gpt-6-luna` | `PERSONA_MODEL` | E8 `qa-agent-eval` |
| Juez | `gpt-6-luna` (subir a `gpt-6-sol` si se queda corto) | `JUDGE_MODEL` | E8 `qa-agent-eval` |
| Agente bajo prueba | `gpt-6-luna` | `AGENT_MODEL` | E8 `qa-agent-eval` |
| Ejemplos de diseño (Claude Agent SDK) | `claude-opus-5-5` / `claude-sonnet-5-5` | — | E4, E5 `agentic_interviewer_ai` |

## Frameworks y herramientas

| Herramienta | Versión | Dónde se usa |
|---|---|---|
| AI-DLC (awslabs/aidlc-workflows) | Por verificar | E1, E4, E5 |
| Playwright | Por definir (C4 usaba ^1.48) | E8 |
| playwright-bdd | Por definir | E8 |
| Next.js | Por definir | Ejemplos y EntreVista AI |
| openai SDK | Por definir | E8, E11 |
| Vitest | Por definir | E8, E11 |
| Terraform | >= 1.5, AWS provider ~> 5.0 | E9 |
| OpenTelemetry SDK (Node) | Por definir | E11 |
