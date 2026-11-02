output "tabla_conversaciones" {
  description = "Nombre de la tabla de DynamoDB. Úsalo como DYNAMODB_TABLE en local."
  value       = aws_dynamodb_table.conversaciones.name
}

output "usuario_app" {
  description = "Usuario de IAM que usa la app para leer y escribir el historial."
  value       = aws_iam_user.app.name
}

output "variables_en_vercel" {
  description = "Variables de entorno que Terraform definió en Vercel."
  value       = var.gestionar_vercel ? ["DYNAMODB_TABLE", "APP_AWS_REGION", "APP_AWS_ACCESS_KEY_ID", "APP_AWS_SECRET_ACCESS_KEY"] : []
}
