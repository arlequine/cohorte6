# Estación 9 · Despliegue con infraestructura como código

## Objetivo
Que toda la infraestructura de tu producto quede descrita en código y que cada cambio llegue a producción por un pipeline: tests, `terraform plan` revisado en el pull request, `terraform apply` al fusionar y deploy automático.

## Antes de la clase
- Tu repo personal con el walking skeleton de la Estación 3 desplegado en Vercel y CI en verde
- Terraform 1.10 o superior (`terraform -version`) y AWS CLI
- Una cuenta de AWS con permisos de administrador sobre una cuenta de práctica (no la de producción de tu empresa)
- Un token de Vercel ([vercel.com/account/tokens](https://vercel.com/account/tokens))
- Docker y una cuenta gratuita de LocalStack con su token, si quieres probar en local (ver "Probar en local")

## Tres formas de desplegar con IaC

En el programa usamos la **ruta C**, pero las tres son válidas y conviene saber cuándo elegir cada una.

| Ruta | Qué gestiona Terraform | Cuándo conviene |
|---|---|---|
| A. Vercel para la app, Terraform solo para AWS | Recursos de apoyo en AWS (datos, colas, archivos). La configuración de Vercel se hace a mano | Equipos que ya usan Vercel y solo necesitan algunos servicios de AWS |
| B. Todo en AWS | La app y su infraestructura: red, cómputo (ECS, Lambda o App Runner), balanceador, datos | Cuando la empresa estandariza en AWS, o hay requisitos de red, cumplimiento o residencia de datos |
| **C. Vercel + AWS, todo con Terraform (la del programa)** | Recursos de AWS **y** la configuración del proyecto en Vercel (variables de entorno) | Quieres el frontend en una plataforma administrada y, aun así, toda la infraestructura en código y revisable |

La ruta B está documentada con un ejemplo completo de la Cohorte 4 en [`repos/iac-infra/`](repos/iac-infra) (VPC, ECS, balanceador y EC2 sobre LocalStack y AWS). Úsala como referencia si tu empresa despliega todo en AWS, o como reto del track avanzado. Ten en cuenta que ese ejemplo usa servicios de pago de LocalStack y genera costo en AWS aunque no haya tráfico.

## Ruta de la sesión (120 min)

| Minutos | Actividad | Resultado |
|---|---|---|
| 0–15 | Modelos de servicio (IaaS, PaaS, FaaS) y las tres rutas de despliegue | Saber por qué el programa usa la ruta C y cuándo usarías otra |
| 15–30 | IaC con Terraform: `init → plan → apply`, estado, idempotencia y drift | Entender qué hace cada comando y por qué el estado importa |
| 30–45 | Demo: la misma configuración contra LocalStack y contra AWS | Ver el cambio de entorno sin tocar el código |
| 45–55 | OIDC: cómo GitHub Actions obtiene credenciales de AWS sin llaves guardadas | Saber qué crea el bootstrap y por qué |
| 55–60 | Pausa | |
| 60–105 | Trabajo práctico: bootstrap, infraestructura y pipeline en tu repo | Tu pipeline completo funcionando |
| 105–115 | Drift: un cambio manual en la consola y cómo lo detecta `terraform plan` | Entender por qué nada se cambia a mano |
| 115–120 | Entregable y conexión con la Estación 10 | Claridad sobre lo que sigue |

## Ejemplo trabajado
La solución de referencia está en [`repos/producto-desplegado/`](repos/producto-desplegado). Es el walking skeleton de la Estación 3 más lo que construyes hoy:

| Pieza | Archivos |
|---|---|
| Historial de conversaciones del agente en DynamoDB | `lib/historial.ts`, `app/api/historial/route.ts` |
| Tabla de DynamoDB, usuario de IAM con permisos mínimos y variables en Vercel | `infra/main.tf` |
| LocalStack y AWS con el mismo código | `infra/local.tfvars`, `infra/produccion.tfvars`, `scripts/tf-local.sh` |
| Bucket del estado y rol de GitHub Actions por OIDC | `infra/bootstrap/` |
| Pipeline: verify, secretos, plan en el PR, apply y deploy en main | `.github/workflows/ci.yml` |
| Producción solo se despliega desde el pipeline | `vercel.json` |

```
Pull request ─► verificar ─► secretos ─► terraform plan ─► comentario en el PR
Push a main ──► verificar ─► secretos ─► terraform apply ─► deploy a producción en Vercel
```

## Tu tarea

Trabaja en tu repo personal, con tu coding agent. Usa el skill y los MCPs de IaC si tu herramienta los tiene configurados (Terraform MCP y AWS Documentation MCP: ver `mcp/README.md`).

1. **Agrega el historial en DynamoDB.** Pide a tu agente que guarde cada conversación en una tabla (`DYNAMODB_TABLE`) con un TTL de 30 días y que exponga `GET /api/historial` protegido con el mismo token. Con tests que no llamen a AWS.
2. **Escribe la infraestructura en `infra/`.** La tabla de DynamoDB, un usuario de IAM con permisos solo sobre esa tabla y las variables de entorno de producción en Vercel. Recuerda que Vercel reserva los nombres `AWS_*`: usa el prefijo `APP_AWS_`.
3. **Pruébala en local** con LocalStack (ver "Probar en local").
4. **Corre el bootstrap una vez** con tus credenciales de AWS:
   ```bash
   cd infra/bootstrap
   cp terraform.tfvars.example terraform.tfvars   # pon tu usuario/repo
   terraform init && terraform apply
   ```
   Guarda el estado que queda en esa carpeta en un lugar seguro: no se sube al repo.
5. **Configura GitHub** (Settings → Secrets and variables → Actions):

   | Tipo | Nombre | Valor |
   |---|---|---|
   | Variable | `AWS_ROLE_ARN` | Salida `rol_github_actions` del bootstrap |
   | Variable | `TF_STATE_BUCKET` | Salida `bucket_estado` del bootstrap |
   | Variable | `VERCEL_PROJECT_NAME` | Nombre de tu proyecto en Vercel |
   | Variable | `AWS_REGION` | Opcional; por defecto `us-east-1` |
   | Variable | `VERCEL_TEAM` | Opcional; solo si tu proyecto está en un equipo de Vercel |
   | Secreto | `VERCEL_TOKEN` | Tu token de Vercel |
   | Secreto | `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` | De `.vercel/project.json` después de correr `npx vercel link` |

6. **Agrega el pipeline** con los jobs de infraestructura y deploy, y `vercel.json` para que producción solo se despliegue desde el pipeline.
7. **Abre un PR**, revisa el plan que el pipeline comenta y fusiónalo. Comprueba que `GET /api/historial` devuelve tus conversaciones en producción.

## Probar en local

Desde marzo de 2026, LocalStack exige una cuenta y un token también en su plan gratuito (Hobby, para uso no comercial). Crea el token en [app.localstack.cloud](https://app.localstack.cloud/workspace/auth-tokens).

```bash
export LOCALSTACK_AUTH_TOKEN=ls-...
docker compose up -d
bash scripts/tf-local.sh apply        # crea la tabla y el usuario en LocalStack
```

Luego, en tu `.env`, activa el historial apuntando a LocalStack (`DYNAMODB_TABLE`, `APP_AWS_ENDPOINT=http://localhost:4566` y las credenciales `test`; ver `.env.example`) y corre `npm run dev`.

Si tu uso es comercial y no tienes licencia de LocalStack, salta este paso: el `terraform plan` del pipeline cumple la misma función de revisar los cambios antes de aplicarlos.

## Entregable
Un pull request en tu repo personal con la etiqueta `estacion-9`, antes de la Estación 10, que incluya:
- `infra/` con la tabla, el usuario de IAM y las variables de Vercel
- El pipeline con plan comentado en el PR, y el apply y el deploy en main funcionando
- En la descripción: la URL de producción y una respuesta de `GET /api/historial`
- Dos o tres líneas sobre qué detectó el `terraform plan` que no habrías visto a simple vista

## Rúbrica

| Criterio | Cumple | Parcial | No cumple |
|---|---|---|---|
| Infraestructura como código | Tabla, usuario y variables de Vercel en Terraform; nada creado a mano | Parte de la infraestructura creada a mano | Sin Terraform |
| Mínimo privilegio | El usuario de la app solo puede leer y escribir su tabla; el rol del pipeline solo toca recursos del proyecto | Permisos más amplios de lo necesario | Credenciales de administrador en la app o en GitHub |
| Pipeline | Plan en el PR, apply y deploy en main, todo en verde | Falta el plan en el PR o el deploy es manual | No hay pipeline de infraestructura |
| Secretos | OIDC para AWS; ningún secreto en el repo ni en el código | OIDC, pero algún valor sensible en un archivo del repo | Llaves de AWS guardadas en GitHub o en el repo |
| Historial | Se guarda en producción y se puede consultar con token | Funciona solo en local | No funciona |
| Reflexión | Explica qué detectó el plan | Descripción superficial | No hay |

## Cómo alimenta la siguiente estación
En la Estación 10 revisas la seguridad de lo que desplegaste hoy: los permisos de IAM, los secretos y la cadena de suministro entran al mismo pipeline como controles automáticos.

## Track avanzado
- Cambia las llaves del usuario de IAM por [OIDC de Vercel](https://vercel.com/docs/oidc/aws), para que la app tampoco use llaves de larga duración.
- Separa el rol del pipeline en dos: uno de solo lectura para los PR y otro para el apply en main.
- Despliega la app completa en AWS siguiendo la ruta B con [`repos/iac-infra/`](repos/iac-infra) y compara costo y complejidad.

## Recursos
Enlaces revisados el 2 de noviembre de 2026. Versiones fijadas en [`versions.md`](../versions.md).

- [Terraform: backend S3 y bloqueo con `use_lockfile`](https://developer.hashicorp.com/terraform/language/backend/s3)
- [Provider de Vercel para Terraform](https://registry.terraform.io/providers/vercel/vercel/latest/docs) (versión 5.x)
- [GitHub Actions: OIDC con AWS](https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Vercel: despliegues desde GitHub Actions](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel)
- [LocalStack: auth tokens](https://docs.localstack.cloud/getting-started/auth-token/)
- Material de la Cohorte 4 para la ruta B: [`clase-9-estudiante.md`](clase-9-estudiante.md) y [`repos/iac-infra/`](repos/iac-infra)
