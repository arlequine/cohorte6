locals {
  nombre = "${var.proyecto}-${var.entorno}"
}

# ── Datos: historial de conversaciones del agente ──────────────────────────────
resource "aws_dynamodb_table" "conversaciones" {
  name         = "${local.nombre}-conversaciones"
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
}

# ── Identidad de la app: usuario con permisos mínimos sobre la tabla ──────────
resource "aws_iam_user" "app" {
  name = "${local.nombre}-app"
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
