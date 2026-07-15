---
sidebar_position: 4
title: Changelog
description: Histórico de versões
---

# 📋 Changelog

## [2.0.0] - 2026-06

### Tech Challenge Fase 2

#### Adicionado
- ✨ Dashboard com gráficos financeiros (donut chart, barras diárias, tendência mensal)
- ✨ Filtros avançados na listagem (tipo, status, data, valor, busca de texto)
- ✨ Paginação com seletor de itens por página (5, 10, 20, 50)
- ✨ Alternância tabela/cards na listagem de transações
- ✨ Upload de recibos com drag-and-drop (validação tipo e tamanho)
- ✨ Sugestões automáticas de categoria baseadas na descrição
- ✨ Validação avançada de formulários com feedback em tempo real
- ✨ Arquitetura microfrontend com Module Federation (configuração Webpack pronta)
- ✨ `MicrofrontendBus` para comunicação cross-módulo via eventos
- ✨ Server-Side Rendering: todas as rotas com `export metadata` para SEO
- ✨ Padrão server `page.tsx` + client `client.tsx` em todas as rotas autenticadas
- ✨ Redux Toolkit com slices: `authSlice`, `transactionsSlice`, `bankingTransactionSlice`
- ✨ Acessibilidade WCAG 2.1 AA em todos os modais e componentes interativos
- ✨ Skip link para navegação por teclado

#### Modificado
- 🔄 `listar-transacoes/page.tsx` convertido para Server Component
- 🔄 `nova-transacao/page.tsx` convertido para Server Component
- 🔄 `resumo-transacao/page.tsx` convertido para Server Component
- 🔄 `modal-editar-transacao` reescrito com `role="dialog"`, `aria-modal`, ESC handler

## [1.0.1] - 2026-05-05

### Fixed
- ✅ Corrigido cálculo de saldo
- ✅ Total de Gastos calcula corretamente (saques + transferências)
- ✅ Transferências aparecem com sinal negativo na timeline

### Changed
- 🏷️ Renomeado: "Alecrim Finance" → "Alecrim Wallet"

## [1.0.0] - 2026-04-21

### Added
- ✨ Aplicação inicial com Next.js 16 + React 19 + TypeScript
- ✨ Dashboard, login, cadastro, listagem de transações
- ✨ Design System com Bootstrap 5
- ✨ Documentação com Docusaurus 3
