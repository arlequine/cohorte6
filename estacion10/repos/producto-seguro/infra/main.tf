data "aws_caller_identity" "actual" {}

locals {
  nombre = "${var.proyecto}-${var.entorno}"
  # Lo crea infra/bootstrap. En LocalStack no existe, así que solo se usa en producción.
  limite_app = "arn:aws:iam::${data.aws_caller_identity.actual.account_id}:policy/${var.proyecto}-limite-app"
}

# ── Datos: historial de conversaciones del agente ──────────────────────────────
# DynamoDB cifra siempre los datos en reposo con una llave propiedad de AWS. Semgrep pide una llave de KMS
# administrada, que agrega costo por petición y permisos de KMS; se acepta como falso positivo (H7 en docs/seguridad.md).
# nosemgrep: terraform.aws.security.aws-dynamodb-table-unencrypted.aws-dynamodb-table-unencrypted
resource "aws_dynamodb_table" "conversaciones" {
  name = "${local.nombre}-conversaciones"
  # Modo provisionado con la capacidad mínima: queda dentro del nivel gratuito permanente de DynamoDB
  # (25 unidades de lectura, 25 de escritura y 25 GB por cuenta y región). El modo bajo demanda
  # (PAY_PER_REQUEST) no entra en ese nivel gratuito: se cobra cada petición.
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  # DynamoDB borra cada conversación cuando llega la fecha de expira_en (30 días).
  ttl {
    attribute_name = "expira_en"
    enabled        = true
  }

  # Recuperación ante desastres (Estación 10): restaurar la tabla a cualquier segundo de los últimos 35 días.
  # Cuesta por GB almacenado; con el volumen de práctica son centavos. En local no se activa.
  point_in_time_recovery {
    enabled = var.entorno == "produccion"
  }

  # Evita que un terraform destroy o un error borre la tabla de producción.
  deletion_protection_enabled = var.entorno == "produccion"
}

# ── Identidad de la app: usuario con permisos mínimos sobre la tabla ──────────
resource "aws_iam_user" "app" {
  name                 = "${local.nombre}-app"
  permissions_boundary = var.entorno == "produccion" ? local.limite_app : null
}

resource "aws_iam_user_policy" "app_dynamodb" {
  name = "acceso-conversaciones"
  user = aws_iam_user.app.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan"]
      Resource = aws_dynamodb_table.conversaciones.arn
    }]
  })
}

# La llave queda en el estado de Terraform: por eso el estado vive en un bucket cifrado y privado.
resource "aws_iam_access_key" "app" {
  user = aws_iam_user.app.name
}

# ── Vercel: variables de entorno de producción ────────────────────────────────
# Vercel reserva los nombres AWS_*, por eso la app usa el prefijo APP_AWS_.
data "vercel_project" "app" {
  count = var.gestionar_vercel ? 1 : 0
  name  = var.vercel_proyecto
}

resource "vercel_project_environment_variable" "tabla" {
  count      = var.gestionar_vercel ? 1 : 0
  project_id = data.vercel_project.app[0].id
  key        = "DYNAMODB_TABLE"
  value      = aws_dynamodb_table.conversaciones.name
  target     = ["production"]
  sensitive  = false
}

resource "vercel_project_environment_variable" "region" {
  count      = var.gestionar_vercel ? 1 : 0
  project_id = data.vercel_project.app[0].id
  key        = "APP_AWS_REGION"
  value      = var.aws_region
  target     = ["production"]
  sensitive  = false
}

resource "vercel_project_environment_variable" "access_key_id" {
  count      = var.gestionar_vercel ? 1 : 0
  project_id = data.vercel_project.app[0].id
  key        = "APP_AWS_ACCESS_KEY_ID"
  value      = aws_iam_access_key.app.id
  target     = ["production"]
  sensitive  = true
}

resource "vercel_project_environment_variable" "secret_access_key" {
  count      = var.gestionar_vercel ? 1 : 0
  project_id = data.vercel_project.app[0].id
  key        = "APP_AWS_SECRET_ACCESS_KEY"
  value      = aws_iam_access_key.app.secret
  target     = ["production"]
  sensitive  = true
}
