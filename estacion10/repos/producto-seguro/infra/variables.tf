variable "proyecto" {
  description = "Nombre base de los recursos. Solo minúsculas, números y guiones."
  type        = string
  default     = "producto"

  validation {
    condition     = can(regex("^[a-z0-9-]{3,30}$", var.proyecto))
    error_message = "Usa de 3 a 30 caracteres: minúsculas, números y guiones."
  }
}

variable "entorno" {
  description = "local (LocalStack) o produccion (AWS real)."
  type        = string

  validation {
    condition     = contains(["local", "produccion"], var.entorno)
    error_message = "El entorno debe ser local o produccion."
  }
}

variable "aws_region" {
  description = "Región de AWS."
  type        = string
  default     = "us-east-1"
}

variable "aws_endpoint" {
  description = "Endpoint de AWS. Vacío para AWS real; http://localhost:4566 para LocalStack."
  type        = string
  default     = ""
}

variable "gestionar_vercel" {
  description = "Si es true, Terraform define en Vercel las variables de entorno que necesita la app."
  type        = bool
  default     = false
}

variable "vercel_proyecto" {
  description = "Nombre del proyecto en Vercel (el que creaste en la Estación 3)."
  type        = string
  default     = ""
}

variable "vercel_team" {
  description = "ID o slug del equipo de Vercel. Vacío para una cuenta personal."
  type        = string
  default     = ""
}
