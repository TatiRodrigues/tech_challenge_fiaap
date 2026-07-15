---
sidebar_position: 4
title: Changelog
description: Histórico de versões
---

# 📋 Changelog

## [2.1.0] - 2026-07-15

### Tech Challenge Fase 2 — Correções e Melhorias

#### Adicionado
- ✨ Ícones de **download** e **exclusão** em todos os anexos (Bootstrap Icons)
- ✨ Paginação com 5 itens/página no Dashboard e na Listagem de Transações
- ✨ **26 transações de exemplo** em `public/transactions.json` (era 3)
- ✨ `user_transactions` — chave separada no localStorage para transações do usuário (isolada do seed)
- ✨ Exibição de anexos em linha na tabela e na visão de cards
- ✨ `vercel.json` com 5 headers de segurança (CSP, X-Frame-Options, Referrer-Policy…)
- ✨ Botão de submit com `aria-busy` durante carregamento
- ✨ Região `aria-live="assertive"` para mensagens de erro nos formulários
- ✨ Região `aria-live="polite"` para contagem de resultados filtrados

#### Corrigido
- 🐛 Login mostrava "Sessão expirada" ao invés de "Usuário não encontrado"
- 🐛 Credenciais apareciam na URL (`?signin-email=...`) — removidos atributos `name` e adicionado `method="post"`
- 🐛 Nome de usuário exibia "Usuário!" ao invés do nome real — `username?` adicionado à interface local
- 🐛 Ícones de upload/lixeira em branco — Font Awesome `fas fa-*` substituído por Bootstrap Icons `bi bi-*`
- 🐛 Nova engrenagem do header: era `<a href="#">` estático → agora é dropdown Bootstrap que abre o painel "Personalizar Dashboard"
- 🐛 Badge "Pendente" (#EEBF41 + branco = 1.72:1) → `text-dark` (contraste 12:1, WCAG AA ✅)
- 🐛 `accessibility.css`: `* { letter-spacing: 0.12em }` quebrava layout — escopo reduzido para `body`, `p`, `li`

#### Modificado
- 🔄 `Dockerfile.dev`: `node:20-alpine` → `node:20-slim` (Debian/glibc, compatível com `@next/swc-linux-x64-gnu`)
- 🔄 `listar-transacoes/client.tsx`: carregamento sempre a partir do JSON seed; cache localStorage isolado em `user_transactions`
- 🔄 `resumo-transacao/page.tsx`: removido localStorage cache; paginação de 5 itens
- 🔄 `Header.tsx`: engrenagem → dropdown Bootstrap + despacho de evento `open-dashboard-customizer`
- 🔄 `MenuLateral.tsx`: logout `<a>` → `<button>`, `aria-current="page"`, `aria-label` no botão fechar
- 🔄 `layout.tsx`: skip link, `role="navigation"`, `role="contentinfo"`, `aria-label` no `<main>`
- 🔄 `login/page.tsx` e `cadastro/page.tsx`: labels visíveis, `aria-required`, `aria-live`, `autoComplete`

---

## [2.0.0] - 2026-06

### Tech Challenge Fase 2

#### Adicionado
- ✨ Dashboard com gráficos financeiros (donut chart, barras diárias, tendência mensal)
- ✨ Filtros avançados na listagem (tipo, status, data, valor, busca de texto)
- ✨ Alternância tabela/cards na listagem de transações
- ✨ Upload de recibos com drag-and-drop (validação tipo e tamanho)
- ✨ Sugestões automáticas de categoria baseadas na descrição
- ✨ Validação avançada de formulários com feedback em tempo real
- ✨ `MicrofrontendBus` para comunicação cross-módulo via eventos
- ✨ Module Federation — configuração Webpack documentada em `next.config.ts`
- ✨ Server-Side Rendering: todas as rotas com `export metadata` para SEO
- ✨ Redux Toolkit com slices: `authSlice`, `transactionsSlice`, `bankingTransactionSlice`
- ✨ Acessibilidade WCAG 2.1 AA em todos os modais e componentes interativos

#### Modificado
- 🔄 `listar-transacoes/page.tsx` convertido para Server Component
- 🔄 `nova-transacao/page.tsx` convertido para Server Component
- 🔄 `resumo-transacao/page.tsx` convertido para Server Component
- 🔄 `modal-editar-transacao` reescrito com `role="dialog"`, `aria-modal`, ESC handler

---

## [1.0.1] - 2026-05-05

#### Corrigido
- ✅ Cálculo de saldo
- ✅ Total de Gastos (saques + transferências)
- ✅ Transferências aparecem com sinal negativo na timeline

#### Modificado
- 🏷️ Renomeado: "Alecrim Finance" → "Alecrim Wallet"

---

## [1.0.0] - 2026-04-21

#### Adicionado
- ✨ Aplicação inicial com Next.js 16 + React 19 + TypeScript
- ✨ Dashboard, login, cadastro, listagem de transações
- ✨ Design System com Bootstrap 5
- ✨ Documentação com Docusaurus 3
