---
sidebar_position: 0
title: 🚀 Guia Rápido
description: Referência rápida de componentes
---

# 🚀 Guia Rápido de Componentes

Comece a usar componentes em segundos!

## Instalação

```bash
# Todos os componentes já estão na pasta /componentes
import { Button } from '@/components/ui/Button';
```

## Componentes Mais Usados

### Button - Disparar Ações

```tsx
<Button>Clique aqui</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="outline">Outline</Button>
<Button disabled>Desabilitado</Button>
<Button loading>Carregando...</Button>
```

**Quando usar:** Salvar, enviar, cancelar, qualquer ação do usuário.

[Ver Documentação Completa →](./button)

---

### Input - Entrada de Texto

```tsx
<Input type="text" placeholder="Nome" />
<Input type="email" placeholder="seu@email.com" />
<Input type="password" placeholder="••••••••" />
<Input error>Com erro</Input>
<Input disabled>Desabilitado</Input>
```

**Quando usar:** Capturar texto, email, senha, números.

[Ver Documentação Completa →](./input)

---

### Card - Contêiner de Conteúdo

```tsx
<Card>
  <div className="p-6">
    <h3>Título</h3>
    <p>Conteúdo</p>
  </div>
</Card>
```

**Quando usar:** Agrupar conteúdo relacionado, criar grades.

[Ver Documentação Completa →](./card)

---

### Modal - Diálogos

```tsx
<Modal isOpen={true} onClose={handleClose}>
  <Modal.Header>Título</Modal.Header>
  <Modal.Body>Conteúdo</Modal.Body>
  <Modal.Footer>
    <Button variant="outline">Cancelar</Button>
    <Button>Confirmar</Button>
  </Modal.Footer>
</Modal>
```

**Quando usar:** Confirmar ações, formulários, alertas.

[Ver Documentação Completa →](./modal)

---

### Alert - Mensagens

```tsx
<Alert type="success">✓ Sucesso!</Alert>
<Alert type="error">✗ Erro</Alert>
<Alert type="warning">⚠ Aviso</Alert>
<Alert type="info">ⓘ Informação</Alert>
```

**Quando usar:** Feedback ao usuário, erros, sucessos.

[Ver Documentação Completa →](./alert)

---

### Form - Formulários

```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup>
    <label>Email</label>
    <Input type="email" />
  </FormGroup>
  <Button type="submit">Enviar</Button>
</Form>
```

**Quando usar:** Coletar dados do usuário.

[Ver Documentação Completa →](./form)

---

### Table - Tabelas de Dados

```tsx
<Table striped hoverable>
  <thead>
    <tr>
      <th>Nome</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    {data.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.email}</td>
      </tr>
    ))}
  </tbody>
</Table>
```

**Quando usar:** Exibir dados estruturados.

[Ver Documentação Completa →](./table)

---

## Padrões Comuns

### Formulário com Validação

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

const handleChange = (e) => {
  setEmail(e.target.value);
  if (!e.target.value.includes('@')) {
    setError('Email inválido');
  } else {
    setError('');
  }
};

return (
  <div>
    <Input 
      value={email} 
      onChange={handleChange}
      error={!!error}
    />
    {error && <p className="text-red-600">{error}</p>}
  </div>
);
```

### Modal com Ação Assíncrona

```tsx
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
    setIsOpen(false);
  } finally {
    setIsLoading(false);
  }
};

return (
  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <Modal.Header>Salvar</Modal.Header>
    <Modal.Body>Conteúdo</Modal.Body>
    <Modal.Footer>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancelar
      </Button>
      <Button loading={isLoading} onClick={handleSave}>
        Salvar
      </Button>
    </Modal.Footer>
  </Modal>
);
```

### Liste de Transações

```tsx
<div className="space-y-2">
  {transactions.map((tx) => (
    <Card key={tx.id}>
      <div className="p-4 flex justify-between items-center">
        <div>
          <p className="font-bold">{tx.description}</p>
          <p className="text-sm text-gray-600">{tx.date}</p>
        </div>
        <p className={tx.value > 0 ? 'text-green-600' : 'text-red-600'}>
          {tx.value > 0 ? '+' : ''} R$ {Math.abs(tx.value).toFixed(2)}
        </p>
      </div>
    </Card>
  ))}
</div>
```

---

## Acessibilidade Checklist

- ✅ Use `label` com `htmlFor` para inputs
- ✅ Adicione `aria-label` para ícones
- ✅ Forneça `aria-describedby` para mensagens de erro
- ✅ Sempre tenha um "Cancelar" junto com confirmações
- ✅ Teste com teclado (Tab, Enter, Escape)

---

## Troubleshooting

### Button não responde ao clique
```tsx
// ❌ Errado
<Button onClick={handleClick()}>  {/* () chamará imediatamente */}

// ✅ Correto
<Button onClick={handleClick}>
```

### Input não exibe valor
```tsx
// Certifique-se de ter value e onChange
<Input 
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
```

### Modal não fecha
```tsx
// Certifique-se de atualizar o estado em onClose
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
```

---

## Próximos Passos

- [Explorar todos os componentes →](./button)
- [Aprender sobre Design System →](/docs/design-system/fundamentos)
- [Guia de Contribuição →](/docs/contribuicoes)

---

**Dica:** Veja o [Configurador](/docs/componentes/button) de cada componente para explorar todas as variações!
