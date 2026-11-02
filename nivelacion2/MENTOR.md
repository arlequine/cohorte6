# Nivelación 2 · Guía del mentor

## En una frase
Que el alumno vea con sus propios ojos qué aporta cada pieza de un agente: el modelo razona, MCP le da manos y la skill le da el criterio del negocio. El error más común es saltarse el Acto 1 y el Acto 2 para ir directo al resultado, y perder la comparación que es el punto del ejercicio.

## Preparación (48 h antes)
- [ ] Ten un proyecto de Supabase con la tabla `tickets` cargada (`setup-tickets.sql`) y un token `sbp_...` de prueba que puedas revocar al terminar
- [ ] Corre los tres actos completos en Claude Code con `claude --model haiku` y confirma que los 8 tickets quedan como dice la guía
- [ ] Ten `reset-tickets.sql` abierto en el SQL Editor de Supabase para rebobinar entre demos
- [ ] Si vas a hacer sesión en vivo, guarda el token fuera de la pantalla compartida

## Guion (sesión de refuerzo de 60 min)

Es asíncrona; si la cohorte tiene sesión de refuerzo en la semana 1, este es el recorrido sugerido.

| Min | Qué hace el mentor | Qué hacen los alumnos | Archivo |
|---|---|---|---|
| 0–5 | Presenta la fórmula: modelo + MCP + skill | Escuchan | `README.md` |
| 5–15 | Acto 1: el modelo razona bien, pero no puede ver la base | Lo repiten | Guía, Acto 1 |
| 15–30 | Acto 2: registra el MCP, lista los tickets, clasifica uno con criterio genérico | Registran el MCP en su herramienta | Guía, Acto 2 y Anexo D |
| 30–45 | Acto 3: agrega la skill y corre el triage completo | Corren el triage | Guía, Acto 3 |
| 45–55 | Verifica en Supabase y compara contra la lista esperada | Verifican y comparan | Guía, cierre |
| 55–60 | Explica la tarea: cambiar una regla y entregar `nivelacion/triage.md` | Anotan dudas | `README.md` |

## Demo
Todo en Claude Code, la herramienta de referencia.

1. `claude --model haiku` y las dos preguntas del Acto 1.
2. `claude mcp add supabase ...` (Acto 2), `claude mcp list` y `/mcp` dentro del chat para mostrar las herramientas nuevas.
3. "Clasifica el ticket 3 por criticidad" sin la skill, para mostrar el criterio genérico.
4. Copia la skill a `.agents/skills/` y `.claude/skills/`, y pide "Haz el triage de los tickets de soporte pendientes".
5. Muestra en el Table Editor de Supabase que los campos cambiaron.

Plan B si algo falla en vivo:
- El MCP no conecta: crea la tabla y carga los datos con `setup-tickets.sql` desde el SQL Editor, y muestra el Acto 3 con capturas.
- El proyecto de Supabase está pausado: los proyectos del plan gratuito se pausan por inactividad. Reactívalo desde el dashboard (tarda uno o dos minutos) o usa un proyecto de respaldo.

## Conceptos clave
1. **El modelo ya sabe pensar; le faltan manos.** El Acto 1 muestra que el razonamiento es bueno, pero sin herramientas no actúa.
   Pregunta: "¿Por qué el agente no pudo revisar los tickets en el Acto 1, si sí supo clasificar el ejemplo?"
2. **MCP da acceso, no criterio.** Con MCP el agente actúa, pero clasifica con criterio genérico.
   Pregunta: "¿Qué ticket clasificó distinto el agente sin la skill, y por qué?"
3. **La skill es el criterio del negocio, versionado.** El error intermitente que hace perder ventas queda en ALTA por la regla, no por el modelo.
   Pregunta: "Si mañana otra persona corre el triage, ¿qué garantiza que lo haga igual?"
4. **Aprobación humana y mínimo privilegio.** `--project-ref` limita el acceso a un proyecto; las aprobaciones mantienen al humano en control; `--read-only` es el punto de partida en un sistema real.

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| `npx: command not found` o el MCP no arranca | Falta Node.js o la terminal no lo encuentra | Volver a `verificar-entorno.sh` de la Nivelación 1 |
| El MCP conecta, pero da error de autenticación | Token mal copiado, vencido o revocado | Generar un token nuevo en Supabase y volver a registrar el MCP |
| El agente no encuentra la tabla `tickets` | `--project-ref` apunta a otro proyecto, o el Anexo B no se completó | Revisar el *project ref* en la URL del dashboard y verificar la tabla en el Table Editor |
| El triage no aplica las reglas de la skill | La skill no está en la carpeta que lee su herramienta | Claude Code: `.claude/skills/triage-tickets/SKILL.md`. Las demás: `.agents/skills/triage-tickets/SKILL.md`. Si sigue sin activarse, invocarla a mano (Anexo D) |
| Los tickets no cambian de estado | El alumno rechazó los UPDATE al aprobar, o el agente no los ejecutó | Repetir y aprobar las operaciones; revisar que la skill pida el UPDATE |
| No hay tickets pendientes al repetir | Ya están clasificados | Rebobinar con el prompt del Anexo B.4 o con `reset-tickets.sql` |
| El token quedó en un archivo del repo | Configuró el MCP en un archivo del proyecto | Revocar el token de inmediato, quitarlo del archivo y configurarlo a nivel de usuario (Anexo D.1) |

## Preguntas frecuentes
- **¿Puedo hacerlo con otra base de datos?** Sí, el patrón es el mismo, pero la guía y el soporte están pensados para Supabase.
- **¿Por qué Haiku?** Para esta tarea basta un modelo rápido y económico. Es una buena práctica elegir el modelo según la tarea.
- **Uso otra herramienta y no encuentro cómo registrar el MCP.** El Anexo D trae la configuración. Si sigue sin funcionar, la recomendación es hacer este ejercicio en Claude Code, donde el soporte es garantizado.

## Qué se adapta y qué no
- Fijo: los tres actos en orden, la skill con sus reglas y la verificación en la base de datos
- Libre: los ejemplos de preguntas en el Acto 1 y qué regla sugieres cambiar en la tarea

## Cierre y refuerzo
- Recuerda que `nivelacion/triage.md` se entrega antes de la Estación 1 y que no deben subir el token
- Pide que revoquen su token de Supabase al terminar si ya no lo usarán

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
