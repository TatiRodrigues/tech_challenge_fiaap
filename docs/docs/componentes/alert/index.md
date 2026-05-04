---
sidebar_position: 7
title: Alert
description: Componente Alert - Mensagens de alerta
---

# Alert

O `Alert` é um componente para exibir mensagens importantes ao usuário.

## Configurador

```tsx
export default function AlertConfigurator() {
  const [type, setType] = React.useState<'success' | 'error' | 'warning' | 'info'>('success');
  const [dismissible, setDismissible] = React.useState(true);
  const [isOpen, setIsOpen] = React.useState(true);

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        Mostrar Alert
      </Button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option>success</option>
            <option>error</option>
            <option>warning</option>
            <option>info</option>
          </select>
        </div>
        <label className="flex items-end gap-2">
          <input 
            type="checkbox" 
            checked={dismissible} 
            onChange={(e) => setDismissible(e.target.checked)}
          />
          <span className="text-sm">Fechável</span>
        </label>
      </div>

      {/* Preview */}
      <Alert 
        type={type} 
        dismissible={dismissible}
        onClose={dismissible ? () => setIsOpen(false) : undefined}
      >
        <strong>Atenção!</strong> Esta é uma mensagem de {type}.
      </Alert>
    </div>
  );
}
```

---

## Exemplos

### Alert de Sucesso

```tsx
<Alert type="success">
  ✓ Operação realizada com sucesso!
</Alert>
```

### Alert de Erro

```tsx
<Alert type="error" dismissible onClose={handleClose}>
  ✗ Ocorreu um erro ao processar sua solicitação.
</Alert>
```

### Alert de Aviso

```tsx
<Alert type="warning">
  ⚠ Verifique os dados antes de continuar.
</Alert>
```

### Alert de Info

```tsx
<Alert type="info">
  ⓘ Informação importante para você.
</Alert>
```

### Com Detalhes

```tsx
<Alert type="error">
  <strong>Erro na Validação</strong>
  <p className="text-sm mt-2">
    Os seguintes campos são obrigatórios:
    <ul className="list-disc ml-4">
      <li>Email</li>
      <li>Senha</li>
    </ul>
  </p>
</Alert>
```

---

## Guia de Uso

### Tipos de Mensagem

- **Success**: Operação concluída com êxito
- **Error**: Algo deu errado
- **Warning**: Atenção necessária
- **Info**: Informação geral

### Ao Topo da Página

```tsx
{error && (
  <Alert type="error" dismissible onClose={() => setError(null)}>
    {error.message}
  </Alert>
)}
```

---

## Acessibilidade

```tsx
<Alert 
  type="error"
  role="alert"
  aria-live="assertive"
>
  Mensagem de erro crítico
</Alert>
```

---

**Próximo**: [Form](../form)
