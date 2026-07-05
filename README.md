# 💰 Alecrim Wallet - Gerenciador de Transações Inteligente

Uma aplicação front-end desenvolvida em **Next.js** para gerenciamento de transações financeiras com interface moderna e intuitiva. Integrada com a **API Bancária Tech Challenge 2** para operações reais.

## ✨ Funcionalidades

### Interface
- ✅ **Home Page**: Bem-vindo com saldo e últimas transações
- ✅ **Listagem de Transações**: Visualize, edite e delete transações
- ✅ **Adicionar Transação**: Formulário com validação avançada
- ✅ **Editar Transação**: Edite informações de transações existentes
- ✅ **Autenticação**: Sistema de login e cadastro
- ✅ **Filtros Avançados**: Tipo, categoria, status, data, valor
- ✅ **Paginação**: Navegação otimizada de resultados
- ✅ **Sugestões de Categorias**: Automáticas baseadas em descrição
- ✅ **Upload de Anexos**: Arraste recibos e documentos

### Backend Integration
- ✅ **API Bancária Real**: Integração com tech-challenge-2
- ✅ **Autenticação JWT**: Login seguro com token
- ✅ **Sincronização de Dados**: Estado em tempo real com Redux
- ✅ **Gerenciamento de Contas**: Suporte a múltiplas contas
- ✅ **Transações em Tempo Real**: Crédito, débito e extratos
- ✅ **Cartões Bancários**: Visualização de cartões associados

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- *(Opcional)* API Bancária rodando localmente (tech-challenge-2) na porta 3000

### Instalação e Execução

#### 1. Clonar e instalar
```bash
# Clone o repositório
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap

# Instale as dependências
npm install
```

#### 2. Configurar variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite conforme necessário (veja seção de Configuração)
```

#### 3. Iniciar a aplicação
```bash
# Modo desenvolvimento
npm run dev

# A aplicação estará em http://localhost:3000
```

### 🔐 Credenciais de Acesso

#### Modo Local (sem API)
```
Email: fiap@alecrimwallet.com.br
Senha: 1234
```

#### Modo com API Bancária
Crie um novo usuário ou use:
```
Email: teste@gmail.com
Senha: testes
Username: Aluno Carequinha
```

## � Integração com API Bancária

### Arquivos de Integração

```
app/
├── config/
│   ├── api.ts              # Configuração da API
│   └── api-types.ts        # Tipos/Interfaces
├── servicos/
│   └── banking-api.ts      # Serviço de integração
└── hooks/
    └── useBankingApi.ts    # Hook customizado

store/
├── slices/
│   ├── authSlice.ts        # Autenticação (atualizado)
│   └── bankingTransactionSlice.ts
└── thunks/
    └── index.ts            # Redux async actions
```

### Como Usar a API

#### Exemplo: Fazer Login
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/thunks';

export function LoginPage() {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  const handleLogin = async (email: string, password: string) => {
    await dispatch(loginUser({ email, password }));
  };

  // ...
}
```

#### Exemplo: Carregar Transações
```typescript
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccount } from '@/store/thunks';

export function TransactionsPage() {
  const dispatch = useDispatch();
  const { items: transactions, isLoading } = useSelector(state => state.bankingTransactions);

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  // ...
}
```

#### Exemplo: Criar Transação
```typescript
import { useDispatch } from 'react-redux';
import { createTransaction } from '@/store/thunks';

export function NewTransactionForm() {
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    await dispatch(createTransaction({
      accountId: 'account-id',
      type: 'Credit',
      value: 100,
      from: 'Meu Banco',
      to: 'Alecrim Wallet'
    }));
  };

  // ...
}
```

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/user` | Criar novo usuário |
| POST | `/user/auth` | Autenticar (Login) |
| GET | `/account` | Buscar contas e transações |
| POST | `/account/transaction` | Criar transação |
| PUT | `/account/transaction/:id` | Atualizar transação |
| DELETE | `/account/transaction/:id` | Deletar transação |
| GET | `/account/:id/statement` | Buscar extrato da conta |

Para mais detalhes, consulte a [documentação da API](https://github.com/israelmeinert/tech-challenge-2#readme).

## �📚 Documentação

A documentação completa do projeto está disponível em:

### Acessar a Documentação

```bash
# Navegue até o diretório docs
cd docs

# Instale as dependências de documentação
npm install

# Inicie o servidor de documentação
npm run start
```

Acesse a documentação: **http://localhost:3000** (depois que a documentação iniciar)

### 📖 Seções da Documentação

- **Primeiro Uso** - Setup e configuração básica
- **Solução Rápida** - Comece em 5 minutos
- **Design System** - Fundamentos, componentes e padrões
- **Componentes** - Documentação interativa com configuradores
- **Arquitetura** - Estrutura e fluxo de dados
- **API e Serviços** - Detalhes técnicos
- **Boas Práticas** - Padrões e conventions
- **Guia de Contribuição** - Como contribuir

## 🛠️ Tecnologias

- **Next.js 16+** - Framework React
- **React 19+** - Biblioteca UI
- **Bootstrap 5** - Componentes e estilos
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Redux Persist** - Persistência de estado
- **Docusaurus 3** - Documentação

## 🎨 Design System

Utilizamos o template [Portal](https://themes.3rdwavemedia.com/demo/portal/) de Xiaoying Riley como referência técnica, adaptando a estrutura HTML/CSS e customizando o design das páginas para a Alecrim wallet.

## 📁 Estrutura do Projeto

```config/                  # Configuração da API
│   │   ├── api.ts              # Endpoints e configurações
│   │   └── api-types.ts        # Tipos/Interfaces da API
│   ├── servicos/               # Serviços de integração
│   │   ├── auth.ts             # Autenticação local
│   │   └── banking-api.ts      # Integração com API bancária
│   ├── hooks/                  # Hooks customizados
│   │   └── useBankingApi.ts    # Hook para API bancária
│   ├── provedores/             # Context providers
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home/Dashboard
│   ├── login/                  # Autenticação
│   ├── cadastro/               # Registro
│   └── (autenticado)/          # Rotas protegidas
├── componentes/                # Componentes reutilizáveis
│   ├── features/               # Componentes de negócio
│   │   ├── enhanced-lista-transacoes/
│   │   ├── enhanced-transaction-form/
│   │   ├── advanced-filters/
│   │   ├── pagination/
│   │   ├── file-upload/
│   │   └── category-suggestions/
│   ├── header/
│   ├── menu-lateral/
│   └── rodape/
├── store/                      # Redux store
│   ├── slices/                # Redux slices
│   │   ├── authSlice.ts       # Autenticação (com API)
│   │   ├── transactionsSlice.ts
│   │   └── bankingTransactionSlice.ts
│   ├── thunks/                # Async actions
│   │   └── index.ts
│   ├── hooks.ts    com API

1. **Registrar**: Crie uma nova conta no formulário de cadastro
2. **Login**: Autentique com email e senha
3. **Dashboard**: Visualize sua conta e transações
4. **Gerenciar Transações**:
   - Adicione novas transações
   - Aplique filtros avançados
   - Faça upload de recibos
   - Edite ou delete conforme necessário
5. **Sair**: Clique em "Sair" para fazer logout

### Recursos Avançados

#### Filtros
- Por tipo (receita/despesa)
- Por categoria (8 opções)
- Por status (pendente/concluída/cancelada)
- Por intervalo de data
- Por intervalo de valor
- Busca por texto

#### Paginação
- Seletor de itens por página (5, 10, 20, 50)
- Navegação inteligente
- Informações de contexto

#### Sugestões de Categorias
- Automáticas baseadas na descrição
- 8 categorias com palavras-chave
- Indicador de confiança

#### Upload de Arquivos
- Drag-and-drop
- Validação de tipo e tamanho
- Até 5 arquivos por transação)
├── package.json
├── .env.example               # Exemplo de variáveis
├── .env.local                 # Variáveis locais (não commitado)
└── README.md                  # Este arquivo
``` transação
- Tipo (depósito, transferência, saque)
- Valor e data
- Descrição e status

## 💡 Como Usar

### Fluxo Principal

1. **Login**: Faça login com as credenciais padrão ou cadastre uma nova conta
2. **Dashboard**: Visualize seu saldo e últimas transações
3. **Gerenciar**: Adicione, edite ou delete transações
4. **Acompanhar**: Veja o histórico completo de transações

### Ações Disponíveis

- **Adicionar Transação**: Clique em "Nova Transação" para criar uma nova
- **Editar Transação**: Clique no botão "Editar" na listagem
- **Deletar Transação**: Clique no botão "Deletar" para remover
- **Sair**: Clique em "Sair" no menu para fazer logout

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Usar API Bancária (true) ou dados locais (false)
NEXT_PUBLIC_USE_BANKING_API=true

# URL da API Bancária
NEXT_PUBLIC_API_URL=http://localhost:3000

# Timeout para requisições (ms)
NEXT_PUBLIC_API_TIMEOUT=10000
```

### Modos de Operação

#### 1. Modo Local (Sem API)
```env
NEXT_PUBLIC_USE_BANKING_API=false
```
- Usa dados em `public/transactions.json`
- Autenticação com localStorage
- Ideal para desenvolvimento inicial

#### 2. Modo com API Bancária
```env
NEXT_PUBLIC_USE_BANKING_API=true
NEXT_PUBLIC_API_URL=http://localhost:3000
```
- Integração completa com API
- JWT authentication
- Dados em tempo real

### Setup da API Bancária

Se você quer usar a integração com API:

```bash
# Clone o repositório da API
git clone https://github.com/israelmeinert/tech-challenge-2.git
cd tech-challenge-2

# Instale dependências
npm install

# Inicie a API (porta 3000)
npm run dev
```

A API estará disponível em `http://localhost:3000`

## 🐛 Troubleshooting

### Problema: "Erro ao carregar conta"
**Solução**: 
- Verifique se a API bancária está rodando em `http://localhost:3000`
- Confirme `NEXT_PUBLIC_API_URL` nas variáveis de ambiente
- Tente fazer login novamente

### Problema: "Token inválido"
**Solução**:
- Limpe o localStorage: `localStorage.clear()`
- Faça login novamente
- Verifique se o token não expirou

### Problema: "Requisição timeout"
**Solução**:
- Aumente `NEXT_PUBLIC_API_TIMEOUT` para 15000 ou mais
- Verifique a conexão de rede
- Confirme que a API está respondendo

### Problema: Upload de arquivo falha
**Solução**:
- Verifique se o arquivo é menor que 5MB
- Confirme se o tipo de arquivo é aceito (PDF, imagens, docs)
- Tente novamente

### Problema: Filtros não funcionam
**Solução**:
- Certifique-se que as transações foram carregadas
- Tente limpar os filtros
- Atualize a página

## 📊 Estado do Redux

### Auth State
```typescript
{
  user: IUser | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  usesBankingApi: boolean
}
```

### Banking Transactions State
```typescript
{
  items: ITransaction[],
  accounts: IAccount[],
  cards: ICard[],
  isLoading: boolean,
  error: string | null
}
```

### Transactions State (Local)
```typescript
{
  items: Transaction[],
  filteredItems: Transaction[],
  paginatedItems: Transaction[],
  pagination: PaginationState,
  sort: SortState,
  filters: TransactionFilters,
  // ...
}
```

## 🔒 Segurança

### Token JWT
- Armazenado em localStorage
- Enviado em cada requisição como `Authorization: Bearer {token}`
- Expira automaticamente

### Validação
- Validação de entrada em cliente (TypeScript + Zod)
- Validação adicional no servidor (API)
- Sanitização de dados

### Dados Sensíveis
- Nunca commite `.env.local`
- Use `.env.example` como template
- Revise logs antes de compartilhar

## 🚀 Deployment

### Vercel (Recomendado)
```bash
# Instale Vercel CLI
npm install -g vercel

# Deploy
vercel

# Ou vincule seu repositório e configure automaticamente
```

### Variáveis no Vercel
1. Vá para Settings → Environment Variables
2. Adicione as variáveis necessárias
3. Redeploy

### Outros Providers
- **Netlify**: Configure variáveis em Build & Deploy
- **AWS Amplify**: Use arquivo `amplify.yml`
- **Digital Ocean**: Configure via dashboard

## 📈 Performance

### Otimizações Implementadas
- ✅ Code splitting automático (Next.js)
- ✅ Image optimization
- ✅ Bundle size análise
- ✅ Lazy loading de componentes
- ✅ Redux persist para cache

### Dicas
- Use `npm run build` para analisar bundle
- Monitore performance em produção
- Considere implementar CDN
- Use service workers para offline

## 🤝 Contribuindo

### Como Contribuir

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Padrões de Código
- Use TypeScript
- Siga o ESLint
- Adicione testes se possível
- Documente mudanças

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💼 Autor

Desenvolvido como Tech Challenge da FIAP Pós-Graduação em Arquitetura de Software.

## 📞 Suporte

- 📧 Email: [seu-email@example.com]
- 🐦 Twitter: [@seu-twitter]
- 💬 Discord: [link-do-seu-servidor]

## 🔗 Links Úteis

- [Tech Challenge 2 API](https://github.com/israelmeinert/tech-challenge-2)
- [Documentação Next.js](https://nextjs.org/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última atualização**: 14/06/2026  
**Versão**: 2.0.0 (com integração API Bancária)


## 🎯 Arquitetura

### Fluxo de Dados

```
Pages → Components → Hooks → Services → localStorage
```

### Camadas

1. **Pages**: Rotas e layouts
2. **Components**: UI reutilizáveis
3. **Hooks**: Lógica compartilhada
4. **Services**: Integração com localStorage

## 🔒 Autenticação

- Sistema de login e registro
- Autenticação baseada em localStorage
- Proteção de rotas com hook `useProtectedRoute`
- Contexto global de usuário

## 📱 Responsividade

Interface completamente responsiva com Bootstrap 5, otimizada para:
- 📱 Mobile (até 576px)
- 📱 Tablet (576px - 992px)
- 🖥️ Desktop (acima de 992px)

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Leia o [Guia de Contribuição](./docs/docs/guia-contribuicao.md)
2. Siga as [Boas Práticas](./docs/docs/boas-praticas.md)
3. Crie um branch para sua feature
4. Faça um pull request com descrição clara

## 📄 Licença

Este projeto foi desenvolvido como parte do Tech Challenge Fiap Pós Tech.

## 📞 Suporte

- 📖 Leia a [documentação completa](./docs/docs/intro.md)
- 💡 Veja [exemplos práticos](./docs/docs/componentes/guia-rapido.md)
- 🆘 Abra uma issue no repositório
- 🤝 Contribua com melhorias!
