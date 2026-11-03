# Estación 2 · Guía del mentor

## En una frase
El alumno sale con su Paso 0 resuelto y los primeros segmentos de su PRD aprobados, y entiende que el PRD es una serie de decisiones suyas, no un documento que genera el modelo. El error más común es pedirle al agente "hazme el PRD completo" y aceptar lo que salga, con cifras inventadas incluidas.

## Preparación (48 h antes)
- [ ] Lee [`manual-estudiante.md`](manual-estudiante.md), Partes II a IV: es el contenido de la primera hora
- [ ] Ensaya el Paso 0 con los `docs/` de EntreVista AI: abre Claude Code en una copia de `estacion2/` (sin `specs/` ni `docs/conflictos.md`), pega el Prompt 1 y verifica que aparece una tabla de conflictos parecida a [`docs/conflictos.md`](docs/conflictos.md)
- [ ] Ten abierto [`specs/prd.md`](specs/prd.md) para mostrar el resultado final sin generarlo en vivo
- [ ] Modelos revisados contra [`versions.md`](../versions.md): necesitas uno capaz (por ejemplo, `claude-opus-5-5`) para que respete el ritmo segmento por segmento
- [ ] Revisa el semáforo con `node scripts/semaforo.mjs alumnos.csv --estacion estacion-1`: quién llega sin PVB o sin crítica. Sin ellos, el Paso 0 no tiene material

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Slide o archivo |
|---|---|---|---|
| 0–10 | Pregunta de entrada: ¿prompt o proceso? Casos Chegg, Jasper y Duolingo | Clasifican su idea: ¿prompt o proceso? | Manual §1–2 |
| 10–25 | Founder vs. FDE, Job to be Done y test de durabilidad | Ubican su perfil y su JTBD | Manual §3–4 |
| 25–45 | Cinco preguntas, tres trampas, tres moats | Eligen un solo moat | Manual §5–9 |
| 45–55 | Refinamiento del PVB campo por campo | Ajustan su `docs/pvb.md` | Manual §13 |
| 55–60 | Pausa | | |
| 60–75 | Demo del Paso 0 con EntreVista AI y recorrido por `docs/` y `specs/` del ejemplo | Observan | `docs/`, `docs/conflictos.md`, `specs/prd.md` |
| 75–110 | Circula: primero a quien no tiene `docs/` suficiente, luego a quien el modelo se le adelanta | Corren su Paso 0 y los segmentos 1 a 3 | `prompts-especificacion.md` |
| 110–120 | Entregable, rúbrica y conexión con E3 | Anotan dudas para el refuerzo | README "Entregable" |

## Demo
Todo en Claude Code, que es la herramienta de referencia.

1. **El setup (minuto 60).** Abre `estacion2/docs/` y muestra un archivo de cada tipo: el PVB, un deep research de validación y la crítica. Remarca que todo está en Markdown y que la crítica es el que más cambió el PVB (ver su sección 5).
2. **Paso 0 en vivo (minuto 65).** En una copia de `estacion2/` sin `specs/prd.md` ni `docs/conflictos.md`, abre Claude Code, pega el Prompt 1 y deja que lea `docs/`. Cuando aparezca la tabla, decide en voz alta dos conflictos. Buenos candidatos: el canal (Telegram vs. WhatsApp) y el modelo de negocio. Explica por qué decides tú y no el modelo.
3. **El resultado (minuto 72).** Abre `docs/conflictos.md` y `specs/prd.md` del ejemplo. Muestra cómo las decisiones aparecen al inicio del PRD, cómo quedan los TBD (ROI y stack) y los segmentos 10 y 11, que son el entregable nuevo de esta cohorte.

Plan B si algo falla en vivo:
- El modelo no detiene el flujo o tarda demasiado: muestra `docs/conflictos.md` y explica el Paso 0 sobre la tabla ya hecha.
- No hay red o falla la API: todo el resultado está en `docs/` y `specs/` del ejemplo.

## Conceptos clave
1. **¿Prompt o proceso?** Lo que es un output puntual se commoditiza con el próximo modelo; lo que es un workflow con contexto de negocio persiste.
   Pregunta: "Si el próximo modelo sale mañana gratis, ¿qué parte de tu producto sigue valiendo?"
2. **Un solo moat.** Data, distribución o confianza. Diluirse en los tres es no construir ninguno.
   Pregunta: "¿Cuál es el tuyo y qué tendría que copiar un competidor para quitártelo?" (En EntreVista AI: confianza.)
3. **El Paso 0 obliga a decidir.** El valor no es la tabla de conflictos, son las decisiones que te fuerza a tomar.
   Pregunta: "¿Qué conflicto de tu Paso 0 te incomodó más y qué decidiste?"
4. **Un PRD de un producto agéntico define cómo se evalúa al agente.** Las métricas de calidad del agente y el plan de evaluación del segmento 11 son el insumo de las Estaciones 8 y 10.
   Pregunta: "¿Cómo sabrías que tu agente está alucinando antes de que lo descubra un cliente?"
5. **Un TBD honesto vale más que un dato inventado.**
   Pregunta: "¿Qué cifra de tu PRD no podrías defender frente a un cliente?"

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| El modelo genera los 13 segmentos de una sola vez | Modelo mediano con poco razonamiento | Sesión nueva con un modelo más capaz, o aceptar el PRD de una vez y refinarlo segmento por segmento |
| El Paso 0 no encuentra conflictos | `docs/` tiene un solo documento o todos dicen lo mismo | Agregar la crítica y al menos una transcripción; sin fuentes distintas no hay contradicciones |
| El PRD trae cifras que no están en `docs/` | El modelo rellena huecos | Señalar la regla 1 del prompt y marcar TBD; la rúbrica lo penaliza |
| El segmento 11 dice "probaremos con usuarios" | No entiende qué es evaluar a un agente | Mostrar el 11.1 a 11.4 de EntreVista AI: dataset, umbrales y red teaming |
| El alumno pierde la sesión de un día a otro | No nombró la sesión | `/rename` y `/resume` en Claude Code; en otra herramienta, pedirle que relea `docs/conflictos.md` y `specs/prd.md` |
| Sube PDFs a `docs/` | Costumbre | Convertirlos a Markdown: gasta menos tokens y el modelo los lee mejor |
| El FDE no tiene a quién nombrar en el Stakeholder Map | No ha hablado con su organización | Que nombre al menos al sponsor y al veto holder esta semana; es el mayor riesgo de su proyecto |

## Preguntas frecuentes
- **¿Puedo hacer el PRD en ChatGPT o Gemini?** Sí, el prompt funciona en cualquier modelo capaz. El soporte garantizado es en Claude.
- **¿El PRD tiene que estar terminado para E3?** Tiene que estar completo como v1, con TBD donde falte información. Se itera durante todo el programa.
- **¿Qué pasa si después de esta clase quiero cambiar de idea?** Es el mejor momento. Desde E3 tu repo empieza a construirse sobre este PRD.
- **¿Por qué EntreVista AI y no mi producto en la demo?** Porque es el producto de referencia de todo el programa: lo verán en todas las estaciones.

## Qué se adapta y qué no
- Fijo: el Paso 0 antes de cualquier segmento, los 13 segmentos, el entregable y la rúbrica
- Libre: los casos de la primera hora (puedes cambiar Chegg, Jasper o Duolingo por casos que conozcas), qué conflictos decides en vivo y cuánto tiempo das a cada framework según el grupo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-2` se entrega antes de la Estación 3, y que E3 empieza completando `AGENTS.md` con base en este PRD
- Revisión de entregas: corre `node scripts/semaforo.mjs alumnos.csv --estacion estacion-2` y revisa primero los rojos, amarillos, `sin-juez` y `sin-pr`. Antes de E3 casi nadie tiene configurado el Juez, así que la revisión es tuya: usa la rúbrica
- En el refuerzo, revisa en voz alta el `conflictos.md` de dos o tres alumnos: es la forma más rápida de que el grupo vea qué es una buena decisión de producto

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
