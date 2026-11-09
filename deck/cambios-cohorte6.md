# Deck · Cambios para la Cohorte 6

Texto corregido, slide por slide, para actualizar el deck comercial *AI For Developers by 30X* (versión de la Cohorte 4, 12 slides) con lo que cambia en la Cohorte 6. El deck de la Cohorte 6 tiene **11 slides**: se quita la del equipo y la de inversión ya no muestra precio.

**El deck ya aplicado está en [`ai-for-devs-deck-cohorte6.pdf`](ai-for-devs-deck-cohorte6.pdf)**, con el mismo diseño. Se genera con `python3 deck/generar-deck.py deck/ai-for-devs-deck-cohorte6.pdf` (requiere `pip install weasyprint`); para cambiar un texto, edita el script y vuelve a generarlo. Los datos sin definir salen como "por confirmar".

Los datos que aún no están definidos aparecen como **[PENDIENTE: …]**. La lista completa está al final, seguida de una tabla que traza cada promesa del deck al material del repo.

Revisado contra el repo el 9 de noviembre de 2026 (PRs #26 a #31).

## Resumen de cambios

| Cambio | Slides |
|---|---|
| Cohorte 4 → Cohorte 6, con fechas pendientes | 4, 5, 6, 11, 12 |
| Sin instructores ni mentores con nombre: los mentores rotan entre estaciones | 3, 5, 6, 7, 11 |
| Se quita la slide del equipo | 7 |
| Sin precio ni descuentos por volumen, para no crear confusiones | 11 |
| Nivelación con diagnóstico y dos tracks | 2, 5 |
| Todas las estaciones con el contenido y el entregable que tiene el repo | 5, 6 |
| Cualquier coding agent permitido, con Claude Code como referencia | 4, 5, 8 |
| Herramientas que de verdad se practican | 8 |
| Demo Day como sesión de presentaciones con video | 6, 11 |

---

## Slide 1 · Portada
Sin cambios.

## Slide 2 · El reto

| Elemento | Actual | Nuevo |
|---|---|---|
| Línea sobre el punto de partida | Diseñado para cualquier punto de partida: con o sin experiencia previa usando AI para programar. | Diseñado para cualquier punto de partida: un diagnóstico inicial ubica a cada participante en un track base o avanzado, con o sin experiencia previa usando AI para programar. |

**Por qué:** la Nivelación 1 incluye un diagnóstico que asigna track.

## Slide 3 · AI-DLC

| Elemento | Actual | Nuevo |
|---|---|---|
| Pie de la slide | 12 estaciones · 4 instructores expertos · 1 producto real construido end-to-end. | 12 estaciones · un equipo de mentores expertos · 1 producto real construido end-to-end. |

**Por qué:** las estaciones ya no están atadas a un instructor.

## Slide 4 · Metodología

| Elemento | Actual | Nuevo |
|---|---|---|
| Pilar 04, Ingeniería Agéntica | Su equipo aprende a orquestar agentes de AI para escribir, revisar, probar y desplegar código. No es vibe coding improvisado: es ingeniería real con frameworks y calidad garantizada. | Su equipo aprende a orquestar agentes de AI para escribir, revisar, probar y desplegar código, con la herramienta que ya usa: Claude Code, Cursor, Codex, Antigravity o GitHub Copilot. No es vibe coding improvisado: es ingeniería real con frameworks y calidad garantizada. |
| Línea de la cohorte | Cohorte 4 — agosto/octubre 2026 · 60 cupos por cohorte · 100% online en vivo. | Cohorte 6 — **[PENDIENTE: meses]** · **[PENDIENTE: cupos]** por cohorte · 100% online en vivo. |

**Por qué:** los ejercicios funcionan con cualquiera de las cinco herramientas; las demos y el soporte garantizado son en Claude Code.

## Slide 5 · Calendario, semanas 1 a 4

| Elemento | Actual | Nuevo |
|---|---|---|
| Título de la sección | CALENDARIO C4 · SEMANAS 1 A 4 | CALENDARIO C6 · SEMANAS 1 A 4 |
| Subtítulo | 12 estaciones intensivas dictadas por 4 instructores expertos. Sesiones de 2 horas, martes y jueves 7-9pm Bogotá. | 12 estaciones intensivas con un equipo de mentores expertos. Sesiones de 2 horas, **[PENDIENTE: días y horario]**. |
| Fechas de cada semana | 18–20 agosto 2026, 25–27 agosto, etc. | **[PENDIENTE: fechas de la Cohorte 6]** |
| Semana 1 | Diagnóstico de nivel técnico, configuración de herramientas y accesos, y nivelación de fundamentos antes de iniciar las estaciones en vivo. 100% asincrónico, a su propio ritmo. | Nivelación 1: entorno de trabajo, repo personal desde la plantilla del programa y diagnóstico que asigna track base o avanzado. Nivelación 2: primer agente con MCP y Skills. 100% asincrónico, a su propio ritmo. |
| E1, instructores | Danny Bravo · Andrés Bilbao · Andrés Caicedo | *(quitar)* |
| E1, entregable | Product Vision Board | Product Vision Board (o Internal Solution Brief para productos internos) |
| E2, instructor | Danny Bravo | *(quitar)* |
| E2, entregable | PRD (Product Requirements Document) | PRD con métricas de éxito y criterios de evaluación del agente |
| E3, título | Herramientas agénticas en práctica | Harness engineering y walking skeleton |
| E3, instructor | Carlos Alarcón | *(quitar)* |
| E3, descripción | Setup de Claude Code, MCPs, Skills y Antigravity. Configuración del agentic harness profesional. | Instrucciones (AGENTS.md), skills, MCP, hooks y subagentes con la herramienta de su preferencia. Primer despliegue del producto con CI desde la semana 3. |
| E3, entregable | Entorno de coding agéntico operativo | Walking skeleton desplegado: URL pública con agente, tests y CI |
| E4, instructor | Christian Braatz | *(quitar)* |
| E4, descripción | AI-DLC Inception, DDD estratégico, BDD y especificaciones como código. | Fase Inception de AI-DLC 2: requerimientos, historias con escenarios Gherkin, diseño de dominio y unidades de trabajo, con arquitectura C4, NFRs y ADR. Cada etapa la aprueba el participante, no el agente. |
| E4, entregable | Especificación técnica del producto | Especificación técnica: Inception aprobada, escenarios Gherkin y arquitectura |
| E5, instructor | Christian Braatz | *(quitar)* |
| E5, descripción | AI-DLC Construction, ADR, TDD con asistencia AI y arquitectura desacoplada. | Fase Construction de AI-DLC 2: diseño funcional, NFRs, decisiones en formato MADR y TDD, hasta la primera unidad en producción. |
| E5, entregable | MADR + plan técnico de implementación | MADR + primera unidad implementada con tests en CI |
| E6, título | Implementando: Orquestación y taxonomía | Del spec al plan de implementación |
| E6, instructor | Leonardo González | *(quitar)* |
| E6, descripción | Orquestación de agentes, taxonomía model/agent y agentic UX para flujos en paralelo. | Del diseño a un plan completo de tareas con criterios de aceptación y dependencias, listo para que lo ejecuten agentes. |
| E6, entregable | Implementación inicial del producto | Plan de tareas completo publicado en Linear |

**Por qué:** E3 cambia de enfoque (el setup pasa a la Nivelación 1 y el código empieza en la semana 3). E4 y E5 usan AI-DLC 2. E6 entrega un plan de tareas, no una implementación; la taxonomía de agentes y la ejecución viven en E7.

## Slide 6 · Calendario, semanas 5 a 7

| Elemento | Actual | Nuevo |
|---|---|---|
| Título de la sección | CALENDARIO C4 · SEMANAS 5 A 7 | CALENDARIO C6 · SEMANAS 5 A 7 |
| Subtítulo | Sesiones de 2 horas, martes y jueves 7-9pm Bogotá. Todas quedan grabadas. | Sesiones de 2 horas, **[PENDIENTE: días y horario]**. Todas quedan grabadas. |
| Fechas de cada semana | 15–17 septiembre 2026, etc. | **[PENDIENTE: fechas de la Cohorte 6]** |
| E7, título | Agentes de código + OpenSymphony | Orquestación de agentes de código |
| E7, instructor | Leonardo González | *(quitar)* |
| E7, descripción | Integración con Linear, control y evaluación de agentes, OpenSymphony para coordinar workflows complejos. | Taxonomía de agentes, OpenSymphony y Linear para despachar, revisar e integrar tareas en paralelo. |
| E7, entregable | Pipeline de coding agents en producción | Al menos tres tareas del plan cerradas por agentes, con revisión de un agente y de una persona |
| E8, instructor | Andrés Caicedo | *(quitar)* |
| E8, descripción | QA agéntico con Playwright, técnica Persona+Juez para tests end-to-end automatizados. | QA agéntico con Playwright y la técnica Persona + Juez con golden datasets. Las evaluaciones del agente bloquean el merge en CI. |
| E8, entregable | Suite de pruebas E2E completa | Suite E2E, BDD y de API + evaluación del agente como gate en CI |
| E9, instructor | Andrés Caicedo | *(quitar)* |
| E9, descripción | Terraform, Docker, GitHub Actions. Infraestructura como código y despliegue real del producto a la nube. | Terraform para AWS y la plataforma de la app, pruebas locales con LocalStack y un pipeline sin llaves (OIDC): plan revisado en cada PR, apply y deploy al fusionar. |
| E10, instructor | Leonardo González | *(quitar)* |
| E10, descripción | OWASP, SAST/DAST/SCA, disaster recovery y validación de cumplimiento. | Riesgos de los agentes (OWASP Top 10 for Agentic Applications) y modelo de amenazas, SAST, IaC y dependencias en el pipeline (Semgrep, npm audit, Dependabot, gitleaks), red team contra el propio agente y runbook de recuperación. |
| E10, entregable | Reporte de seguridad del producto | Reporte de seguridad con al menos un hallazgo cerrado y verificado |
| E11, instructor | Andrés Caicedo | *(quitar)* |
| E11, descripción | OpenTelemetry, dashboards técnicos y de negocio, pruebas con k6 y preparación del pitch. | OpenTelemetry para aplicaciones y agentes (convenciones `gen_ai.*`), dashboard como código, pruebas de carga con k6 y costo por conversación: la cifra que cada participante lleva a su presentación. |
| E11, entregable | Dashboard de monitoreo + pitch preparado | Dashboard de monitoreo + prueba de carga + costo por conversación |
| E12, responsables | Danny Bravo + founders 30X | *(quitar)* |
| E12, descripción | Pitch del producto ante pares, evaluadores y founders invitados. Video de 3 minutos + presentación en vivo. | Cada participante presenta el producto que construyó durante el programa. Todos entregan un video de su presentación. |
| E12, entregable | Producto presentado ante la red 30X | Producto presentado ante la cohorte + video |
| Título de la slide | QA, despliegue, seguridad y Demo Day ante founders. | QA, despliegue, seguridad y Demo Day. |

**Por qué:** el Demo Day es una sesión de presentaciones sin evaluadores; el mentor coordina para que presenten todos los que se pueda, y el video respalda a quien no alcance. E11 ya no ensaya el pitch en clase: aporta la cifra de costo y el dashboard que se usan en la presentación, y el speech se prepara con la guía de E12.

## Slide 7 · Equipo
**Se quita la slide completa.** Los mentores rotan entre estaciones, así que el deck no nombra a nadie ni asigna estaciones. Las demás slides hablan de "mentores expertos" sin nombres. Desde aquí, los números de este documento son los del deck de la Cohorte 4; en el deck nuevo cada slide baja uno (Herramientas pasa a ser la 7 y el Cierre, la 11).

## Slide 8 · Herramientas

| Categoría | Actual | Nuevo |
|---|---|---|
| Agentes de coding | Claude Code · GitHub Copilot · Cursor · Windsurf | Claude Code (referencia) · Cursor · Codex · Antigravity · GitHub Copilot |
| Testing y QA | Playwright · BDD · Checkly · k6 · Lighthouse CI | Playwright · BDD con Gherkin · Persona + Juez · Golden datasets · k6 |
| Seguridad | SonarQube · OWASP ZAP · Dependabot · Secret Scan | Semgrep · npm audit · Dependabot · gitleaks · Red team del agente |
| Observabilidad | OpenTelemetry · ELK Stack · Sentry · Datadog | OpenTelemetry (`gen_ai.*`) · Grafana · Tempo · Loki · Prometheus |
| CI/CD e Infra | GitHub Actions · IaC (Terraform) · Docker | GitHub Actions con OIDC · Terraform · Docker · LocalStack · Vercel |
| Orquestación AI | MCP Servers · Skills · Workflows paralelos | AGENTS.md · Skills · MCP · AI-DLC 2 · OpenSymphony + Linear |

**Por qué:** el slide nombraba herramientas sin práctica en el material (Windsurf, Checkly, Lighthouse CI, SonarQube, OWASP ZAP, Sentry, Datadog, ELK) y omitía las que sí se usan. Dependabot se queda porque E10 lo configura. Cada herramienta del slide nuevo tiene un ejercicio en el repo (ver la trazabilidad al final).

Pie de la slide: *"Su equipo sale del programa con un stack profesional y criterio para elegirlo"* se mantiene. Cambiar *"Cada estación practica con la herramienta correcta — no demos superficiales."* por *"Cada herramienta de esta página tiene un ejercicio en el programa; los participantes usan el coding agent que ya conocen."*

## Slide 9 · Antes / después
Sin cambios de texto. Nota: el "reporte detallado por participante" depende del semáforo semanal y las rúbricas del issue #5.

## Slide 10 · Retorno de inversión

| Elemento | Actual | Nuevo |
|---|---|---|
| Subtítulo | Resultados concretos que observamos en C1 y C2 cuando los participantes vuelven a sus equipos. | Resultados concretos que observamos en cohortes anteriores cuando los participantes vuelven a sus equipos. |
| Pie | Inversión recuperada en los primeros 2-3 meses de aplicación post-programa. | *(quitar: sin precio en el deck, la cifra no tiene contra qué compararse)* |

**Por qué:** si hay datos de las cohortes 3 a 5, conviene citarlos.

## Slide 11 · Inversión

| Elemento | Actual | Nuevo |
|---|---|---|
| Lo que recibirá, línea 2 | 12 estaciones en vivo con 4 instructores expertos | 12 estaciones en vivo con un equipo de mentores expertos |
| Lo que recibirá, línea 5 | Demo Day ante founders de la red 30X | Demo Day: presentación del producto ante la cohorte |
| Duración | 7 semanas · 18 de agosto – 1 de octubre 2026 | 7 semanas · **[PENDIENTE: fechas de la Cohorte 6]** |
| Sesiones en vivo | 12 estaciones · martes y jueves, 7-9pm COT. Todas quedan grabadas. | 12 estaciones · **[PENDIENTE: días y horario]**. Todas quedan grabadas. |
| Modalidad | 100% online en vivo, cupos limitados a 60 por cohorte. | 100% online en vivo, cupos limitados a **[PENDIENTE: cupos]** por cohorte. |
| Introducción | Compare el costo de AI For Developers con el costo de no hacer nada: … | Compare lo que su equipo recibe con el costo de no hacer nada: … |
| Beneficios corporativos | Descuentos por volumen, facturación empresarial y reporte de resultados por participante. | Facturación empresarial y reporte de resultados por participante. |
| Bloque oscuro de inversión | INVERSIÓN POR PARTICIPANTE · USD 1,500 · descuentos por volumen para grupos de 3+, 5+ y 10+ | PARA SU ORGANIZACIÓN · Un programa a la medida de su equipo: facturación empresarial y soporte administrativo dedicado, reporte de resultados por participante y personalización del producto a un proyecto real de su organización |

**Por qué:** el precio y los descuentos se quitan del deck para no crear confusiones; se comunican en la reunión de consultoría.

## Slide 12 · Cierre

| Elemento | Actual | Nuevo |
|---|---|---|
| Cohorte | COHORTE 4 | COHORTE 6 |
| Fechas | Inicio: 18 de agosto 2026 · Demo Day: 1 de octubre 2026 | Inicio: **[PENDIENTE]** · Demo Day: **[PENDIENTE]** |
| Ventas y cupos | Cierre de ventas: 14 de agosto · Cupos: 60 por cohorte · 100% online en vivo | Cierre de ventas: **[PENDIENTE]** · Cupos: **[PENDIENTE]** por cohorte · 100% online en vivo |

---

## Pendientes por definir

| Dato | Slides |
|---|---|
| Fechas de inicio, de cada semana, del Demo Day y de cierre de ventas | 4, 5, 6, 11, 12 |
| Días y horario de las sesiones | 5, 6, 11 |
| Cupos por cohorte | 4, 11, 12 |
| Cohortes con datos de resultados | 10 |

---

## Trazabilidad: lo que promete el deck y dónde está en el repo

Cada estación del deck tiene material que entrega lo que promete. Si una fila cambia en el repo, actualízala aquí y en el deck.

| Slide | Promesa | Dónde está |
|---|---|---|
| 2, 5 | Diagnóstico y track base o avanzado | `nivelacion1/` (diagnóstico y asignación de track) |
| 5 | Nivelación con primer agente con MCP y Skills | `nivelacion2/` |
| 5 | E1 · Product Vision Board | `estacion1/` (plantillas de PVB e ISB, demo de SkillWall Live) |
| 5 | E2 · PRD con métricas y evaluación del agente | `estacion2/` (ejemplo de EntreVista AI en `specs/prd.md`) |
| 5 | E3 · Walking skeleton desplegado | `estacion3/repos/walking-skeleton/`, `plantilla-alumno/` |
| 5 | E4 · Inception con AI-DLC 2 | `estacion4/` (runbook), `ejemplos/entrevista-ai/` |
| 5 | E5 · MADR + primera unidad con tests en CI | `estacion5/` (runbook con la plantilla MADR) |
| 5 | E6 · Plan de tareas en Linear | `estacion6/` (skill `create-implementation-plan`, prompts) |
| 6 | E7 · Tareas cerradas por agentes | `estacion7/` (rutas OpenSymphony y manual, `conceptos.md`) |
| 6 | E8 · Suite E2E + Persona + Juez como gate | `estacion8/repos/entrevista-qa/` |
| 6 | E9 · Producto en la nube con IaC y pipeline | `estacion9/repos/producto-desplegado/` (ruta del programa), `estacion9/repos/iac-infra/` (solo AWS) |
| 6 | E10 · Reporte de seguridad | `estacion10/repos/producto-seguro/` (controles, modelo de amenazas, red team, DR) |
| 6 | E11 · Dashboard + k6 + costo | `estacion11/repos/entrevista-obs/`, `estacion11/repos/otel-stack/` |
| 6 | E12 · Presentación + video | `estacion12/` |
| 4, 8 | Cualquier coding agent, Claude Code de referencia | README de la raíz (convención), tablas de equivalencias de cada estación, `mcp/README.md` de los repos de referencia |
| 9, 11 | Reporte de resultados por participante | Rúbricas en `rubricas/`, Juez en `plantilla-alumno/.github/workflows/juez.yml`, semáforo en `scripts/semaforo.mjs` |
| 3, 11 | Cualquier mentor puede impartir cualquier estación | `MENTOR.md` de cada estación (falta el ensayo por otro mentor, issue #13) |

