---
name: nuevo-endpoint
description: Úsala cuando haya que agregar una ruta de API nueva en app/api. Sigue el patrón del proyecto para validación, errores, logs y tests.
---

# Agregar una ruta de API

Usa `app/api/agent/route.ts` como referencia.

1. Pon la lógica en una función de `lib/` que reciba sus dependencias como parámetros, para poder probarla con dobles.
2. Crea `app/api/<nombre>/route.ts` y exporta la función del método HTTP (`GET`, `POST`…).
3. Valida la entrada antes de usarla. Si es inválida, responde `400` con `{ "error": "..." }`.
4. Envuelve las llamadas externas en `try/catch`; si fallan, registra con `log('error', ...)` y responde `502`.
5. Registra el resultado con `log('info', '<ruta>.<evento>', { ...campos útiles })`, incluyendo `duracion_ms`.
6. Agrega tests en `tests/`: el caso válido, al menos un caso inválido y el caso de fallo externo.
7. Termina con la skill `verificar-antes-de-entregar`.
