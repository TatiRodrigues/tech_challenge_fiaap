📋 # VISÃO GERAL COMPLETA - TECH CHALLENGE FASE UM

## 🎯 Objetivo Final

Criar uma aplicação completa de gerenciamento de transações financeiras com:
- Interface moderna e responsiva
- Integração com API bancária real (tech-challenge-2)
- Recursos avançados de filtro, busca e paginação
- Validação inteligente e sugestões automáticas
- Upload de anexos com validação
- Acessibilidade WCAG 2.1 AA

---

## 🏗️ Arquitetura

### Frontend Stack
- **Next.js 16+** - Framework React com SSR
- **React 19+** - Biblioteca UI
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Bootstrap 5** - UI Components
- **SASS** - Estilos avançados

### Backend (API)
- **Node.js** - Runtime
- **tech-challenge-2 API** - API bancária
- **JWT** - Autenticação
- **MongoDB** - Banco de dados

---

## 📦 Componentes Principais

### 1. Autenticação
- Login/Registro com JWT
- Fallback para dados locais
- Token persistence
- Logout

### 2. Transações
- CRUD completo
- Filtros avançados (8 tipos)
- Paginação adaptativa
- Busca por texto
- Ordenação dinâmica

### 3. Validação Avançada
- Email, senha, valor, data
- Mensagens de erro específicas
- Validação em tempo real
- Contador de caracteres

### 4. Sugestões de Categorias
- Análise automática de descrição
- 8 categorias com 50+ palavras-chave
- Indicador de confiança (%)
- Seleção rápida

### 5. Upload de Arquivos
- Drag-and-drop
- Validação de tipo e tamanho
- Até 5 arquivos por transação
- Tipos: PDF, imagens, docs

### 6. Dashboard
- Resumo de saldo
- Últimas transações
- Cartões disponíveis
- Estatísticas

---

## 🔄 Fluxo de Dados

```
Usuário
   ↓
React Component (Page/Form)
   ↓
Redux (dispatch thunk)
   ↓
Banking API Service (Axios)
   ↓
API Bancária (tech-challenge-2)
   ↓
Redux Store (slice update)
   ↓
Component re-render (useSelector)
   ↓
Usuário vê resultado
```

---

## 📁 Estrutura de Arquivos

```
/
├── app/
│   ├── config/
│   │   ├── api.ts              ← Config da API
│   │   └── api-types.ts        ← Tipos da API
│   ├── servicos/
│   │   ├── auth.ts             ← Auth local
│   │   └── banking-api.ts      ← Integração API
│   ├── hooks/
│   │   └── useBankingApi.ts    ← Hook customizado
│   ├── provedores/
│   ├── login/
│   ├── cadastro/
│   ├── (autenticado)/          ← Rotas protegidas
│   ├── layout.tsx
│   └── page.tsx
│
├── componentes/
│   ├── features/
│   │   ├── enhanced-lista-transacoes/
│   │   ├── enhanced-transaction-form/
│   │   ├── advanced-filters/
│   │   ├── pagination/
│   │   ├── file-upload/
│   │   ├── category-suggestions/
│   │   └── cards-resumo/
│   ├── header/
│   ├── menu-lateral/
│   └── rodape/
│
├── store/
│   ├── slices/
│   │   ├── authSlice.ts        ← Com integração API
│   │   ├── transactionsSlice.ts
│   │   └── bankingTransactionSlice.ts
│   ├── thunks/
│   │   └── index.ts            ← 8 async actions
│   ├── hooks.ts
│   ├── index.ts
│   └── ReduxProvider.tsx
│
├── utils/
│   ├── filterUtils.ts          ← Filtros, paginação
│   ├── uploadUtils.ts          ← Upload validation
│   ├── validationUtils.ts      ← Form validation
│   └── formatting.ts           ← Formatação
│
├── types/
│   └── index.ts                ← Tipos globais
│
├── public/
│   ├── transactions.json       ← Dados mockados
│   └── imagens/
│
├── docs/                       ← Docusaurus
│
├── .env.example
├── README.md                   ← ATUALIZADO
├── SETUP.md                    ← Este arquivo
├── QUICK_START.md
├── INTEGRATION_GUIDE.md        ← NOVO
├── API_INTEGRATION_SUMMARY.md  ← NOVO
├── FEATURES_DOCUMENTATION.md
└── package.json
```

---

## 🚀 Como Executar

### Modo 1: Frontend Only (Dados Locais)
```bash
npm install
npm run dev
# http://localhost:3000
# Login: fiap@alecrimwallet.com.br / 1234
```

### Modo 2: Com API Completa
```bash
# Terminal 1: API
cd ../tech-challenge-2
npm install && npm run dev

# Terminal 2: Frontend
npm install && npm run dev
```

### Configurar Ambiente
```bash
cp .env.example .env.local
# Edite conforme necessário
```

---

## ✨ Recursos Implementados

### Filtros Avançados (8 tipos)
- [ ] Tipo (Receita/Despesa)
- [ ] Categoria (8 opções)
- [ ] Status (3 estados)
- [ ] Data (intervalo)
- [ ] Valor (intervalo)
- [ ] Texto (busca)
- [ ] Ordenação (3 campos)
- [ ] Paginação (4 tamanhos)

### Validação (10+ regras)
- Email válido
- Senha forte
- Valor positivo (<= 1M)
- Descrição (3-500 chars)
- Data não futura
- Categoria obrigatória
- Arquivo < 5MB
- Arquivo tipo correto
- Max 5 arquivos
- Data válida

### Sugestões (8 categorias)
- Alimentação
- Transporte
- Saúde
- Educação
- Entretenimento
- Utilidades
- Investimento
- Outro

### Upload (8 tipos)
- PDF
- JPEG
- PNG
- GIF
- DOC
- DOCX
- XLS
- XLSX

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| Componentes React | 20+ |
| Hooks Customizados | 5+ |
| Páginas | 8+ |
| Redux Slices | 3 |
| Async Thunks | 8 |
| Tipos TypeScript | 50+ |
| Utilitários | 4 arquivos |
| Testes E2E | Pronto para Cypress |
| Documentação | 7 arquivos MD |
| Linhas de Código | ~3500 |

---

## 🔐 Segurança

✅ JWT Authentication  
✅ HTTPS Ready  
✅ Input Validation  
✅ CORS Configured  
✅ Environment Variables  
✅ Type Safety (TS)  
✅ Token Refresh Ready  
✅ Endpoint Protection  

---

## ♿ Acessibilidade

✅ WCAG 2.1 AA  
✅ Screen Readers  
✅ Keyboard Navigation  
✅ High Contrast  
✅ Focus Visible  
✅ Skip Links  
✅ ARIA Labels  
✅ Semantic HTML  

---

## 📈 Performance

✅ Code Splitting  
✅ Image Optimization  
✅ Lazy Loading  
✅ Caching (Redux Persist)  
✅ Paginação  
✅ Debounce ready  
✅ Memoization  

---

## 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| README.md | Visão geral completa com integração API |
| SETUP.md | Este arquivo (visão geral) |
| QUICK_START.md | Comece em 5 minutos |
| INTEGRATION_GUIDE.md | Guia detalhado de integração |
| FEATURES_DOCUMENTATION.md | Features avançadas |
| IMPLEMENTATION_SUMMARY.md | Resumo de implementação |
| API_INTEGRATION_SUMMARY.md | Resumo da integração API |

---

## 🎯 Próximos Passos (Recomendado)

- [ ] Implementar testes (Jest + RTL)
- [ ] Adicionar testes E2E (Cypress)
- [ ] Deploy em produção
- [ ] Implementar refresh token
- [ ] Adicionar cache mais inteligente
- [ ] Melhorar tratamento offline
- [ ] Analytics/Logging
- [ ] Performance monitoring

---

## 🤝 Como Contribuir

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/nova`)
3. Commit (`git commit -am 'Add feature'`)
4. Push (`git push origin feature/nova`)
5. Abra um PR

---

## 📞 Suporte

- 📧 Email: [seu-email]
- 💬 Issues: Abra uma issue no GitHub
- 📚 Docs: Veja a documentação completa

---

## 🔗 Links Úteis

- [tech-challenge-2 API](https://github.com/israelmeinert/tech-challenge-2)
- [Next.js Docs](https://nextjs.org/docs)
- [Redux Docs](https://redux.js.org/)
- [Bootstrap Docs](https://getbootstrap.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Status**: ✅ Completo e Funcional  
**Versão**: 2.0.0 (com integração API)  
**Data**: 14/06/2026


#### Leitores de Tela
- ARIA labels em botões, inputs, links
- ARIA roles apropriados (button, tab, alert, etc.)
- Live regions para anúncios dinâmicos
- Screen reader only text para contexto adicional

#### Contraste e Cores
- Mínimo 4.5:1 em texto regular
- Suporte a `prefers-color-scheme: dark`
- Suporte a `prefers-contrast: more`
- Ferramenta de cálculo de contraste incluída

#### Redução de Movimento
- Respeita `prefers-reduced-motion`
- Animações desabilitadas para usuários que preferem
- Transições reduzidas

#### Elementos Interativos
- Tamanho mínimo de toque: 44x44px
- Espaçamento adequado entre elementos
- Estados clara (hover, focus, active, disabled)
- Mensagens de erro acessíveis

#### Suporte a Textos Grandes
- Layout responsivo que suporta zoom até 200%
- Unidades relativas (rem, em)
- Word spacing e letter spacing otimizados

### ✅ Microfrontends (Preparação)

#### Arquitetura Module Federation
- Configuração em `config/microfrontend.ts`
- Preparação no `next.config.ts` com webpack optimization
- Exposes de componentes principais
- Shared libraries configuradas

#### Comunicação entre Microfrontends
- `MicroFrontendBus`: Event emitter para pub/sub
- Estratégia de mensagens desacoplada
- Suporte para carregamento dinâmico de módulos remotos

#### Estrutura para Múltiplos Apps
- Host principal (Alecrim Wallet)
- Remote 1: Transações (porta 3001)
- Remote 2: Autenticação (porta 3002)
- Remote 3: Relatórios (porta 3003)

---

## 📁 Estrutura do Projeto

```
alecrim-wallet/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Layout raiz com Redux + Auth
│   ├── page.tsx                     # Dashboard/Home
│   ├── assets/
│   │   ├── css/
│   │   │   ├── accessibility.css   # Estilos WCAG 2.1 AA
│   │   │   └── portal.css
│   │   ├── scss/
│   │   └── images/
│   ├── login/                       # Autenticação
│   ├── cadastro/
│   ├── esqueceu-senha/
│   ├── (autenticado)/               # Rotas protegidas
│   │   ├── layout.tsx
│   │   ├── listar-transacoes/
│   │   ├── nova-transacao/
│   │   └── resumo-transacao/
│   ├── provedores/
│   │   └── AuthProvider.tsx         # Auth context
│   ├── servicos/
│   │   └── auth.ts                  # Serviços de autenticação
│   └── hooks/
│       └── useProtectedRoute.ts     # Hook de rotas protegidas
│
├── componentes/                      # Componentes React
│   ├── header/                      # Componentes de layout
│   ├── menu-lateral/
│   ├── rodape/
│   └── features/                    # Features específicas
│       ├── listar-transacoes/
│       ├── formulario-transacao/
│       ├── modal-editar-transacao/
│       ├── cards-resumo/
│       └── resumo-transacao/
│
├── store/                           # Redux
│   ├── index.ts                     # Store, persistor
│   ├── hooks.ts                     # Hooks tipados
│   ├── ReduxProvider.tsx            # Provider
│   └── slices/
│       ├── authSlice.ts             # Estado de autenticação
│       └── transactionsSlice.ts     # Estado de transações
│
├── types/
│   └── index.ts                     # Tipos centralizados (IUser, ITransaction, etc.)
│
├── utils/
│   ├── accessibility.ts             # Utilitários de acessibilidade
│   └── formatting.ts                # Formatação, mascaras, validação
│
├── config/
│   └── microfrontend.ts             # Configuração de microfrontends
│
├── hooks/
│   └── useTransactions/
│
├── public/
│   └── transactions.json            # Dados mockados
│
├── docs/                            # Documentação Docusaurus
│   ├── docs/
│   └── package.json
│
├── tsconfig.json                    # TypeScript com paths
├── next.config.ts                   # Next.js com otimizações
├── package.json                     # Dependências
├── README.md                        # Readme inicial
└── SETUP.md                         # Este arquivo
```

---

## ⚙️ Instalação e Setup

### Pré-requisitos
- **Node.js** 18+ (recomendado 20+)
- **npm** 9+ ou **yarn** 4+

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fase_um
```

### Passo 2: Instalar Dependências

```bash
npm install
# ou
yarn install
```

### Passo 3: Executar em Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Passo 4: Build para Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

---

## 🔐 Credenciais de Teste

```
Nome: Fiap Pós Tech
Email: fiap@alecrimwallet.com.br
Senha: 1234
```

---

## 📚 Documentação

### Documentação Técnica (Docusaurus)

```bash
cd docs
npm install
npm start
```

Acesse: **http://localhost:3000** (após iniciar a documentação)

### Seções Disponíveis
- 📖 Primeiro Uso
- ⚡ Solução Rápida
- 🎨 Design System
- 🧩 Componentes
- 🏗️ Arquitetura
- 🔌 API e Serviços
- ✅ Boas Práticas

---

## 🎯 Guia de Uso

### Redux - Gestão de Estado

#### Acessar Estado de Autenticação

```tsx
import { useAuth, useAuthUser } from '@/store/hooks';

export function MeuComponente() {
  // Todo o estado de auth
  const auth = useAuth();
  
  // Apenas o usuário
  const user = useAuthUser();
  
  return (
    <div>
      {user && <p>Bem-vindo, {user.nome}!</p>}
    </div>
  );
}
```

#### Acessar Estado de Transações

```tsx
import { useTransactions, useTransactionTotals } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { addTransaction } from '@/store/slices/transactionsSlice';

export function MinhaTransacao() {
  const dispatch = useAppDispatch();
  const transactions = useTransactions();
  const { receitas, despesas, saldo } = useTransactionTotals();
  
  const handleAddTransaction = () => {
    dispatch(addTransaction({
      id: '123',
      tipo: 'receita',
      valor: 1000,
      // ... outros campos
    }));
  };
  
  return (
    <div>
      <p>Receitas: {receitas}</p>
      <p>Despesas: {despesas}</p>
      <p>Saldo: {saldo}</p>
    </div>
  );
}
```

### Acessibilidade - Implementação

#### Input Acessível

```tsx
import { createAccessibleProps } from '@/utils/accessibility';

export function MeuForm() {
  return (
    <>
      <label htmlFor="email">Email *</label>
      <input
        {...createAccessibleProps.input({
          id: 'email',
          label: 'Email',
          required: true,
        })}
      />
    </>
  );
}
```

#### Navegação por Teclado

```tsx
import { keyboardNavigation } from '@/utils/accessibility';

export function MeuComponente() {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (keyboardNavigation.isEscapeKey(e)) {
      // Fechar modal
    }
    
    if (keyboardNavigation.isEnterKey(e)) {
      // Submeter form
    }
  };
  
  return <input onKeyDown={handleKeyDown} />;
}
```

#### Anúncio ao Leitor de Tela

```tsx
import { screenReaderAnnouncements } from '@/utils/accessibility';

export function MeuComponente() {
  const handleSuccess = () => {
    screenReaderAnnouncements.announce(
      'Transação criada com sucesso!',
      'sr-announcements'
    );
  };
  
  return <button onClick={handleSuccess}>Criar Transação</button>;
}
```

### Formatação e Validação

```tsx
import {
  formatCurrency,
  formatDate,
  validateEmail,
  validatePassword,
  maskCPF,
} from '@/utils/formatting';

// Formatação
const preco = formatCurrency(1500.50); // R$ 1.500,50
const data = formatDate(new Date()); // 07/06/2026
const cpf = maskCPF('12345678901'); // 123.456.789-01

// Validação
const isValidEmail = validateEmail('user@example.com'); // true
const passwordValidation = validatePassword('Senha@123');
// { isValid: true, strength: 'strong', requirements: {...} }
```

---

## 🔧 Configuração de Microfrontends

### Estrutura Recomendada

Para integrar microfrontends futuros:

1. **Transações Remoto** (porta 3001)
   ```bash
   npm run dev:transactions
   ```

2. **Autenticação Remoto** (porta 3002)
   ```bash
   npm run dev:auth
   ```

3. **Relatórios Remoto** (porta 3003)
   ```bash
   npm run dev:reporting
   ```

### Carregar Componente Remoto

```tsx
import { loadRemoteComponent } from '@/config/microfrontend';

const RemoteComponent = React.lazy(async () => {
  const module = await loadRemoteComponent(
    'alecrim_wallet_transactions',
    './components/ListarTransacoes'
  );
  return { default: module };
});

export function MeuComponente() {
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <RemoteComponent />
    </React.Suspense>
  );
}
```

---

## 🧪 Testes

### ESLint

```bash
npm run lint
```

---

## 📊 Performance

### Otimizações Implementadas

- ✅ **Code Splitting**: Separação automática de chunks
- ✅ **Image Optimization**: Formatos avif, webp
- ✅ **Bundle Optimization**: SWC minify
- ✅ **Redux DevTools**: Debug de estado (use extensão do Chrome)
- ✅ **Cache Headers**: Configuração de cache na CDN
- ✅ **ISR**: Revalidação incremental de páginas estáticas

### Analisar Bundle

```bash
npm run build
# Verificar .next/static para tamanhos dos chunks
```

---

## 🤝 Contribuição

Para contribuir ao projeto:

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Commit suas mudanças: `git commit -m 'Adiciona feature'`
3. Push para a branch: `git push origin feature/sua-feature`
4. Abra um Pull Request

Veja [CONTRIBUTING.md](./docs/docs/guia-contribuicao.md) para mais detalhes.

---

## 📝 Versionamento

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas features compatíveis
- **PATCH**: Bug fixes

Veja [CHANGELOG.md](./docs/docs/changelog.md) para histórico completo.

---

## 📄 Licença

Este projeto é privado e para uso exclusivo da avaliação de Pós-Graduação.

---

## 📧 Suporte

Para dúvidas ou problemas:

1. Consulte a [Documentação](./docs/docs/LEIA_PRIMEIRO.md)
2. Verifique [Issues](https://github.com/TatiRodrigues/tech_challenge_fiaap/issues)
3. Entre em contato pelo email de suporte

---

## 🎉 Próximos Passos

### Melhorias Planejadas

- [ ] Implementar autenticação real (API)
- [ ] Integração com banco de dados
- [ ] Dashboard com gráficos
- [ ] Exportar relatórios (PDF, Excel)
- [ ] Sincronização em tempo real com WebSockets
- [ ] PWA offline support
- [ ] Testes unitários e e2e
- [ ] CI/CD pipeline

---

**Desenvolvido com ❤️ para Tech Challenge Fase Um**
