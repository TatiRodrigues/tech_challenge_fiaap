# ====================================
# Script de verificação rápida
# Verifica se tudo está configurado
# ====================================

Write-Host ""
Write-Host "🔍 VERIFICAÇÃO DE CONFIGURAÇÃO - ALECRIM WALLET" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$allChecks = $true

# 1. Verificar Docker
Write-Host "1️⃣  Verificando Docker..." -ForegroundColor Yellow
if (Get-Command docker -ErrorAction SilentlyContinue) {
    $dockerVersion = docker --version
    Write-Host "   ✓ Docker instalado: $dockerVersion" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Docker NÃO está instalado" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 2. Verificar docker-compose
Write-Host "2️⃣  Verificando Docker Compose..." -ForegroundColor Yellow
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    Write-Host "   ✓ docker-compose instalado" -ForegroundColor Green
}
elseif (Get-Command docker -ErrorAction SilentlyContinue) {
    Write-Host "   ✓ docker compose (novo) disponível" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Docker Compose NÃO está disponível" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 3. Verificar se backend existe
Write-Host "3️⃣  Verificando repositório do backend..." -ForegroundColor Yellow
$backendPath = "..\tech-challenge-2"
if (Test-Path $backendPath) {
    Write-Host "   ✓ Backend encontrado em: $backendPath" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Backend NÃO encontrado em: $backendPath" -ForegroundColor Red
    Write-Host "     Clone em: https://github.com/TatiRodrigues/tech-challenge-2" -ForegroundColor Yellow
    $allChecks = $false
}

Write-Host ""

# 4. Verificar arquivo docker-compose.yml
Write-Host "4️⃣  Verificando docker-compose.yml..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    Write-Host "   ✓ docker-compose.yml encontrado" -ForegroundColor Green
}
else {
    Write-Host "   ✗ docker-compose.yml NÃO encontrado" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 5. Verificar .env.local
Write-Host "5️⃣  Verificando configuração de ambiente..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "   ✓ .env.local configurado" -ForegroundColor Green
    }
    else {
        Write-Host "   ⚠ NEXT_PUBLIC_API_URL não encontrado em .env.local" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   ⚠ .env.local não encontrado" -ForegroundColor Yellow
}

Write-Host ""

# 6. Verificar portas disponíveis
Write-Host "6️⃣  Verificando disponibilidade de portas..." -ForegroundColor Yellow
$ports = @(3000, 3001, 27017)

foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "   ⚠ Porta $port está em uso (container/serviço ativo)" -ForegroundColor Yellow
    }
    else {
        Write-Host "   ✓ Porta $port disponível" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

if ($allChecks) {
    Write-Host ""
    Write-Host "✅ Tudo pronto! Use um destes comandos para iniciar:" -ForegroundColor Green
    Write-Host ""
    Write-Host "   .\run-stack.ps1                 # Script automático" -ForegroundColor Cyan
    Write-Host "   docker-compose up               # Manual" -ForegroundColor Cyan
    Write-Host "   docker compose up               # Versão nova" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "❌ Há problemas a resolver antes de começar" -ForegroundColor Red
    Write-Host ""
    Write-Host "Veja as instruções em DOCKER_SETUP.md" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
