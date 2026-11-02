---
name: verificar-antes-de-entregar
description: Úsala antes de dar por terminada cualquier tarea o de abrir un pull request. Corre lint, tipos y tests, y revisa que no haya secretos ni convenciones rotas.
---

# Verificar antes de entregar

1. Corre `npm run verify`. Si algo falla, corrígelo y vuelve a correrlo hasta que pase.
2. Revisa el diff completo (`git diff`) y confirma que:
   - No hay llaves, tokens ni contraseñas en el código.
   - Cada ruta o función nueva en `lib/` tiene tests.
   - No hay `console.log` sueltos: los eventos usan `log()` de `lib/logger.ts`.
3. Si cambiaste algo en `.agents/skills/`, corre `npm run sync-skills`.
4. Resume en dos o tres líneas qué cambió y cómo lo verificaste.
