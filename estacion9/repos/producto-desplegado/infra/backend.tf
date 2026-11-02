# Estado remoto en S3, con bloqueo nativo (use_lockfile). El bucket lo crea infra/bootstrap.
# Los valores se pasan al iniciar:
#   terraform init -backend-config=backend.hcl
# En local, scripts/tf-local.sh crea backend_override.tf para usar un estado local.
terraform {
  backend "s3" {}
}
