#!/usr/bin/env bash
set -euo pipefail

### install-dep.sh — só instala dependências em ./backend e ./frontend

FORCE=false
PM_FROM_ARG="${PKG_MGR:-}"   # pode vir do ambiente
BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

usage() {
  cat <<'EOF'
Usage: ./install-dep.sh [--pm <pnpm|yarn|npm>] [--force] [-h|--help]

--pm       Força o gerenciador (pnpm|yarn|npm). Se omitido, detecta por lockfile.
--force    Relaxa políticas de lockfile (frozen/immutable/ci) e usa "install" normal.
EOF
}

# ---- args ----
while (($#)); do
  case "$1" in
    --pm)
      [[ $# -ge 2 ]] || { echo "Faltou valor para --pm"; exit 2; }
      PM_FROM_ARG="$2"; shift 2 ;;
    --pm=*)
      PM_FROM_ARG="${1#*=}"; shift ;;
    --force)
      FORCE=true; shift ;;
    -h|--help)
      usage; exit 0 ;;
    *)
      echo "Arg desconhecido: $1"; usage; exit 1 ;;
  esac
done

log()  { printf "\n\033[1;36m[install-dep]\033[0m %s\n" "$*"; }
warn() { printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
err()  { printf "\n\033[1;31m[error]\033[0m %s\n" "$*"; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { err "Missing command: $1"; exit 1; }
}

# pelo menos um gerenciador de pacotes disponível
require_any_pkgmgr() {
  command -v pnpm >/dev/null 2>&1 \
  || command -v yarn >/dev/null 2>&1 \
  || command -v npm  >/dev/null 2>&1 \
  || { err "Nenhum gerenciador encontrado (npm/yarn/pnpm)."; exit 1; }
}

detect_pkg_mgr() {
  # lockfile > PATH
  if [[ -f "pnpm-lock.yaml" ]]; then echo "pnpm"; return; fi
  if [[ -f "yarn.lock" ]]; then echo "yarn"; return; fi
  if [[ -f "package-lock.json" || -f "npm-shrinkwrap.json" ]]; then echo "npm"; return; fi
  if command -v pnpm >/dev/null 2>&1; then echo "pnpm"; return; fi
  if command -v yarn >/dev/null 2>&1; then echo "yarn"; return; fi
  echo "npm"
}

validate_pm() {
  case "$1" in
    pnpm|yarn|npm) command -v "$1" >/dev/null 2>&1 || { err "Gerenciador '$1' não encontrado no PATH."; exit 1; } ;;
    *) err "Valor inválido para --pm: $1 (use pnpm|yarn|npm)"; exit 1 ;;
  esac
}

pkg_install() {
  local mgr="$1" force="$2"
  case "$mgr" in
    pnpm)
      if $force; then pnpm install --no-frozen-lockfile
      else pnpm install --frozen-lockfile || pnpm install
      fi ;;
    yarn)
      if $force; then yarn install
      else yarn install --frozen-lockfile 2>/dev/null || yarn install --immutable || yarn install
      fi ;;
    npm)
      if $force; then npm install
      else npm ci || npm install
      fi ;;
  esac
}

install_in_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || { warn "Sem diretório '$dir' — pulando."; return 0; }

  log "Instalando em: $dir"
  pushd "$dir" >/dev/null

  local mgr
  if [[ -n "$PM_FROM_ARG" ]]; then
    mgr="$PM_FROM_ARG"
    validate_pm "$mgr"
  else
    mgr="$(detect_pkg_mgr)"
    validate_pm "$mgr"
  fi

  log "Gerenciador selecionado: $mgr"
  pkg_install "$mgr" "$FORCE"

  popd >/dev/null
}

# ---- prechecks ----
require_cmd node
require_any_pkgmgr

# garante retorno ao diretório original
ORIG_DIR="$(pwd)"; trap 'cd "$ORIG_DIR" >/dev/null || true' EXIT

install_in_dir "$BACKEND_DIR"
install_in_dir "$FRONTEND_DIR"

log "Dependências instaladas. ✅"
