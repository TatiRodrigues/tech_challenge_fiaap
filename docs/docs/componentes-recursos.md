---
sidebar_position: 6
title: Componentes Recursos
description: Componentes de funcionalidade
---

# 🎮 Componentes Recursos

Componentes específicos de funcionalidade.

## Cards Resumo

Exibem resumo de dados:
- **Total de Ganhos**: Soma de todos os depósitos
- **Total de Gastos**: Soma de saques + transferências
- **Saldo**: Ganhos - Gastos
- **Transações**: Contagem total de transações

### Lógica de Cálculo
```
Total de Ganhos = Σ depósitos (com status "Concluído")
Total de Gastos = Σ saques + Σ transferências (com status "Concluído")
Saldo = Total de Ganhos - Total de Gastos
```

## Formulário Transação

Formulário para criar/editar transações com:
- Validação em tempo real
- Seleção de categoria (Depósito, Transferência, Saque)
- Datepicker
- Submit assíncrono
- Preenchimento automático do mês/ano

## Listar Transações

Lista de transações com:
- Tabela responsiva
- Filtros por tipo, status, data
- Ordenação por data/valor/tipo
- Paginação
- Resumo Filtrado com cálculos dos itens filtrados

### Resumo Filtrado
Mostra estatísticas apenas das transações que atendem aos filtros:
- **Depósitos**: Valor total de depósitos filtrados
- **Transferências**: Valor total de transferências (mostrado em azul)
- **Saques**: Valor total de saques
- **Total**: Resultado da filtragem (Depósitos - Transferências - Saques)

## Modal Editar Transação

Modal para editar transação existente com:
- Carregamento de dados da transação
- Validação de campos
- Feedback de sucesso/erro
- Atualização em tempo real na lista

## Resumo Mensal

Exibe resumo mensal com:
- Seletor de mês
- Estatísticas do mês selecionado
- Timeline de transações do mês
- Cada transação mostra data, hora, tipo, valor e status

### Tipos de Transação na Timeline
- **Depósito**: Verde, com sinal de `+`
- **Transferência**: Azul, com sinal de `-` (é uma saída)
- **Saque**: Amarelo, com sinal de `-` (é uma saída)

---

[Voltar: Documentação Técnica →](./arquitetura)
