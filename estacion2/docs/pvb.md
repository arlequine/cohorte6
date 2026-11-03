# Product Vision Board — EntreVista AI

> **Ejemplo trabajado del programa.** EntreVista AI es el producto de referencia de AI for Developers: lo verás evolucionar de la Estación 1 a la 12. Este PVB ya está refinado con los frameworks de la Estación 2. Las cifras vienen de `overview.md`, `mercado.md` e `icp.md`; en un producto real, verifica cada una en su fuente antes de citarla.

---

## PRODUCTO

**Nombre del producto:** EntreVista AI

**Descripción en una línea:** Un agente que conduce entrevistas de screening conversacionales por Telegram para empresas de alto volumen en América Latina, y le entrega al reclutador humano evidencia estructurada para decidir.

---

## 1. PROBLEMA

**Problema que resuelvo:** Los equipos de reclutamiento de BPO y empresas tech en LATAM no alcanzan a hacer screening de calidad al volumen que necesitan. Una vacante recibe más de 250 solicitudes (`icp.md`), el proceso tarda 44 días en promedio mientras el mejor talento sale del mercado en 10 (`icp.md`), y 4 de cada 10 candidatos en México abandonan por procesos engorrosos (`mercado.md`). Las herramientas actuales escalan sin profundidad (chatbots de reglas) o tienen profundidad sin escalar (entrevistas humanas).

**¿Este problema sobrevive a las próximas generaciones de modelos foundation?**
[X] Sí, porque es un problema de WORKFLOW/INTEGRACIÓN, no de OUTPUT

Un modelo más capaz hace mejores preguntas, pero no resuelve el flujo: consentimiento, rúbricas por rol, revisión humana, trazabilidad auditable y el canal donde ya están los candidatos. Eso vive en el proceso de cada empresa.

**Durability Score (1-5):** 4. No es 5 porque las suites de HR grandes pueden agregar la capa conversacional (Workday ya compró Paradox, `overview.md`).

---

## 2. SEGMENTO TARGET

**¿Para quién es este producto?**
- **Segmento A:** BPO y contact centers de 200 a 5,000+ empleados en Colombia, México y Argentina, con rotación anual de 80 % a 120 % (`mercado.md`).
- **Segmento B:** empresas tech y SaaS de 50 a 500 empleados que contratan de 50 a 300 personas al año con equipos de reclutamiento de 1 a 5 personas.

**Usuario diario:** el reclutador operativo. **Comprador:** Director de Adquisición de Talento (A) o Head of People (B).

**¿Quién controla el veto de confianza?** El reclutador operativo: no compra, pero si la herramienta le quita control o le genera trabajo, la sabotea. En empresas grandes, además, el área legal o de compliance, por el riesgo de sesgo y la regulación de IA en reclutamiento.

---

## 3. MOAT PRIMARIO

**Moat primario:** [X] Trust Moat

**¿Qué trust única podemos construir?** Cada puntaje lleva la cita textual de la conversación que lo justifica, la IA nunca rechaza a nadie sola (humano en el bucle obligatorio), el candidato siempre sabe que habla con una IA y no hay análisis biométrico ni emocional. En un mercado donde el 79 % de los postulantes exige saber si una máquina los evalúa (`overview.md`) y donde la regulación clasifica estos sistemas como de alto riesgo, ser auditable es la razón para elegirnos.

---

## 4. ARENA COMPETITIVA

**Arena:** [X] Disruptor (AI-Disrupted): reimaginamos el screening, un workflow que ya existe.

**¿Cómo sobrevives a los gigantes?** Glider AI y HireVue son referentes globales, pero con pricing enterprise, video y sin localización para LATAM. Los locales (Magneto, Webcand, Genomawork) operan con flujos de reglas o formato examen. No competimos con los ATS ni las suites HCM (Buk, Workday): somos la capa de screening que se pone antes, sin integración obligatoria en el MVP.

---

## 5. UX PARADIGM

**Paradigma:** [X] Agent: la IA ejecuta la entrevista sola dentro de límites claros, y el humano aprueba o rechaza.

**¿Por qué?** Un asistente no resuelve el volumen: el reclutador seguiría haciendo cada entrevista. Un sistema autónomo que decide solo es inaceptable legal y éticamente. El agente con humano en el bucle es el punto medio: la IA hace la conversación y la evidencia, la persona decide.

---

## 6. AI DECISION TRIANGLE

**Optimizo primariamente para:** [X] Capability

**Trade-offs que acepto:** Más costo por conversación a cambio de repreguntas relevantes y cero alucinaciones sobre salario o políticas. La velocidad importa poco: el candidato responde a su ritmo por Telegram, así que unos segundos más por mensaje no cambian la experiencia.

---

## 7. MODELO ECONÓMICO

**Modelo de pricing:** [X] Outcome-Based: pago por contratación exitosa.

**¿El pricing escala si tienes 10x usuarios?** [X] Necesita ajuste. El ingreso depende de que el cliente contrate y nos lo reporte; hay que validarlo en el primer piloto.

**Costo estimado por screening:** TBD, depende del modelo y del largo de la conversación. Se mide en el piloto.
**Revenue por contratación:** TBD.
**Gross margin proyectado:** TBD.

> Un campo en blanco honesto vale más que una cifra inventada: estos tres datos son preguntas de investigación del piloto, no supuestos.

---

## 8. MÉTRICAS DE ÉXITO

**Métricas de usuario:**
1. Contrataciones exitosas facilitadas por mes (North Star)
2. Tasa de completación del screening: de ~60 % a 80 % o más

**Métricas específicas de AI:**
1. Factualidad: 98 % o más, sin ninguna alucinación sobre salario, beneficios o políticas
2. Alineación agente-humano: correlación de 0.75 o más entre los puntajes del agente y los de reclutadores expertos

---

## 9. RIESGOS CRÍTICOS

**1. ¿Qué pasa si el problema desaparece en 12 meses por commoditización?** La entrevista conversacional se va a commoditizar; la evidencia auditable, la revisión humana integrada y la localización no. Si en 12 meses cualquier ATS trae un agente que entrevista, nuestra ventaja tiene que estar en la confianza y en las rúbricas calibradas con datos de LATAM.

**2. ¿Puede un competidor replicar tu producto con la misma API en menos de 6 semanas?** El bot sí. Las rúbricas calibradas contra reclutadores reales, el historial de auditoría y la relación con los primeros clientes, no.

**3. Si tienes éxito a escala, ¿cuál es la primera forma en que se rompe la confianza?** Un caso público de sesgo o una alucinación del agente sobre condiciones laborales. Mitigación: humano en el bucle obligatorio, rúbricas objetivas, red teaming continuo y auditoría trimestral de la distribución de puntajes.
