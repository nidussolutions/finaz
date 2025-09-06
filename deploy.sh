#!/usr/bin/env bash
set -Eeuo pipefail

BRANCH="main"
DO_GIT_PULL=false

# ---- parse args ----
for arg in "$@"; do
  case $arg in
    --branch)
      BRANCH="$2"
      shift 2
      ;;
    --branch=*)
      BRANCH="${arg#*=}"
      shift
      ;;
    --pull)
      DO_GIT_PULL=true
      shift
      ;;
    *)
      ;;
  esac
done

# ---- helpers ----
log() { printf "\n\033[1;36m[deploy]\033[0m %s\n" "$*"; }
warn() { printf "\n\033[1;33m[warn]\033[0m %s\n" "$*"; }
err() { printf "\n\033[1;31m[error]\033[0m %s\n" "$*"; }

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Missing command: $1"
    return 1
  fi
}

detect_pkg_mgr() {
  if [[ -f "pnpm-lock.yaml" ]]; then echo "pnpm"; return 0; fi
  if [[ -f "yarn.lock" ]]; then echo "yarn"; return 0; fi
  echo "npm"
}

pkg_install() {
  local mgr="$1"
  case "$mgr" in
    pnpm) pnpm install ;;
    yarn) yarn install ;;
    npm)  npm ci || npm install ;;
  esac
}

pkg_build() {
  local mgr="$1"
  case "$mgr" in
    pnpm) pnpm run build ;;
    yarn) yarn build ;;
    npm)  npm run build ;;
  esac
}

pkg_start_cmd() {
  local mgr="$1" script="$2"
  case "$mgr" in
    pnpm) echo "pnpm run $script" ;;
    yarn) echo "yarn $script" ;;
    npm)  echo "npm run $script" ;;
  esac
}

# ---- start ----
log "Starting deploy"

# ---- git pull ----
if $DO_GIT_PULL; then
  log "Fetching latest code"
  git fetch --all
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"
else
  log "Skipping git pull"
fi

# ---- resolve project structure ----
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

if [[ -z "$FRONTEND_DIR" ]] || [[ -z "$BACKEND_DIR" ]]; then
  err "Could not detect frontend/backend folders. Expected apps/web + apps/api or frontend + backend."
  exit 1
fi

log "Frontend dir: $FRONTEND_DIR"
log "Backend dir : $BACKEND_DIR"

# ---- Backend build & migrate ----
log "Installing backend dependencies"
pushd "$BACKEND_DIR" >/dev/null

BACKEND_PKG_MGR=$(detect_pkg_mgr)
pkg_install "$BACKEND_PKG_MGR"

# Determine start script 
BACK_START_SCRIPT="start"
BACK_START_CMD=$(pkg_start_cmd "$BACKEND_PKG_MGR" "$BACK_START_SCRIPT")
popd >/dev/null

# ---- Frontend build ----
log "Installing frontend dependencies"
pushd "$FRONTEND_DIR" >/dev/null

FRONT_PKG_MGR=$(detect_pkg_mgr)
pkg_install "$FRONT_PKG_MGR"

# Make sure we build for production
export NODE_ENV=production

log "Building frontend"
pkg_build "$FRONT_PKG_MGR"

# Determine start script (prefer 'start' which maps to `next start`)
FRONT_START_SCRIPT="start"
FRONT_START_CMD=$(pkg_start_cmd "$FRONT_PKG_MGR" "$FRONT_START_SCRIPT")
popd >/dev/null

# ---- PM2 process setup ----
API_NAME="finaz-api"
WEB_NAME="finaz-web"
API_CWD="$(cd "$BACKEND_DIR" && pwd)"
WEB_CWD="$(cd "$FRONTEND_DIR" && pwd)"
API_PORT="${FINAZ_API_PORT:-4000}"
WEB_PORT="${FINAZ_WEB_PORT:-3000}"

log "Configuring PM2 processes (recreate)"

# defina PORT/NODE_ENV no comando pra garantir porta/ambiente
pm2 start bash --name "$API_NAME" -- -lc "cd '$API_CWD' && PORT=$API_PORT NODE_ENV=production $BACK_START_CMD"
pm2 start bash --name "$WEB_NAME" -- -lc "cd '$WEB_CWD' && PORT=$WEB_PORT NODE_ENV=production $FRONT_START_CMD"

pm2 save
pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1 | bash || true

log "Deployment finished successfully ✅"
echo "API:    http://localhost:$API_PORT"
echo "WEB:    http://localhost:$WEB_PORT"