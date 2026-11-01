#!/usr/bin/env bash
# Copia las skills de .agents/skills/ (fuente única) a .claude/skills/ para Claude Code.
#
# Cursor, Codex, Antigravity y GitHub Copilot leen .agents/skills/ directamente.
# Claude Code solo lee .claude/skills/, así que este script mantiene una copia.
# Se usa copia y no symlink porque los symlinks fallan en Windows sin permisos de administrador.
#
# Uso:
#   bash scripts/sync-skills.sh [directorio]          copia las skills
#   bash scripts/sync-skills.sh --check [directorio]  solo verifica; sale con 1 si hay diferencias (útil en CI)
#
# [directorio] es la raíz del proyecto donde viven .agents/ y .claude/ (por defecto, el actual).
# Nunca borra skills que existan solo en .claude/skills/: esas se reportan y se dejan intactas.

set -eu

modo="copiar"
if [ "${1:-}" = "--check" ]; then
  modo="verificar"
  shift
fi
raiz="${1:-.}"
origen="$raiz/.agents/skills"
destino="$raiz/.claude/skills"

if [ ! -d "$origen" ]; then
  echo "No existe $origen: no hay skills que sincronizar."
  exit 0
fi

diferencias=0
for dir in "$origen"/*/; do
  [ -d "$dir" ] || continue
  nombre="$(basename "$dir")"
  if [ ! -f "$dir/SKILL.md" ]; then
    echo "Omitida: $nombre (no tiene SKILL.md)"
    continue
  fi
  if [ -d "$destino/$nombre" ] && diff -r "$dir" "$destino/$nombre" >/dev/null 2>&1; then
    continue
  fi
  diferencias=$((diferencias + 1))
  if [ "$modo" = "verificar" ]; then
    echo "Desactualizada: $nombre"
  else
    mkdir -p "$destino"
    rm -rf "${destino:?}/$nombre"
    cp -R "$dir" "$destino/$nombre"
    echo "Copiada: $nombre"
  fi
done

if [ -d "$destino" ]; then
  for dir in "$destino"/*/; do
    [ -d "$dir" ] || continue
    nombre="$(basename "$dir")"
    [ -d "$origen/$nombre" ] || echo "Solo en .claude/skills (no se toca): $nombre"
  done
fi

if [ "$modo" = "verificar" ]; then
  if [ "$diferencias" -gt 0 ]; then
    echo "$diferencias skill(s) desactualizada(s). Corre: bash scripts/sync-skills.sh"
    exit 1
  fi
  echo "Las skills están sincronizadas."
else
  echo "Listo: $diferencias skill(s) actualizada(s)."
fi
