---
sidebar_position: 9
title: 📋 Melhores Práticas
description: Melhores práticas para usar componentes
---

# 📋 Melhores Práticas

Diretrizes para usar componentes de forma eficaz e consistente.

## Nomenclatura e Estrutura

### ✅ Faça

```tsx
// Use nomes claros e descritivos
const handleSaveTransaction = () => {};
const [isModalOpen, setIsModalOpen] = useState(false);

// Agrupe estados relacionados
const [formData, setFormData] = useState({
  description: '',
  value: 0,
  date: new Date(),
});

// Use componentes reutilizáveis
const TransactionCard = ({ transaction }) => (
  <Card>
    <div className="p-4">
      <h4>{transaction.description}</h4>
      <p>R$ {transaction.value}</p>
    </div>
  </Card>
);
```

### ❌ Não Faça

```tsx
// Evite nomes genéricos
const handle = () => {};
const [m, setM] = useState(false);

// Evite muitos estados
const [v1, setV1] = useState('');
const [v2, setV2] = useState('');
const [v3, setV3] = useState('');

// Evite componentes muito grandes
const HugeComponent = () => {
  // 500+ linhas de código
};
```

---

## Composição

### ✅ Faça - Componentes Menores

```tsx
// Divida em componentes reutilizáveis
const TransactionList = ({ transactions }) => (
  <div className="space-y-2">
    {transactions.map((tx) => (
      <TransactionItem key={tx.id} transaction={tx} />
    ))}
  </div>
);

const TransactionItem = ({ transaction }) => (
  <Card>
    <TransactionItemContent transaction={transaction} />
  </Card>
);

const TransactionItemContent = ({ transaction }) => (
  <div className="flex justify-between">
    <div>
      <h4>{transaction.description}</h4>
      <p className="text-sm text-gray-600">{transaction.date}</p>
    </div>
    <p className={transaction.value > 0 ? 'text-green-600' : 'text-red-600'}>
      {transaction.value > 0 ? '+' : ''} R$ {Math.abs(transaction.value)}
    </p>
  </div>
);
```

### ❌ Não Faça - Um Componente Grande

```tsx
// Evite tudo em um componente
const TransactionList = ({ transactions, onEdit, onDelete }) => {
  // Lógica de formatação, renderização, handlers...
  // Tudo aqui
};
```

---

## Props e Type Safety

### ✅ Faça - Types Bem Definidos

```tsx
interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSubmit,
  isLoading = false,
  error,
}) => {
  // Implementação
};
```

### ❌ Não Faça - Tipos Soltos

```tsx
const TransactionForm = ({ t, o, l, e }) => {
  // O que cada prop significa?
};

const TransactionForm: React.FC<any> = (props) => {
  // Sem type safety
};
```

---

## Tratamento de Erros

### ✅ Faça - Validação Completa

```tsx
const handleSaveTransaction = async () => {
  // Validação
  if (!description.trim()) {
    setError('Descrição é obrigatória');
    return;
  }

  if (value <= 0) {
    setError('Valor deve ser maior que zero');
    return;
  }

  setIsLoading(true);
  try {
    await saveTransaction({ description, value });
    setSuccess('Transação salva com sucesso!');
    resetForm();
  } catch (err) {
    setError(err.message || 'Erro ao salvar transação');
  } finally {
    setIsLoading(false);
  }
};
```

### ❌ Não Faça - Sem Validação

```tsx
const handleSaveTransaction = async () => {
  await saveTransaction({ description, value });
};
```

---

## Acessibilidade

### ✅ Faça - Acessível

```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup>
    <label htmlFor="transaction-desc">
      Descrição
      <span className="text-red-600" aria-label="obrigatório">*</span>
    </label>
    <Input
      id="transaction-desc"
      required
      aria-required="true"
      aria-describedby={error ? 'desc-error' : undefined}
    />
    {error && (
      <p id="desc-error" className="text-sm text-red-600 mt-1" role="alert">
        {error}
      </p>
    )}
  </FormGroup>

  <Button type="submit" aria-busy={isLoading}>
    {isLoading ? 'Salvando...' : 'Salvar'}
  </Button>
</Form>
```

### ❌ Não Faça - Inacessível

```tsx
<input placeholder="Descrição" />
<button onClick={handleSubmit}>OK</button>
```

---

## Performance

### ✅ Faça - Otimizado

```tsx
// Memoize callbacks
const handleSave = useCallback(async (data) => {
  await saveTransaction(data);
}, []);

// Memoize componentes
const TransactionItem = React.memo(({ transaction }) => (
  <Card>{/* conteúdo */}</Card>
));

// Lazy load se necessário
const TransactionChart = lazy(() => 
  import('./TransactionChart')
);
```

### ❌ Não Faça - Performance Ruim

```tsx
// Funções inline a cada render
<Button onClick={() => handleSave(data)}>

// Lógica pesada em render
{transactions.map((tx) => {
  const formatted = complexCalculation(tx);
  return <TransactionItem key={tx.id} data={formatted} />;
})}
```

---

## Teste de Componentes

### ✅ Faça - Teste Bem

```tsx
describe('Button', () => {
  it('deve disparar callback ao clicar', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Clique</Button>
    );
    
    fireEvent.click(getByText('Clique'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('deve ser acessível por teclado', () => {
    const { getByText } = render(
      <Button>Clique</Button>
    );
    
    fireEvent.keyDown(getByText('Clique'), { key: 'Enter' });
    expect(getByText('Clique')).toHaveFocus();
  });
});
```

---

## State Management

### ✅ Faça - Estado Limpo

```tsx
// Agrupe estados relacionados
const [form, setForm] = useState({
  description: '',
  value: 0,
  date: new Date(),
});

const [status, setStatus] = useState({
  isLoading: false,
  error: null,
  success: false,
});

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};
```

### ❌ Não Faça - Estado Desorganizado

```tsx
const [description, setDescription] = useState('');
const [value, setValue] = useState(0);
const [date, setDate] = useState(new Date());
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);
// 50+ linhas de useState
```

---

## Responsividade

### ✅ Faça - Mobile First

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {transactions.map((tx) => (
    <TransactionCard key={tx.id} transaction={tx} />
  ))}
</div>

<Table className="hidden md:table">
  {/* Tabela completa em desktop */}
</Table>

<div className="md:hidden space-y-2">
  {/* Lista em mobile */}
</div>
```

### ❌ Não Faça - Desktop Only

```tsx
<Table>
  {/* Render no mobile como pequena tabela ilegível */}
</Table>
```

---

## Documentação

### ✅ Faça - Bem Documentado

```tsx
/**
 * Exibe uma transação em um card
 * 
 * @component
 * @example
 * const transaction = { id: 1, description: 'Compra', value: 50 }
 * return <TransactionCard transaction={transaction} />
 *
 * @param {Transaction} transaction - A transação a exibir
 * @param {Function} onEdit - Callback ao editar
 * @param {Function} onDelete - Callback ao deletar
 * @returns {JSX.Element} Card com transação
 */
export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onEdit,
  onDelete,
}) => {
  // Implementação
};
```

### ❌ Não Faça - Sem Documentação

```tsx
export const TransactionCard = ({ t, o, d }) => {
  // ???
};
```

---

## Checklist de Qualidade

Antes de fazer commit, verifique:

- ✅ Componentes menores e focados
- ✅ TypeScript types bem definidos
- ✅ Nomes claros e descritivos
- ✅ Validação de entrada
- ✅ Tratamento de erros
- ✅ Acessibilidade verificada
- ✅ Performance otimizada
- ✅ Testes implementados
- ✅ Documentação completa
- ✅ Responsividade testada

---

**Próximo**: [Guia de Uso →](./guia-rapido)
