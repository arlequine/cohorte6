# Runbook de recuperación ante desastres · Producto de referencia (Estación 10)

**Última prueba de restauración:** pendiente. Hazla una vez en tu cuenta y registra el resultado abajo.

## Objetivos

| Objetivo | Valor | Por qué |
|---|---|---|
| RPO | 5 minutos | Point-in-time recovery restaura a cualquier segundo de los últimos 35 días; el margen cubre la detección |
| RTO | 1 hora | Restaurar una tabla pequeña toma minutos; el resto es verificar y comunicar |

## Qué se puede recuperar y cómo

| Componente | Respaldo | Cómo se recupera |
|---|---|---|
| Código | Git en GitHub | `git revert` o volver a desplegar un commit anterior desde el pipeline |
| Infraestructura | `infra/` en Git; estado en S3 con versiones | `terraform apply` desde el pipeline; si el estado se corrompe, recuperar una versión anterior del objeto en S3 |
| Historial (DynamoDB) | Point-in-time recovery (35 días); protección contra borrado | Escenario E1 |
| Secretos | Vercel y el estado de Terraform | Escenario E3 |

## Escenarios

### E1 · Se borraron o corrompieron conversaciones
1. **Detectar.** `GET /api/historial` devuelve datos raros o vacíos, o lo reporta un usuario.
2. **Contener.** Si el origen es un bug, revierte el último deploy desde el pipeline.
3. **Restaurar a una tabla nueva** (con credenciales de administrador, no desde el pipeline). Elige un momento anterior al problema:
   ```bash
   aws dynamodb restore-table-to-point-in-time \
     --source-table-name producto-produccion-conversaciones \
     --target-table-name producto-produccion-conversaciones-restaurada \
     --restore-date-time 2026-11-02T10:00:00Z
   aws dynamodb wait table-exists --table-name producto-produccion-conversaciones-restaurada
   ```
4. **Copiar los datos de vuelta** a la tabla original, que es la que gestiona Terraform:
   ```bash
   node scripts/restaurar-historial.mjs \
     --origen producto-produccion-conversaciones-restaurada \
     --destino producto-produccion-conversaciones          # sin --aplicar: solo cuenta
   node scripts/restaurar-historial.mjs ... --aplicar       # copia de verdad
   ```
5. **Verificar.** `GET /api/historial` muestra las conversaciones esperadas.
6. **Limpiar.** Borra la tabla `-restaurada`; no está en Terraform y genera costo.
7. **Comunicar.** Registra el incidente y la prueba en la tabla de abajo.

### E2 · Se borró la tabla
La protección contra borrado impide un `terraform destroy` o un `DeleteTable` accidental en producción. Si aun así se borra, la restauración por point-in-time sigue disponible: restaura con el nombre original (`--target-table-name producto-produccion-conversaciones`) y corre el pipeline para que Terraform vuelva a reconocer la configuración.

### E3 · Se filtró un secreto
| Secreto | Dónde se rota | Qué más revisar |
|---|---|---|
| `ANTHROPIC_API_KEY` | Consola de Anthropic, luego la variable en Vercel | Uso y gasto de la API en las últimas horas |
| `AGENT_ACCESS_TOKEN` | Generar uno nuevo y actualizar la variable en Vercel | Logs con `agente.respuesta` desde IPs desconocidas |
| Llave de IAM de la app | Con credenciales de administrador, en `infra/`: `terraform apply -replace=aws_iam_access_key.app -var-file=produccion.tfvars`. Terraform crea una llave nueva y actualiza Vercel; después vuelve a desplegar | CloudTrail del usuario `producto-produccion-app` |
| `VERCEL_TOKEN` | Dashboard de Vercel, luego el secreto en GitHub | Deploys recientes en Vercel |

## Registro de pruebas

| Fecha | Escenario | Quién | Tiempo real | Resultado |
|---|---|---|---|---|
| | E1 | | | |
