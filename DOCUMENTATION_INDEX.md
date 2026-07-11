# 📚 Índice de Documentação - Alecrim Wallet

> **Guia de navegação para toda a documentação do projeto**

---

## 🎯 Comece Aqui

### Para Iniciar o Projeto (1ª vez)
👉 **[QUICK_START.md](QUICK_START.md)** - 5 minutos  
- ✅ 3 passos simples para rodar o projeto
- ✅ Indicadores de sucesso
- ✅ Erros mais comuns

### Se Tiver Problemas
👉 **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Guia completo  
- 🔍 Troubleshooting detalhado
- 🐛 Diagnóstico de erros
- 📊 Monitoramento de containers

### Entender o Projeto
👉 **[README.md](README.md)** - Documentação oficial  
- 📋 Funcionalidades
- 🛠️ Tecnologias
- 📁 Estrutura do projeto

### Ver o que Mudou
👉 **[MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md)** - Histórico técnico  
- 📝 Alterações implementadas
- 🔧 Melhorias de código
- ✨ Novos recursos

---

## 📖 Documentação Completa

### Setupdo Projeto
| Documento | Propósito | Tempo |
|-----------|----------|-------|
| [QUICK_START.md](QUICK_START.md) | Iniciar rápido | 5 min |
| [DOCKER_SETUP.md](DOCKER_SETUP.md) | Configuração detalhada | 15 min |
| [.env.example](.env.example) | Variáveis de ambiente | 2 min |
| [docker-compose.yml](docker-compose.yml) | Configuração Docker | 5 min |

### Desenvolvimento
| Documento | Propósito | Público |
|-----------|----------|--------|
| [README.md](README.md) | Documentação completa | Todos |
| [docs/](docs/) | Documentação interativa | Developers |
| [MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md) | Histórico técnico | Tech Lead |

---

## 🎯 Escolha seu Caminho

### 👨‍💼 Gestor do Projeto
1. Leia: [README.md](README.md) - Visão geral
2. Veja: [MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md) - Status
3. Acesse: http://localhost:3001 - Demo

### 👨‍💻 Developer
1. Execute: [QUICK_START.md](QUICK_START.md) - Setup
2. Estude: [README.md](README.md) - Arquitetura
3. Explore: `docs/` - Design system
4. Develop: Crie em `src/`

### 🔧 DevOps / SysAdmin
1. Configure: [DOCKER_SETUP.md](DOCKER_SETUP.md)
2. Monitore: Comandos em [DOCKER_SETUP.md](DOCKER_SETUP.md)
3. Otimize: Variáveis em `.env.local`
4. Deploy: Instruções em [README.md](README.md#-deployment)

### 🐛 QA / Tester
1. Prepare: [QUICK_START.md](QUICK_START.md)
2. Teste: Funcionalidades em [README.md](README.md#-como-usar)
3. Reporte: Use logs em [DOCKER_SETUP.md](DOCKER_SETUP.md#-logs-e-debugging)
4. Debug: Troubleshoot em [DOCKER_SETUP.md](DOCKER_SETUP.md#-diagnosticando-erros)

---

## 🔍 Encontre o Que Procura

### "Como iniciar o projeto?"
→ [QUICK_START.md](QUICK_START.md)

### "O projeto não inicia"
→ [DOCKER_SETUP.md](DOCKER_SETUP.md#-diagnosticando-erros)

### "Como alterar variáveis de ambiente?"
→ [.env.example](.env.example) e [README.md](README.md#-configuração)

### "Como ver logs?"
→ [DOCKER_SETUP.md](DOCKER_SETUP.md#-logs-e-debugging)

### "Como parar os containers?"
→ [DOCKER_SETUP.md](DOCKER_SETUP.md#-parando-a-stack)

### "Qual é a arquitetura?"
→ [README.md](README.md#-fluxo-de-dados) e [DOCKER_SETUP.md](DOCKER_SETUP.md#-arquitetura)

### "Como contribuir?"
→ [README.md](README.md#-contribuindo)

### "Como fazer deploy?"
→ [README.md](README.md#-deployment)

### "O que mudou?"
→ [MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md)

---

## 📋 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| Verificar | `.\check-setup.ps1` | Valida pré-requisitos |
| Iniciar | `.\run-stack.ps1` | Inicia Docker Compose |
| Parar | `.\stop-docker.ps1` | Para containers |
| Build | `.\build-docker.ps1` | Reconstrói imagens |

---

## 🔧 Estrutura de Diretórios

```
📦 tech_challenge_fase_um
├── 📄 QUICK_START.md ........................ ⭐ COMECE AQUI
├── 📄 DOCUMENTATION_INDEX.md ............... Este arquivo
├── 📄 DOCKER_SETUP.md ....................... Troubleshooting
├── 📄 MUDANCAS_REALIZADAS.md ............... Histórico técnico
├── 📄 README.md ............................. Documentação oficial
├── 📄 docker-compose.yml .................... Stack Docker
├── 📄 .env.example .......................... Variáveis de exemplo
├── 🔧 check-setup.ps1 ...................... Verificar pré-requisitos
├── 🔧 run-stack.ps1 ........................ Iniciar stack
├── 🔧 stop-docker.ps1 ...................... Parar stack
├── 📁 app/ ................................. Frontend (Next.js)
├── 📁 docs/ ................................ Documentação interativa
├── 📁 package.json ......................... Dependências
└── 📁 src/ ................................. Código fonte
```

---

## ⏱️ Tempo de Leitura

| Documento | Tempo |
|-----------|-------|
| QUICK_START.md | ⏱️ 5 min |
| DOCKER_SETUP.md | ⏱️ 15 min |
| README.md | ⏱️ 30 min |
| MUDANCAS_REALIZADAS.md | ⏱️ 10 min |
| **Total** | **⏱️ 60 min** |

---

## 🆘 Suporte

### Precisa de ajuda?

1. **Erro rápido?** → [DOCKER_SETUP.md - Erros Comuns](DOCKER_SETUP.md#-problemas-comuns)
2. **Problema técnico?** → [DOCKER_SETUP.md - Diagnosticando](DOCKER_SETUP.md#-diagnosticando-erros)
3. **Quer entender mais?** → [README.md](README.md)
4. **Quer saber o que mudou?** → [MUDANCAS_REALIZADAS.md](MUDANCAS_REALIZADAS.md)

---

## 📞 Contato

- 📧 Email: [seu-email@example.com]
- 🐛 Issues: [Abra uma issue no GitHub](https://github.com/TatiRodrigues/tech_challenge_fiaap/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/TatiRodrigues/tech_challenge_fiaap/discussions)

---

## ✅ Checklist de Onboarding

- [ ] Li [QUICK_START.md](QUICK_START.md)
- [ ] Executei `.\check-setup.ps1` com sucesso
- [ ] Executei `.\run-stack.ps1` e vejo containers rodando
- [ ] Acessei http://localhost:3001 com sucesso
- [ ] Fiz login com credenciais padrão
- [ ] Consultei [README.md](README.md) para entender a estrutura
- [ ] Explorei os docs interativos em `docs/`
- [ ] Li [DOCKER_SETUP.md](DOCKER_SETUP.md) para casos de erro

---

**Última atualização:** 2026-07-11  
**Versão:** 2.0.0  
**Status:** ✅ Pronto para produção
