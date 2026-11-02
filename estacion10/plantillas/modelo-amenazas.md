# Modelo de amenazas · OWASP Top 10 for Agentic Applications

**Producto:** 
**Fecha:** 
**Qué hace el agente:** una o dos frases. Qué herramientas usa, qué datos lee y qué puede modificar.

Para cada riesgo, responde la pregunta guía pensando en **tu** producto. Si el riesgo no aplica, di por qué en una línea: también es información útil.

| ID | Riesgo | Pregunta guía | ¿Aplica? | Cómo podría pasar en tu producto | Mitigación actual | Qué falta |
|---|---|---|---|---|---|---|
| ASI01 | Agent Goal Hijack | ¿Puede alguien cambiar lo que hace tu agente con lo que escribe, o con contenido que el agente lee (correos, documentos, páginas web)? | | | | |
| ASI02 | Tool Misuse and Exploitation | ¿Qué herramientas puede invocar tu agente y qué pasaría si las usa con parámetros que no esperabas? | | | | |
| ASI03 | Identity and Privilege Abuse | ¿Con qué identidad y permisos actúa el agente? ¿Son los mínimos? ¿Quién puede llamarlo? | | | | |
| ASI04 | Agentic Supply Chain Vulnerabilities | ¿Qué dependencias, servidores MCP, skills o modelos de terceros usas y cómo sabes que son confiables? | | | | |
| ASI05 | Unexpected Code Execution | ¿Puede tu agente ejecutar código o comandos? ¿Dónde corren y con qué aislamiento? | | | | |
| ASI06 | Memory & Context Poisoning | ¿Guarda memoria o historial que luego vuelve a leer? ¿Alguien podría meter ahí instrucciones o datos falsos? | | | | |
| ASI07 | Insecure Inter-Agent Communication | ¿Habla con otros agentes? ¿Cómo se autentican los mensajes entre ellos? | | | | |
| ASI08 | Cascading Failures | Si el modelo, una herramienta o una base de datos falla, ¿qué más se cae? | | | | |
| ASI09 | Human-Agent Trust Exploitation | ¿Alguien podría actuar a partir de una respuesta del agente sin verificarla? ¿Qué daño causaría una respuesta equivocada? | | | | |
| ASI10 | Rogue Agents | ¿Cómo sabrías que el agente está haciendo algo fuera de lo previsto? ¿Puedes detenerlo? | | | | |

## Los tres riesgos más importantes para tu producto
1. 
2. 
3. 

Llévalos al reporte de seguridad como hallazgos.
