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
| Agente del walking skeleton | `claude-haiku-5-5` | `ANTHROPIC_MODEL` | `plantilla-alumno`, E3 `walking-skeleton` |

## Frameworks y herramientas

| Herramienta | Versión | Dónde se usa |
|---|---|---|
| Node.js | 22 (`.nvmrc`) | Todos los proyectos |
| Next.js | ^16.4 | `plantilla-alumno`, E3 (C4 usaba 15 y 16.1 en otros ejemplos) |
| React | ^19.3 | `plantilla-alumno`, E3 |
| `@anthropic-ai/sdk` | ^1.3 | `plantilla-alumno`, E3 |
| TypeScript | ^6.0 | `plantilla-alumno`, E3 |
| Vitest | ^5.0 | `plantilla-alumno`, E3 (C4 usaba 2 y 4 en otros ejemplos) |
| ESLint + `eslint-config-next` | ^9 / ^16.4 | `plantilla-alumno`, E3 |
| AI-DLC (awslabs/aidlc-workflows) | Por verificar | E1, E4, E5 |
| Playwright | Por definir (C4 usaba ^1.48) | E8 |
| playwright-bdd | Por definir | E8 |
| openai SDK | Por definir | E8, E11 |
| Terraform | >= 1.5, AWS provider ~> 5.0 | E9 |
| OpenTelemetry SDK (Node) | Por definir | E11 |
