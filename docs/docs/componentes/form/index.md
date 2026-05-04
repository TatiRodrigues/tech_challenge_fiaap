---
sidebar_position: 8
title: Form
description: Componente Form - Agrupamento de formulários
---

# Form

O `Form` é um componente para estruturar e agrupar campos de formulário.

## Exemplos

### Formulário Básico

```tsx
<Form onSubmit={handleSubmit}>
  <FormGroup>
    <label htmlFor="name">Nome</label>
    <Input id="name" type="text" required />
  </FormGroup>

  <FormGroup>
    <label htmlFor="email">Email</label>
    <Input id="email" type="email" required />
  </FormGroup>

  <div className="flex gap-2">
    <Button type="submit">Enviar</Button>
    <Button type="reset" variant="outline">Limpar</Button>
  </div>
</Form>
```

### Formulário de Transação

```tsx
<Form onSubmit={handleSaveTransaction}>
  <FormGroup>
    <label>Descrição</label>
    <Input 
      type="text" 
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      required
    />
  </FormGroup>

  <FormGroup>
    <label>Valor</label>
    <Input 
      type="number" 
      value={value}
      onChange={(e) => setValue(parseFloat(e.target.value))}
      step="0.01"
      required
    />
  </FormGroup>

  <FormGroup>
    <label>Data</label>
    <Input 
      type="date" 
      value={date}
      onChange={(e) => setDate(e.target.value)}
      required
    />
  </FormGroup>

  <FormGroup>
    <label>Categoria</label>
    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option>Selecione...</option>
      <option>Alimentação</option>
      <option>Transporte</option>
      <option>Lazer</option>
      <option>Outro</option>
    </Select>
  </FormGroup>

  <FormGroup>
    <label>Notas</label>
    <Textarea 
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      rows={4}
    />
  </FormGroup>

  <div className="flex gap-2">
    <Button type="submit" fullWidth>
      Salvar Transação
    </Button>
    <Button 
      type="button" 
      variant="outline" 
      fullWidth
      onClick={handleCancel}
    >
      Cancelar
    </Button>
  </div>
</Form>
```

### Formulário com Validação

```tsx
const [errors, setErrors] = React.useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  
  const newErrors = {};
  if (!email.includes('@')) {
    newErrors.email = 'Email inválido';
  }
  if (password.length < 8) {
    newErrors.password = 'Mínimo 8 caracteres';
  }
  
  setErrors(newErrors);
  
  if (Object.keys(newErrors).length === 0) {
    // Enviar formulário
  }
};

return (
  <Form onSubmit={handleSubmit}>
    {Object.keys(errors).length > 0 && (
      <Alert type="error">
        Por favor, corrija os erros abaixo.
      </Alert>
    )}

    <FormGroup>
      <label htmlFor="email">Email</label>
      <Input 
        id="email"
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
      />
      {errors.email && (
        <p className="text-sm text-red-600 mt-1">{errors.email}</p>
      )}
    </FormGroup>

    <FormGroup>
      <label htmlFor="password">Senha</label>
      <Input 
        id="password"
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors.password}
      />
      {errors.password && (
        <p className="text-sm text-red-600 mt-1">{errors.password}</p>
      )}
    </FormGroup>

    <Button type="submit">
      Cadastrar
    </Button>
  </Form>
);
```

---

## Guia de Uso

### Estrutura Semântica

```tsx
✅ Correto
<Form>
  <FormGroup>
    <label htmlFor="field-id">Label</label>
    <Input id="field-id" />
  </FormGroup>
</Form>

❌ Errado
<form>
  <input placeholder="Field" />
</form>
```

### Agrupamento Lógico

```tsx
<Form>
  {/* Seção de Dados Pessoais */}
  <FormGroup>
    <label>Nome</label>
    <Input />
  </FormGroup>

  {/* Seção de Endereço */}
  <FormGroup>
    <label>Rua</label>
    <Input />
  </FormGroup>
</Form>
```

---

## Acessibilidade

### Labels Obrigatórias

```tsx
<FormGroup>
  <label htmlFor="email">
    Email
    <span className="text-red-600" aria-label="obrigatório">*</span>
  </label>
  <Input id="email" required aria-required="true" />
</FormGroup>
```

### Mensagens de Erro

```tsx
<FormGroup>
  <label htmlFor="password">Senha</label>
  <Input 
    id="password" 
    aria-describedby="password-error"
    aria-invalid={!!error}
  />
  {error && (
    <p id="password-error" className="text-sm text-red-600">
      {error}
    </p>
  )}
</FormGroup>
```

---

**Próximo**: [Documentação Completa](/docs/intro)
