locals {
  es_local = var.aws_endpoint != ""
}

provider "aws" {
  region = var.aws_region

  # Con LocalStack: credenciales de prueba y todos los servicios apuntando al emulador.
  access_key                  = local.es_local ? "test" : null
  secret_key                  = local.es_local ? "test" : null
  skip_credentials_validation = local.es_local
  skip_metadata_api_check     = local.es_local
  skip_requesting_account_id  = local.es_local

  dynamic "endpoints" {
    for_each = local.es_local ? [var.aws_endpoint] : []
    content {
      dynamodb = endpoints.value
      iam      = endpoints.value
      sts      = endpoints.value
    }
  }

  default_tags {
    tags = {
      proyecto   = var.proyecto
      entorno    = var.entorno
      gestionado = "terraform"
    }
  }
}

# El token se lee de la variable de entorno VERCEL_API_TOKEN.
provider "vercel" {
  team = var.vercel_team != "" ? var.vercel_team : null
}
