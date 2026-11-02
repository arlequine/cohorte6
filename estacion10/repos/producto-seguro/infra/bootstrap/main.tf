data "aws_caller_identity" "actual" {}

locals {
  cuenta = data.aws_caller_identity.actual.account_id
}

# ── Bucket del estado de Terraform: privado, cifrado y con versiones ──────────
resource "aws_s3_bucket" "estado" {
  bucket = "${var.proyecto}-tfstate-${local.cuenta}"
}

resource "aws_s3_bucket_versioning" "estado" {
  bucket = aws_s3_bucket.estado.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "estado" {
  bucket = aws_s3_bucket.estado.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "estado" {
  bucket                  = aws_s3_bucket.estado.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── OIDC: GitHub Actions obtiene credenciales temporales, sin llaves guardadas ─
resource "aws_iam_openid_connect_provider" "github" {
  count          = var.crear_proveedor_oidc ? 1 : 0
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.crear_proveedor_oidc ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  proveedor_oidc_arn = var.crear_proveedor_oidc ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}

# Solo la rama main y los pull requests de tu repo pueden asumir este rol.
resource "aws_iam_role" "github_actions" {
  name = "${var.proyecto}-github-actions"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Federated = local.proveedor_oidc_arn }
      Action    = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = { "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com" }
        StringLike = {
          "token.actions.githubusercontent.com:sub" = [
            "repo:${var.github_repo}:ref:refs/heads/main",
            "repo:${var.github_repo}:pull_request",
          ]
        }
      }
    }]
  })
}

# Permisos acotados a los recursos con el prefijo del proyecto.
resource "aws_iam_role_policy" "github_actions" {
  name = "terraform-${var.proyecto}"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "EstadoListar"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.estado.arn
      },
      {
        Sid      = "EstadoLeerEscribir"
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
        Resource = "${aws_s3_bucket.estado.arn}/*"
      },
      {
        Sid    = "TablaDynamoDB"
        Effect = "Allow"
        Action = [
          "dynamodb:CreateTable", "dynamodb:DeleteTable", "dynamodb:DescribeTable", "dynamodb:UpdateTable",
          "dynamodb:DescribeTimeToLive", "dynamodb:UpdateTimeToLive",
          "dynamodb:DescribeContinuousBackups", "dynamodb:UpdateContinuousBackups",
          "dynamodb:DescribeKinesisStreamingDestination",
          "dynamodb:GetResourcePolicy", "dynamodb:ListTagsOfResource",
          "dynamodb:TagResource", "dynamodb:UntagResource",
        ]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${local.cuenta}:table/${var.proyecto}-*"
      },
      # El pipeline crea el usuario de IAM de la app. Para que no pueda usar eso para escalar privilegios,
      # solo puede crear usuarios o darles políticas si llevan el límite de permisos "limite_app",
      # que restringe cualquier política a leer y escribir las tablas del proyecto (Estación 10, hallazgo H5).
      # Semgrep marca estas acciones por patrón; el riesgo residual está documentado en docs/seguridad.md.
      {
        Sid    = "CrearUsuarioSoloConLimite"
        Effect = "Allow"
        # nosemgrep: terraform.lang.security.iam.no-iam-priv-esc-funcs.no-iam-priv-esc-funcs, terraform.lang.security.iam.no-iam-priv-esc-other-users.no-iam-priv-esc-other-users, terraform.lang.security.iam.no-iam-resource-exposure.no-iam-resource-exposure, terraform.lang.security.iam.no-iam-creds-exposure.no-iam-creds-exposure
        Action   = ["iam:CreateUser", "iam:PutUserPolicy", "iam:PutUserPermissionsBoundary"]
        Resource = "arn:aws:iam::${local.cuenta}:user/${var.proyecto}-*"
        Condition = {
          StringEquals = { "iam:PermissionsBoundary" = aws_iam_policy.limite_app.arn }
        }
      },
      {
        Sid    = "GestionarUsuarioDeLaApp"
        Effect = "Allow"
        # nosemgrep: terraform.lang.security.iam.no-iam-priv-esc-funcs.no-iam-priv-esc-funcs, terraform.lang.security.iam.no-iam-priv-esc-other-users.no-iam-priv-esc-other-users, terraform.lang.security.iam.no-iam-resource-exposure.no-iam-resource-exposure, terraform.lang.security.iam.no-iam-creds-exposure.no-iam-creds-exposure
        Action = [
          "iam:GetUser", "iam:DeleteUser", "iam:TagUser", "iam:UntagUser", "iam:ListUserTags",
          "iam:GetUserPolicy", "iam:DeleteUserPolicy", "iam:ListUserPolicies",
          "iam:ListAttachedUserPolicies", "iam:ListGroupsForUser",
          "iam:CreateAccessKey", "iam:DeleteAccessKey", "iam:ListAccessKeys",
        ]
        Resource = "arn:aws:iam::${local.cuenta}:user/${var.proyecto}-*"
      },
      {
        Sid      = "NoQuitarElLimite"
        Effect   = "Deny"
        Action   = ["iam:DeleteUserPermissionsBoundary"]
        Resource = "*"
      },
    ]
  })
}

# ── Límite de permisos para el usuario de la app ──────────────────────────────
# Aunque el pipeline le asigne otra política, el usuario nunca podrá hacer más que esto.
resource "aws_iam_policy" "limite_app" {
  name        = "${var.proyecto}-limite-app"
  description = "Límite de permisos del usuario de la app: solo leer y escribir las tablas del proyecto"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:Scan"]
      Resource = "arn:aws:dynamodb:${var.aws_region}:${local.cuenta}:table/${var.proyecto}-*"
    }]
  })
}
