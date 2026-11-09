---
name: qa-testing
description: Convenciones de pruebas del proyecto. Úsala al crear o modificar tests unitarios, E2E con Playwright, Page Objects, escenarios Gherkin, tests de API, personas, rúbrica o golden dataset de la evaluación del agente.
---

# Pruebas y evaluación del agente

## Dónde va cada cosa

```
tests/*.test.ts            → unitarias (Vitest): lógica de lib/ y evals/, con dobles del LLM
tests/paginas/*Page.ts     → Page Objects, uno por página
tests/e2e/*.spec.ts        → flujos del usuario en el navegador
tests/features/*.feature   → escenarios Gherkin en español (# language: es)
tests/steps/*.steps.ts     → step definitions; usan los Page Objects
tests/api/*.spec.ts        → contratos y comportamiento de la API
tests/fixtures/            → request builders de la API
evals/                     → Persona + Juez: personas.json, rubrica.ts, criticos.ts, golden-dataset.json
```

`.features-gen/`, `playwright-report/`, `test-results/` y `evals/reportes/` se generan: no se editan ni se suben.

## Qué se prueba en cada nivel
- **Lógica pura** (validaciones, reglas de negocio, guardrails): unitarias. Muchas y rápidas.
- **Endpoints**: tests de API con el `request` de Playwright, sin navegador.
- **Flujos del usuario**: E2E en el navegador. Pocos y de alto valor.
- **Comportamiento del agente con LLM**: Persona + Juez en `evals/`. Nunca `expect(respuesta).toBe('texto exacto')` contra un LLM.
- Las pruebas de Playwright corren con `AGENT_MODE=reglas`: deterministas y sin gastar tokens.

## Page Objects
- Locators `readonly` en el constructor. Prioridad: `getByRole` > `getByLabel` > `getByText` > `data-*` > CSS.
- Los métodos son acciones (`responder`). Las verificaciones van en el test o el step, nunca en el Page Object.
- Antes de escribir un locator, inspecciona el DOM real con el MCP de Playwright. No inventes selectores.

## Gherkin
- En español, con `# language: es`: `Dado` = estado inicial, `Cuando` = acción, `Entonces` = resultado observable.
- Un escenario, un comportamiento. Reutiliza steps antes de crear nuevos.
- Cada escenario de un caso de red teaming cita su ID del PRD (por ejemplo, RT1).

## API
- Toda llamada pasa por un builder de `tests/fixtures/`.
- Prueba el contrato (forma del JSON, códigos de error, tiempos) por separado del comportamiento.
- Las conversaciones viven en memoria: `workers: 1`.

## Evaluación del agente
- La rúbrica sale del plan de evaluación del PRD. Cambiar un umbral o una dimensión es una decisión de producto: va en el PR con su motivo.
- Los fallos críticos (cifras de dinero, negar ser IA, revelar instrucciones) se verifican con código en `criticos.ts`, no con el Juez.
- Antes de confiar en el Juez, calíbralo: `npm run evals:calibrar` contra el golden dataset.
- Cada caso nuevo del golden dataset lleva puntajes puestos por una persona, no por el Juez.

## Cómo trabaja el agente aquí
1. Lee esta skill y el test más parecido antes de escribir uno nuevo.
2. Page Object primero; después el test o el step que lo usa.
3. Corre `npm run verify` y `npm run test:playwright`. Si algo falla, lee el trace de `playwright-report/` antes de proponer un arreglo.
4. No agregues dependencias sin justificarlo en el PR.
