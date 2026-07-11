# 🚀 Guia Rápido - Alecrim Wallet

## ⚡ Iniciar em 3 passos

### 1️⃣ Verificar pré-requisitos
```powershell
# Verificar se tudo está instalado
.\check-setup.ps1
```

**O que será checado:**
- ✓ Docker Desktop instalado
- ✓ docker-compose disponível
- ✓ Backend (tech-challenge-2) clonado
- ✓ Portas livres (3000, 3001, 27017)
- ✓ Arquivo .env.local configurado

### 2️⃣ Iniciar a stack
```powershell
# Inicia Frontend + Backend + MongoDB em containers
.\run-stack.ps1
```

**Resultado esperado:**
- Frontend: http://localhost:3001 ✨
- Backend API: http://localhost:3000 🔌
- MongoDB: localhost:27017 📦

### 3️⃣ Acessar a aplicação
Abra no navegador: **http://localhost:3001**

---

## 🎯 Indicadores de Sucesso

| Componente | Como Verificar | Status Esperado |
|-----------|---------------|-----------------|
| **Docker** | Ver containers | 3 containers rodando (mongo, bff, app) |
| **Frontend** | http://localhost:3001 | Página de login carrega |
| **Backend** | http://localhost:3000/health | Retorna `{"status":"ok"}` |
| **MongoDB** | Logs do container | "Server started on port 27017" |

### ✅ Teste Rápido
```powershell
# 1. Backend está online?
curl http://localhost:3000/health

# 2. Containers rodando?
docker-compose ps

# 3. MongoDB conectando?
docker-compose logs mongo | Select-String "started"
```

---

## ⚙️ Configuração de Ambiente

### Arquivo .env.local (Auto-gerado)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_BANKING_API=true
NEXT_PUBLIC_API_TIMEOUT=10000
```

Se não existir, criar em `c:\Users\tatir\OneDrive\Desktop\pos_graduacao\tech_challenge_fase_um\.env.local`

---

## 🆘 Erros Comuns

### Erro: "Network Error | Status: undefined"
**Causa:** Backend não está respondendo  
**Solução:**
1. Verifique se Docker Desktop está aberto
2. Execute `docker-compose ps` - todos os containers devem estar `Up`
3. Aguarde 30 segundos para inicialização completa
4. Recarregue a página (F5)
5. Abra DevTools (F12) → Console para ver logs

### Erro: "Port 3000 already in use"
**Causa:** Outro processo usando a porta  
**Solução:**
```powershell
# Liberar porta 3000
netstat -ano | findstr :3000           # Ver quem está usando
docker-compose down                     # Parar todos os containers
docker-compose up -d                    # Reiniciar
```

### Erro: "Cannot find module"
**Causa:** Dependências não instaladas  
**Solução:**
```powershell
# Reiniciar com reconstrução
docker-compose down
docker-compose up --build -d
```

### Erro: "MongoDB connection refused"
**Causa:** MongoDB não iniciou  
**Solução:**
```powershell
# Verificar logs
docker-compose logs mongo

# Reiniciar apenas MongoDB
docker-compose restart mongo
docker-compose logs -f mongo   # Aguardar "started on port"
```

---

## 🐛 Debugar Problemas

### Ver status dos containers
```powershell
docker-compose ps
```

### Ver logs detalhados
```powershell
# Todos os logs
docker-compose logs -f

# Apenas backend
docker-compose logs -f bff

# Apenas frontend
docker-compose logs -f app

# Apenas MongoDB
docker-compose logs -f mongo
```

### Parar e limpar
```powershell
# Parar containers
docker-compose down

# Parar e remover volumes (cuidado!)
docker-compose down -v

# Reconstruir tudo
docker-compose down
docker-compose up --build -d
```

---

## 📋 Arquivos Importantes

| Arquivo | Descrição |
|---------|-----------|
| `.env.local` | Variáveis de ambiente (Auto-gerado) |
| `docker-compose.yml` | Configuração da stack Docker |
| `Dockerfile.dev` | Imagem para desenvolvimento |
| `.env.example` | Template de variáveis |

---

## 🔗 Próximas Etapas

1. ✅ Verificar pré-requisitos: `.\check-setup.ps1`
2. ✅ Iniciar stack: `.\run-stack.ps1`
3. ✅ Acessar: http://localhost:3001
4. ⏭️ **Login com credenciais padrão:**
   - Email: `fiap@alecrimwallet.com.br`
   - Senha: `1234`

---

## 📚 Documentação Completa

- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Índice de toda documentação
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Guia completo com troubleshooting avançado
- **[MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md)** - Detalhes técnicos das alterações
- **[README.md](README.md)** - Documentação principal do projeto
