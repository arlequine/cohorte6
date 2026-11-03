# Modelo de amenazas · Producto de referencia (Estación 10)

**Producto:** agente que responde preguntas con Claude y guarda el historial en DynamoDB
**Fecha:** noviembre de 2026
**Qué hace el agente:** recibe un mensaje de hasta 1000 caracteres, responde con Claude y guarda la conversación. No usa herramientas, no ejecuta código y no lee contenido externo. Solo puede escribir y leer su propia tabla.

| ID | Riesgo | ¿Aplica? | Cómo podría pasar en este producto | Mitigación actual | Qué falta |
|---|---|---|---|---|---|
| ASI01 | Agent Goal Hijack | Sí | Un mensaje con instrucciones ("ignora tus reglas…") cambia lo que responde el agente o le saca sus instrucciones | Regla en el system prompt que trata el mensaje como datos; canario y filtro de salida; red team con 5 casos de inyección | Correr el red team en cada cambio del system prompt |
| ASI02 | Tool Misuse and Exploitation | No | El agente no tiene herramientas | — | Revisar si se agregan herramientas |
| ASI03 | Identity and Privilege Abuse | Sí | Alguien llama al endpoint sin permiso y gasta el saldo de la API, o la llave de IAM de la app se filtra | `AGENT_ACCESS_TOKEN`; el usuario de IAM solo puede leer y escribir su tabla; el pipeline usa OIDC | La llave de IAM de la app es de larga duración: cambiar a OIDC de Vercel |
| ASI04 | Agentic Supply Chain Vulnerabilities | Sí | Una dependencia de npm comprometida roba credenciales durante el build | `npm audit` y Dependabot en CI; `package-lock.json` versionado; gitleaks | Revisar los cambios de Dependabot antes de fusionar, no aceptarlos a ciegas |
| ASI05 | Unexpected Code Execution | No | El agente no ejecuta código | — | — |
| ASI06 | Memory & Context Poisoning | Bajo | El historial se guarda, pero el agente no lo vuelve a leer como contexto | El historial no entra al prompt | Si el historial se usa como memoria, validar lo que se reinyecta |
| ASI07 | Insecure Inter-Agent Communication | No | Hay un solo agente | — | — |
| ASI08 | Cascading Failures | Sí | Si DynamoDB falla, podría tumbar las respuestas del agente | El guardado del historial está en `try/catch`: el agente responde aunque DynamoDB falle | — |
| ASI09 | Human-Agent Trust Exploitation | Bajo | Un usuario toma una respuesta inventada como cierta | Instrucción de decir "no sé" en lugar de inventar | Aviso en la interfaz de que las respuestas pueden equivocarse |
| ASI10 | Rogue Agents | Bajo | El agente responde fuera de lo previsto y nadie se entera | Logs JSON con `agente.salida_bloqueada` | Alerta cuando aparezca ese evento (Estación 11) |

## Los tres riesgos más importantes
1. **ASI01:** filtración de instrucciones e inyección. Ver H1 en `docs/seguridad.md`.
2. **ASI03:** la llave de IAM de larga duración. Ver H2.
3. **ASI03:** consumo del saldo de la API por abuso del endpoint. Ver H3.
