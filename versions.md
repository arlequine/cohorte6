# Versiones fijadas para la Cohorte 6

Fuente única de modelos, SDKs y herramientas. El resto del repo referencia este archivo y no repite números. Revisar antes de cada cohorte.

Última revisión: pendiente (ver issue de mantenimiento).

## Modelos

| Uso | Modelo | Variable de entorno | Notas |
|---|---|---|---|
| Agente conversacional (EntreVista AI) | Por definir | `CONVERSATION_MODEL` | GPT-4o sale de la API el 14 de enero de 2027 |
| Evaluador / Juez | Por definir | `EVALUATOR_MODEL` | |
| Persona simulada (E8) | Por definir | `PERSONA_MODEL` | |

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
