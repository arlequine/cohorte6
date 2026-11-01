# Estación 3 · Guion de slides

17 slides para una sesión de 120 minutos. Cada slide tiene su mensaje principal (lo que el alumno debe recordar), el contenido y las notas para el mentor. El diseño visual queda a cargo de quien arme el deck.

---

## 1. Portada
**Mensaje:** Hoy tu producto pasa de documentos a una URL pública.
- Estación 3 · Harness engineering y walking skeleton
- Semana 3 de 7

## 2. Dónde estamos
**Mensaje:** Ya sabes qué construir; hoy dejas la base sobre la que se construye todo lo demás.
- Línea del programa: PVB (E1) → PRD (E2) → **skeleton (E3)** → diseño del QUÉ (E4) → …
- Resaltar que desde hoy cada estación agrega una capa a algo que ya está desplegado

**Notas:** Pregunta rápida al grupo: ¿quién tiene su PRD en `specs/`?

## 3. La misma tarea, dos resultados
**Mensaje:** El contexto que le das al agente cambia el resultado más que el modelo.
- Dos columnas: "Sin `AGENTS.md`" y "Con `AGENTS.md`"
- Mismo prompt: *"Agrega un endpoint POST /api/agent que responda con Claude"*
- Lo que cambió: validación, errores, modelo desde el entorno, tests

**Notas:** Esta slide acompaña la demo en vivo del minuto 0. Llena las diferencias con lo que salga en la demo.

## 4. Qué es un harness
**Mensaje:** El harness es todo lo que rodea al modelo y le permite actuar bien.
- Modelo = el que propone
- Harness = contexto + herramientas + permisos + controles
- Frase para cerrar: "El modelo propone; el harness decide qué puede hacer y verifica lo que hizo"

## 5. Las seis piezas
**Mensaje:** Cada pieza responde a una pregunta distinta.

| Pieza | Pregunta que responde |
|---|---|
| Instrucciones | ¿Qué debe saber siempre? |
| Skills | ¿Cómo hace esta tarea en particular? |
| MCP | ¿A qué herramientas y datos externos tiene acceso? |
| Permisos | ¿Qué puede hacer sin preguntarme? |
| Controles automáticos | ¿Qué se verifica siempre, haga lo que haga? |
| Subagentes | ¿Qué tareas delego con su propio contexto? |

## 6. Instrucciones: `AGENTS.md`
**Mensaje:** Un solo archivo de instrucciones funciona en las cinco herramientas.
- Qué va: qué es el proyecto, comandos, estructura, convenciones, "antes de terminar"
- Qué no va: procedimientos largos (eso es una skill) ni secretos
- Claude Code: `CLAUDE.md` con una línea, `@AGENTS.md`

**Notas:** Mostrar el `AGENTS.md` de la solución de referencia.

## 7. Skills
**Mensaje:** Una skill es un procedimiento que el agente carga solo cuando lo necesita.
- Formato: carpeta con `SKILL.md` (nombre, descripción y pasos)
- La descripción decide cuándo se activa: escríbela como "Úsala cuando…"
- Ubicación: `.agents/skills/`; para Claude Code, `npm run sync-skills`

## 8. MCP, permisos y subagentes
**Mensaje:** MCP da herramientas nuevas; los permisos ponen límites; los subagentes reparten el trabajo.
- MCP: cada herramienta lo configura en un archivo distinto → `mcp/README.md`
- Permisos: empieza restrictivo y abre según confíes
- Subagentes: contexto propio, útiles para investigar o para tareas acotadas

## 9. Equivalencias por herramienta
**Mensaje:** Las piezas son las mismas; solo cambia dónde viven.
- Tabla de la sección "Equivalencias por herramienta" del README de la estación
- Demos y soporte garantizado: Claude Code

**Notas:** No leas la tabla completa. Pide que cada alumno ubique su fila.

## 10. Controles que no dependen del agente
**Mensaje:** Lo obligatorio se verifica siempre, con cualquier herramienta.
- Pre-commit: `npm run verify` antes de cada commit (`npm run hooks` para activarlo)
- CI: lint, tipos, tests, skills sincronizadas, build y secret scanning
- Los hooks de cada herramienta son un extra, no el control principal

## 11. Demo: el harness funcionando
**Mensaje:** Contexto, una skill y un control, en diez minutos.
- Completar `AGENTS.md`
- Agregar la skill `nuevo-endpoint` y verla activarse
- Un commit que falla porque un test no pasa

**Notas:** Ver la sección Demo de `MENTOR.md`, paso 2.

## 12. Qué es un walking skeleton
**Mensaje:** La versión más delgada del producto que ya recorre todo el camino: código, tests, CI y producción.
- Una página, un endpoint del agente, un test, CI y una URL
- No tiene funcionalidad de negocio todavía; tiene el camino completo
- Desde aquí, cada cambio es un push

## 13. Tu tarea en siete pasos
**Mensaje:** Pídele al agente un paso a la vez y verifica cada uno.
1. Completar `AGENTS.md`
2. Endpoint `POST /api/agent` con Claude
3. Tests sin llamar a la API real
4. Logs en JSON
5. Una skill propia
6. Secret scanning en CI
7. Deploy en Vercel con `ANTHROPIC_API_KEY` y `AGENT_ACCESS_TOKEN`

**Notas:** Insistir en el límite de gasto en Anthropic y en el token antes del paso 7.

## 14. Dos tareas en paralelo
**Mensaje:** Con subagentes o worktrees, el agente puede avanzar en dos frentes sin que se pisen.
- `git worktree add ../mi-repo-logs` → otra carpeta, otra rama, otra sesión
- Al final se integran como dos pull requests

## 15. Cuándo paralelizar
**Mensaje:** Paraleliza tareas independientes; serializa las que tocan los mismos archivos.
- Buenas candidatas: logs y gitleaks, docs y tests
- Malas candidatas: dos cambios a la misma ruta
- Vista previa de lo que se verá a fondo en la Estación 7

## 16. Entregable y rúbrica
**Mensaje:** Un PR con la etiqueta `estacion-3`, CI en verde y la URL de Vercel.
- Resumen de la rúbrica: despliegue, agente, tests, harness, CI y reflexión
- Fecha límite: antes de la Estación 4

## 17. Qué sigue
**Mensaje:** En la Estación 4 diseñas el QUÉ de tu producto dentro de este mismo repo.
- AI-DLC Inception, DDD estratégico y BDD
- Tu agente va a leer el `AGENTS.md` que dejaste hoy
- Refuerzo: trae tu URL funcionando o tus errores de deploy
