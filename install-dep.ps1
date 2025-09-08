#!/usr/bin/env pwsh
param (
    [string]$pm = $env:PKG_MGR,   # pode vir do ambiente
    [switch]$force
)

$backendDir = "backend"
$frontendDir = "frontend"

function Log($msg)  { Write-Host "`n[install-dep] $msg" -ForegroundColor Cyan }
function Warn($msg) { Write-Host "`n[warn] $msg" -ForegroundColor Yellow }
function Err($msg)  { Write-Host "`n[error] $msg" -ForegroundColor Red }

function Require-Cmd($cmd) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Err "Missing command: $cmd"
        exit 1
    }
}

function Require-AnyPkgMgr {
    if (-not (Get-Command pnpm -ErrorAction SilentlyContinue) -and
        -not (Get-Command yarn -ErrorAction SilentlyContinue) -and
        -not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Err "Nenhum gerenciador encontrado (npm/yarn/pnpm)."
        exit 1
    }
}

function Detect-PkgMgr {
    if (Test-Path "pnpm-lock.yaml") { return "pnpm" }
    if (Test-Path "yarn.lock")      { return "yarn" }
    if (Test-Path "package-lock.json" -or (Test-Path "npm-shrinkwrap.json")) { return "npm" }

    if (Get-Command pnpm -ErrorAction SilentlyContinue) { return "pnpm" }
    if (Get-Command yarn -ErrorAction SilentlyContinue) { return "yarn" }
    return "npm"
}

function Validate-Pm($mgr) {
    switch ($mgr) {
        "pnpm" { if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { Err "pnpm não encontrado"; exit 1 } }
        "yarn" { if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) { Err "yarn não encontrado"; exit 1 } }
        "npm"  { if (-not (Get-Command npm  -ErrorAction SilentlyContinue)) { Err "npm não encontrado";  exit 1 } }
        default { Err "Gerenciador inválido: $mgr"; exit 1 }
    }
}

function Pkg-Install($mgr, $force) {
    switch ($mgr) {
        "pnpm" {
            if ($force) { pnpm install --no-frozen-lockfile }
            else { pnpm install --frozen-lockfile; if ($LASTEXITCODE -ne 0) { pnpm install } }
        }
        "yarn" {
            if ($force) { yarn install }
            else {
                yarn install --frozen-lockfile
                if ($LASTEXITCODE -ne 0) {
                    yarn install --immutable
                    if ($LASTEXITCODE -ne 0) { yarn install }
                }
            }
        }
        "npm" {
            if ($force) { npm install }
            else {
                npm ci
                if ($LASTEXITCODE -ne 0) { npm install }
            }
        }
    }
}

function Install-InDir($dir) {
    if (-not (Test-Path $dir)) {
        Warn "Sem diretório '$dir' — pulando."
        return
    }

    Push-Location $dir
    try {
        $mgr = if ($pm) { $pm } else { Detect-PkgMgr }
        Validate-Pm $mgr
        Log "Instalando em: $dir com $mgr"
        Pkg-Install $mgr $force
    }
    finally {
        Pop-Location
    }
}

# ---- prechecks ----
Require-Cmd node
Require-AnyPkgMgr

Install-InDir $backendDir
Install-InDir $frontendDir

Log "Dependências instaladas. ✅"
