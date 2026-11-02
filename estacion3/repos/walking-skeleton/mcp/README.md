# Configuración de MCP por herramienta

Cada coding agent configura sus servidores MCP en un archivo distinto. Cuando una estación use un servidor MCP, la guía trae la configuración para las cinco herramientas. Este ejemplo usa el MCP de Playwright, que se usa en la Estación 8.

| Herramienta | Dónde se configura | Formato |
|---|---|---|
| **Claude Code** (referencia) | `.mcp.json` en la raíz del repo | JSON, clave `mcpServers` |
| Cursor | `.cursor/mcp.json` en el repo, o `~/.cursor/mcp.json` | JSON, clave `mcpServers` |
| Codex | `.codex/config.toml` en el repo, o `~/.codex/config.toml` | TOML, tabla `[mcp_servers.<nombre>]` |
| Antigravity | Archivo `mcp_config.json` global, o el comando `/mcp` dentro de `agy` | JSON, clave `mcpServers` |
| GitHub Copilot | VS Code: `.vscode/mcp.json`. CLI: comando `/mcp add` | JSON, clave `servers` en VS Code |

## Ejemplo: Playwright MCP

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
