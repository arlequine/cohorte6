"""Genera el deck de la Cohorte 6 (A4 vertical, mismo diseño que el de la Cohorte 4) con WeasyPrint."""
import sys
from weasyprint import HTML

POR_CONFIRMAR = "por confirmar"

CSS = r"""
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Nimbus Sans", "Liberation Sans", Arial, sans-serif; color: #111; font-size: 8.4pt; line-height: 1.45; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; background: #fff; }
.page:last-child { page-break-after: auto; }
.lima { color: #c6f432; }
.verde { color: #7ea51d; }
.band { background: #0d0d0d; color: #fff; height: 57mm; padding: 9mm 14mm 0 14mm; position: relative; }
.band .kicker { color: #c6f432; font-size: 6.6pt; font-weight: 700; letter-spacing: 2.2pt; text-transform: uppercase; }
.band h1 { font-size: 16pt; line-height: 1.2; font-weight: 700; margin-top: 2.5mm; width: 115mm; }
.band .sub { color: #bdbdbd; font-size: 7.4pt; margin-top: 3.5mm; width: 105mm; }
.band .logo { position: absolute; top: 8mm; left: 142mm; font-weight: 700; font-size: 11pt; }
.band .big { position: absolute; right: 14mm; bottom: 8mm; white-space: nowrap; font-size: 27pt; font-weight: 700; letter-spacing: -0.3pt; }
.body { padding: 9mm 14mm 0 14mm; }
.foot { position: absolute; bottom: 7mm; left: 14mm; right: 14mm; font-size: 5.8pt; color: #9a9a9a; display: flex; justify-content: space-between; }
.dark .foot { color: #6a6a6a; }
.lead { font-size: 7.8pt; color: #333; margin-bottom: 6mm; width: 182mm; }
.grid2 { display: flex; flex-wrap: wrap; gap: 4mm; }
.card { border: 0.4mm solid #e2e2e2; border-radius: 2.5mm; padding: 4.2mm 4.5mm; width: 87mm; }
.card h3 { font-size: 8.4pt; font-weight: 700; margin-bottom: 1.6mm; }
.card p { color: #555; font-size: 7.1pt; }
.card .ico { width: 5.5mm; height: 5.5mm; margin-bottom: 2mm; }
.card.wide { width: 178mm; }
.strong { font-weight: 700; font-size: 7.6pt; margin-top: 6mm; }
.note { font-size: 7.2pt; color: #444; margin-top: 4mm; }
.boxed { border: 0.6mm solid #111; border-radius: 2.5mm; padding: 4.5mm 5mm; margin-top: 5mm; width: 182mm; }
.boxed h4 { font-size: 7.6pt; font-weight: 700; text-transform: uppercase; margin-bottom: 1.5mm; }
.boxed p { font-size: 7.1pt; color: #444; }
/* calendario */
.week { margin-bottom: 4.5mm; }
.week .wh { display: flex; align-items: center; gap: 2.5mm; margin-bottom: 2.2mm; }
.pill { background: #0d0d0d; color: #c6f432; font-weight: 700; font-size: 6.6pt; padding: 0.9mm 3mm; border-radius: 2mm; letter-spacing: 0.3pt; }
.week .wh span.t { font-size: 6.8pt; color: #555; }
.st { border: 0.4mm solid #e2e2e2; border-radius: 2.5mm; padding: 3.3mm 4mm; width: 87mm; min-height: 33mm; }
.st .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.4mm; }
.st .id { background: #0d0d0d; color: #fff; font-weight: 700; font-size: 6pt; padding: 0.5mm 2mm; border-radius: 1.5mm; }
.st .when { font-size: 5.9pt; color: #7ea51d; font-weight: 700; }
.st h3 { font-size: 8.1pt; font-weight: 700; margin-bottom: 1.2mm; }
.st p { font-size: 6.6pt; color: #555; }
.st .del { border-top: 0.3mm dashed #dcdcdc; margin-top: 2mm; padding-top: 1.5mm; font-size: 6.3pt; font-weight: 700; }
.solo { width: 178mm; min-height: 0; }
/* stack */
.tool h3 { margin-bottom: 1mm; }
.tool .names { font-weight: 700; font-size: 7pt; margin-bottom: 1.2mm; }
/* antes/después */
.ba { width: 182mm; }
.ba .hd { display: flex; justify-content: space-between; font-size: 6.2pt; letter-spacing: 1.6pt; color: #777; text-transform: uppercase; margin-bottom: 2mm; }
.ba .row { display: flex; align-items: center; border-bottom: 0.3mm solid #e4e4e4; padding: 3.2mm 0; }
.ba .l { width: 78mm; color: #888; font-size: 6.9pt; }
.ba .a { width: 12mm; text-align: center; color: #7ea51d; font-size: 10pt; }
.ba .r { width: 92mm; font-weight: 700; font-size: 7.1pt; }
/* ROI */
.kpi .num { font-size: 21pt; font-weight: 700; color: #7ea51d; line-height: 1.1; }
.kpi .cap { font-size: 6.2pt; color: #777; margin-bottom: 2mm; }
/* inversión */
.top30 { display: flex; justify-content: space-between; align-items: center; padding: 8mm 14mm 0 14mm; font-size: 9pt; font-weight: 700; }
.top30 .url { color: #7ea51d; font-size: 7pt; }
.cols { display: flex; gap: 10mm; padding: 12mm 14mm 0 14mm; }
.cols .left { width: 105mm; }
.cols .right { width: 67mm; }
.cols h2 { font-size: 13.5pt; line-height: 1.2; margin-bottom: 3.5mm; }
.cols .intro { font-size: 7.2pt; color: #555; margin-bottom: 6mm; }
.lab { font-size: 6.2pt; letter-spacing: 1.6pt; color: #777; text-transform: uppercase; margin-bottom: 2mm; }
.list div { border-bottom: 0.3mm dashed #d7d7d7; padding: 2.1mm 0; font-size: 7.1pt; }
.info { display: flex; gap: 3mm; margin-bottom: 4.5mm; }
.info svg { flex: none; width: 4.5mm; height: 4.5mm; margin-top: 0.3mm; }
.info b { display: block; font-size: 6.4pt; letter-spacing: 1pt; text-transform: uppercase; }
.info span { font-size: 6.8pt; color: #555; }
.benef { background: #0d0d0d; color: #fff; border-radius: 3mm; margin: 8mm 14mm 0 14mm; padding: 6mm 7mm; display: flex; gap: 8mm; }
.benef .t { width: 62mm; }
.benef .t .k { color: #c6f432; font-size: 6.6pt; letter-spacing: 2pt; font-weight: 700; text-transform: uppercase; }
.benef .t .h { font-size: 13pt; font-weight: 700; margin-top: 1.5mm; line-height: 1.2; }
.benef .items { border-left: 0.3mm solid #444; padding-left: 6mm; flex: 1; }
.benef .items div { border-bottom: 0.3mm solid #333; padding: 1.9mm 0; font-size: 6.9pt; }
/* portada y cierre */
.dark { background: #0d0d0d; color: #fff; }
.cover .hero { background: #0d0d0d; color: #fff; height: 224mm; text-align: center; padding-top: 17mm; position: relative; }
.brand { font-weight: 700; font-size: 11pt; line-height: 1; }
.brand small { display: block; color: #c6f432; font-size: 4.8pt; letter-spacing: 1.4pt; margin-top: 1mm; }
.cover h1 { font-size: 26pt; line-height: 1.25; margin-top: 30mm; }
.cover .icons { position: absolute; bottom: 26mm; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: 7mm; }
.cover .icons .sq { width: 19mm; height: 19mm; border: 0.6mm solid #444; border-radius: 4mm; display: flex; align-items: center; justify-content: center; }
.cover .icons .plus { color: #c6f432; font-size: 11pt; font-weight: 700; }
.cover .claim { text-align: center; font-weight: 700; font-size: 9.6pt; line-height: 1.4; padding: 13mm 26mm 0 26mm; }
.cover .nums { display: flex; justify-content: center; gap: 13mm; margin-top: 7mm; text-align: center; }
.cover .nums b { display: block; font-size: 15pt; }
.cover .nums span { font-size: 5.4pt; color: #555; }
.close { text-align: center; padding-top: 18mm; }
.close h1 { font-size: 15.5pt; line-height: 1.35; margin-top: 12mm; }
.close .co { background: #1c1c1c; border-radius: 2.5mm; margin: 9mm 24mm 0 24mm; padding: 4.5mm; }
.close .co .k { color: #c6f432; font-size: 6.4pt; letter-spacing: 2pt; font-weight: 700; }
.close .co .d { font-weight: 700; font-size: 8.4pt; margin-top: 1.4mm; }
.close .co .s { color: #9a9a9a; font-size: 6.2pt; margin-top: 1mm; }
.close .btn { display: inline-block; background: #c6f432; color: #111; font-weight: 700; font-size: 7.6pt; padding: 3.3mm 9mm; border-radius: 1.5mm; margin-top: 7mm; letter-spacing: 0.3pt; }
.close .mail { color: #c6f432; font-weight: 700; font-size: 7.4pt; margin-top: 5mm; }
.close .resp { color: #9a9a9a; font-size: 6.2pt; }
"""

def foot(n):
    return f'<div class="foot"><span>AI For Developers by 30X · Programa Corporativo</span><span>hardcoreai30x.online · {n}</span></div>'

def band(kicker, title, sub, big):
    return f'''<div class="band"><div class="kicker">— {kicker}</div><h1>{title}</h1><div class="sub">{sub}</div>
    <div class="logo">30<span class="lima">X</span></div><div class="big">{big}</div></div>'''

G = "#7ea51d"
def ico(path):
    return f'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="{G}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{path}</svg>'

pages = []

# 1 · Portada
pages.append(f'''<div class="page cover"><div class="hero"><div class="brand">30<span class="lima">X</span><small>AI FOR DEVELOPERS</small></div>
<h1>AI For Developers<br><span class="lima">by 30X</span></h1>
<div class="icons"><div class="sq"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c6f432" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 21 12 15 6"/><polyline points="9 6 3 12 9 18"/></svg></div>
<div class="plus">+</div><div class="sq"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#c6f432" stroke-width="2" stroke-linejoin="round"><path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z"/></svg></div></div></div>
<div class="claim">Un programa intensivo de 7 semanas que convierte a sus desarrolladores en referentes de Inteligencia Artificial dentro de su organización, con calidad y visión de producto.</div>
<div class="nums"><div><b>7</b><span>semanas</span></div><div><b>12</b><span>estaciones<br>en vivo</span></div><div><b>48+</b><span>horas</span></div><div><b>1</b><span>producto<br>real</span></div></div></div>''')

# 2 · El reto
pages.append(f'''<div class="page">{band("El reto","Su equipo de desarrollo enfrenta una transformación inevitable.","Cada trimestre sin actuar amplía la brecha frente a la competencia. Una conversación de 30 minutos basta para diagnosticar dónde está su equipo.","El Reto")}
<div class="body"><p class="lead">La Inteligencia Artificial está redefiniendo cómo se construye software. Las organizaciones que no preparen a sus equipos para este nuevo paradigma enfrentarán retrasos en entregas, pérdida de talento clave y una desventaja competitiva que se amplía cada trimestre.</p>
<div class="grid2">
<div class="card">{ico('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>')}<h3>01 · Productividad en riesgo</h3><p>Sus desarrolladores usan herramientas de AI sin metodología. El resultado: código frágil, deuda técnica acumulada y proyectos que tardan el doble de lo necesario.</p></div>
<div class="card">{ico('<line x1="4" y1="20" x2="20" y2="20"/><line x1="7" y1="16" x2="7" y2="11"/><line x1="12" y1="16" x2="12" y2="13"/><line x1="17" y1="16" x2="17" y2="14"/>')}<h3>02 · Talento clave que se estanca</h3><p>Sus mejores ingenieros están atrapados en ejecución de tickets sin contexto de producto. Sin crecimiento, empiezan a buscar oportunidades donde puedan evolucionar.</p></div>
<div class="card">{ico('<polyline points="3 3 3 21 21 21"/><polyline points="7 15 11 11 14 14 20 7"/>')}<h3>03 · Brecha de competitividad</h3><p>Mientras otras empresas ya implementan AI-driven development en su ciclo completo de software, cada mes sin actuar amplía la brecha frente a la competencia.</p></div>
</div>
<p class="strong">El problema no es la tecnología. Es no tener un método, herramientas y un proceso que asegure que su equipo adopte AI con criterio de ingeniería.</p>
<p class="note">Diseñado para cualquier punto de partida: un diagnóstico inicial ubica a cada participante en un track base o avanzado, con o sin experiencia previa usando AI para programar.</p>
</div>{foot(2)}</div>''')

# 3 · AI-DLC
etapas = [("01 · Descubrimiento","AI transcribe, resume y extrae requisitos automáticamente."),("02 · Especificación","PRDs y specs generados y validados con asistencia de AI."),
("03 · Diseño","Prototipos UI desde texto, arquitectura como código."),("04 · Implementación","Agentes de coding que escriben, revisan y testean en paralelo."),
("05 · QA semi-autónomo","Tests generados por AI, evaluación de agentes, detección de regresiones."),("06 · Deploy continuo","IaC, pipelines sin llaves y despliegue en cada merge.")]
cards = "".join(f'<div class="card"><h3>{t}</h3><p>{d}</p></div>' for t,d in etapas)
pages.append(f'''<div class="page">{band("La evolución","AI-DLC: Inteligencia Artificial en cada etapa del desarrollo.","Así es como las empresas líderes ya están construyendo software. Su equipo deja de improvisar con AI y empieza a operar con criterio de ingeniería.","AI-DLC")}
<div class="body"><p class="lead">El AI-DLC (AI-augmented Development Life Cycle) no reemplaza a sus desarrolladores: los potencia. Cada etapa del ciclo de software se acelera con agentes de AI que asisten, validan y automatizan las tareas repetitivas, liberando a su equipo para enfocarse en decisiones de alto valor.</p>
<div class="grid2">{cards}<div class="card wide"><h3>07 · Observabilidad 360°</h3><p>Trazas, métricas y logs de la aplicación y de sus agentes, con dashboards de latencia, tokens y costo por conversación.</p></div></div>
<p class="strong">Su equipo deja de improvisar con AI y empieza a operar con criterio de ingeniería.</p>
<p class="note">12 estaciones · mentores expertos · 1 producto real construido end-to-end.</p>
</div>{foot(3)}</div>''')

# 4 · Metodología
pil = [("01 · Mentalidad de Producto","Sus desarrolladores dejan de ser ejecutores de tickets para convertirse en profesionales que entienden el porqué de lo que construyen: métricas de negocio, experiencia de usuario y valor real para la organización."),
("02 · AI-DLC End-to-End","Dominio completo del ciclo de desarrollo aumentado por AI: desde la captura de requerimientos hasta el despliegue con observabilidad 360°. Cada etapa optimizada con las herramientas correctas."),
("03 · Especificación como Código","La documentación técnica deja de ser un documento olvidado en una wiki. PRDs, historias de usuario y decisiones de arquitectura viven en Markdown con trazabilidad directa al código."),
("04 · Ingeniería Agéntica","Su equipo aprende a orquestar agentes de AI para escribir, revisar, probar y desplegar código, con la herramienta que ya usa: Claude Code, Cursor, Codex, Antigravity o GitHub Copilot. No es vibe coding improvisado: es ingeniería real con frameworks y calidad garantizada.")]
cards = "".join(f'<div class="card"><h3>{t}</h3><p>{d}</p></div>' for t,d in pil)
pages.append(f'''<div class="page">{band("Metodología","Los 4 pilares que transforman a su equipo.","AI For Developers no es un curso teórico. Cada participante construye un producto real de principio a fin usando agentes de AI.","Metodología")}
<div class="body"><div class="grid2">{cards}</div>
<div class="boxed"><h4>Un programa integrado — cuatro piezas secuenciales</h4><p>Mentalidad de producto · AI-DLC · Especificación · Ingeniería agéntica. No se trabajan por separado: se integran en el orden en que se potencian. Cuando junta las cuatro, su equipo deja de improvisar con AI y empieza a operar un canal de entrega que trabaja para la organización.</p></div>
<p class="note">Cohorte 6 · fechas {POR_CONFIRMAR} · cupos limitados · 100% online en vivo.</p>
</div>{foot(4)}</div>''')

def est(i, titulo, desc, entregable):
    return f'<div class="st"><div class="top"><span class="id">E{i}</span><span class="when">Sesión en vivo · 2 h</span></div><h3>{titulo}</h3><p>{desc}</p><div class="del">Entregable: {entregable}</div></div>'

def semana(n, tema, contenido):
    return f'<div class="week"><div class="wh"><span class="pill">SEMANA {n}</span><span class="t">{tema}</span></div><div class="grid2">{contenido}</div></div>'

# 5 · Calendario 1–4
niv = '<div class="st solo"><h3>Semana de nivelación</h3><p>Nivelación 1: entorno de trabajo, repo personal desde la plantilla del programa y diagnóstico que asigna track base o avanzado. Nivelación 2: primer agente con MCP y Skills. 100% asincrónico, a su propio ritmo.</p></div>'
pages.append(f'''<div class="page">{band("Calendario C6 · Semanas 1 a 4","Construyen un producto real. De principio a fin.","12 estaciones intensivas con mentores expertos. Sesiones de 2 horas, dos por semana; días y horario por confirmar.","Curriculum")}
<div class="body">
{semana(1,"Nivelación",niv)}
{semana(2,"Descubrimiento y Definición", est(1,"Introducción y Demostración","Bienvenida, demostración de referencia del ciclo completo con agentes y presentación de la red 30X / Tribu iA.","Product Vision Board") + est(2,"Descubrimiento y Definición (PRD)","AI Strategic Lens, 3 Moats y descubrimiento acelerado con AI para establecer alcance, user journey y casos de uso.","PRD con métricas de éxito y evaluación del agente"))}
{semana(3,"Harness y Especificación", est(3,"Harness engineering y walking skeleton","Instrucciones (AGENTS.md), skills, MCP, hooks y subagentes con la herramienta de su preferencia. Primer despliegue del producto con CI.","Walking skeleton desplegado con CI") + est(4,"Diseñando el QUÉ con AI-DLC","Fase Inception de AI-DLC: requerimientos, historias con escenarios Gherkin, diseño de dominio, C4, NFRs y ADR.","Especificación técnica del producto"))}
{semana(4,"Arquitectura y Plan", est(5,"Diseñando el CÓMO con AI-DLC","Fase Construction de AI-DLC: diseño funcional, decisiones en formato MADR y TDD hasta la primera unidad en producción.","MADR + primera unidad con tests en CI") + est(6,"Del spec al plan de implementación","Del diseño a un plan completo de tareas con criterios de aceptación y dependencias, listo para que lo ejecuten agentes.","Plan de tareas publicado en Linear"))}
</div>{foot(5)}</div>''')

# 6 · Calendario 5–7
pages.append(f'''<div class="page">{band("Calendario C6 · Semanas 5 a 7","QA, despliegue, seguridad y Demo Day.","Sesiones de 2 horas, dos por semana; días y horario por confirmar. Todas quedan grabadas.","Curriculum")}
<div class="body">
{semana(5,"Agentes y Calidad", est(7,"Orquestación de agentes de código","Taxonomía de agentes, OpenSymphony y Linear para despachar, revisar e integrar tareas en paralelo.","Tareas del plan cerradas por agentes") + est(8,"Aseguramiento de Calidad","QA agéntico con Playwright y la técnica Persona + Juez con golden datasets. Las evaluaciones del agente bloquean el merge en CI.","Suite E2E + evaluación del agente en CI"))}
{semana(6,"Despliegue y Seguridad", est(9,"Despliegue (IaC)","Terraform, LocalStack y un pipeline sin llaves: plan revisado en cada PR, apply y deploy al fusionar.","Producto desplegado en la nube") + est(10,"Seguridad","Riesgos de los agentes (OWASP Agentic Top 10), SAST y dependencias en el pipeline, red team del propio agente y recuperación.","Reporte de seguridad con hallazgos cerrados"))}
{semana(7,"Observabilidad y Demo Day", est(11,"Observabilidad","OpenTelemetry para aplicaciones y agentes, dashboards técnicos y de negocio, pruebas de carga con k6 y costo por conversación.","Dashboard + prueba de carga") + est(12,"Demo Day","Cada participante presenta el producto que construyó durante el programa. Todos entregan un video de su presentación.","Producto presentado + video"))}
</div>{foot(6)}</div>''')

# 7 · Stack
tools = [("Agentes de Coding","Claude Code · Cursor · Codex · Antigravity · GitHub Copilot","Asistentes de AI que escriben, revisan y refactorizan código bajo dirección del desarrollador. Claude Code es la herramienta de referencia."),
("Testing y QA","Playwright · BDD con Gherkin · Persona + Juez · Golden datasets · k6","Pruebas end-to-end, evaluación de agentes con LLM y pruebas de carga."),
("Seguridad","Semgrep · npm audit · Dependabot · gitleaks · Red team del agente","Análisis estático, de infraestructura, de dependencias y de secretos integrado al pipeline."),
("Observabilidad","OpenTelemetry · Grafana · Tempo · Loki · Prometheus","Trazas, métricas y logs correlacionados, con tokens y costo por conversación del agente."),
("CI/CD e Infra","GitHub Actions · Terraform · Docker · LocalStack · Vercel","Pipelines con build, test, seguridad y deploy en cada merge, sin llaves de larga duración."),
("Orquestación AI","AGENTS.md · Skills · MCP · AI-DLC · OpenSymphony + Linear","Instrucciones, procedimientos y protocolos para que los agentes trabajen en paralelo de forma coordinada.")]
cards = "".join(f'<div class="card tool"><h3>{t}</h3><div class="names">{n}</div><p>{d}</p></div>' for t,n,d in tools)
pages.append(f'''<div class="page">{band("Herramientas","Ecosistema de herramientas estado del arte.","Su equipo aprende a usar profesionalmente las herramientas que están definiendo la industria. Frameworks y criterio, no atajos.","Stack")}
<div class="body"><div class="grid2">{cards}</div>
<p class="strong">Su equipo sale del programa con un stack profesional y criterio para elegirlo.</p>
<p class="note">Cada herramienta de esta página tiene un ejercicio en el programa; los participantes usan el coding agent que ya conocen.</p>
</div>{foot(7)}</div>''')

# 8 · Antes / después
rows = [("Desarrolladores que ejecutan tickets sin contexto de negocio","Ingenieros que entienden el porqué, aportan a producto y miden impacto"),
("Herramientas de AI usadas sin método: código frágil y deuda técnica","AI-DLC completo: cada etapa potenciada con las herramientas correctas"),
("Documentación desactualizada que nadie lee, desconectada del código","Specs como código: documentos vivos con trazabilidad directa a tests"),
("Equipos lentos, entregas que se retrasan y calidad inconsistente","Velocidad 3-5x con calidad: specs, tests automáticos y seguridad día uno"),
("Talento valioso que se siente estancado y empieza a buscar afuera","Profesionales que crecen dentro de su organización como referentes de AI")]
r = "".join(f'<div class="row"><div class="l">{a}</div><div class="a">→</div><div class="r">{b}</div></div>' for a,b in rows)
pages.append(f'''<div class="page">{band("Resultados","La transformación de su equipo.","Lo que cambia después de AI For Developers no es solo técnico — es cultural. Sus desarrolladores operan con criterio de ingeniería, no improvisación.","Antes / Después")}
<div class="body"><div class="ba"><div class="hd"><span>Antes del programa</span><span>Después de AI For Developers</span></div>{r}</div>
<p class="strong">El delta es medible — y los participantes lo aplican desde el día uno.</p>
<p class="note">Al cierre del programa, su empresa recibe un reporte detallado por participante.</p>
</div>{foot(8)}</div>''')

# 9 · ROI
k = [("3-5x","más rápido en ciclos de entrega","Velocidad de Entrega","Sus desarrolladores construyen productos completos en semanas, no meses. El AI-DLC elimina cuellos de botella en cada etapa."),
("Día 1","calidad y seguridad by default","Calidad del Software","Código mantenible desde el primer día. Specs trazables, tests automatizados y observabilidad integrados al flujo diario."),
("↑","satisfacción y crecimiento interno","Retención de Talento Clave","Cuando sus mejores ingenieros crecen y se convierten en referentes, no necesitan buscar oportunidades afuera."),
("→","de ejecutores a líderes técnicos","Capacidad de Innovación","Un equipo que entiende producto y domina AI no solo ejecuta más rápido: propone soluciones y lidera iniciativas.")]
cards = "".join(f'<div class="card kpi"><div class="num">{a}</div><div class="cap">{b}</div><h3>{c}</h3><p>{d}</p></div>' for a,b,c,d in k)
pages.append(f'''<div class="page">{band("Retorno de inversión","Impacto directo en su organización.","Resultados concretos que observamos en cohortes anteriores cuando los participantes vuelven a sus equipos.","ROI")}
<div class="body"><div class="grid2">{cards}</div>
<p class="strong">Cada cohorte deja un equipo capaz de liderar la próxima ola de software con AI.</p>
</div>{foot(9)}</div>''')

# 10 · Lo que recibe (sin precio)
def info(svg, t, d):
    return f'<div class="info"><svg viewBox="0 0 24 24" fill="none" stroke="{G}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{svg}</svg><div><b>{t}</b><span>{d}</span></div></div>'
pages.append(f'''<div class="page"><div class="top30"><span>30<span class="verde">X</span> &nbsp;|&nbsp; AI For Developers · Programa Corporativo</span><span class="url">hardcoreai30x.online</span></div>
<div class="cols"><div class="left"><h2>Una inversión en el futuro de su equipo.</h2>
<p class="intro">Compare lo que su equipo recibe con el costo de no hacer nada: proyectos atrasados, talento que se va y una brecha competitiva que se amplía cada trimestre.</p>
<div class="lab">Lo que recibirá</div><div class="list">
<div>7 semanas de programa intensivo (48+ horas)</div><div>12 estaciones en vivo con mentores expertos</div><div>Herramientas y frameworks AI estado del arte</div>
<div>1 producto real construido end-to-end</div><div>Demo Day: presentación del producto ante la cohorte</div><div>Certificado de completación del programa</div></div></div>
<div class="right">
{info('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',"Duración","7 semanas · fechas por confirmar")}
{info('<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',"Sesiones en vivo","12 estaciones de 2 horas, dos por semana. Todas quedan grabadas.")}
{info('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20"/>',"Modalidad","100% online en vivo, cupos limitados por cohorte.")}
{info('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',"Beneficios corporativos","Facturación empresarial y reporte de resultados por participante.")}
</div></div>
<div class="benef"><div class="t"><div class="k">Para su organización</div><div class="h">Un programa a la medida de su equipo</div></div>
<div class="items"><div>Facturación empresarial y soporte administrativo dedicado</div><div>Reporte de resultados por participante al cierre del programa</div><div>Personalización del producto a un proyecto real de su organización</div></div></div>
{foot(10)}</div>''')

# 11 · Cierre
pages.append(f'''<div class="page dark"><div class="close"><div class="brand">30<span class="lima">X</span><small>AI FOR DEVELOPERS</small></div>
<h1>El mejor momento para preparar a su<br>equipo fue ayer.<br><span class="lima">El segundo mejor momento es hoy.</span></h1>
<div class="co"><div class="k">COHORTE 6</div><div class="d">Inicio: por confirmar &nbsp;·&nbsp; Demo Day: por confirmar</div><div class="s">Cupos limitados &nbsp;·&nbsp; 100% online en vivo</div></div>
<div class="btn">SOLICITAR REUNIÓN DE CONSULTORÍA</div>
<div class="mail">sales@hardcoreai30x.online</div><div class="resp">Respuesta en menos de 24 horas hábiles</div></div>{foot(11)}</div>''')

html = f"<!doctype html><html lang='es'><head><meta charset='utf-8'><style>{CSS}</style></head><body>{''.join(pages)}</body></html>"
out = sys.argv[1] if len(sys.argv) > 1 else "deck.pdf"
HTML(string=html).write_pdf(out)
print("ok", out, len(pages))
