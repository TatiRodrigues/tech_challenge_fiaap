# 🚀 Guia Rápido de Início

## 📦 O que foi implementado?

✅ **Filtros Avançados**: Tipo, categoria, status, data, valor, busca  
✅ **Paginação**: Seletor de página, navegação, seletor de itens  
✅ **Validação**: Campos obrigatórios, formatos, ranges  
✅ **Sugestões**: Categorias automáticas baseadas em descrição  
✅ **Anexos**: Upload drag-and-drop de recibos/documentos  
✅ **Ordenação**: Por data, valor ou descrição  

---

## 🎯 Como Usar?

### 1️⃣ Listar Transações com Filtros e Paginação

```tsx
import EnhancedListarTransacoes from '@/componentes/features/enhanced-lista-transacoes/EnhancedListarTransacoes';

export default function TransacoesPage() {
  return (
    <div className="container">
      <EnhancedListarTransacoes
        onEditTransaction={(id) => console.log('Editar:', id)}
        onDeleteTransaction={(id) => console.log('Deletar:', id)}
      />
    </div>
  );
}
```

### 2️⃣ Formulário com Validação e Anexos

```tsx
import EnhancedTransactionForm from '@/componentes/features/enhanced-transaction-form/EnhancedTransactionForm';

export default function NovaTransacaoPage() {
  return (
    <EnhancedTransactionForm
      onSuccess={() => alert('Transação criada!')}
      onCancel={() => history.back()}
    />
  );
}
```

---

## 📋 Componentes Disponíveis

| Componente | Localização | Uso |
|-----------|-----------|-----|
| **AdvancedFilters** | `advanced-filters/` | Filtros expansíveis |
| **Pagination** | `pagination/` | Paginação de resultados |
| **FileUpload** | `file-upload/` | Upload de anexos |
| **CategorySuggestions** | `category-suggestions/` | Sugestões de categoria |
| **EnhancedTransactionForm** | `enhanced-transaction-form/` | Formulário completo |
| **EnhancedListarTransacoes** | `enhanced-lista-transacoes/` | Listagem com filtros |

---

## 🔧 Utilitários

### Filtros
```tsx
import { filterTransactions, sortTransactions, paginateTransactions } from '@/utils/filterUtils';

const filtered = filterTransactions(transactions, {
  tipo: 'despesa',
  categoria: 'alimentacao',
  dataInicio: '2024-01-01'
});
```

### Validação
```tsx
import { validateTransactionForm, suggestCategories } from '@/utils/validationUtils';

const errors = validateTransactionForm({
  tipo: 'despesa',
  valor: 50.00,
  descricao: 'Compra no supermercado',
  categoria: '',
  data: '2024-01-15'
});

const suggestions = suggestCategories('supermercado');
// Retorna: [{ categoria: 'alimentacao', confianca: 0.95 }]
```

### Upload
```tsx
import { validateFiles, formatFileSize } from '@/utils/uploadUtils';

const errors = validateFiles(fileArray, {
  maxFileSize: 5 * 1024 * 1024,
  maxFiles: 5,
  allowedMimeTypes: ['application/pdf', 'image/jpeg']
});
```

---

## 🎮 Redux Actions

```tsx
import { useDispatch, useSelector } from 'react-redux';
import {
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  setSort,
  addAttachment,
  removeAttachment
} from '@/store/slices/transactionsSlice';

const dispatch = useDispatch();

// Aplicar filtros
dispatch(setFilters({
  tipo: 'despesa',
  categoria: 'alimentacao',
  dataInicio: '2024-01-01',
  dataFim: '2024-01-31',
  searchTerm: 'supermercado'
}));

// Limpar filtros
dispatch(clearFilters());

// Paginação
dispatch(setPage(2));
dispatch(setPageSize(20));

// Ordenação
dispatch(setSort({ field: 'valor', order: 'desc' }));

// Anexos
dispatch(addAttachment({
  transactionId: 'tx-123',
  attachment: { /* ... */ }
}));
```

---

## 📊 Categorias Disponíveis

| Categoria | Palavras-chave |
|-----------|----------------|
| 🍔 Alimentação | restaurante, supermercado, comida, padaria... |
| 🚗 Transporte | uber, taxi, combustível, estacionamento... |
| 🏥 Saúde | farmácia, médico, hospital, dentista... |
| 📚 Educação | escola, faculdade, curso, livro... |
| 🎬 Entretenimento | cinema, netflix, spotify, passeio... |
| 💡 Utilidades | energia, água, internet, aluguel... |
| 💰 Investimento | ações, criptomoeda, fundo, poupança... |
| 🔹 Outro | Customizado |

---

## ✨ Exemplos Práticos

### Exemplo 1: Filtrar Despesas de Fevereiro
```tsx
dispatch(setFilters({
  tipo: 'despesa',
  dataInicio: '2024-02-01',
  dataFim: '2024-02-29'
}));
```

### Exemplo 2: Buscar por Palavra-chave
```tsx
dispatch(setFilters({
  searchTerm: 'supermercado'
}));
```

### Exemplo 3: Filtro de Valor
```tsx
dispatch(setFilters({
  valorMinimo: 0,
  valorMaximo: 100
}));
```

### Exemplo 4: Ordenar por Valor Descendente
```tsx
dispatch(setSort({ field: 'valor', order: 'desc' }));
```

---

## 🎨 Personalizações

### Mudar Limite de Arquivo
```tsx
<FileUpload
  maxFileSize={10 * 1024 * 1024}  // 10MB
  maxFiles={10}
/>
```

### Customizar Validação
```tsx
// Estender validationUtils.ts
export const validateTransactionForm = (data) => {
  const errors = [];
  
  // Sua validação customizada
  if (data.valor > 50000) {
    errors.push({
      field: 'valor',
      message: 'Valor muito alto!'
    });
  }
  
  return errors;
};
```

---

## 🐛 Troubleshooting

### Problema: Filtros não funcionam
**Solução**: Certifique-se que Redux Provider está envolvendo o componente

### Problema: Sugestões não aparecem
**Solução**: Adicione pelo menos 3 caracteres na descrição

### Problema: Upload não funciona
**Solução**: Verifique se o arquivo não ultrapassa 5MB e é de um tipo aceito

### Problema: Paginação desaparece
**Solução**: Paginação só aparece se total > pageSize (ex: > 10 itens)

---

## 📱 Responsividade

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

---

## ♿ Acessibilidade

- ✅ Compatível com leitores de tela
- ✅ Navegação por teclado (Tab)
- ✅ Labels ARIA
- ✅ Alto contraste

---

## 📚 Mais Informações

Consulte os arquivos:
- `FEATURES_DOCUMENTATION.md` - Documentação completa
- `IMPLEMENTATION_SUMMARY.md` - Resumo técnico

---

**💡 Dica**: Use os componentes prontos! Eles já incluem:
- Validação
- Acessibilidade
- Responsividade
- Tratamento de erros
- Integração com Redux

🎉 **Tudo pronto para usar!**
