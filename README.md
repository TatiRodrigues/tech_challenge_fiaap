# 💰 Alecrim Wallet

Aplicação de gerenciamento financeiro pessoal desenvolvida como **Tech Challenge Fase 2** da FIAP Pós-Graduação em Arquitetura de Software.

---

## 🚀 Executar localmente

### Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|--------------|---------|
| **Node.js** | 20 LTS | https://nodejs.org |
| **npm** | 10+ | (incluso no Node.js) |

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3001**

### Credenciais

```
Email: teste@gmail.com
Senha: testes
Username: Aluno Carequinha
```

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo desenvolvimento (porta 3001) |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia a build de produção |
| `npm run lint` | Executa o linter |

---

## 🐳 Executar com Docker (stack completa)

O `docker-compose.yml` orquestra os três serviços: **MongoDB**, **BFF (Node.js)** e **Frontend (Next.js)**.

### Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|--------------|---------|
| **Docker Desktop** | 24+ | https://www.docker.com/products/docker-desktop |
| **Git** | 2+ | https://git-scm.com |

### Estrutura de pastas esperada

Os dois repositórios devem ficar lado a lado na mesma pasta:

```
/dev/
├── tech_challenge_fiaap/   ← este repositório (frontend)
└── tech-challenge-2/       ← BFF (backend)
```

### Clone os dois repositórios

```bash
# Frontend (este repo)
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git

# BFF
git clone https://github.com/israelmeinert/tech-challenge-2.git
```

### Subir os containers

```bash
cd tech_challenge_fiaap

# Sobe MongoDB + BFF (frontend roda fora do Docker — ver nota abaixo)
docker compose up -d mongo bff

# Aguardar BFF ficar healthy (~30s) e então iniciar o frontend
npm install
npm run dev
```

Acesse: **http://localhost:3001**

> **Nota:** O frontend é executado diretamente no host Windows/macOS em vez de dentro do container, pois o Docker Alpine usa binários musl incompatíveis com o SWC nativo requerido pelo Next.js 16. O `docker-compose.yml` inclui o serviço `app` para ambientes Linux onde esta limitação não existe.

### Verificar status dos containers

```bash
docker compose ps
docker logs tech-challenge-bff --tail 20
```

---

## ☁️ Deploy em Cloud (Vercel)

### Deploy do Frontend (Vercel)

O projeto já inclui `vercel.json` com configurações de segurança (headers HTTP) e build.

1. Acesse [vercel.com](https://vercel.com) e importe o repositório `tech_challenge_fiaap`
2. Configure a variável de ambiente:

```
NEXT_PUBLIC_API_URL = https://URL_DO_SEU_BFF
```

3. Clique em **Deploy**

A Vercel detecta automaticamente o Next.js e aplica SSR/SSG corretamente.

### Deploy do BFF

O BFF (`tech-challenge-2`) pode ser deployado em qualquer plataforma que suporte Node.js (Railway, Render, Heroku, etc.) ou como container Docker em AWS ECS / Azure Container Apps.

Variáveis necessárias no BFF em produção:

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/tech-challenge
NODE_ENV=production
PORT=3000
```

---

## ✨ Funcionalidades

- **Dashboard** — Gráficos financeiros: donut chart, barras diárias e tendência mensal
- **Listagem de Transações** — Filtros avançados (tipo, status, período, busca), paginação e alternância tabela/cards
- **Nova / Editar Transação** — Validação avançada, sugestões automáticas de categoria e upload de recibos (drag-and-drop)
- **Autenticação** — Login, cadastro e recuperação de senha

---

## 🏗️ Arquitetura (Tech Challenge Fase 2)

### Tecnologias

| Tecnologia | Versão | Papel |
|-----------|--------|-------|
| Next.js | 16 | Framework (SSR/SSG) |
| React | 19 | UI |
| TypeScript | 5 | Tipagem estática |
| Redux Toolkit | 2 | Gestão de estado |
| Redux Persist | 6 | Persistência de estado |
| Bootstrap | 5 | Estilos |
| Webpack | 5 | Bundler (Module Federation) |

### SSR / Server Components

Páginas convertidas para Server Components com `Metadata` para SEO:

```
app/
├── login/layout.tsx              ← Server, export metadata
├── cadastro/layout.tsx           ← Server, export metadata
├── esqueceu-senha/layout.tsx     ← Server, export metadata
└── (autenticado)/
    ├── listar-transacoes/
    │   ├── page.tsx              ← Server, export metadata
    │   └── client.tsx            ← 'use client' — lógica interativa
    ├── nova-transacao/
    │   ├── page.tsx              ← Server, export metadata
    │   └── client.tsx
    └── resumo-transacao/
        ├── page.tsx              ← Server, export metadata
        └── client.tsx
```

### Microfrontends (Module Federation)

Arquitetura definida com três módulos independentes:

| Módulo | Porta | Responsabilidade |
|--------|-------|-----------------|
| `alecrim_wallet_host` | 3001 | Shell, Header, MenuLateral |
| `alecrim_wallet_transactions` | 3002 | Telas e lógica de transações |
| `alecrim_wallet_auth` | 3003 | Login, cadastro, recuperação |

A configuração Webpack está pronta em `next.config.ts` (comentada). Para ativar:

```bash
# 1. Instalar o plugin
npm install @module-federation/nextjs-mf

# 2. Em next.config.ts:
#    - remover a linha: turbopack: {}
#    - descomentar o bloco: webpack: (config, ...) => { ... }

# 3. Reiniciar: npm run dev
```

Comunicação entre módulos via `MicrofrontendBus` (`config/microfrontend-advanced.ts`):

```typescript
import { MicrofrontendBus, MFEEvents } from '@/config/microfrontend-advanced';

// Emitir
MicrofrontendBus.getInstance().emit(MFEEvents.Transaction.CREATED, data);

// Escutar (via hook)
const { on } = useMicrofrontendBus();
on(MFEEvents.Auth.LOGOUT, () => router.push('/login'));
```

Eventos já conectados:
- `TRANSACTION_CREATED` → emitido pelo `FormularioTransacao` após salvar
- `AUTH_LOGOUT` → emitido pelo `Header` antes do logout

### Gestão de Estado (Redux)

```
store/
├── slices/
│   ├── authSlice.ts                 ← user, token, isAuthenticated
│   ├── transactionsSlice.ts         ← modelo FIAP (receita/despesa)
│   └── bankingTransactionSlice.ts   ← integração API bancária
├── thunks/index.ts                  ← loginUser, logoutUser, fetchAccount
└── hooks.ts                         ← useAppDispatch, useAppSelector (tipados)
```

### Acessibilidade (WCAG 2.1 AA)

- **Skip link** "Pular para o conteúdo principal" visível ao pressionar Tab
- **Landmarks semânticos**: `<header role="banner">`, `<nav aria-label>`, `<main>`, `<footer role="contentinfo">`
- **Labels visíveis** em todos os formulários (Login, Cadastro, Nova/Editar Transação)
- `aria-current="page"` no menu lateral — leitor de tela anuncia a página ativa
- Modais com `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, foco automático e fechamento com `Escape`
- `aria-live="assertive"` em erros de formulário; `aria-live="polite"` em sucesso e contagem de resultados
- `aria-busy` nos botões de submit durante carregamento
- `aria-hidden="true"` em todos os ícones decorativos
- **Contraste** corrigido: badge "Pendente" usa `text-dark` sobre amarelo (contraste 12:1, WCAG AA ✅)
- `scope="col"` nos cabeçalhos de tabela
- `aria-label` descritivo nos botões de ação por transação
- `aria-pressed` nos botões de alternância tabela/cards
- `prefers-reduced-motion` e `prefers-contrast` respeitados via CSS
- Mínimo de 44×44px nas áreas clicáveis (WCAG 2.5.5)

---

## 📁 Estrutura do Projeto

```
├── app/                        # Rotas Next.js (App Router)
│   ├── (autenticado)/          # Rotas protegidas por autenticação
│   │   ├── layout.tsx
│   │   ├── listar-transacoes/
│   │   ├── nova-transacao/
│   │   └── resumo-transacao/
│   ├── login/
│   ├── cadastro/
│   ├── esqueceu-senha/
│   ├── layout.tsx              # Root layout (ReduxProvider + skip link)
│   └── globals.css
├── componentes/                # Componentes reutilizáveis
│   ├── features/
│   │   ├── financial-charts/   # Gráficos do dashboard
│   │   ├── cards-resumo/       # Cards de saldo
│   │   ├── pagination/         # Componente de paginação
│   │   ├── file-upload/        # Upload de recibos
│   │   ├── modal-editar-transacao/
│   │   └── formulario-transacao/
│   ├── header/
│   ├── menu-lateral/
│   └── rodape/
├── config/
│   ├── microfrontend.ts        # Configuração Module Federation
│   └── microfrontend-advanced.ts # MicrofrontendBus + eventos
├── store/                      # Redux store
├── utils/
│   ├── transactionValidation.ts # validateTransaction + CATEGORY_SUGGESTIONS
│   └── filterUtils.ts           # IPaginationState
├── types/
├── public/
│   └── transactions.json       # Dados de exemplo (modo local)
├── next.config.ts
├── package.json
└── .env.local                  # Variáveis de ambiente (não commitado)
```

---

## ⚙️ Variáveis de Ambiente

O arquivo `.env.local` já está configurado para desenvolvimento local. Valores padrão:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

### Integração com API bancária (opcional)

Para usar dados reais em vez dos dados locais, rode o backend em paralelo:

```bash
git clone https://github.com/israelmeinert/tech-challenge-2.git
cd tech-challenge-2
npm install
npm run dev   # http://localhost:3000
```

Credenciais com API:
```
Email: teste@gmail.com
Senha: testes
```

---

## 🐛 Problemas comuns

**Página não carrega / erro de módulo**
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
npm run dev
```

**"Token inválido" ao fazer login**
```javascript
// No console do navegador (F12):
localStorage.clear()
// Recarregue a página
```

**Porta 3001 em uso**
```bash
# Matar o processo na porta
npx kill-port 3001
npm run dev
```

---

## 👩‍💻 Autora

Desenvolvido por **Tatiane Rodrigues** — FIAP Pós-Graduação em Arquitetura de Software.
