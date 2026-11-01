# Diagnóstico de nivel

Califica cada afirmación del 0 al 3 según lo que puedes hacer **hoy, sin ayuda**:

- **0** · No sé qué es
- **1** · Lo conozco, pero no lo he hecho
- **2** · Lo he hecho con ayuda o pocas veces
- **3** · Lo hago con soltura y podría explicárselo a alguien

Copia la tabla de tu sección a `nivelacion/entrega.md` con tu calificación.

## A. Fundamentos de desarrollo

| # | Afirmación | 0–3 |
|---|---|---|
| A1 | Trabajo con ramas, resuelvo conflictos y abro pull requests en Git | |
| A2 | Escribo tests unitarios y entiendo qué hace que un test sea útil | |
| A3 | Diseño y consumo APIs HTTP (métodos, códigos de estado, JSON) | |
| A4 | Escribo TypeScript con tipos propios, no solo `any` | |
| A5 | Levanto servicios con Docker y Docker Compose | |

## B. Programar con IA

| # | Afirmación | 0–3 |
|---|---|---|
| B1 | Uso un coding agent (Claude Code, Cursor, Codex, Antigravity, Copilot u otro) en mi trabajo diario | |
| B2 | Le doy al agente el contexto que necesita (archivos, convenciones, objetivo) en lugar de pedir todo en una línea | |
| B3 | Reviso y pruebo el código que genera el agente antes de aceptarlo | |
| B4 | Uso archivos de instrucciones del proyecto (`CLAUDE.md`, `AGENTS.md` o similares) | |
| B5 | Divido una tarea grande en pasos que el agente puede ejecutar y verificar uno por uno | |

## C. LLMs y agentes

| # | Afirmación | 0–3 |
|---|---|---|
| C1 | Explico qué son los tokens y la ventana de contexto, y cómo afectan costo y calidad | |
| C2 | He llamado a la API de un LLM desde código | |
| C3 | Explico qué es tool use (function calling) y para qué sirve | |
| C4 | Sé qué es MCP y he conectado al menos un servidor MCP | |
| C5 | Sé cómo evaluar si un agente responde bien (evals, rúbricas, datasets de prueba) | |

## D. Producto y especificación

| # | Afirmación | 0–3 |
|---|---|---|
| D1 | Escribo historias de usuario con criterios de aceptación verificables | |
| D2 | He escrito o usado un PRD o una especificación técnica | |
| D3 | Documento decisiones de arquitectura (ADR o similar) | |
| D4 | Escribo escenarios en Gherkin (Dado / Cuando / Entonces) | |
| D5 | Defino métricas para saber si un producto resuelve el problema | |

## Tu puntaje

Suma cada sección (máximo 15) y el total (máximo 60).

| Sección | Puntaje |
|---|---|
| A. Fundamentos | |
| B. Programar con IA | |
| C. LLMs y agentes | |
| D. Producto | |
| **Total** | |

Tu sección más baja es la que más te conviene reforzar esta semana. En el README de la Nivelación 1 hay recursos para cada área.

---

## Reto práctico (45 minutos)

Hazlo con tu coding agent dentro de tu repo personal, en `nivelacion/reto/`.

**El problema.** Un equipo de soporte recibe tickets en texto libre y quiere clasificarlos automáticamente sin usar un LLM, por ahora.

**Lo que tienes que construir.** Una función en TypeScript:

```ts
clasificarTicket(texto: string): {
  categoria: 'facturacion' | 'acceso' | 'bug' | 'otro';
  prioridad: 'alta' | 'media' | 'baja';
}
```

Con estas reglas:
- Menciones de cobro, factura o reembolso → `facturacion`
- Menciones de contraseña, login o acceso → `acceso`
- Menciones de error, falla o "no funciona" → `bug`
- Cualquier otra cosa → `otro`
- Prioridad `alta` si el texto contiene "urgente" o "producción"; `baja` si tiene menos de 20 caracteres; `media` en los demás casos

**Requisitos:**
1. Tests con Vitest que cubran cada categoría, cada prioridad y al menos dos casos ambiguos que tú elijas.
2. Todos los tests pasan con `npx vitest run`.
3. Un `NOTAS.md` breve que responda:
   - ¿Qué coding agent y qué modelo usaste?
   - ¿Cuántas veces tuviste que corregir al agente y por qué?
   - ¿Qué caso ambiguo encontraste y cómo decidiste resolverlo?
   - ¿Qué le pedirías distinto al agente si empezaras de nuevo?

Lo que más importa no es la función, sino cómo dirigiste al agente y cómo verificaste su trabajo. Por eso las notas cuentan tanto como el código.

## Cómo se asigna el track

| Track | Cuándo |
|---|---|
| **Avanzado** | Total de 40 o más, ninguna sección por debajo de 8, y el reto terminado con tests pasando |
| **Base** | Cualquier otro caso |

Los dos tracks tienen los mismos entregables. El avanzado suma un reto opcional en cada estación. Si no estás de acuerdo con tu track, coméntalo con tu mentor en la primera sesión de refuerzo.
