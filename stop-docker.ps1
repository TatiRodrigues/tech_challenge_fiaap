# Script para parar e remover containers Docker
# Uso: .\stop-docker.ps1 [-Remove] [-Volumes]

param(
    [switch]$Remove = $false,
    [switch]$Volumes = $false,
    [string]$Environment = "development"
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Docker Stop Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"
$WarningColor = "Yellow"

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host "$(Get-Date -Format 'HH:mm:ss') - $Message" -ForegroundColor $Color
}

# Determinar arquivo compose
$ComposeFile = if ($Environment -eq "production") { "docker-compose.prod.yml" } else { "docker-compose.yml" }

Write-Log "Usando arquivo: $ComposeFile" $InfoColor

# Parar containers
Write-Log "Parando containers..." $InfoColor
cd $PSScriptRoot

if ($Remove -and $Volumes) {
    Write-Log "Removendo containers e volumes..." $WarningColor
    docker-compose -f $ComposeFile down -v
    Write-Log "✓ Containers e volumes removidos" $SuccessColor
} elseif ($Remove) {
    Write-Log "Removendo containers..." $WarningColor
    docker-compose -f $ComposeFile down
    Write-Log "✓ Containers removidos" $SuccessColor
} else {
    Write-Log "Parando containers..." $WarningColor
    docker-compose -f $ComposeFile stop
    Write-Log "✓ Containers parados" $SuccessColor
}

# Listar containers
Write-Log "Containers ativos:" $InfoColor
docker ps

Write-Host "`n================================" -ForegroundColor Cyan
if ($Remove -and $Volumes) {
    Write-Host "Dados persistidos foram removidos!" -ForegroundColor Red
} elseif ($Remove) {
    Write-Host "Containers foram removidos (dados mantidos)" -ForegroundColor Green
} else {
    Write-Host "Containers estão parados (para remover: -Remove)" -ForegroundColor Yellow
}
Write-Host "================================" -ForegroundColor Cyan
