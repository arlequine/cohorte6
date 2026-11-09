---
name: iac
description: Convenciones de infraestructura como código de este proyecto — Terraform en infra/ con AWS (DynamoDB, IAM) y Vercel, mismos módulos para LocalStack y producción, mínimo privilegio, nombres y variables APP_AWS_, plan antes de apply y uso de los MCP de Terraform y AWS Documentation. Úsala al crear o modificar cualquier archivo .tf o .tfvars, scripts/tf-local.sh o el job de infraestructura del pipeline.
---

# Infraestructura como código

## Dónde va cada cosa

```
infra/main.tf            → recursos: tabla de DynamoDB, usuario de IAM y variables de Vercel
infra/variables.tf       → entradas, cada una con description en español
infra/outputs.tf         → salidas que usa el pipeline o el alumno
infra/local.tfvars       → LocalStack: otro endpoint, Vercel apagado (gestionar_vercel = false)
infra/produccion.tfvars  → AWS real + Vercel
infra/backend.tf         → estado en S3 con bloqueo (use_lockfile); en local lo reemplaza tf-local.sh
infra/bootstrap/         → bucket del estado y rol OIDC del pipeline; se aplica una vez a mano
scripts/tf-local.sh      → plan, apply o destroy contra LocalStack con estado local
```

## Reglas

1. **Nada a mano.** Ningún recurso se crea ni se cambia desde la consola de AWS o el dashboard de Vercel. Si hace falta, va en `infra/`.
2. **Un código, dos destinos.** La diferencia entre LocalStack y producción vive solo en los `.tfvars`. No agregues `count` ni condiciones por entorno fuera de `gestionar_vercel`.
3. **Mínimo privilegio.** La política del usuario de la app lista acciones concretas sobre el ARN exacto de su tabla. Nunca `"*"` en `Action` ni en `Resource`.
4. **Nombres.** `${var.proyecto}-${var.entorno}-<componente>` con `local.nombre`.
5. **Variables de la app en Vercel** con el prefijo `APP_AWS_`: Vercel reserva `AWS_*`. Los secretos van como variables sensibles, nunca en `outputs.tf` sin `sensitive = true`.
6. **Nivel gratuito.** DynamoDB en modo provisionado con 1 unidad de lectura y 1 de escritura. No cambies a `PAY_PER_REQUEST` ni agregues servicios que cobran por hora sin decirlo en el PR.
7. **Versiones** de Terraform y providers según `versions.md` del repo del programa.

## Cómo trabaja el agente

1. Antes de escribir un recurso, consulta su schema con el **MCP de Terraform**. No escribas atributos de memoria.
2. Si hay dudas de límites, precios o permisos de IAM, consulta el **MCP de AWS Documentation** y cita la página.
3. Después de cada cambio: `terraform fmt -recursive` y `terraform validate` en `infra/`, y `bash scripts/tf-local.sh plan`.
4. Muestra el plan y espera aprobación antes de cualquier `apply`. En producción, el `apply` solo lo hace el pipeline al fusionar en `main`.
5. Si el plan quiere destruir y recrear la tabla, detente y explica por qué: se pierde el historial.

Si tu herramienta no tiene los MCP configurados, `mcp/README.md` tiene la configuración para las cinco.
