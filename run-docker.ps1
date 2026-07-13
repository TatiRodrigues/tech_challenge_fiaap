# Script para rodar containers Docker
# Uso: .\run-docker.ps1 -Environment production

param(
    [string]$Environment = "development",
    [switch]$Detach = $true
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Docker Run Script" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

# Cores para output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host "$(Get-Date -Format 'HH:mm:ss') - $Message" -ForegroundColor $Color
}

# Verificar Docker
Write-Log "Verificando Docker..." $InfoColor
docker ps > $null 2>&1
if (-not $?) {
    Write-Log "Erro: Docker daemon não está rodando!" $ErrorColor
    exit 1
}

cd $PSScriptRoot

# Determinar arquivo compose
if ($Environment -eq "production") {
    $ComposeFile = "docker-compose.prod.yml"
    $DetachFlag = if ($Detach) { "-d" } else { "" }
} else {
    $ComposeFile = "docker-compose.yml"
    $DetachFlag = if ($Detach) { "-d" } else { "" }
    # Para desenvolvimento com hot-reload
    $ProfileFlag = "--profile dev"
}

Write-Log "Usando arquivo: $ComposeFile" $InfoColor

# Parar containers anteriores (opcional)
Write-Log "Parando containers anteriores..." $InfoColor
docker-compose -f $ComposeFile down --remove-orphans 2>&1 | Out-Null

# Iniciar containers
Write-Log "Iniciando containers..." $InfoColor
if ($Environment -eq "development") {
    docker-compose -f $ComposeFile $ProfileFlag up $DetachFlag
} else {
    docker-compose -f $ComposeFile up $DetachFlag
}

if ($?) {
    Write-Log "[OK] Containers iniciados com sucesso!" $SuccessColor
    
    # Aguardar um pouco para containers ficarem prontos
    Start-Sleep -Seconds 2
    
    # Listar containers
    Write-Log "Containers rodando:" $InfoColor
    docker ps
    
    Write-Host "`n================================" -ForegroundColor Cyan
    Write-Host "URLs de acesso:" -ForegroundColor Yellow
    Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "BFF: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    if ($Detach) {
        Write-Host "`nPara ver logs:" -ForegroundColor Yellow
        Write-Host "docker logs -f tech-challenge-app" -ForegroundColor Gray
    }
} else {
    Write-Log "[ERRO] Falha ao iniciar containers" $ErrorColor
    exit 1
}
