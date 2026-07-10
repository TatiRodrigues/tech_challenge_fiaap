# 🐳 Guia Completo Docker - Tech Challenge

Este guia explica como usar Docker com este projeto.

---

## 📋 Pré-requisitos

- ✅ Docker Desktop instalado
- ✅ Docker Compose v2+
- ✅ Node.js 20+ (para desenvolvimento sem Docker)
- ✅ Git

---

## 🚀 Quick Start

### **Desenvolvimento (com hot-reload)**

```powershell
.\run-docker.ps1 -Environment development
```

Ou manualmente:
```bash
docker-compose up -d
```

**URLs:**
- Frontend: http://localhost:3000
- BFF: http://localhost:3001
- MongoDB: localhost:27017

---

### **Produção**

```powershell
.\run-docker.ps1 -Environment production
```

Ou manualmente:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📦 Scripts Auxiliares (PowerShell)

### **1. Build de Imagens**
```powershell
# Build desenvolvimento
.\build-docker.ps1 -Environment development

# Build produção
.\build-docker.ps1 -Environment production
```

### **2. Rodar Containers**
```powershell
# Desenvolvimento (attached - vê logs ao vivo)
.\run-docker.ps1 -Environment development -Detach:$false

# Produção (detached - roda em background)
.\run-docker.ps1 -Environment production -Detach:$true
```

### **3. Parar Containers**
```powershell
# Apenas parar (dados mantidos)
.\stop-docker.ps1

# Remover containers (dados mantidos)
.\stop-docker.ps1 -Remove

# Remover tudo incluindo volumes (CUIDADO - deleta BD)
.\stop-docker.ps1 -Remove -Volumes
```

---

## 🔧 Configuração

### **Variáveis de Ambiente**

**Frontend** - Criar `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_LOG_LEVEL=info
NODE_ENV=development
```

**BFF** - Criar `../tech-challenge-2/.env`:
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:senha123@mongo:27017/tech-challenge?authSource=admin
```

---

## 📊 Arquivos Docker

### **Dockerfile** (Produção)
- ✅ Multi-stage build
- ✅ Usuário não-root
- ✅ Node.js 20 Alpine
- ✅ Health check
- ✅ Otimizado para tamanho

### **Dockerfile.dev** (Desenvolvimento)
- ✅ Hot-reload com nodemon
- ✅ Volumes mapeados
- ✅ Sem otimizações (debug fácil)

### **docker-compose.yml** (Dev)
- ✅ Frontend + BFF + MongoDB
- ✅ Volumes para código
- ✅ Hot-reload automático
- ✅ Profiles para desenvolvimento

### **docker-compose.prod.yml** (Produção)
- ✅ Resource limits
- ✅ Restart policies
- ✅ Health checks avançados
- ✅ Sem volumes persistentes

### **.dockerignore**
- ✅ Remove ~200MB desnecessários
- ✅ Acelera build
- ✅ Aumenta segurança

---

## 🎯 Commandos Úteis

### **Ver Status**
```bash
# Listar containers rodando
docker ps

# Listar todas as imagens
docker images

# Ver logs em tempo real
docker logs -f tech-challenge-app

# Ver logs do BFF
docker logs -f tech-challenge-bff
```

### **Execução**
```bash
# Entrar em um container
docker exec -it tech-challenge-app /bin/sh

# Executar comando em container
docker exec tech-challenge-app npm run build

# Restart de um container
docker restart tech-challenge-app
```

### **Limpeza**
```bash
# Remover container parado
docker rm tech-challenge-app

# Remover imagem
docker rmi tech-challenge-app:latest

# Limpeza completa (cuidado!)
docker system prune -a
```

---

## 🚨 Troubleshooting

### **Problema: "Failed to resolve reference"**
```
Solução: WiFi instável. Tente novamente ou use WiFi melhor
```

### **Problema: "Port 3000 already in use"**
```powershell
# Encontrar processo usando porta
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess

# Parar container anterior
docker stop tech-challenge-app
docker rm tech-challenge-app
```

### **Problema: Nodemon crash no BFF**
```bash
# Ver erro completo
docker logs tech-challenge-bff

# Verificar MongoDB está rodando
docker ps | grep mongo
```

### **Problema: Volume não atualiza no hot-reload**
```powershell
# Remover e reconstruir
.\stop-docker.ps1 -Remove -Volumes
.\run-docker.ps1 -Environment development
```

---

## 📈 Performance

### **Otimizações Implementadas**

1. **Multi-stage Build**
   - Reduz imagem de ~800MB para ~200MB

2. **.dockerignore**
   - Remove docs, testes, cache, node_modules

3. **Alpine Linux**
   - Node.js 20-alpine = 150MB (vs 300MB com ubuntu)

4. **Cache de Layers**
   - npm install em layer separado
   - Reutiliza se package*.json não muda

5. **Resource Limits** (Produção)
   - App: 512MB max
   - BFF: 512MB max
   - MongoDB: 1GB max

---

## 🔐 Segurança

### **Práticas Implementadas**

✅ **Usuário não-root** (nextjs:1001)
✅ **Secrets não em código** (use .env)
✅ **Alpine Linux** (menos vulnerabilidades)
✅ **Health checks** (detecta falhas)
✅ **Network isolada** (bridge)
✅ **Restart policies** (recuperação automática)

### **Para Produção**

1. Mudar senha MongoDB:
```yaml
MONGO_PASSWORD=sua_senha_forte_aqui
```

2. Usar AWS/Azure secrets manager

3. Adicionar HTTPS/SSL

4. Usar container registry privado

---

## 📚 Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Python Docker](https://docs.docker.com/language/python/build-images/)
- [Alpine Linux Base Image](https://hub.docker.com/_/alpine)

---

## 🤝 Contribuições

Encontrou um problema? Quer melhorar este guia?

1. Teste localmente
2. Documenta o issue
3. Faça um Pull Request

---

**Última atualização:** 2026-07-09  
**Mantido por:** Tech Challenge Team
