#!/usr/bin/env bash
# Verifica el entorno de trabajo de AI for Developers · Cohorte 6.
# Uso: bash nivelacion1/verificar-entorno.sh
# Solo lee versiones; no instala ni modifica nada.

set -u

if [ -t 1 ]; then
  VERDE=$'\033[32m'; AMARILLO=$'\033[33m'; ROJO=$'\033[31m'; GRIS=$'\033[90m'; FIN=$'\033[0m'
else
  VERDE=""; AMARILLO=""; ROJO=""; GRIS=""; FIN=""
fi

faltan_obligatorias=0

# Devuelve 0 si la versión $1 es mayor o igual que $2 (formato X.Y[.Z]).
version_ok() {
  [ "$(printf '%s\n%s\n' "$2" "$1" | sort -V | head -n1)" = "$2" ]
}

# revisar <nombre> <comando> <versión mínima o vacío> <obligatoria|despues> <para qué>
revisar() {
  local nombre="$1" cmd="$2" minima="$3" tipo="$4" uso="$5" salida version
  if ! command -v "$cmd" >/dev/null 2>&1; then
    if [ "$tipo" = "obligatoria" ]; then
      printf '%s✗ %-14s%s no encontrado  %s(%s)%s\n' "$ROJO" "$nombre" "$FIN" "$GRIS" "$uso" "$FIN"
      faltan_obligatorias=$((faltan_obligatorias + 1))
    else
      printf '%s○ %-14s%s pendiente      %s(%s)%s\n' "$AMARILLO" "$nombre" "$FIN" "$GRIS" "$uso" "$FIN"
    fi
    return
  fi
  salida="$("$cmd" --version 2>&1 | head -n1)"
  version="$(printf '%s' "$salida" | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1)"
  if [ -n "$minima" ] && [ -n "$version" ] && ! version_ok "$version" "$minima"; then
    if [ "$tipo" = "obligatoria" ]; then
      printf '%s✗ %-14s%s %s (mínimo %s)\n' "$ROJO" "$nombre" "$FIN" "$version" "$minima"
      faltan_obligatorias=$((faltan_obligatorias + 1))
    else
      printf '%s○ %-14s%s %s (mínimo %s)\n' "$AMARILLO" "$nombre" "$FIN" "$version" "$minima"
    fi
    return
  fi
  printf '%s✓ %-14s%s %s\n' "$VERDE" "$nombre" "$FIN" "${version:-$salida}"
}

echo "Obligatorio desde la semana 1"
revisar "Git"         git    2.40 obligatoria "control de versiones"
revisar "Node.js"     node   20.0 obligatoria "todos los proyectos de ejemplo"
revisar "npm"         npm    9.0  obligatoria "dependencias"
revisar "GitHub CLI"  gh     2.40 obligatoria "repo personal y PRs"

# Coding agent: basta con uno. Claude Code es la herramienta de referencia.
agentes=""
for par in "claude:Claude Code" "cursor-agent:Cursor CLI" "cursor:Cursor" "codex:Codex" "agy:Antigravity CLI" "copilot:Copilot CLI"; do
  cmd="${par%%:*}"; nombre="${par#*:}"
  if command -v "$cmd" >/dev/null 2>&1; then
    version="$("$cmd" --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -n1)"
    agentes="${agentes}${nombre}${version:+ $version}, "
  fi
done
if command -v code >/dev/null 2>&1 && code --list-extensions 2>/dev/null | grep -qi '^github\.copilot'; then
  agentes="${agentes}Copilot (VS Code), "
fi
if [ -n "$agentes" ]; then
  printf '%s✓ %-14s%s %s\n' "$VERDE" "Coding agent" "$FIN" "${agentes%, }"
  case "$agentes" in
    *"Claude Code"*) ;;
    *) printf '%s  %-14s%s %sLas demos y el soporte garantizado son en Claude Code%s\n' "" "" "" "$GRIS" "$FIN" ;;
  esac
else
  printf '%s✗ %-14s%s ninguno encontrado  %s(instala uno: ver "Elige tu coding agent")%s\n' "$ROJO" "Coding agent" "$FIN" "$GRIS" "$FIN"
  printf '%s  %-14s%s %sSi usas solo el IDE de Cursor o Antigravity, anótalo a mano en tu entrega%s\n' "" "" "" "$GRIS" "$FIN"
  faltan_obligatorias=$((faltan_obligatorias + 1))
fi

if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    printf '%s✓ %-14s%s sesión iniciada\n' "$VERDE" "gh auth" "$FIN"
  else
    printf '%s✗ %-14s%s sin sesión: corre gh auth login\n' "$ROJO" "gh auth" "$FIN"
    faltan_obligatorias=$((faltan_obligatorias + 1))
  fi
fi

echo
echo "Para más adelante"
revisar "Docker"      docker    ""  despues "semana 6: LocalStack y observabilidad"
revisar "Terraform"   terraform 1.5 despues "semana 6: infraestructura como código"
revisar "AWS CLI"     aws       ""  despues "semana 6: despliegue"
revisar "jq"          jq        1.6 despues "semana 6: scripts de verificación"

if [ -n "${OPENAI_API_KEY:-}" ]; then
  printf '%s✓ %-14s%s definida\n' "$VERDE" "OPENAI_API_KEY" "$FIN"
else
  printf '%s○ %-14s%s pendiente      %s(semana 5: agentes de ejemplo y evals)%s\n' "$AMARILLO" "OPENAI_API_KEY" "$FIN" "$GRIS" "$FIN"
fi

echo
if [ "$faltan_obligatorias" -eq 0 ]; then
  printf '%sListo: tienes todo lo obligatorio.%s\n' "$VERDE" "$FIN"
  exit 0
else
  printf '%sFaltan %d herramienta(s) obligatoria(s). Revisa nivelacion1/README.md.%s\n' "$ROJO" "$faltan_obligatorias" "$FIN"
  exit 1
fi
