# Antes de estación 7: prepara todas las tareas

**Cuándo:** entre la Estación 6 y la 7. **Tiempo orientativo:** 75–105 minutos; depende del tamaño y madurez de tu proyecto. Continúa el paquete iniciado en clase y entrégalo en un pull request con la etiqueta `estacion-6` antes de la Estación 7.

Prepara todas las tareas necesarias para implementar el alcance definido de tu proyecto en estaciones 4 y 5. Usa la skill de OpenSymphony `create-implementation-plan` para generar y revisar el paquete completo. En la Estación 7 verás cómo despachar tareas por dependencias y despacharás la primera de tu plan. No es necesario implementar nada antes de clase. Si te falta tu diseño, usa los artefactos de EntreVista AI en [`ejemplos/entrevista-ai/`](../ejemplos/entrevista-ai/); el validador de contraseña es solo una muestra del formato.

## 1. Revisa el mapa (5 minutos)

El **modelo** interpreta y propone. El **arnés** le permite leer, editar y ejecutar con permisos. Una **skill** aporta un procedimiento reutilizable. Un **hook** reacciona a un evento del arnés. El **orquestador** coordina tareas, dependencias y estados. La **evidencia** permite revisar el resultado.

Nuestro recorrido será: tarea lista → ejecución → pruebas → revisión → merge autorizado. Un agente puede terminar una ejecución sin haber resuelto la tarea. La revisión de código y las pruebas deben confirmar el resultado.

## 2. Comprueba tus herramientas (10–15 minutos)

Mantén el coding agent que ya usas en el curso (lo instalaste en la [Nivelación 1](../nivelacion1/README.md)). Comprueba que puedes abrir tu repositorio, hacer una consulta sobre un archivo y ejecutar un comando con tu cuenta autenticada. No necesitas instalar varios.

Registra el nombre y la versión de tu herramienta (`claude --version` en Claude Code).

Comprueba Git con `git --version`; si falta, usa [Git para tu sistema](https://git-scm.com/install/). Abre una terminal en tu proyecto y ejecuta `git status`. Debe reconocer el repositorio. No borres cambios existentes para dejarlo limpio.

En **GitHub**, inicia sesión y confirma que puedes acceder al repo donde trabajarás y crear una rama/PR. En **Linear**, usa un workspace propio (el plan gratuito permite 250 issues y dos equipos, así que uno compartido por la cohorte se llena) y confirma que puedes crear y editar una tarea. Para publicar desde tu agente, configura el [MCP de Linear](https://linear.app/docs/mcp) (`https://mcp.linear.app/mcp`); si no, la interfaz web sirve.

**Smoke test del arnés:** pide «Lee el README y las instrucciones de este repo; dime el objetivo y el comando de pruebas, citando los archivos. No modifiques nada». Comprueba tú las referencias.

## 3. Genera el plan completo con la skill (35–50 minutos)

La [skill create-implementation-plan](../estacion6/skills/create-implementation-plan/SKILL.md) está incluida en el material. Copia su carpeta a `.agents/skills/` de tu repo y corre `npm run sync-skills`: así la encuentra cualquier herramienta. No necesitas instalar OpenSymphony para usarla.

Trabaja en la raíz de tu proyecto, en una rama `estacion-6`. Tus artefactos están en `specs/` (PRD, arquitectura y ADRs) y en `aidlc/spaces/default/intents/<tu-intención>/` (Inception y Construction de AI-DLC). Envía este prompt:

```text
Usa la skill create-implementation-plan para preparar TODAS las tareas
necesarias para implementar el alcance aprobado de mi proyecto.
Lee primero specs/, los artefactos de AI-DLC en aidlc/ (sobre todo las unidades
de trabajo y el plan de entrega) y el estado actual del repo.
No limites el plan a una feature ni a una tarea de muestra.
La arquitectura ya está en specs/arquitectura.md: no crees docs/architecture.md
y no reescribas AGENTS.md; si propones cambios, déjalos como sugerencia.

Crea docs/tasks/task-package.yaml, docs/tasks/milestones.md y un archivo
Markdown por tarea con el frontmatter y las secciones exigidos por la skill.
Organiza milestones, dependencias, prioridades y criterios de aceptación.
Incluye integración, pruebas y el trabajo de calidad, seguridad y despliegue
que el alcance requiera. No agregues funcionalidades fuera del spec.

Comprueba cobertura: cada requisito debe apuntar a tareas o a evidencia
de que ya está implementado. Registra esto en docs/tasks/cobertura.md.
Explicita vacíos y decisiones pendientes; no inventes requisitos.
Si hay incertidumbre, incluye una tarea para resolverla y bloquea las
dependientes. Respeta la identidad de tareas y waves ya publicadas.

Valida archivos, IDs, referencias, milestones y ausencia de ciclos.
No implementes ni publiques todavía. Entrega el paquete para mi revisión.
```

El entregable incluye:

- `docs/tasks/task-package.yaml`: inventario completo y canónico de tareas de la ronda de planificación.
- `docs/tasks/milestones.md`: objetivos y orden de los hitos.
- Un Markdown por tarea: alcance, entregables, aceptación, plan de pruebas, contexto y Definition of Ready.
- `docs/tasks/cobertura.md`: tabla requisito → tareas / evidencia existente / vacío pendiente. Es un complemento de esta actividad, no un campo nuevo del manifest.

Revisa que no falte ninguna parte del alcance. Un paquete completo puede contener tareas bloqueadas; solo las que tienen dependencias y decisiones resueltas están listas para ejecutar. Si tu proyecto ya tiene tareas, conserva IDs y evita duplicados.

## 4. Revisa cobertura y dependencias (10–15 minutos)

Pide al agente una segunda pasada de revisión del paquete y comprueba tú sus conclusiones:

- Todos los requisitos del alcance están representados.
- Cada archivo del manifest existe y cada ID es único.
- Milestones, dependencias y padres apuntan a entradas válidas; el grafo no tiene ciclos.
- Cada tarea tiene aceptación observable y un plan de validación concreto.
- Hay tareas iniciales ejecutables; los bloqueos restantes están explícitos.

Ejecuta la validación disponible del repo y registra el resultado actual. No inventes pruebas exitosas. Si no existe runner, incluye su preparación como tarea y expresa las dependencias correspondientes. Mantén contexto y decisiones en los archivos existentes de tu proyecto; no reemplaces los archivos de AI-DLC.

## 5. Prepara la publicación en Linear (10 minutos)

Revisa primero el paquete completo. `create-implementation-plan` genera el plan; la publicación es un paso separado. Con `convert-tasks-to-linear`, si lo tienes disponible, valida el paquete y revisa el dry-run antes de autorizar la publicación en el equipo y proyecto correctos.

También puedes publicarlo desde tu agente con el MCP de Linear o por la interfaz web. Mantén correspondencia entre IDs locales e issues reales, milestones y dependencias. No publiques de nuevo tareas ya existentes. Usa un proyecto de preparación sin despacho automático activo: publicar en un proyecto observado por un orquestador puede iniciar trabajo.

Si faltan acceso, integración o tiempo de publicación, entrega el paquete completo validado y registra «publicación pendiente». Ese bloqueo no justifica reducirlo a una tarea. La importación puede resolverse en E7.

## 6. Entrega (5 minutos)

Abre un pull request con la etiqueta `estacion-6` (ver la [guía de la Estación 6](../estacion6/README.md#entregable)) con:

- Manifest, milestones y **todos** los archivos de tareas, más la tabla de cobertura.
- En la descripción: resultado de la revisión del grafo, enlace al proyecto de Linear con la correspondencia de IDs (o el bloqueo de publicación), herramienta utilizada, comando de validación con su resultado real (sin credenciales), primera tarea ejecutable y una pregunta para clase.

**El plan está preparado** cuando cubre todo el alcance y permite decidir qué ejecutar primero y qué debe esperar. **Necesitas apoyo** si quedan requisitos sin descomponer o decisiones que impiden planificar. Reporta sistema operativo, paso, comando y error exacto después de 10 minutos de bloqueo de instalación.

## Qué haremos en estación 7

Veremos los patrones de coordinación de agentes y una demo de OpenSymphony: despacho, revisión por agentes, integración de una tarea revisada y los grafos de tareas y memoria. Después despacharás la primera tarea de tu plan, con OpenSymphony o a mano con tu agente (ver la [guía de la Estación 7](README.md)).

Instalar OpenSymphony es opcional. Si quieres usarlo en clase, llega con Rust 1.97.1 o más nuevo y `cargo install opensymphony` terminado; tarda en compilar.

## Recursos y profundización opcional

Consulta la [lista de recursos de estaciones 6 y 7](../estacion6/recursos.md). Para la preparación, necesitas especialmente `create-implementation-plan`; `convert-tasks-to-linear` y `linear` corresponden al paso de publicación y operación en Linear.

Lee [persistencia y compaction](https://openai.com/index/how-two-settings-tripled-our-arc-agi-3-scores/) y responde: ¿qué decisiones perderías si reiniciaras tu sesión? Mira [hooks](https://code.claude.com/docs/en/hooks-guide) y propone un evento y una acción verificable. Estas lecturas no añaden instalaciones obligatorias.
