# Producto desplegado · solución de referencia de la Estación 9

El walking skeleton de la [Estación 3](../../../estacion3/repos/walking-skeleton) más lo que se construye en la Estación 9: historial en DynamoDB, infraestructura en Terraform (AWS y Vercel) y un pipeline que despliega a producción después de revisar el plan.

## Qué agrega respecto a la Estación 3

| Pieza | Archivos |
|---|---|
| Historial de conversaciones con TTL de 30 días | `lib/historial.ts`, `app/api/historial/route.ts` |
| Verificación del token compartida | `lib/auth.ts` |
| Tabla de DynamoDB, usuario de IAM y variables de producción en Vercel | `infra/main.tf` |
| Mismo código para LocalStack y AWS | `infra/local.tfvars`, `infra/produccion.tfvars`, `scripts/tf-local.sh`, `docker-compose.yml` |
| Bucket del estado y rol de GitHub Actions por OIDC | `infra/bootstrap/` |
| Pipeline completo | `.github/workflows/ci.yml` |
| Producción solo desde el pipeline | `vercel.json` |
| Tests del historial y de la ruta con el historial activo o caído | `tests/historial.test.ts`, `tests/route.test.ts` |

## Endpoints

| Método y ruta | Respuesta |
|---|---|
| `GET /api/health` | `{ "estado": "ok" }` |
| `POST /api/agent` | `{ "respuesta", "modelo", "tokens" }`, y guarda la conversación si `DYNAMODB_TABLE` está definida |
| `GET /api/historial` | `{ "conversaciones": [...] }` con las 10 más recientes; 503 si el historial no está configurado |

Los dos endpoints del agente exigen `Authorization: Bearer <token>` si `AGENT_ACCESS_TOKEN` está definido.

## Pipeline

```
Pull request ─► verificar ─► secretos ─► terraform plan ─► comentario en el PR
Push a main ──► verificar ─► secretos ─► terraform apply ─► deploy a producción en Vercel
```

Los jobs de infraestructura y deploy se omiten hasta que el repo tenga la variable `AWS_ROLE_ARN`. La configuración completa está en la guía de la [Estación 9](../../README.md).

## En local

```bash
npm install
cp .env.example .env          # ANTHROPIC_API_KEY y, si quieres historial, las variables de LocalStack
export LOCALSTACK_AUTH_TOKEN=ls-...
docker compose up -d
bash scripts/tf-local.sh apply
npm run dev
```

## Notas
- Vercel reserva los nombres `AWS_*`; por eso la app usa `APP_AWS_REGION`, `APP_AWS_ACCESS_KEY_ID` y `APP_AWS_SECRET_ACCESS_KEY`.
- Las variables que Terraform define en Vercel son solo de producción. Los despliegues de vista previa de los PR no tienen historial.
- La tabla está en modo provisionado con la capacidad mínima (1 y 1) para quedar dentro del nivel gratuito permanente de DynamoDB. El modo bajo demanda cobra cada petición.
- La llave del usuario de IAM queda en el estado de Terraform. Por eso el estado vive en un bucket privado, cifrado y con versiones.
