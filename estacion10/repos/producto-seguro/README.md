# Producto seguro · solución de referencia de la Estación 10

El producto desplegado de la [Estación 9](../../../estacion9/repos/producto-desplegado) más los controles de seguridad y la recuperación ante desastres de la Estación 10.

## Qué agrega respecto a la Estación 9

| Pieza | Archivos |
|---|---|
| SAST con Semgrep (código y Terraform) en el pipeline | job `sast` en `.github/workflows/ci.yml` |
| Auditoría de dependencias en el pipeline | job `dependencias` en `.github/workflows/ci.yml` |
| Actualizaciones automáticas de npm, Actions y Terraform | `.github/dependabot.yml` |
| El apply y el deploy esperan a que pasen los controles | `needs` del job `infra` |
| Defensas contra inyección y filtración de instrucciones | `lib/agent.ts` (regla, canario y `filtrarSalida`) y sus tests |
| Red team contra el endpoint propio | `scripts/red-team.mjs` |
| Point-in-time recovery y protección contra borrado en producción | `infra/main.tf` |
| Permiso para activar PITR desde el pipeline | `infra/bootstrap/main.tf` |
| Copia de datos desde una tabla restaurada | `scripts/restaurar-historial.mjs` |
| Ejemplos llenos: modelo de amenazas, reporte de seguridad y runbook de DR | `docs/` |

## Pipeline

```
verificar ─┐
secretos ──┤
sast ──────┼─► terraform plan (PR) / apply (main) ─► deploy (main)
dependencias┘
```

## Red team

Solo contra tu propia instancia o con autorización:

```bash
AGENT_URL=https://tu-app.vercel.app AGENT_ACCESS_TOKEN=... node scripts/red-team.mjs --salida docs/red-team.md
```

Sale con código 1 si algún caso falla o no se pudo evaluar. Los casos que dependen del modelo pueden variar entre corridas: repite la prueba antes de dar un hallazgo por cerrado.

## Notas
- Si ya aplicaste el bootstrap de la Estación 9, vuelve a aplicarlo: ahora el rol del pipeline necesita `dynamodb:UpdateContinuousBackups` para activar PITR.
- Con la protección contra borrado activa, `terraform destroy` falla en producción. Para eliminar la tabla, primero cambia `deletion_protection_enabled` en un PR.
