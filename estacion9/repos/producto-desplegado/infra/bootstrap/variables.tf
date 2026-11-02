variable "proyecto" {
  description = "Mismo nombre base que en infra/variables.tf."
  type        = string
  default     = "producto"
}

variable "github_repo" {
  description = "Repo que podrá desplegar, en formato usuario/repo. Ejemplo: ana/ai4dev-ana"
  type        = string

  validation {
    condition     = can(regex("^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$", var.github_repo))
    error_message = "Usa el formato usuario/repo."
  }
}

variable "aws_region" {
  description = "Región de AWS."
  type        = string
  default     = "us-east-1"
}

variable "crear_proveedor_oidc" {
  description = "false si tu cuenta de AWS ya tiene el proveedor OIDC de GitHub (token.actions.githubusercontent.com)."
  type        = bool
  default     = true
}
