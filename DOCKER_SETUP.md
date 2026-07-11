# 🚀 Guia de Execução - Alecrim Wallet

> ⚠️ **Para iniciar rápido**, veja [QUICK_START.md](QUICK_START.md)  
> 📚 **Para índice completo**, veja [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

## ⚙️ Pré-requisitos

- **Docker Desktop** instalado ([Download aqui](https://www.docker.com/products/docker-desktop))
- **Git** instalado
- **Repositórios clonados** em `../tech-challenge-2` (backend)

## 🎯 Arquitetura

```
┌─────────────────────────────────────────────────────────┐
│           🖥️  DOCKER COMPOSE STACK                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend (Next.js)      Backend (Node.js)   MongoDB   │
│  localhost:3001  ←──────→  :3000      ←────→  :27017   │
│  (Port 3000      (http://bff:3000)             │       │
│   no container)                                │       │
│                                                │       │
│  ✓ Hot reload     ✓ Auto-restart      ✓ Persistente   │
│  ✓ SSR enabled    ✓ Health checks     ✓ Backup        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🏃 Opção 1: Docker Compose (Recomendado)

### ✅ Iniciando a stack completa

```powershell
# Executar o script PowerShell
.\run-stack.ps1
```

Ou manualmente:

```powershell
# Parar e limpar containers anteriores
docker-compose down --remove-orphans

# Iniciar a stack
docker-compose up

# Ou em background (detached)
docker-compose up -d
```

### 📍 URLs de Acesso

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017
- **Health Check**: http://localhost:3000/health

### 🛑 Parando a stack

```powershell
# Parar todos os containers
docker-compose down

# Remover volumes (limpar dados)
docker-compose down -v
```

### 📊 Monitorando containers

```powershell
# Ver status dos containers
docker-compose ps

# Ver logs de um serviço específico
docker-compose logs bff           # Backend
docker-compose logs app           # Frontend
docker-compose logs mongo         # MongoDB

# Seguir logs em tempo real
docker-compose logs -f            # Todos
docker-compose logs -f bff        # Apenas backend
```

---

## 🏃 Opção 2: Desenvolvimento Local (sem Docker)

### Backend

```powershell
# Navegar para a pasta do backend
cd ..\tech-challenge-2

# Instalar dependências
npm install

# Iniciar (certifique-se que MongoDB está rodando localmente)
npm run dev

# O servidor rodará em http://localhost:3000
```

### Frontend

```powershell
# Navegar para a pasta do frontend
cd ..\tech_challenge_fase_um

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar em http://localhost:3001
```

### 📋 Requisitos locais

- Node.js 18+ instalado
- MongoDB rodando localmente em `mongodb://localhost:27017`
- Portas 3000, 3001 e 27017 disponíveis

---

## 🐛 Diagnosticando Erros

### Erro: "Network Error | Status: undefined"

Significa que o frontend **não consegue conectar ao backend**.

**Checklist de Diagnóstico:**

1. ✅ Backend está rodando?
   ```powershell
   curl http://localhost:3000/health
   ```

2. ✅ Porta 3000 está em uso?
   ```powershell
   netstat -ano | findstr :3000
   ```

3. ✅ .env.local está correto?
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. ✅ Containers do Docker estão saudáveis?
   ```powershell
   docker-compose ps
   docker-compose logs bff
   ```

### Erro: "MongoDB connection refused"

MongoDB pode não estar rodando:

```powershell
# Com Docker Compose (automático)
docker-compose up mongo

# Ou localmente
# Verificar se o serviço está ativo
# MongoDB geralmente usa porta 27017
```

---

## 🔄 Fluxo de Login Corrigido

Agora com melhor tratamento de erros:

1. **Página de login carrega** → Verifica conectividade com API
2. **Se offline** → Mostra mensagem clara: "⚠️ Servidor indisponível"
3. **Se online** → Permite tentar login
4. **Erro de rede** → Mensagem detalhada com detalhes técnicos
5. **Erro de autenticação** → Mensagem clara ao usuário

---

## 📝 Logs e Debugging

### Logs do Frontend

Abra o **DevTools do navegador** (F12):
- Console: Verá logs do health check
- Network: Verá requisições e erros de conexão

### Logs do Backend

```powershell
docker-compose logs -f bff
```

### Logs do MongoDB

```powershell
docker-compose logs -f mongo
```

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Port 3000 já está em uso | `docker-compose down` ou mude a porta em docker-compose.yml |
| Docker não inicia | Verifique se Docker Desktop está aberto |
| Erro "Cannot find module" | Execute `npm install` no container |
| MongoDB não conecta | Verifique credenciais em docker-compose.yml |
| Frontend não vê o backend | Verifique `NEXT_PUBLIC_API_URL` em .env.local |

---

## ✅ Verificação Rápida

Após iniciar, teste com:

```bash
# 1. Frontend acessível?
curl http://localhost:3001

# 2. Backend acessível?
curl http://localhost:3000/health

# 3. MongoDB acessível?
mongosh --host localhost:27017

# 4. Frontend consegue ver backend?
# Abra DevTools (F12) e veja o console
# Deve aparecer: [HealthCheck] API está online ✓
```

---

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Docker](https://hub.docker.com/_/mongo)

---

**Última atualização**: 2026-07-10
