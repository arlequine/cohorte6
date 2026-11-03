---
name: autoevaluar-entrega
description: Úsala antes de abrir el PR de una entrega de estación o nivelación. Descarga la rúbrica de la estación y revisa la entrega criterio por criterio, igual que lo hará el Juez.
---

# Autoevaluar una entrega

1. Identifica la estación: pregúntale al alumno si no está claro. La etiqueta tiene la forma `estacion-N` o `nivelacion-N`.
2. Descarga la rúbrica:
   `curl -s https://raw.githubusercontent.com/arlequine/cohorte6/main/rubricas/<etiqueta>.json`
   Si no hay red, lee la sección "Rúbrica" de la guía de la estación.
3. Revisa los cambios de la entrega (`git diff main...HEAD` y los archivos que el entregable pide).
4. Para cada criterio, decide **cumple**, **parcial** o **no cumple** con las descripciones de la rúbrica, y cita la evidencia: archivo y línea, o lo que falta.
5. Presenta una tabla `Criterio | Resultado | Evidencia | Qué falta` y el semáforo esperado: verde si al menos el 80 % y ningún "no cumple", amarillo si al menos el 50 %, rojo si menos.
6. No corrijas nada por tu cuenta: propón los cambios y deja que el alumno decida. Cuando todo cumpla, recuérdale:
   - correr la skill `verificar-antes-de-entregar`;
   - abrir el PR con el título `<etiqueta>: <resumen>` y ponerle la etiqueta `<etiqueta>`.
