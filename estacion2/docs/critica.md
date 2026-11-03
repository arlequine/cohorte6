# Crítica — Por qué EntreVista AI podría fracasar

> **Ejemplo trabajado.** Deep research de crítica: la pregunta no es "¿funciona la idea?" sino "¿qué la mata?". Es el documento que más debería cambiar tu PVB.

## 1. Supuestos sin validar

| Supuesto | Por qué es frágil | Cómo validarlo |
|---|---|---|
| Los candidatos usan Telegram | En LATAM domina WhatsApp; no hay datos de penetración de Telegram entre candidatos de BPO | Piloto con 100 candidatos: si la conversión del enlace al screening es menor al 50 %, cambiar de canal |
| Las empresas pagan por contratación exitosa | Depende de que el cliente reporte la contratación; el ingreso es impredecible | Preguntarlo en 5 entrevistas con compradores antes del piloto |
| El time-to-hire mejora igual que en Estados Unidos | Los datos publicados no son de LATAM | Medir en el piloto contra la línea base del cliente |
| Los reclutadores adoptan el dashboard | Una herramienta más en un equipo saturado | Co-diseñar el dashboard con 2 o 3 reclutadores del piloto |

## 2. Por qué fracasan productos parecidos

- **Experiencia fría.** Los chatbots de reclutamiento de primera generación ahuyentan al talento: el 47 % de candidatos los percibe impersonales (`overview.md`). Un agente mal diseñado repite el error con más tecnología.
- **Sesgo.** Un sistema que evalúa personas a escala amplifica cualquier sesgo de su rúbrica o de su modelo. Un caso público basta para perder la confianza del mercado.
- **Wrapper sin moat.** Un bot que entrevista con la API de un LLM se replica en semanas. Si la ventaja es solo el prompt, no hay ventaja.
- **Demo que no llega a producción.** El piloto deslumbra a la directora de talento y se traba en legal, en IT o en el reclutador que no lo quiere usar.

## 3. Riesgos técnicos

- **Alucinaciones** sobre salario, beneficios o políticas: un solo caso puede ser un problema legal.
- **Respuestas generadas con ChatGPT** por los candidatos: si el agente no repregunta, evalúa al modelo y no a la persona.
- **Dependencia de un proveedor de LLM:** cambios de precio o de comportamiento del modelo afectan la calidad sin que cambiemos nada.
- **Datos personales:** un incidente de seguridad expone información de candidatos de varios clientes.

## 4. Riesgos de mercado

- Las suites grandes (Workday con Paradox) pueden bajar a LATAM con un agente incluido.
- Los competidores locales pueden agregar repreguntas con un LLM en un trimestre.
- La regulación puede endurecerse antes de que el producto tenga tracción.

## 5. Qué cambia en el PVB después de esta crítica

1. El moat no puede ser "la IA entrevista mejor": pasa a ser **confianza y auditabilidad**.
2. El canal es una hipótesis con fecha de validación, no una decisión cerrada.
3. El modelo económico queda en TBD con un plan B: cobro por screening si el pago por contratación no funciona en 60 días.
4. El humano en el bucle deja de ser una función y se vuelve un principio no negociable.
