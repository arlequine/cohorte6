# AI for Developers | 30X — Cohorte 6

Materiales de la **Cohorte 6**. El programa es un recorrido de 12 estaciones en 7 semanas, donde cada alumno construye un producto real de punta a punta con IA.

El material de la Cohorte 4, del que parte esta versión, está en [arlequine/c4](https://github.com/arlequine/c4).

## Qué cambia respecto a la Cohorte 4

- **Código desde la semana 3.** En E3 cada alumno deja un *walking skeleton*: un repo con CI, una URL pública y un agente mínimo que responde.
- **Hilos transversales.** Tests, seguridad, evals, observabilidad, costo y pitch arrancan temprano y se profundizan en su estación.
- **Un producto de referencia.** EntreVista AI se usa de E1 a E12.
- **Cualquier mentor puede impartir cualquier estación.** Cada estación trae un `MENTOR.md` que basta para dar la sesión.

## Mapa

| Semana | Estación | Entregable |
|---|---|---|
| 1 | Nivelación 1 + 2 | Entorno operativo + track (base o avanzado) |
| 2 | E1 Intro y demo | Product Vision Board o Internal Solution Brief |
| 2 | E2 PRD | PRD v1 con métricas y criterios de eval |
| 3 | E3 Harness engineering | Walking skeleton desplegado |
| 3 | E4 Diseñando el QUÉ | Artefactos de Inception + escenarios Gherkin |
| 4 | E5 Diseñando el CÓMO | MADR + unidad 1 con tests verdes en CI |
| 4 | E6 Del spec al plan | Task package publicado en Linear |
| 5 | E7 Orquestación | Al menos 3 tareas cerradas por agentes con PR revisado |
| 5 | E8 Calidad | Suite E2E + evals del agente como gate en CI |
| 6 | E9 Despliegue | Producto en la nube con pipeline completo |
| 6 | E10 Seguridad | Reporte de seguridad + hallazgos cerrados |
| 7 | E11 Observabilidad | Dashboard + prueba de carga + pitch ensayado |
| 7 | E12 Demo Day | Video de 3 min + demo en vivo |

El detalle está en el [mapa curricular de la Cohorte 6](https://claude.ai/artifact/KCGYvyP2ADN63jUkLNEJRg).

## Estructura

```
nivelacion1/, nivelacion2/
estacionN/
├── README.md     ← para el alumno (plantillas/ESTACION.md)
├── MENTOR.md     ← para quien imparte (plantillas/MENTOR.md)
├── slides/
└── repos/        ← código de práctica y demo
plantillas/       ← plantillas de estación y de guía del mentor
versions.md       ← modelos, SDKs y herramientas fijados para la cohorte
```

## Cómo contribuir

1. Toma un issue del milestone **Cohorte 6**.
2. Crea una rama `eN/<tema>` y abre un PR que cierre el issue.
3. Antes de marcar una estación como lista, otro mentor la ensaya solo con su `MENTOR.md`.
4. Si cambias un modelo o una versión, cámbialo en `versions.md`, no en cada archivo.
