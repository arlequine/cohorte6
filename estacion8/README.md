# Estación 8 · Aseguramiento de calidad

## Objetivo
Dejar tu producto protegido por pruebas que bloquean el merge: flujos E2E con Page Objects, escenarios Gherkin, contratos de API y una evaluación de tu agente con Persona + Juez, calibrada con un golden dataset y corriendo en CI.

## Antes de la clase
- Tu repo con la primera unidad de E5 y las tareas de E7 integradas, con CI en verde
- El secreto `ANTHROPIC_API_KEY` en tu repo (lo agregaste en la Estación 3)
- El MCP de Playwright configurado en tu herramienta (ver `mcp/README.md` de tu repo)
- El plan de evaluación del agente de tu PRD (segmento 11 de la Estación 2) a la mano

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–10 | De texto para humanos a interfaz de agentes: Gherkin, POM y rúbricas como contrato | La tesis de la sesión |
| 10–20 | Pirámide de pruebas y el anti-patrón del cono de helado | Saber qué va en cada nivel |
| 20–35 | TDD, BDD y Gherkin; demo: el `.feature` como prompt | Un escenario que se ejecuta |
| 35–45 | Page Object Model y request builders; demo con el MCP de Playwright | Locators que salen del DOM real |
| 45–55 | Persona + Juez, golden datasets y fallos críticos | Cómo se evalúa algo que no es determinista |
| 55–60 | Pausa | |
| 60–70 | Demo: la evaluación de EntreVista AI y el gate en CI | Ver un PR bloqueado por el Juez |
| 70–110 | Trabajo práctico en tu repo | La suite de Playwright corriendo y tu primera persona evaluada |
| 110–120 | Entregable, rúbrica y conexión con la Estación 9 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La solución de referencia es [`repos/entrevista-qa/`](repos/entrevista-qa): una EntreVista AI mínima montada sobre el walking skeleton, con todas las capas de esta estación y sus workflows de CI. Su [rúbrica](repos/entrevista-qa/evals/rubrica.md) y sus casos de red teaming salen del plan de evaluación del [PRD de EntreVista AI](../estacion2/specs/prd.md) (sección 11): lo que se escribió en la Estación 2 se ejecuta aquí.

Material de apoyo: las [slides](clase-8-slides.pdf) son de la Cohorte 4 (sus rutas de repos cambiaron); este README es el vigente.

## Tu tarea
Trabaja en tu repo personal, en una rama `estacion-8`. Pídele los cambios a tu agente por partes y usa la solución de referencia como modelo, no como copia.

1. **Instala la skill de pruebas.** Copia [`qa-testing`](repos/entrevista-qa/.agents/skills/qa-testing/SKILL.md) a `.agents/skills/`, ajústala a tu producto y corre `npm run sync-skills`.
2. **Agrega Playwright** con tres proyectos (e2e, bdd y api) y que levante tu app sola, como en el [`playwright.config.ts`](repos/entrevista-qa/playwright.config.ts) de referencia. Si tu agente llama a un LLM, dale un modo determinista para las pruebas.
3. **E2E con Page Objects:** al menos dos flujos críticos de tu producto. Pide a tu agente que inspeccione el DOM con el MCP de Playwright antes de escribir locators.
4. **Gherkin:** al menos un `.feature` en español con tres escenarios, incluidos los casos de red teaming de tu PRD que se puedan verificar en la interfaz.
5. **API:** contratos de tu endpoint del agente (forma del JSON, errores, tiempos) con request builders.
6. **Evaluación del agente:** en `evals/`, al menos tres personas (un caso feliz y dos adversariales de tu PRD), la rúbrica con las métricas de calidad de tu segmento 10 y las verificaciones mecánicas de tus fallos críticos.
7. **Calibra al Juez:** un golden dataset de al menos cuatro conversaciones con puntajes puestos por ti, y `npm run evals:calibrar` con 80 % de concordancia o más.
8. **El gate en CI:** agrega un workflow como [`calidad.yml`](repos/entrevista-qa/.github/workflows/calidad.yml) y marca sus jobs como checks obligatorios en **Settings → Branches**.

### Equivalencias por herramienta

| | Claude Code (referencia) | Cursor | Codex | Antigravity | GitHub Copilot |
|---|---|---|---|---|---|
| Skill `qa-testing` | `.claude/skills/` (copia con `npm run sync-skills`) | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` | `.agents/skills/` |
| MCP de Playwright | `.mcp.json` | `.cursor/mcp.json` | `.codex/config.toml` | `/mcp` en `agy` | `.vscode/mcp.json` |

El snippet de cada herramienta está en `mcp/README.md` de tu repo. El gate de CI no depende de la herramienta: corre en GitHub Actions.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-8`, antes de la Estación 9, que incluya:
- La skill `qa-testing` adaptada a tu producto
- Las pruebas E2E, BDD y de API, en verde en CI
- `evals/` con personas, rúbrica, fallos críticos y golden dataset
- El workflow de calidad con el job de evaluación en verde
- En la descripción del PR: el resultado de la calibración del Juez y una captura de la configuración de checks obligatorios

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| E2E | Dos flujos críticos con Page Objects, locators por rol o etiqueta y sin esperas fijas | Un flujo, o tests con selectores sueltos | No hay E2E |
| BDD | Un `.feature` en español con tres escenarios, incluidos casos de red teaming del PRD, que se ejecutan | Escenarios que no se ejecutan o sin casos del PRD | No hay escenarios |
| API | Contratos y errores del endpoint del agente probados con request builders | Solo el camino feliz o llamadas sueltas | No hay pruebas de API |
| Evaluación | Personas con casos adversariales, rúbrica alineada al PRD y fallos críticos verificados con código | Rúbrica genérica o sin fallos críticos | No hay evaluación del agente |
| Calibración | Golden dataset etiquetado por el alumno y concordancia del Juez de 80 % o más | Golden dataset sin calibración o concordancia menor | No hay golden dataset |
| Gate en CI | Workflow de calidad en verde, con los jobs como checks obligatorios | Workflow en verde pero sin checks obligatorios | No hay workflow |

## Cómo alimenta la siguiente estación
En la Estación 9 despliegas tu producto en la nube con Terraform y un pipeline completo. Estas pruebas son el filtro que corre antes de cada despliegue: si el Juez reprueba, no se despliega.

## Track avanzado
- Agrega una persona por cada caso de red teaming de tu PRD que todavía no cubres.
- Corre la evaluación con dos modelos de Juez distintos sobre el mismo golden dataset y compara su concordancia.
- Reescribe un flujo E2E con el patrón Screenplay y compáralo con su versión con Page Objects.

## Recursos
Enlaces revisados el 3 de noviembre de 2026. Versiones fijadas en [`versions.md`](../versions.md).

- [Playwright](https://playwright.dev) y [su MCP](https://github.com/microsoft/playwright-mcp)
- [playwright-bdd](https://github.com/vitalets/playwright-bdd)
- [Martin Fowler: Page Object](https://martinfowler.com/bliki/PageObject.html)
- [Referencia de Gherkin](https://cucumber.io/docs/gherkin/reference/)
- [Zheng et al., *Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena*](https://arxiv.org/abs/2306.05685)
- [Anthropic, *Demystifying evals for AI agents*](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
