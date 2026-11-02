# Nivelación 2 · Tu primer agente: triage de tickets con MCP y Skills

## Objetivo
Construir un agente que lee tickets de soporte de una base de datos en Supabase, los clasifica con las reglas de tu negocio y actualiza la base. En el camino vas a ver qué aporta cada pieza de un agente:

```
AGENTE  =  Modelo (razona)  +  MCP (actúa sobre sistemas)  +  Skill (sabe el procedimiento)
```

Es asíncrona y toma alrededor de una hora. Puedes seguirla en vivo si tu cohorte tiene sesión de refuerzo, o completa en tu casa.

## Antes de empezar
- La [Nivelación 1](../nivelacion1/README.md) terminada: tu coding agent instalado y tu repo personal creado
- Una cuenta gratuita de Supabase ([supabase.com](https://supabase.com))

## Archivos

| Archivo | Para qué sirve |
|---|---|
| [`demo-paso-a-paso.md`](demo-paso-a-paso.md) | **La guía completa.** Empieza por acá |
| [`SKILL-triage-tickets.md`](SKILL-triage-tickets.md) | La skill de triage, lista para copiar |
| [`setup-tickets.sql`](setup-tickets.sql) | Alternativa: crear la tabla y los datos con SQL directo |
| [`reset-tickets.sql`](reset-tickets.sql) | Alternativa: dejar los tickets como al inicio para repetir el ejercicio |

La guía usa Claude Code, la herramienta de referencia. Si usas Cursor, Codex, Antigravity o GitHub Copilot, el **Anexo D** de la guía te da el equivalente de cada paso.

## Ruta

| Parte | Qué pasa | Qué aprendes |
|---|---|---|
| Acto 1 | El modelo solo razona bien, pero no puede ver tu base de datos | Un LLM sin herramientas no actúa |
| Acto 2 | Conectas el MCP de Supabase y el agente ya consulta y modifica datos | MCP le da manos al modelo, pero con criterio genérico |
| Acto 3 | Agregas la skill de triage y el agente aplica las reglas de tu negocio | Una skill convierte el criterio del negocio en un procedimiento repetible |
| Cierre | Verificas en Supabase que los datos realmente cambiaron | Un agente que dice "listo" no basta: se verifica |

## Tu tarea
1. Sigue la guía hasta terminar el Acto 3 y verifica los resultados en Supabase.
2. Cambia una regla de la skill. Por ejemplo, que todo lo que mencione "factura" sea ALTA. Rebobina los tickets y vuelve a correr el triage.
3. En tu repo personal, crea `nivelacion/triage.md` con:
   - La tabla final de clasificación que te dio el agente
   - La regla que cambiaste y qué ticket cambió de nivel por eso
   - Qué herramienta usaste y si tuviste que invocar la skill a mano

## Entregable
`nivelacion/triage.md` en tu repo personal, antes de la Estación 1. No subas tu token de Supabase ni archivos de configuración de MCP que lo contengan.

## Cómo alimenta la siguiente estación
El patrón modelo + MCP + skill es la base de todo el programa. En la Estación 3 lo vuelves a usar dentro del harness de tu propio producto, y desde ahí en cada estación.

## Track avanzado
- Conecta el MCP en modo `--read-only` y observa qué pasa cuando el agente intenta actualizar los tickets.
- Crea una segunda skill que genere un reporte diario de tickets por criticidad.

## Al terminar
Revoca tu token de Supabase en **Account Settings → Access Tokens** si ya no lo vas a usar. Un token con acceso a tu base es una contraseña.
