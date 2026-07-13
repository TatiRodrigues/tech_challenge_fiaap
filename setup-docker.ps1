# Script para configurar Docker dos dois projetos
Write-Host "================================" -ForegroundColor Cyan
Write-Host "[SETUP DOCKER] Tech Challenge" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Mudar para diretório do frontend
$frontendDir = "C:\Users\tatir\OneDrive\Desktop\pos_graduacao\tech_challenge_fase_um"
Set-Location $frontendDir

# Verificar se Docker está rodando
Write-Host "[1/5] Verificando Docker Desktop..." -ForegroundColor Yellow
$dockerCheck = docker ps -q 2>&1
if ($?) {
    Write-Host "[OK] Docker está rodando!`n" -ForegroundColor Green
} else {
    Write-Host "[ERRO] Docker Desktop não está rodando!" -ForegroundColor Red
    Write-Host "[AVISO] Por favor, inicie o Docker Desktop e tente novamente.`n" -ForegroundColor Yellow
    exit 1
}

# Passo 1: Parar containers anteriores
Write-Host "[2/5] Parando containers anteriores..." -ForegroundColor Yellow
docker-compose down --remove-orphans 2>&1 | Out-Null
Write-Host "[OK] Containers anteriores removidos!`n" -ForegroundColor Green

# Passo 2: Verificar se .env.local existe
Write-Host "[3/5] Configurando variáveis de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env.local")) {
    Write-Host "[INFO] Criando arquivo .env.local..."
    @"
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_BANKING_API=true
NEXT_PUBLIC_API_TIMEOUT=10000
"@ | Out-File -FilePath ".env.local" -Encoding ASCII
    Write-Host "[OK] Arquivo .env.local criado!`n" -ForegroundColor Green
} else {
    Write-Host "[OK] Arquivo .env.local já existe!`n" -ForegroundColor Green
}

# Passo 3: Build e inicia containers
Write-Host "[4/5] Construindo e iniciando containers..." -ForegroundColor Yellow
Write-Host "Isso pode levar alguns minutos na primeira execucao...`n" -ForegroundColor Yellow

docker-compose up --build -d

# Passo 4: Aguardar inicialização
Write-Host "[5/5] Aguardando inicializacao dos servicos..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verificar status
$containerStatus = docker-compose ps

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "[OK] SETUP CONCLUIDO!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Status dos Containers:" -ForegroundColor Cyan
$containerStatus

Write-Host "`nURLs de Acesso:" -ForegroundColor Green
Write-Host "  * Frontend:  http://localhost:3001" -ForegroundColor White
Write-Host "  * Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "  * MongoDB:   localhost:27017" -ForegroundColor White

Write-Host "`nTeste Rapido:" -ForegroundColor Green
Write-Host "  # 1. Verifique se backend está online:" -ForegroundColor Gray
Write-Host "  curl http://localhost:3000/health" -ForegroundColor Cyan

Write-Host "`n  # 2. Veja logs em tempo real:" -ForegroundColor Gray
Write-Host "  docker-compose logs -f" -ForegroundColor Cyan

Write-Host "`n  # 3. Acesse no navegador:" -ForegroundColor Gray
Write-Host "  http://localhost:3001" -ForegroundColor Cyan

Write-Host "`nDocumentacao:" -ForegroundColor Green
Write-Host "  * QUICK_START.md - Guia rápido" -ForegroundColor Gray
Write-Host "  * DOCKER_SETUP.md - Guia completo com troubleshooting" -ForegroundColor Gray
Write-Host "  * DOCUMENTATION_INDEX.md - Índice de documentação" -ForegroundColor Gray

Write-Host "`n" -ForegroundColor Cyan
