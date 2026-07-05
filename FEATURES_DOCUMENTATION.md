# Documentação - Recursos Avançados de Transações

## Visão Geral

Este documento descreve os novos recursos implementados para melhorar a funcionalidade de listagem, filtragem e gerenciamento de transações na aplicação.

## 📋 Recursos Implementados

### 1. **Filtros Avançados e Busca**

#### Localização
- Componente: `componentes/features/advanced-filters/AdvancedFilters.tsx`
- Utilitários: `utils/filterUtils.ts`

#### Funcionalidades
- **Busca por Texto**: Busca em descrição e categoria
- **Filtro por Tipo**: Receita ou Despesa
- **Filtro por Categoria**: Alimentação, Transporte, Saúde, Educação, Entretenimento, Utilidades, Investimento, Outro
- **Filtro por Status**: Pendente, Concluída, Cancelada
- **Filtro por Data**: Intervalo de data (início e fim)
- **Filtro por Valor**: Valor mínimo e máximo
- **Interface Expansível**: Filtros colapsáveis para melhor UX
- **Contador de Filtros Ativos**: Exibe quantidade de filtros aplicados
- **Botão Limpar Filtros**: Remove todos os filtros com um clique

#### Como Usar
```tsx
import AdvancedFilters from '@/componentes/features/advanced-filters/AdvancedFilters';

<AdvancedFilters
  filters={filters}
  onFilterChange={(newFilters) => handleFilterChange(newFilters)}
  onClearFilters={() => handleClearFilters()}
/>
```

---

### 2. **Paginação**

#### Localização
- Componente: `componentes/features/pagination/Pagination.tsx`
- Utilitários: `utils/filterUtils.ts`

#### Funcionalidades
- **Seletor de Tamanho de Página**: 5, 10, 20, ou 50 itens por página
- **Navegação por Página**: Botões anterior/próximo
- **Numeração de Páginas**: Exibição inteligente de números (com reticências para gaps)
- **Informações de Paginação**: Mostra "Exibindo 1 a 10 de 50 transações"
- **Acessibilidade**: Labels ARIA e navegação por teclado
- **Responsividade**: Adapta-se a diferentes tamanhos de tela

#### Como Usar
```tsx
import Pagination from '@/componentes/features/pagination/Pagination';

<Pagination
  pagination={pagination}
  onPageChange={(page) => dispatch(setPage(page))}
  onPageSizeChange={(pageSize) => dispatch(setPageSize(pageSize))}
/>
```

---

### 3. **Validação Avançada de Formulário**

#### Localização
- Componente: `componentes/features/enhanced-transaction-form/EnhancedTransactionForm.tsx`
- Utilitários: `utils/validationUtils.ts`

#### Funcionalidades
- **Validação em Tempo Real**: Feedback imediato ao usuário
- **Validação de Campo**:
  - Tipo: Obrigatório (receita ou despesa)
  - Valor: Obrigatório, positivo, máximo R$ 1.000.000,00
  - Descrição: 3-500 caracteres
  - Categoria: Obrigatória
  - Data: Válida e não pode ser futura
- **Mensagens de Erro Específicas**: Detalhes sobre o que precisa ser corrigido
- **Mascaramento de Moeda**: Entrada de valor em tempo real
- **Contador de Caracteres**: Para campo de descrição

#### Como Usar
```tsx
import { validateTransactionForm } from '@/utils/validationUtils';

const errors = validateTransactionForm({
  tipo: 'despesa',
  valor: 100,
  descricao: 'Compra no supermercado',
  categoria: 'alimentacao',
  data: '2024-01-15'
});

if (errors.length > 0) {
  // Handle errors
}
```

---

### 4. **Sugestões Automáticas de Categorias**

#### Localização
- Componente: `componentes/features/category-suggestions/CategorySuggestions.tsx`
- Utilitários: `utils/validationUtils.ts`

#### Funcionalidades
- **Análise de Descrição**: Lê a descrição digitada
- **Sugestões de Categoria**: Até 3 sugestões baseadas em palavras-chave
- **Índice de Confiança**: Mostra a confiança de cada sugestão (%)
- **Seleção Rápida**: Um clique para usar sugestão
- **Palavras-Chave Pré-configuradas**: Para cada categoria

#### Exemplos de Palavras-Chave por Categoria
- **Alimentação**: restaurante, lanchonete, supermercado, comida, pizza, padaria, etc.
- **Transporte**: uber, taxi, ônibus, combustível, gasolina, estacionamento, etc.
- **Saúde**: farmácia, médico, hospital, consulta, medicamento, dentista, etc.
- **Educação**: escola, faculdade, universidade, curso, livro, material escolar, etc.
- **Entretenimento**: cinema, teatro, show, jogo, streaming, netflix, spotify, etc.
- **Utilidades**: energia, água, internet, telefone, condomínio, aluguel, etc.
- **Investimento**: ações, criptomoeda, imóvel, fundo, poupança, etc.

#### Como Usar
```tsx
import CategorySuggestions from '@/componentes/features/category-suggestions/CategorySuggestions';

<CategorySuggestions
  description={formData.descricao}
  selectedCategory={formData.categoria}
  onCategorySelect={(category) => setFormData({ ...formData, categoria: category })}
/>
```

---

### 5. **Upload de Anexos (Recibos e Documentos)**

#### Localização
- Componente: `componentes/features/file-upload/FileUpload.tsx`
- Utilitários: `utils/uploadUtils.ts`

#### Funcionalidades
- **Drag-and-Drop**: Arraste arquivos para a zona de upload
- **Seleção de Arquivo**: Clique para abrir seletor
- **Validação de Arquivo**:
  - Tamanho máximo: 5MB (configurável)
  - Tipos aceitos: PDF, JPEG, PNG, GIF, DOC, DOCX, XLS, XLSX
  - Máximo 5 arquivos (configurável)
- **Feedback Visual**: Zona muda de cor ao arrastar
- **Lista de Anexos**: Exibe arquivos adicionados com tamanho
- **Remoção de Arquivo**: Botão individual para remover
- **Mensagens de Erro**: Detalhadas e específicas por arquivo

#### Tipos de Arquivo Aceitos
```
PDF: application/pdf
Imagens: image/jpeg, image/png, image/gif
Documentos: application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
Planilhas: application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
```

#### Como Usar
```tsx
import FileUpload from '@/componentes/features/file-upload/FileUpload';

<FileUpload
  onFilesSelected={(files) => setAttachments([...attachments, ...files])}
  attachments={attachments}
  onRemoveAttachment={(id) => setAttachments(attachments.filter(a => a.id !== id))}
  maxFiles={5}
  maxFileSize={5 * 1024 * 1024}
/>
```

---

### 6. **Ordenação Dinâmica**

#### Localização
- Funcionalidade: Integrada no Redux Slice
- Utilitários: `store/slices/transactionsSlice.ts`

#### Funcionalidades
- **Ordenar por Data**: Ascendente ou descendente
- **Ordenar por Valor**: Ascendente ou descendente
- **Ordenar por Descrição**: A-Z ou Z-A
- **Indicador Visual**: Ícone de seta indica direção de ordenação
- **Clique para Alternar**: Clique no cabeçalho para mudar ordem

---

## 🔄 Fluxo de Dados com Redux

### Estado (State)

```typescript
interface TransactionsState {
  items: Transaction[];              // Todas as transações
  filteredItems: Transaction[];       // Transações após filtros
  paginatedItems: Transaction[];      // Transações da página atual
  pagination: PaginationState;        // Info de paginação
  sort: SortState;                   // Info de ordenação
  filters: TransactionFilters;        // Filtros aplicados
  isLoading: boolean;
  error: string | null;
  // ... outros campos
}
```

### Actions Disponíveis

```typescript
// Filtros
dispatch(setFilters(newFilters))      // Aplicar filtros
dispatch(clearFilters())              // Limpar filtros

// Paginação
dispatch(setPage(pageNumber))         // Mudar página
dispatch(setPageSize(size))           // Mudar tamanho da página

// Ordenação
dispatch(setSort({ field: 'data', order: 'desc' }))

// Anexos
dispatch(addAttachment({ transactionId, attachment }))
dispatch(removeAttachment({ transactionId, attachmentId }))

// CRUD
dispatch(addTransaction(transaction))
dispatch(updateTransaction(transaction))
dispatch(deleteTransaction(transactionId))
```

---

## 📱 Componentes Principais

### EnhancedListarTransacoes
Componente de listagem com filtros, paginação e ordenação.

```tsx
import EnhancedListarTransacoes from '@/componentes/features/enhanced-lista-transacoes/EnhancedListarTransacoes';

<EnhancedListarTransacoes
  onEditTransaction={(id) => handleEdit(id)}
  onDeleteTransaction={(id) => handleDelete(id)}
/>
```

### EnhancedTransactionForm
Formulário com validação, sugestões de categoria e upload de anexos.

```tsx
import EnhancedTransactionForm from '@/componentes/features/enhanced-transaction-form/EnhancedTransactionForm';

<EnhancedTransactionForm
  transactionId={selectedId}
  onSuccess={() => handleSuccess()}
  onCancel={() => handleCancel()}
/>
```

---

## 🎯 Casos de Uso

### 1. Filtrar Despesas de Alimentação em Fevereiro
```
1. Abrir Filtros Avançados
2. Tipo: Despesa
3. Categoria: Alimentação
4. Data Início: 2024-02-01
5. Data Fim: 2024-02-29
6. Resultado: Apenas despesas de alimentação em fevereiro
```

### 2. Buscar Transações por Palavra-Chave
```
1. Nos Filtros Avançados, preencher "Buscar"
2. Digitar: "supermercado"
3. Resultado: Todas as transações com "supermercado" na descrição
```

### 3. Adicionar Transação com Recibo
```
1. Abrir formulário
2. Preencher dados (tipo, valor, descrição)
3. Sugestões de categoria aparecem automaticamente
4. Arrastar recibo (PDF) para zona de upload
5. Clicar em "Criar Transação"
6. Recibo fica anexado à transação
```

---

## 🔧 Configuração

### Upload de Arquivos - Customização

```typescript
// Antes de usar FileUpload, customize se necessário:
import { DEFAULT_UPLOAD_CONFIG } from '@/utils/uploadUtils';

// Modificar configurações
const customConfig = {
  ...DEFAULT_UPLOAD_CONFIG,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowedMimeTypes: [...DEFAULT_UPLOAD_CONFIG.allowedMimeTypes]
};
```

### Validação - Adicionar Validações Customizadas

```typescript
import { validateTransactionForm } from '@/utils/validationUtils';

// Estender validação
const additionalValidation = (data) => {
  if (data.valor > 10000) {
    // Validação customizada
  }
};
```

---

## 🧪 Testes

### Testar Filtros
- [ ] Aplicar múltiplos filtros simultaneamente
- [ ] Limpar filtros mantém listagem intacta
- [ ] Paginação reseta ao aplicar novos filtros

### Testar Upload de Arquivos
- [ ] Arrastar arquivo funciona
- [ ] Clique abre seletor
- [ ] Arquivo grande mostra erro
- [ ] Tipo inválido mostra erro
- [ ] Remover arquivo funciona

### Testar Sugestões de Categoria
- [ ] Sugestões aparecem ao digitar descrição
- [ ] Clique em sugestão preenche categoria
- [ ] Confiança % é exibida

---

## 📝 Notas Importantes

1. **Persistência**: Dados estão em Redux, considere implementar persistência em backend
2. **Acessibilidade**: Todos os componentes seguem WCAG 2.1 AA
3. **Performance**: Paginação otimiza renderização de grandes datasets
4. **Responsividade**: Todos os componentes são mobile-first
5. **Validação**: Ocorre em tempo real com feedback imediato

---

## 🚀 Próximos Passos

1. Implementar persistência em banco de dados
2. Adicionar exportação de relatórios (PDF/CSV)
3. Implementar scroll infinito como alternativa a paginação
4. Adicionar gráficos de análise
5. Melhorar algoritmo de sugestão de categorias (ML)

