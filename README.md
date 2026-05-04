# 💰 Alecrim Finance - Gerenciador de Transações Inteligente

Uma aplicação front-end desenvolvida em **Next.js** para gerenciamento de transações financeiras com interface moderna e intuitiva.

## ✨ Funcionalidades

- ✅ **Home Page**: Bem-vindo com saldo e últimas transações
- ✅ **Listagem de Transações**: Visualize, edite e delete transações
- ✅ **Adicionar Transação**: Modal para criar novas transações
- ✅ **Editar Transação**: Edite informações de transações existentes
- ✅ **Autenticação**: Sistema de login e cadastro
- ✅ **Dados Mockados**: Utilizando arquivo JSON local

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação e Execução

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse a aplicação: **http://localhost:3000**

### 🔐 Credenciais de Acesso Padrão

Use estas credenciais para acessar a aplicação:

```
Nome: Fiap Pós Tech
Email: fiap@alecrimfinance.com.br
Senha: Senha1234
```

## 📚 Documentação

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

- **Next.js 14+** - Framework React
- **React 18+** - Biblioteca UI
- **Bootstrap 5** - Componentes e estilos
- **TypeScript** - Type safety
- **Docusaurus 3** - Documentação

## 🎨 Design System

Utilizamos o template [Portal](https://themes.3rdwavemedia.com/demo/portal/) de Xiaoying Riley como referência técnica, adaptando a estrutura HTML/CSS e customizando o design das páginas para a Alecrim Finance.

## 📁 Estrutura do Projeto

```
alecrim-finance/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout principal
│   ├── not-found.tsx            # Página 404
│   ├── page.tsx                 # Home/Dashboard
│   ├── login/                   # Autenticação
│   ├── cadastro/                # Registro
│   ├── (autenticado)/           # Rotas protegidas
│   ├── servicos/                # Lógica de autenticação
│   ├── provedores/              # Context providers
│   └── hooks/                   # Custom React hooks
├── componentes/                 # Componentes reutilizáveis
│   ├── header/
│   ├── menu-lateral/
│   ├── rodape/
│   └── features/                # Componentes de negócio
├── docs/                        # Documentação (Docusaurus)
├── public/                      # Arquivos estáticos
└── hooks/                       # Hooks customizados
```

## 📊 Dados Mockados

Os dados estão em `public/transactions.json` e incluem:
- ID único para cada transação
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

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev         # Inicia servidor de desenvolvimento

# Build
npm run build       # Build para produção

# Produção
npm run start       # Inicia servidor de produção

# Verificação
npm run lint        # Verifica código com ESLint
```

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
