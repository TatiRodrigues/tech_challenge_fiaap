# Script para construir imagens Docker
# Uso: .\build-docker.ps1 -Environment development

param(
    [string]$Environment = "development",
    [switch]$NoBuild = $false
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Docker Build Script" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Cyan

# Cores para output
$ErrorColor = "Red"
$SuccessColor = "Green"
$InfoColor = "Cyan"

# Função para exibir mensagens
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host "$(Get-Date -Format 'HH:mm:ss') - $Message" -ForegroundColor $Color
}

# Verificar se Docker está instalado
Write-Log "Verificando Docker..." $InfoColor
$dockerVersion = docker --version
if ($?) {
    Write-Log "Docker encontrado: $dockerVersion" $SuccessColor
} else {
    Write-Log "Erro: Docker não encontrado!" $ErrorColor
    exit 1
}

# Build Frontend
Write-Log "Construindo imagem Frontend..." $InfoColor
$frontendImage = "tech-challenge-app:latest"

if ($Environment -eq "development") {
    $dockerfile = "Dockerfile.dev"
} else {
    $dockerfile = "Dockerfile"
}

cd $PSScriptRoot
docker build -t $frontendImage -f $dockerfile .

if ($?) {
    Write-Log "✓ Frontend construído com sucesso: $frontendImage" $SuccessColor
} else {
    Write-Log "✗ Erro ao construir Frontend" $ErrorColor
    exit 1
}

# Build Backend
Write-Log "Construindo imagem Backend (BFF)..." $InfoColor
$bffImage = "tech-challenge-bff:latest"
$bffPath = Join-Path (Split-Path $PSScriptRoot -Parent) "tech-challenge-2"

if (Test-Path $bffPath) {
    cd $bffPath
    docker build -t $bffImage -f Dockerfile .
    
    if ($?) {
        Write-Log "✓ Backend construído com sucesso: $bffImage" $SuccessColor
    } else {
        Write-Log "✗ Erro ao construir Backend" $ErrorColor
        exit 1
    }
} else {
    Write-Log "⚠ Pasta do Backend não encontrada em: $bffPath" "Yellow"
}

# Listar imagens criadas
Write-Log "Imagens Docker criadas:" $InfoColor
docker images | Select-Object -First 3 | Format-Table

Write-Host "`n================================" -ForegroundColor Cyan
Write-Log "✓ Build concluído com sucesso!" $SuccessColor
Write-Host "================================" -ForegroundColor Cyan
Write-Host "`nPróximos passos:" -ForegroundColor Yellow
Write-Host "1. Rodar containers: .\run-docker.ps1 -Environment $Environment"
Write-Host "2. Ver logs: docker logs -f tech-challenge-app"
Write-Host "3. Parar tudo: .\stop-docker.ps1"
