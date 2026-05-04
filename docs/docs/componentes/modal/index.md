---
sidebar_position: 5
title: Modal
description: Componente Modal - Diálogos e caixas de diálogo
---

# Modal

O `Modal` é um componente que mostra conteúdo em uma camada acima do resto da página, focando a atenção do usuário.

## Configurador

```tsx
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export default function ModalConfigurator() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-2">Tamanho</label>
          <select 
            value={size} 
            onChange={(e) => setSize(e.target.value as any)}
            className="px-3 py-2 border rounded"
          >
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
          </select>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          Abrir Modal
        </Button>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        size={size}
      >
        <Modal.Header onClose={() => setIsOpen(false)}>
          Título do Modal
        </Modal.Header>
        <Modal.Body>
          <p>Conteúdo do modal</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setIsOpen(false)}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
```

### Propriedades

| Propriedade | Tipo | Descrição |
|------------|------|-----------|
| **isOpen** | `boolean` | Se o modal está aberto |
| **onClose** | `() => void` | Callback ao fechar |
| **size** | `'sm' \| 'md' \| 'lg'` | Tamanho do modal |
| **children** | `ReactNode` | Conteúdo |

---

## Exemplos

### Modal Básico

```tsx
const [isOpen, setIsOpen] = React.useState(false);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>
      Abrir Modal
    </Button>

    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Header onClose={() => setIsOpen(false)}>
        Título
      </Modal.Header>
      <Modal.Body>
        <p>Conteúdo</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setIsOpen(false)}>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);
```

### Modal de Confirmação

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header onClose={() => setIsOpen(false)}>
    Confirmar Ação
  </Modal.Header>
  <Modal.Body>
    <p>Tem certeza que deseja continuar?</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button onClick={handleConfirm}>
      Confirmar
    </Button>
  </Modal.Footer>
</Modal>
```

### Modal com Formulário

```tsx
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header onClose={() => setIsOpen(false)}>
    Adicionar Transação
  </Modal.Header>
  <Modal.Body>
    <form className="space-y-4">
      <div>
        <label>Descrição</label>
        <Input type="text" />
      </div>
      <div>
        <label>Valor</label>
        <Input type="number" />
      </div>
    </form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancelar
    </Button>
    <Button onClick={handleSave}>
      Salvar
    </Button>
  </Modal.Footer>
</Modal>
```

---

## Guia de Uso

### Quando Usar

- ✅ Confirmar ações importantes
- ✅ Coletar dados com formulários
- ✅ Mostrar alertas críticos
- ✅ Ações que requerem foco

### Quando Não Usar

- ❌ Para navegação principal
- ❌ Para conteúdo muito longo
- ❌ Para interações simples

### Boas Práticas

```tsx
// ✅ Sempre tenha um botão Cancelar
<Modal.Footer>
  <Button variant="outline">Cancelar</Button>
  <Button>Confirmar</Button>
</Modal.Footer>

// ✅ Feche ao clicar em X
<Modal.Header onClose={handleClose}>
  Título
</Modal.Header>

// ✅ Use o tamanho apropriado
<Modal size="md"> {/* ou 'sm' ou 'lg' */}
```

---

## Acessibilidade

### Role Dialog

```tsx
<Modal role="dialog" aria-labelledby="modal-title">
  <Modal.Header id="modal-title">
    Título do Modal
  </Modal.Header>
</Modal>
```

### Foco Capturado

O foco é automaticamente mantido dentro do modal quando aberto.

### Fechar com Esc

O modal pode ser fechado pressionando Esc.

```tsx
<Modal onKeyDown={(e) => {
  if (e.key === 'Escape') {
    onClose();
  }
}}>
```

---

**Próximo**: [Documentação Completa](/docs/intro)
