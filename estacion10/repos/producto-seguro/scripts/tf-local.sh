#!/usr/bin/env bash
# Corre Terraform contra LocalStack con un estado local, sin tocar AWS ni Vercel.
# Uso: bash scripts/tf-local.sh plan | apply | destroy
# Requiere LocalStack corriendo: docker compose up -d (con LOCALSTACK_AUTH_TOKEN definido).
set -euo pipefail

accion="${1:-plan}"
cd "$(dirname "$0")/../infra"

# Reemplaza el backend S3 por uno local solo en tu máquina (el archivo está en .gitignore).
cat > backend_override.tf <<'HCL'
terraform {
  backend "local" {
    path = "terraform-local.tfstate"
  }
}
HCL

# El provider de Vercel se configura aunque en local no se use: un token de relleno basta.
export VERCEL_API_TOKEN="${VERCEL_API_TOKEN:-sin-uso-en-local}"

terraform init -input=false -reconfigure >/dev/null
case "$accion" in
  plan)    terraform plan -var-file=local.tfvars ;;
  apply)   terraform apply -var-file=local.tfvars -auto-approve ;;
  destroy) terraform destroy -var-file=local.tfvars -auto-approve ;;
  *) echo "Uso: bash scripts/tf-local.sh plan | apply | destroy" >&2; exit 1 ;;
esac
