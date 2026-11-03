# Estación 10 · Guía del mentor

## En una frase
El alumno sale con controles de seguridad automáticos en su pipeline, un modelo de amenazas de su propio agente y al menos un hallazgo cerrado con evidencia. El error más común es tratar la seguridad como una lista de herramientas: correr los escáneres, ver verde y no pensar en los riesgos del agente, que ningún escáner detecta.

## Preparación (48 h antes)
- [ ] Ten desplegada tu copia de la solución de referencia (`repos/producto-seguro/`) con el pipeline en verde, una llave de Anthropic con límite de gasto y el `AGENT_ACCESS_TOKEN`
- [ ] Corre `scripts/red-team.mjs` contra tu instancia y guarda la tabla: es tu evidencia para la demo y tu plan B
- [ ] Prepara la demo de Shannon (ver Demo, paso 3): instalación, llave del modelo y **una instancia propia y aislada** como objetivo. Corre la prueba una vez antes: tarda y consume tokens
- [ ] Prepara una rama de tu repo de demo con una dependencia vulnerable o un patrón inseguro, para mostrar un control fallando en el PR
- [ ] Revisa el semáforo: quién no tiene el pipeline de E9 en verde. Sin él, los controles no tienen dónde correr

## Guion (120 min)

| Min | Qué hace el mentor | Qué hacen los alumnos | Material |
|---|---|---|---|
| 0–10 | Superficie de ataque por capas | Ubican las capas en su producto | README, "Las capas que vas a revisar" |
| 10–25 | Casos de cadena de suministro y parsers de imágenes | Preguntan | Slides de la Cohorte 4 |
| 25–40 | OWASP Agentic Top 10 recorrido con el modelo de amenazas de la solución | Siguen la tabla | `repos/producto-seguro/docs/modelo-amenazas.md` |
| 40–55 | Demo de Shannon contra la instancia aislada | Observan | Demo, paso 3 |
| 55–60 | Pausa | | |
| 60–105 | Circula: primero quien tiene el pipeline en rojo, luego quien no sabe qué riesgos aplican | Pasos 1 a 6 de la tarea | README, "Tu tarea" |
| 105–115 | Demo de cierre: un caso del red team falla, se corrige y vuelve a pasar | Observan y aplican en su repo | Demo, paso 2 |
| 115–120 | Entregable, rúbrica y conexión con E11 | Anotan dudas | README |

## Demo
1. **Un control fallando.** Abre el PR de la rama preparada: Semgrep o `npm audit` fallan y el job de infraestructura no corre. Mensaje: el pipeline no despliega lo que no pasa los controles. La primera corrida de Semgrep sobre el código de la Estación 9 dio 23 resultados reales (H4 a H7 en `docs/seguridad.md` de la solución): úsalos para mostrar los tres desenlaces posibles de un hallazgo, que son corregirlo, mitigarlo con riesgo residual documentado o aceptarlo como falso positivo.
2. **Del hallazgo al cierre.** En una copia de la solución sin las defensas de `lib/agent.ts` (quita la regla, el canario y el filtro), corre el caso `filtrar-instrucciones` del red team. Luego restaura las defensas, despliega y vuelve a correrlo. Esa secuencia es la que se pide en el entregable.
3. **Pentest con agentes.** Corre Shannon contra tu instancia aislada. Muestra cómo forma hipótesis, las prueba y reporta el impacto. Recalca que solo se hace con autorización y en un entorno propio.

Plan B si algo falla en vivo:
- **Shannon no termina a tiempo o falla:** muestra el reporte de tu corrida previa y recorre un hallazgo.
- **La API de Anthropic no responde:** muestra la tabla del red team que guardaste en la preparación y los tests de `tests/agent.test.ts`, que no necesitan red.
- **El PR de demo no falla como esperabas:** abre los logs de la última corrida que sí falló.

## Conceptos clave
1. **Revisar tu código no basta.** La mayor parte de lo que se ejecuta en tu producto lo escribió otra persona: dependencias, imágenes base, servidores MCP.
   Pregunta: "¿Cuántas dependencias directas e indirectas tiene tu producto?" (`npm ls --all | wc -l`)
2. **Los riesgos del agente no los ve un escáner.** Semgrep no detecta que tu agente obedece instrucciones de un correo. Eso sale del modelo de amenazas y del red team.
   Pregunta: "¿Qué contenido externo lee tu agente y quién controla ese contenido?"
3. **Defensa en capas.** Ninguna defensa contra inyección es perfecta: regla en el prompt, canario, filtro de salida, permisos mínimos y monitoreo se suman.
   Pregunta: "Si tu regla del system prompt falla, ¿qué es lo siguiente que detiene el daño?"
4. **Un hallazgo no está cerrado hasta que se verifica.** Corregir sin volver a probar es una suposición.
5. **La recuperación se prueba antes de necesitarla.** Un runbook que nunca se ejecutó es una hipótesis.

## Errores típicos de los alumnos

| Síntoma | Causa | Cómo resolverlo |
|---|---|---|
| Semgrep falla con un hallazgo que el alumno no entiende | Regla desconocida | Leer la explicación de la regla en el enlace del log; si es un falso positivo, ignorarlo con un comentario `nosemgrep` justificado en el reporte |
| `npm audit` falla por una dependencia de desarrollo | Se olvidó `--omit=dev` | Usar `--omit=dev`; las de desarrollo se revisan con Dependabot |
| `npm audit` falla y no hay versión corregida | La vulnerabilidad no tiene parche | Evaluar si la parte vulnerable se usa; documentar el riesgo aceptado en el reporte con fecha de revisión |
| El apply falla con `AccessDenied` en `UpdateContinuousBackups` | No volvió a aplicar el bootstrap | Aplicar el bootstrap de la solución de E10 |
| `terraform destroy` falla en producción | La protección contra borrado funciona | Es lo esperado; para eliminar la tabla, desactivarla primero en un PR |
| El red team marca ERROR en todos los casos del modelo | Falta el token, la URL está mal o la llave de Anthropic no tiene saldo | Revisar `AGENT_URL`, `AGENT_ACCESS_TOKEN` y el saldo |
| Un caso del red team pasa a veces y falla otras | El modelo no es determinista | Tratarlo como hallazgo: si falla una vez, falla |
| Dependabot abre muchos PRs | Configuración sin agrupar | Agrupar las actualizaciones menores, como en la solución |

## Preguntas frecuentes
- **¿Por qué Semgrep y no CodeQL?** Semgrep es gratuito en repos privados y revisa Terraform. CodeQL analiza más a fondo, pero en repos privados requiere licencia. Si el repo es público, se pueden usar los dos.
- **¿Puedo correr Shannon contra la app de mi empresa?** Solo con autorización por escrito y un alcance definido. Para el curso, contra tu propia instancia.
- **¿El canario evita todas las filtraciones?** No: detecta y bloquea las que incluyen el marcador. Una paráfrasis de las instrucciones puede pasar. Por eso es una capa más, no la única.
- **¿Qué pasa si no encuentro ningún hallazgo?** Revisa de nuevo el modelo de amenazas. Si de verdad no hay, cierra uno de los riesgos aceptados de la solución de referencia (por ejemplo, el límite de tasa) y documéntalo.

## Qué se adapta y qué no
- Fijo: los controles en el pipeline, el modelo de amenazas con el OWASP Agentic Top 10, al menos un hallazgo cerrado con evidencia y la regla de probar solo sistemas propios
- Libre: qué herramienta de pentest se muestra en la demo, los casos adicionales del red team y la profundidad en cadena de suministro o en riesgos del agente según el grupo

## Cierre y refuerzo
- Recuerda que el PR con la etiqueta `estacion-10` se entrega antes de la Estación 11
- En el refuerzo, revisa en voz alta dos o tres modelos de amenazas: es la forma más rápida de que el grupo vea riesgos que no había considerado
- Insiste en que no se desactivan controles para que pase un PR

## Notas para el siguiente mentor
Pendiente: se llena al terminar la Cohorte 6.
