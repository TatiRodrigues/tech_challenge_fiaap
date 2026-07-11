# ====================================
# Script para iniciar a stack completa
# Frontend (port 3001) + Backend (port 3000) + MongoDB
# ====================================

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Iniciando Alecrim Wallet Stack" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker não está instalado ou não está no PATH" -ForegroundColor Red
    Write-Host "Por favor, instale Docker Desktop" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Docker encontrado" -ForegroundColor Green

# Verificar se docker-compose está disponível
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  docker-compose não encontrado, tentando docker compose..." -ForegroundColor Yellow
    $useNewDocker = $true
} else {
    $useNewDocker = $false
}

# Parar containers anteriores se existirem
Write-Host ""
Write-Host "Limpando containers anteriores..." -ForegroundColor Yellow
if ($useNewDocker) {
    docker compose down --remove-orphans 2>$null
} else {
    docker-compose down --remove-orphans 2>$null
}

# Iniciar stack
Write-Host ""
Write-Host "Iniciando containers..." -ForegroundColor Yellow
Write-Host ""

if ($useNewDocker) {
    docker compose up
} else {
    docker-compose up
}

# Mostrar instruções ao finalizar
Write-Host ""
Write-Host "================================" -ForegroundColor Yellow
Write-Host "Stack finalizada" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
