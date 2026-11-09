# Configuración de MCP por herramienta

Cada coding agent configura sus servidores MCP en un archivo distinto. Cuando una estación use un servidor MCP, la guía trae la configuración para las cinco herramientas. Este archivo trae primero los tres MCP de la Estación 9 y después el de Playwright, que se usa en la Estación 8.

| Herramienta | Dónde se configura | Formato |
|---|---|---|
| **Claude Code** (referencia) | `.mcp.json` en la raíz del repo | JSON, clave `mcpServers` |
| Cursor | `.cursor/mcp.json` en el repo, o `~/.cursor/mcp.json` | JSON, clave `mcpServers` |
| Codex | `.codex/config.toml` en el repo, o `~/.codex/config.toml` | TOML, tabla `[mcp_servers.<nombre>]` |
| Antigravity | Archivo `mcp_config.json` global, o el comando `/mcp` dentro de `agy` | JSON, clave `mcpServers` |
| GitHub Copilot | VS Code: `.vscode/mcp.json`. CLI: comando `/mcp add` | JSON, clave `servers` en VS Code |

## Estación 9: Terraform, AWS Documentation y LocalStack

| Servidor | Para qué lo usa el agente | Necesita |
|---|---|---|
| `terraform` | El schema real de cada recurso y provider del Registry, en lugar de escribir atributos de memoria | Docker |
| `aws-documentation` | Buscar y leer la documentación oficial de AWS (límites, nivel gratuito, permisos de IAM) | [`uv`](https://docs.astral.sh/uv/getting-started/installation/) (trae `uvx`) |
| `localstack` | Levantar, revisar y consultar LocalStack desde el agente | Node.js y `LOCALSTACK_AUTH_TOKEN` exportado en tu terminal |

El token de LocalStack nunca va escrito en el archivo: cada herramienta lo lee de tu entorno o te lo pide.

**Claude Code** (`.mcp.json` en la raíz). Claude Code reemplaza `${VAR}` por la variable de tu entorno:

```json
{
  "mcpServers": {
    "terraform": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"]
    },
    "aws-documentation": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": { "FASTMCP_LOG_LEVEL": "ERROR", "AWS_DOCUMENTATION_PARTITION": "aws" }
    },
    "localstack": {
      "command": "npx",
      "args": ["-y", "@localstack/localstack-mcp-server"],
      "env": { "LOCALSTACK_AUTH_TOKEN": "${LOCALSTACK_AUTH_TOKEN}" }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`). Igual que el de Claude Code, pero la variable se escribe `${env:LOCALSTACK_AUTH_TOKEN}`:

```json
{
  "mcpServers": {
    "terraform": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"]
    },
    "aws-documentation": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": { "FASTMCP_LOG_LEVEL": "ERROR", "AWS_DOCUMENTATION_PARTITION": "aws" }
    },
    "localstack": {
      "command": "npx",
      "args": ["-y", "@localstack/localstack-mcp-server"],
      "env": { "LOCALSTACK_AUTH_TOKEN": "${env:LOCALSTACK_AUTH_TOKEN}" }
    }
  }
}
```

**Codex** (`.codex/config.toml`; Codex solo lo lee si confías en el proyecto). `env_vars` reenvía la variable de tu terminal:

```toml
[mcp_servers.terraform]
command = "docker"
args = ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"]

[mcp_servers.aws-documentation]
command = "uvx"
args = ["awslabs.aws-documentation-mcp-server@latest"]
env = { FASTMCP_LOG_LEVEL = "ERROR", AWS_DOCUMENTATION_PARTITION = "aws" }

[mcp_servers.localstack]
command = "npx"
args = ["-y", "@localstack/localstack-mcp-server"]
env_vars = ["LOCALSTACK_AUTH_TOKEN"]
```

**GitHub Copilot en VS Code** (`.vscode/mcp.json`). VS Code te pide el token la primera vez y lo guarda cifrado:

```json
{
  "inputs": [
    { "type": "promptString", "id": "localstack-token", "description": "Token de LocalStack", "password": true }
  ],
  "servers": {
    "terraform": {
      "type": "stdio",
      "command": "docker",
      "args": ["run", "-i", "--rm", "hashicorp/terraform-mcp-server"]
    },
    "aws-documentation": {
      "type": "stdio",
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": { "FASTMCP_LOG_LEVEL": "ERROR", "AWS_DOCUMENTATION_PARTITION": "aws" }
    },
    "localstack": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@localstack/localstack-mcp-server"],
      "env": { "LOCALSTACK_AUTH_TOKEN": "${input:localstack-token}" }
    }
  }
}
```

**Antigravity:** dentro de `agy`, agrega cada servidor con `/mcp` usando el mismo comando y argumentos. Exporta `LOCALSTACK_AUTH_TOKEN` en tu terminal antes de abrir `agy`.

**Para comprobar que funcionan**, pídele a tu agente: *"Con el MCP de Terraform, dime qué argumentos acepta `aws_dynamodb_table` para el TTL"*. Si responde citando el schema del provider y no de memoria, el MCP está conectado.

Si no tienes uno de los requisitos (por ejemplo, Docker o `uv`), quita ese servidor del archivo: el ejercicio de la estación se puede hacer sin MCP, solo con más revisión de tu parte.

## Estación 8: Playwright MCP

**Claude Code** (`.mcp.json`) y **Cursor** (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Codex** (`.codex/config.toml`):

```toml
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

**GitHub Copilot en VS Code** (`.vscode/mcp.json`):

```json
{
  "servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Antigravity:** dentro de `agy`, usa `/mcp` para agregar el servidor con el mismo comando y argumentos. La ubicación del archivo global puede cambiar entre versiones: revisa la [documentación de MCP de Antigravity](https://antigravity.google/docs/mcp).

> Nunca pongas llaves o tokens directamente en estos archivos si los vas a subir al repo. Usa variables de entorno.
