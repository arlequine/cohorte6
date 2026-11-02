# Se aplica una sola vez, con tus credenciales de AWS, antes del primer pipeline.
# Crea lo que el pipeline necesita para existir: el bucket del estado y el rol que asume GitHub Actions.
# Su propio estado queda local (terraform.tfstate en esta carpeta, ignorado por git): guárdalo en un lugar seguro.
terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
