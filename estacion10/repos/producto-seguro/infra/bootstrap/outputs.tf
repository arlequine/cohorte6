output "rol_github_actions" {
  description = "Guárdalo en GitHub como variable AWS_ROLE_ARN (Settings → Secrets and variables → Actions → Variables)."
  value       = aws_iam_role.github_actions.arn
}

output "bucket_estado" {
  description = "Guárdalo en GitHub como variable TF_STATE_BUCKET y úsalo en infra/backend.hcl."
  value       = aws_s3_bucket.estado.bucket
}

output "limite_app" {
  description = "Límite de permisos que debe llevar el usuario de IAM de la app."
  value       = aws_iam_policy.limite_app.arn
}
