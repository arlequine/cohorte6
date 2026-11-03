# Versiones fijadas para la Cohorte 6

Fuente única de modelos, SDKs y herramientas. El resto del repo referencia este archivo y no repite números. Revisar antes de cada cohorte.

Última revisión de modelos: 31 de octubre de 2026. Frameworks y herramientas: pendiente (issue #12).

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
| AI-DLC (awslabs/aidlc-workflows) | 2.11.2 (CLI `aidlc`, perfil `classic`), revisado el 3 de noviembre de 2026. La demo de E1 y el ejemplo `ejemplos/entrevista-ai/aidlc-docs-v1` usan las reglas 1.0.1 | E1 (demo), E4, E5 |
| `@playwright/test` | ^1.64.1 | E8 `entrevista-qa` (C4 usaba ^1.48) |
| playwright-bdd | ^9.2.1 | E8 `entrevista-qa` |
| `@playwright/mcp` | `@latest` (0.0.84 al 3 de noviembre de 2026) | E8, MCP de cada herramienta |
| openai SDK | Por definir | E11 |
| Terraform | >= 1.10 (backend S3 con `use_lockfile`) | E9 `producto-desplegado` |
| Provider `hashicorp/aws` | ~> 6.0 (validado con 6.71) | E9 |
| Provider `vercel/vercel` | ~> 5.24 | E9 |
| `@aws-sdk/client-dynamodb` y `lib-dynamodb` | ^3 | E9 `producto-desplegado` |
| Semgrep | Imagen `semgrep/semgrep` (última), reglas `p/default` y `p/terraform` | E10 |
| Terraform (material de C4, ruta solo AWS) | >= 1.5, AWS provider ~> 5.0 | E9 `iac-infra` |
| OpenTelemetry SDK (Node) | Por definir | E11 |
