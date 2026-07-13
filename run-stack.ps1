# ====================================
# Script para iniciar a stack completa
# Frontend (port 3001) + Backend (port 3000) + MongoDB
# ====================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Iniciando Alecrim Wallet Stack" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker esta instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Docker nao esta instalado ou nao esta no PATH" -ForegroundColor Red
    Write-Host "Por favor, instale Docker Desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker encontrado" -ForegroundColor Green

# Preferir a sintaxe moderna `docker compose`
docker compose version *> $null
if ($LASTEXITCODE -eq 0) {
    $composeCommand = "docker compose"
    Write-Host "[OK] Usando Docker Compose v2 (docker compose)" -ForegroundColor Green
} elseif (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    $composeCommand = "docker-compose"
    Write-Host "[OK] Usando docker-compose" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Docker Compose nao esta disponivel" -ForegroundColor Red
    exit 1
}

# Parar containers anteriores e limpar orfaos
Write-Host ""
Write-Host "Limpando containers anteriores..." -ForegroundColor Yellow
if ($composeCommand -eq "docker compose") {
    docker compose down --remove-orphans
} else {
    docker-compose down --remove-orphans
}

# Iniciar stack
Write-Host ""
Write-Host "Iniciando containers..." -ForegroundColor Yellow
Write-Host ""

if ($composeCommand -eq "docker compose") {
    docker compose up --build
} else {
    docker-compose up --build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "" 
    Write-Host "================================" -ForegroundColor Red
    Write-Host "Falha ao iniciar a stack" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host "Dica: verifique os logs com 'docker compose logs' ou 'docker-compose logs'" -ForegroundColor Yellow
    exit $LASTEXITCODE
}

# Mostrar instrucoes ao finalizar
Write-Host ""
Write-Host "================================" -ForegroundColor Yellow
Write-Host "Stack finalizada" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host "MongoDB:  localhost:27017" -ForegroundColor Green
Write-Host ""
Write-Host "Status atual dos containers:" -ForegroundColor Cyan
if ($composeCommand -eq "docker compose") {
    docker compose ps
} else {
    docker-compose ps
}
