# Estación 10 · Seguridad

## Objetivo
Revisar la seguridad de tu producto desplegado con controles automáticos en el pipeline y con los riesgos propios de los agentes, y salir con un reporte de seguridad donde al menos un hallazgo quedó cerrado y verificado.

## Antes de la clase
- Tu pipeline de la Estación 9 en verde, con el producto desplegado en Vercel y el historial en DynamoDB
- Tu `AGENT_ACCESS_TOKEN` a la mano: lo vas a usar para probar tu propio endpoint
- Haber leído qué hace tu agente: qué recibe, qué herramientas usa y qué datos toca

> Ejecuta pruebas activas (red team, pentest) **solo contra sistemas propios** o con autorización por escrito y alcance definido.

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | Superficie de ataque de un producto con agente: código, dependencias, infraestructura, datos y el propio agente | Un mapa de qué revisar |
| 10–25 | Casos reales: cadena de suministro (Mini Shai-Hulud) y parsers de imágenes (HEIF Heist) | Entender por qué revisar solo tu código no basta |
| 25–40 | OWASP Top 10 for Agentic Applications (ASI01–ASI10) | Saber qué riesgos aplican a tu agente |
| 40–55 | Demo: pentest con agentes (Shannon) contra la app de referencia, en un entorno propio | Ver cómo un agente encuentra y reproduce una vulnerabilidad |
| 55–60 | Pausa | |
| 60–105 | Trabajo práctico: controles en el pipeline, modelo de amenazas, red team y DR | Hallazgos reales en tu producto |
| 105–115 | Del hallazgo al cierre: corregir, volver a probar y documentar | Un hallazgo cerrado con evidencia |
| 115–120 | Entregable y conexión con la Estación 11 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La solución de referencia está en [`repos/producto-seguro/`](repos/producto-seguro): el producto de la Estación 9 con los controles y la recuperación de hoy. En su carpeta `docs/` hay un modelo de amenazas, un reporte de seguridad y un runbook de DR llenos, para que veas el nivel de detalle esperado.

## Las capas que vas a revisar

| Capa | Riesgo | Control | Cuándo corre |
|---|---|---|---|
| Secretos | Llaves o tokens en el repo | gitleaks (desde la Estación 3) | Cada PR y cada push |
| Código | Patrones inseguros (inyección, criptografía débil, configuración insegura) | **Semgrep** con `p/default` | Cada PR y cada push |
| Infraestructura | Recursos mal configurados en Terraform | **Semgrep** con `p/terraform` | Cada PR y cada push |
| Dependencias | Paquetes con vulnerabilidades conocidas o comprometidos | **`npm audit`** y **Dependabot** | Cada PR y cada semana |
| Agente | Inyección de instrucciones, filtración del system prompt, abuso de costo | **Modelo de amenazas** y **red team** | Cuando cambia el agente |
| Datos | Borrado o corrupción | **Point-in-time recovery**, protección contra borrado y **runbook de DR** | Siempre activo; prueba de restauración una vez |

Usamos Semgrep para el análisis de código porque es gratuito en repos privados y revisa también Terraform. CodeQL analiza más a fondo, pero en repos privados requiere una licencia de GitHub Code Security. Si tu repo es público, agrégalo como reto del track avanzado.

## Tu tarea

Trabaja en tu repo personal, con tu coding agent.

1. **Agrega los controles al pipeline.**
   - Un job `sast` con Semgrep (`p/default` y `p/terraform`).
   - Un job `dependencias` con `npm audit --omit=dev --audit-level=high`.
   - `.github/dependabot.yml` para npm, GitHub Actions y Terraform.
   - El job de infraestructura debe esperar a que pasen todos los controles.
2. **Corrige lo que encuentren** los controles, o documenta por qué aceptas el riesgo. Nunca desactives un control para que pase el PR.
3. **Haz tu modelo de amenazas** con [`plantillas/modelo-amenazas.md`](plantillas/modelo-amenazas.md) en `docs/modelo-amenazas.md`. Elige los tres riesgos más importantes para tu producto.
4. **Corre el red team** contra tu propia URL. Copia [`scripts/red-team.mjs`](repos/producto-seguro/scripts/red-team.mjs) y agrega al menos dos casos propios basados en tu modelo de amenazas.
   ```bash
   AGENT_URL=https://tu-app.vercel.app AGENT_ACCESS_TOKEN=... node scripts/red-team.mjs --salida docs/red-team.md
   ```
5. **Cierra al menos un hallazgo** con un cambio en el código o la infraestructura, y vuelve a correr la prueba que lo demostró. Si tu agente no tiene defensas contra la filtración de instrucciones, la solución de referencia muestra un patrón: regla en el system prompt, marcador canario y filtro de salida.
6. **Prepara la recuperación.** Activa point-in-time recovery y protección contra borrado en la tabla de producción (`infra/main.tf`), vuelve a aplicar el bootstrap para dar al pipeline el permiso `dynamodb:UpdateContinuousBackups` y escribe tu runbook con [`plantillas/runbook-dr.md`](plantillas/runbook-dr.md). El track avanzado incluye probar la restauración.
7. **Escribe tu reporte** con [`plantillas/reporte-seguridad.md`](plantillas/reporte-seguridad.md) en `docs/seguridad.md`.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-10`, antes de la Estación 11, que incluya:
- Los controles en el pipeline, en verde
- `docs/modelo-amenazas.md`, `docs/seguridad.md` y `docs/runbook-dr.md`
- El resultado del red team (`docs/red-team.md`)
- Al menos un hallazgo **cerrado y verificado**: el cambio que lo corrige y la evidencia de que ya no ocurre

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Controles en el pipeline | Semgrep, `npm audit`, Dependabot y gitleaks; el deploy espera a que pasen | Faltan uno o dos controles, o el deploy no espera | Sin controles nuevos |
| Modelo de amenazas | Los diez riesgos evaluados para su producto y los tres principales justificados | Evaluación genérica, no aplicada a su producto | No hay |
| Red team | Corrido contra su URL, con al menos dos casos propios | Solo los casos de la solución de referencia | No se corrió |
| Hallazgo cerrado | Cambio en el código o la infraestructura con evidencia reproducible | Cambio sin evidencia, o evidencia sin cambio | Ningún hallazgo cerrado |
| Recuperación | PITR y protección contra borrado activos, y runbook con pasos y comandos | Solo uno de los dos | Nada |
| Reporte | Claro, con severidad, impacto y estado de cada hallazgo | Incompleto | No hay |

## Cómo alimenta la siguiente estación
En la Estación 11 instrumentas tu producto con OpenTelemetry. Los eventos de seguridad que ya registras (por ejemplo `agente.no_autorizado` y `agente.salida_bloqueada`) se convierten en métricas y alertas.

## Track avanzado
- Corre [Shannon](https://github.com/KeygraphHQ/shannon) o [Strix](https://github.com/usestrix/strix) contra tu propia instancia (o una copia en un entorno aislado) y agrega lo que encuentren a tu reporte.
- Prueba la restauración del runbook (escenario E1) y registra el tiempo real contra tu RTO.
- Si tu repo es público, agrega CodeQL y compara sus hallazgos con los de Semgrep.
- Limita la tasa de peticiones del endpoint (firewall de Vercel o un contador en DynamoDB).

## Recursos
Enlaces revisados el 2 de noviembre de 2026.

- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) y [OWASP Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- [Semgrep: reglas y uso en CI](https://semgrep.dev/docs/) · [Dependabot](https://docs.github.com/code-security/dependabot) · [`npm audit`](https://docs.npmjs.com/cli/commands/npm-audit)
- [DynamoDB: point-in-time recovery](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/PointInTimeRecovery.html)
- Pentesting asistido: [Shannon](https://github.com/KeygraphHQ/shannon), [Strix](https://github.com/usestrix/strix), [CyberStrike](https://github.com/CyberStrikeus/CyberStrike). El [historial de CyberStrike](https://github.com/CyberStrikeus/CyberStrike/blob/main/CHANGELOG.md) documenta su origen en OpenCode.
- Credenciales de agentes: [Agent Vault](https://docs.agent-vault.dev/) y [explicación de Trilogy AI](https://trilogyai.substack.com/p/agent-vault-protects-secrets).
- Cadena de suministro: [advisory Mini Shai-Hulud](https://www.autodesk.com/trust/security-advisories/adsk-sa-26-mini-shai-hulud) y [análisis técnico](https://www.akamai.com/blog/security-research/mini-shai-hulud-worm-returns-goes-public).
- Parsers de imágenes: [HEIF Heist](https://heif-heist.com/).
- Modelos y trabajo defensivo: [AI Cybersecurity Playbook](https://trilogy-group.github.io/ai-cybersecurity-playbook/), [repositorio y ejercicios](https://github.com/trilogy-group/ai-cybersecurity-playbook), [artículo sobre Kimi K3](https://trilogyai.substack.com/p/ai-cybersecurity-playbook-kimi-k3), [Altar-1](https://www.aikido.dev/blog/aikido-altar-open-weight-ai-sovereign-security) y [pesos del modelo](https://huggingface.co/AikidoSec/altar-1).
- Slides de la Cohorte 4: [HTML](estacion10.html), [PDF](estacion10.pdf) y [fuente editable](fuente/estacion10-source.html).
