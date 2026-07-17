# Alecrim Wallet

Aplicação de gerenciamento financeiro pessoal — Tech Challenge Fase 2, FIAP Pós-Graduação em Arquitetura de Software.

**Repositório:** https://github.com/TatiRodrigues/tech_challenge_fiaap

---

## Executar em ambiente de desenvolvimento

### Pré-requisitos

| Ferramenta     | Versão mínima |
|----------------|--------------|
| Node.js        | 20 LTS       |
| npm            | 10+          |
| Docker Desktop | 24+          |
| Git            | 2+           |

### Opção 1 — Somente o Frontend (sem backend)

```bash
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap
npm install
npm run dev
```

Acesse: **http://localhost:3001**

> O frontend funciona de forma independente. As transações ficam salvas no navegador (localStorage).

### Opção 2 — Stack completa com Docker (Frontend + BFF + MongoDB)

Os dois repositórios precisam ficar lado a lado na mesma pasta:

```
/dev/
├── tech_challenge_fiaap/   ← este repositório (frontend)
└── tech-challenge-2/       ← BFF (backend)
```

```bash
# 1. Clone os dois repositórios
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
git clone https://github.com/TatiRodrigues/tech-challenge-bff.git tech-challenge-2

# 2. Entre na pasta do frontend
cd tech_challenge_fiaap

# 3. Suba toda a stack (primeira vez — faz build das imagens)
docker compose up --build

# Para iniciar sem rebuild (após primeira vez)
docker compose up
```

| Serviço  | URL                   |
|----------|-----------------------|
| Frontend | http://localhost:3001 |
| BFF API  | http://localhost:3000 |
| MongoDB  | localhost:27017       |

```bash
# Parar a stack
docker compose down

# Ver logs em tempo real
docker compose logs -f

# Rebuild após mudanças no código
docker compose up --build
```

### Scripts npm

| Comando           | Descrição                            |
|-------------------|--------------------------------------|
| `npm run dev`   | Desenvolvimento com Turbopack (3001) |
| `npm run build` | Build de produção                    |
| `npm run start` | Inicia a build de produção           |
| `npm run lint`  | Lint do projeto                      |

### Variáveis de ambiente

O arquivo `.env.local` já está configurado para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Acessibilidade

O projeto implementa as diretrizes **WCAG 2.1 nível AA**.

### Navegação por teclado

- **Skip link** "Pular para o conteúdo principal" aparece ao pressionar `Tab`, permitindo ignorar menus e ir direto ao conteúdo
- Toda a interface é operável via teclado: formulários, tabelas, botões e modais
- Modais capturam o foco ao abrir e o devolvem ao elemento disparador ao fechar
- Modais fecham com a tecla `Escape`
- Botões de alternância (tabela/cards) usam `aria-pressed` para indicar estado
- Área mínima clicável de 44×44px (WCAG 2.5.5)

### Leitores de tela

- Landmarks semânticos: `<header role="banner">`, `<nav aria-label="...">`, `<main id="main-content">`, `<footer role="contentinfo">`
- Labels visíveis em todos os campos de formulário
- `aria-current="page"` no item ativo do menu lateral
- Modais com `role="dialog"`, `aria-modal="true"` e `aria-labelledby`
- `aria-live="assertive"` em erros de formulário (lidos imediatamente)
- `aria-live="polite"` em mensagens de sucesso e contagem de resultados filtrados
- `aria-busy="true"` nos botões de submit durante carregamento
- `aria-hidden="true"` em ícones decorativos
- `aria-label` descritivo nos botões de ação (ex.: "Editar transação: Salário")
- `scope="col"` nos cabeçalhos de tabela

### Contraste

| Elemento                          | Contraste | WCAG   |
|-----------------------------------|-----------|--------|
| Verde `#15a362` / branco        | 4.6:1     | AA ✅  |
| Badge Pendente (escuro/amarelo)   | 12:1      | AAA ✅ |
| Badge Concluído (branco/verde)    | 4.6:1     | AA ✅  |
| Badge Cancelado (branco/vermelho) | 5.1:1     | AA ✅  |
| Texto secundário `#5d6778` / branco | 4.7:1 | AA ✅  |

- `prefers-reduced-motion` respeitado — animações desativadas quando a preferência é detectada
- `prefers-contrast: more` respeitado via CSS para usuários que solicitam maior contraste
