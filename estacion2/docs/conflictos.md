# Paso 0 — Análisis de conflictos

> **Ejemplo trabajado.** Resultado del Paso 0 del Prompt 1 sobre los documentos de `docs/` de EntreVista AI. El agente encontró las contradicciones y los huecos; las decisiones las tomó el equipo de producto. Con estas decisiones se escribió `specs/prd.md`.

| # | Conflicto o hueco | Dónde aparece | Opciones que propuso el agente | Decisión |
|---|---|---|---|---|
| 1 | Alcance geográfico: el overview cita regulación europea y el mercado es LATAM | `overview.md` §4, `mercado.md` §1 | Solo LATAM · LATAM + España · Global | **LATAM primero**, con cumplimiento por diseño para expandir después |
| 2 | Dos segmentos con necesidades distintas (volumen vs. profundidad técnica) | `icp.md` §1 | Solo BPO · Solo tech · Ambos | **BPO + tech** en el MVP, con rúbricas por tipo de rol |
| 3 | Canal: el mercado habla de WhatsApp y el PVB de Telegram | `mercado.md` §3, `pvb.md` | WhatsApp · Telegram · Web | **Telegram**, como hipótesis que se valida en 30 días |
| 4 | Profundidad: los referentes globales usan tareas prácticas | `overview.md` §5 | Solo conversación · Conversación + tareas | **Screening conversacional con repreguntas**; tareas prácticas como Should Have |
| 5 | Velocidad vs. experiencia del candidato | `icp.md` §2, `critica.md` §2 | Priorizar velocidad · Priorizar experiencia | **Experiencia del candidato** como principio no negociable |
| 6 | Contra quién nos posicionamos | `mercado.md` §3 | Globales · Locales | **Frente a los locales**, con razonamiento agéntico como diferenciador |
| 7 | ROI: los datos de impacto son de Estados Unidos | `overview.md` §6, `critica.md` §1 | Usar datos de EE. UU. · Marcar TBD | **TBD** hasta tener datos del piloto |
| 8 | Regulación: certificar o diseñar para cumplir | `overview.md` §4 | Certificación formal · Cumplimiento por diseño | **Cumplimiento por diseño**, sin certificaciones europeas en el MVP |
| 9 | Modelo de negocio | `pvb.md` §7, `critica.md` §1 | Suscripción · Por screening · Por contratación | **Por contratación exitosa**, con plan B por screening |
| 10 | Stack tecnológico | Ningún documento lo define | — | **TBD**: se decide en la Estación 5 |
| 11 | Idioma | `mercado.md` §5 | Español neutro · Variantes por país | **Español neutro** |
| 12 | Integración con ATS | `icp.md` §5 | Integrar en el MVP · Capa independiente | **Ninguna en el MVP** |
