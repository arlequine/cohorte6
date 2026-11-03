---
# Plantilla basada en MADR 4.0.0 (https://github.com/adr/madr). Guarda cada ADR como specs/adr/NNNN-titulo-corto.md.
status: "{propuesto | aceptado | rechazado | deprecado | reemplazado por ADR-NNNN}"
date: {AAAA-MM-DD de la última actualización}
decision-makers: {quién decidió: tú, tu equipo; anota si el agente propuso la decisión}
---

# {Título corto que nombre el problema y la solución elegida}

> Un buen ADR no justifica por qué algo es "bueno", sino por qué es la mejor opción entre las disponibles para este caso.

## Contexto y problema

{Dos o tres frases sobre el desafío técnico, de preferencia como pregunta. Di qué componente o unidad afecta.}
*Ejemplo: ¿Cómo procesamos imágenes grandes sin bloquear la API y sin empeorar la latencia del usuario?*

## Factores de decisión

* {Un NFR o restricción que pesa en la decisión. Ejemplo: P95 de la API < 500 ms}
* {Otro factor. Ejemplo: el equipo no tiene experiencia operando colas}

## Opciones consideradas

* {Opción A. Ejemplo: procesamiento síncrono en la API}
* {Opción B. Ejemplo: worker con cola de mensajes}
* {Opción C. Ejemplo: servicio externo}

## Decisión

Opción elegida: "{Opción B}", porque {justificación: el factor que decide}.

### Consecuencias

* Bueno, porque {consecuencia positiva. Ejemplo: la API queda disponible aunque el procesamiento tarde}
* Malo, porque {consecuencia negativa. Toda decisión tiene una. Ejemplo: agrega infraestructura y estados "pendiente" en el frontend}

### Confirmación

{Cómo se verifica que la implementación cumple la decisión: un test, una métrica, una revisión. Ejemplo: test de carga con P95 < 500 ms en CI.}

## Pros y contras de las opciones

### {Opción A}

* Bueno, porque {argumento}
* Malo, porque {argumento}

### {Opción C}

* Bueno, porque {argumento}
* Malo, porque {argumento}

## Más información

{NFR relacionado, enlaces a artefactos de AI-DLC (por ejemplo, `decisions.md` o `nfr-design/`) y cuándo conviene revisar esta decisión.}
