---
sidebar_position: 6
title: Table
description: Componente Table - Tabelas de dados
---

# Table

O `Table` é um componente para exibir dados estruturados em linhas e colunas.

## Configurador

```tsx
export default function TableConfigurator() {
  const [striped, setStriped] = React.useState(true);
  const [bordered, setBordered] = React.useState(false);
  const [hoverable, setHoverable] = React.useState(true);

  const data = [
    { id: 1, name: 'João Silva', email: 'joao@example.com', status: 'Ativo' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', status: 'Inativo' },
    { id: 3, name: 'Pedro Costa', email: 'pedro@example.com', status: 'Ativo' },
  ];

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4">
        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={striped} 
            onChange={(e) => setStriped(e.target.checked)}
          />
          <span className="text-sm">Listrado</span>
        </label>
        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={bordered} 
            onChange={(e) => setBordered(e.target.checked)}
          />
          <span className="text-sm">Com Bordas</span>
        </label>
        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={hoverable} 
            onChange={(e) => setHoverable(e.target.checked)}
          />
          <span className="text-sm">Hover</span>
        </label>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 p-8 rounded-lg overflow-x-auto">
        <Table striped={striped} bordered={bordered} hoverable={hoverable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>
                  <Badge variant={row.status === 'Ativo' ? 'success' : 'error'}>
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
```

---

## Exemplos

### Table Básica

```tsx
<Table>
  <thead>
    <tr>
      <th>Coluna 1</th>
      <th>Coluna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Dado 1</td>
      <td>Dado 2</td>
    </tr>
  </tbody>
</Table>
```

### Table com Ações

```tsx
<Table striped hoverable>
  <thead>
    <tr>
      <th>Descrição</th>
      <th>Valor</th>
      <th>Data</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {transactions.map((tx) => (
      <tr key={tx.id}>
        <td>{tx.description}</td>
        <td className={tx.value > 0 ? 'text-green-600' : 'text-red-600'}>
          {tx.value > 0 ? '+' : ''} R$ {Math.abs(tx.value)}
        </td>
        <td>{new Date(tx.date).toLocaleDateString()}</td>
        <td>
          <Button size="sm" variant="outline" onClick={() => handleEdit(tx.id)}>
            Editar
          </Button>
          <Button size="sm" variant="outline" className="text-red-600">
            Deletar
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

---

## Guia de Uso

### Responsividade

Para tabelas em dispositivos móveis, considere:

```tsx
<div className="overflow-x-auto">
  <Table>
    {/* Conteúdo */}
  </Table>
</div>
```

### Ordenação

```tsx
const [sortBy, setSortBy] = React.useState('name');
const [sortOrder, setSortOrder] = React.useState('asc');

const handleHeaderClick = (column) => {
  if (sortBy === column) {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  } else {
    setSortBy(column);
    setSortOrder('asc');
  }
};
```

---

## Acessibilidade

```tsx
<Table role="grid">
  <thead>
    <tr role="row">
      <th role="columnheader">Nome</th>
      <th role="columnheader">Email</th>
    </tr>
  </thead>
</Table>
```

---

**Próximo**: [Alert](../alert)
