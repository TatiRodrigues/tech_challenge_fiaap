# 🐳 Configuração Docker - Dois Projetos

## 🎯 O Que Será Configurado

Você tem **2 projetos + MongoDB** que serão executados em containers Docker:

| Projeto | Porta | Função |
|---------|-------|--------|
| **Frontend** (Next.js) | 3001 | Interface web |
| **Backend** (Node.js) | 3000 | API BFF |
| **MongoDB** | 27017 | Banco de dados |

---

## ⚠️ IMPORTANTE: Docker Desktop Deve Estar Aberto!

Antes de fazer qualquer coisa:

1. **Procure por "Docker Desktop"** no menu Iniciar do Windows
2. **Clique para abrir** e aguarde 1-2 minutos para inicializar
3. Você verá a ícone do Docker aparecer na bandeja (canto inferior direito)
4. Só então execute o script abaixo

---

## 🚀 Como Executar (Escolha UMA opção)

### Opção A: Script Automático (Recomendado) ⭐

Abra **PowerShell** e execute:

```powershell
cd "C:\Users\tatir\OneDrive\Desktop\pos_graduacao\tech_challenge_fase_um"
.\setup-docker.ps1
```

Este script vai automaticamente:
- ✅ Parar containers anteriores
- ✅ Criar arquivo `.env.local`
- ✅ Construir as imagens Docker
- ✅ Iniciar todos os containers
- ✅ Mostrar status final

### Opção B: Comandos Manuais

Se preferir executar passo a passo:

```powershell
# 1. Ir para o diretório do frontend
cd "C:\Users\tatir\OneDrive\Desktop\pos_graduacao\tech_challenge_fase_um"

# 2. Parar e limpar containers anteriores
docker-compose down --remove-orphans

# 3. Construir imagens e iniciar containers
docker-compose up --build -d

# 4. Ver status
docker-compose ps

# 5. Ver logs (para confirmar que está funcionando)
docker-compose logs -f
```

---

## ✅ Verificação de Sucesso

Após executar, você deve ver **3 containers em execução**:

```
NAME                     STATUS
tech-challenge-mongo     Up (healthy)
tech-challenge-bff       Up
tech-challenge-app       Up
```

### Teste de Conectividade

Abra o PowerShell e execute:

```powershell
# 1. Backend está respondendo?
curl http://localhost:3000/health

# Resultado esperado: {"status":"ok"}

# 2. Frontend está rodando?
curl http://localhost:3001

# 3. Ver logs em tempo real
docker-compose logs -f
```

### Acessar via Navegador

Abra seu navegador e acesse:

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3000/health

---

## 🛑 Parar os Containers

Para parar tudo quando não estiver usando:

```powershell
# Parar containers (dados são preservados)
docker-compose down

# Parar e remover volumes (CUIDADO - deleta dados)
docker-compose down -v
```

---

## 📊 Monitorar Containers

### Ver Status

```powershell
docker-compose ps
```

### Ver Logs

```powershell
# Todos os logs
docker-compose logs -f

# Apenas do backend
docker-compose logs -f bff

# Apenas do frontend
docker-compose logs -f app

# Apenas do MongoDB
docker-compose logs -f mongo

# Últimas 100 linhas
docker-compose logs --tail 100
```

### Ver Uso de Recursos

```powershell
docker stats
```

---

## 🆘 Problemas Comuns

### ❌ "Docker Desktop não está rodando"

**Solução:**
1. Abra o menu Iniciar do Windows
2. Procure por "Docker Desktop"
3. Clique para abrir
4. Aguarde 1-2 minutos
5. Tente novamente

### ❌ "Port 3000 already in use"

**Solução:**
```powershell
# Parar todos os containers
docker-compose down

# Ver qual processo está usando porta 3000
netstat -ano | findstr :3000

# Reiniciar
docker-compose up -d
```

### ❌ "Cannot find module" (npm error)

**Solução:**
```powershell
# Reconstruir os containers (força novo npm install)
docker-compose down
docker-compose up --build -d
```

### ❌ "MongoDB connection refused"

**Solução:**
```powershell
# Ver logs do MongoDB
docker-compose logs mongo

# Reiniciar apenas MongoDB
docker-compose restart mongo

# Aguardar inicialização
docker-compose logs -f mongo

# Você deve ver: "Server started on port 27017"
```

### ❌ Frontend não consegue conectar ao Backend

**Diagnóstico:**
1. Abra DevTools do navegador (F12)
2. Vá para a aba "Console"
3. Verifique se há mensagens de erro
4. Abre a aba "Network"
5. Procure por chamadas para http://localhost:3000

**Solução:**
```powershell
# 1. Verifique se backend está respondendo
curl http://localhost:3000/health

# 2. Verifique containers
docker-compose ps

# 3. Ver logs do backend
docker-compose logs bff

# 4. Recarregue a página no navegador (Ctrl+Shift+R)
```

---

## 📝 Estrutura dos Projetos

```
C:\Users\tatir\OneDrive\Desktop\pos_graduacao\
├── tech_challenge_fase_um/          ← Frontend (Next.js)
│   ├── docker-compose.yml           ← Configuração Docker
│   ├── Dockerfile.dev               ← Imagem desenvolvimento
│   ├── .env.local                   ← Variáveis de ambiente
│   └── setup-docker.ps1             ← Script de setup
│
├── tech-challenge-2/                ← Backend (Node.js)
│   └── Dockerfile.dev               ← Imagem desenvolvimento
│
└── (MongoDB roda no container)
```

---

## 🔧 Próximas Etapas

1. ✅ Abrir Docker Desktop
2. ✅ Executar `.\setup-docker.ps1`
3. ✅ Esperar inicialização (2-3 minutos)
4. ✅ Acessar http://localhost:3001
5. ✅ Fazer login com credenciais padrão:
   - Email: `fiap@alecrimwallet.com.br`
   - Senha: `1234`

---

## 📚 Documentação Completa

Se precisar de mais detalhes:
- `QUICK_START.md` - Guia rápido
- `DOCKER_SETUP.md` - Guia completo com troubleshooting avançado
- `DOCUMENTATION_INDEX.md` - Índice de toda documentação

---

**Última atualização**: 2026-07-11
