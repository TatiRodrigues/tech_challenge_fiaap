# ====================================
# Script de verificacao rapida
# Verifica se tudo esta configurado
# ====================================

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptRoot "..\tech-challenge-2"
$composeFilePath = Join-Path $scriptRoot "docker-compose.yml"
$envFilePath = Join-Path $scriptRoot ".env.local"

Write-Host ""
Write-Host "VERIFICACAO DE CONFIGURACAO - ALECRIM WALLET" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$allChecks = $true
$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue
$dockerComposeLegacyCommand = Get-Command docker-compose -ErrorAction SilentlyContinue
$expectedPortContainers = @{
    3000 = "tech-challenge-bff"
    3001 = "tech-challenge-app"
    27017 = "tech-challenge-mongo"
}

# 1. Verificar Docker
Write-Host "1. Verificando Docker..." -ForegroundColor Yellow
if ($null -ne $dockerCommand) {
    $dockerVersion = docker --version
    Write-Host "   [OK] Docker instalado: $dockerVersion" -ForegroundColor Green
}
else {
    Write-Host "   [ERRO] Docker nao esta instalado" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 2. Verificar Docker Compose
Write-Host "2. Verificando Docker Compose..." -ForegroundColor Yellow
$dockerComposeAvailable = $false

if ($null -ne $dockerComposeLegacyCommand) {
    $dockerComposeAvailable = $true
    Write-Host "   [OK] docker-compose instalado" -ForegroundColor Green
}
elseif ($null -ne $dockerCommand) {
    docker compose version *> $null
    if ($LASTEXITCODE -eq 0) {
        $dockerComposeAvailable = $true
        Write-Host "   [OK] docker compose disponivel" -ForegroundColor Green
    }
}

if (-not $dockerComposeAvailable) {
    Write-Host "   [ERRO] Docker Compose nao esta disponivel" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 3. Verificar se backend existe
Write-Host "3. Verificando repositorio do backend..." -ForegroundColor Yellow
if (Test-Path $backendPath) {
    Write-Host "   [OK] Backend encontrado em: $backendPath" -ForegroundColor Green
}
else {
    Write-Host "   [ERRO] Backend nao encontrado em: $backendPath" -ForegroundColor Red
    Write-Host "          Clone em: https://github.com/TatiRodrigues/tech-challenge-2" -ForegroundColor Yellow
    $allChecks = $false
}

Write-Host ""

# 4. Verificar arquivo docker-compose.yml
Write-Host "4. Verificando docker-compose.yml..." -ForegroundColor Yellow
if (Test-Path $composeFilePath) {
    Write-Host "   [OK] docker-compose.yml encontrado" -ForegroundColor Green
}
else {
    Write-Host "   [ERRO] docker-compose.yml nao encontrado" -ForegroundColor Red
    $allChecks = $false
}

Write-Host ""

# 5. Verificar .env.local
Write-Host "5. Verificando configuracao de ambiente..." -ForegroundColor Yellow
if (Test-Path $envFilePath) {
    $envContent = Get-Content $envFilePath -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "   [OK] .env.local configurado" -ForegroundColor Green
    }
    else {
        Write-Host "   [AVISO] NEXT_PUBLIC_API_URL nao encontrado em .env.local" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   [AVISO] .env.local nao encontrado" -ForegroundColor Yellow
}

Write-Host ""

# 6. Verificar portas disponiveis
Write-Host "6. Verificando disponibilidade de portas..." -ForegroundColor Yellow
$ports = @(3000, 3001, 27017)

foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        $expectedContainer = $expectedPortContainers[$port]
        $expectedContainerRunning = $false

        if ($null -ne $dockerCommand -and -not [string]::IsNullOrWhiteSpace($expectedContainer)) {
            $containerMatch = docker ps --filter "name=$expectedContainer" --format "{{.Names}}" 2>$null
            if ($containerMatch -contains $expectedContainer) {
                $expectedContainerRunning = $true
            }
        }

        if ($expectedContainerRunning) {
            Write-Host "   [OK] Porta $port esta em uso pelo container esperado ($expectedContainer)" -ForegroundColor Green
        }
        else {
            Write-Host "   [AVISO] Porta $port esta em uso por outro processo/servico" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   [OK] Porta $port disponivel" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

if ($allChecks) {
    Write-Host ""
    Write-Host "Tudo pronto! Use um destes comandos para iniciar:" -ForegroundColor Green
    Write-Host ""
    Write-Host "   .\run-stack.ps1                 # Script automatico" -ForegroundColor Cyan
    Write-Host "   docker-compose up               # Manual" -ForegroundColor Cyan
    Write-Host "   docker compose up               # Versao nova" -ForegroundColor Cyan
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "Ha problemas a resolver antes de comecar" -ForegroundColor Red
    Write-Host ""
    Write-Host "Veja as instrucoes no README.md" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
