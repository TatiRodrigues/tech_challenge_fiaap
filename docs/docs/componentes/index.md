---
sidebar_position: 1
title: Componentes
description: Biblioteca de componentes da aplicação Alecrim Finance
---

# Componentes

Biblioteca completa de componentes reutilizáveis para a Alecrim Finance, seguindo os padrões de Design System Porsche.

## Estrutura de Componentes

### Entrada de Dados
Componentes para capturar informações do usuário.

- **[Button](./button)** - Disparar ações e navegação
- **[Input](./input)** - Campos de entrada de texto
- **[Form](./form)** - Agrupamento de formulários

### Feedback
Componentes para comunicar estado e mensagens ao usuário.

- **[Alert](./alert)** - Mensagens de alerta e notificação
- **[Modal](./modal)** - Diálogos modais

### Conteúdo
Componentes para estruturação e apresentação de conteúdo.

- **[Card](./card)** - Contêiner de conteúdo
- **[Table](./table)** - Tabelas de dados

## Estrutura de Documentação

Cada componente possui as seguintes seções:

### 🎮 Configurador
Jogue com as propriedades do componente e veja as mudanças em tempo real.

### 📚 Exemplos
Exemplos práticos de como usar o componente em diferentes cenários.

### 📖 Guia de Uso
Diretrizes e melhores práticas de quando e como usar o componente.

### ♿ Acessibilidade
Informações sobre acessibilidade, ARIA e boas práticas inclusivas.

### 🔌 API
Documentação completa das propriedades, eventos e slots do componente.

## Guia Rápido

### Começar com um Componente

1. Abra a documentação do componente
2. Veja o **Configurador** para explorar as variações
3. Copie o exemplo que melhor se adequa ao seu caso
4. Consulte a seção **API** para entender todas as props

### Exemplo de Uso

```tsx
import { Button } from '@/components/ui/Button';

export default function MyComponent() {
  return (
    <Button variant="primary" onClick={() => alert('Clicado!')}>
      Clique aqui
    </Button>
  );
}
```

## Padrões de Design

### Propriedades Comuns

Todos os componentes seguem esses padrões:

- **variant** - Estilo visual (primary, secondary, outline, etc)
- **size** - Tamanho (sm, md, lg)
- **disabled** - Estado desabilitado
- **className** - Classes Tailwind customizadas

### Estados

- **Normal** - Padrão
- **Hover** - Ao passar o mouse
- **Focus** - Quando recebe foco (teclado/mouse)
- **Active** - Quando está em estado ativo
- **Disabled** - Quando desabilitado
- **Loading** - Quando processando

## Acessibilidade

Todos os componentes são construídos com acessibilidade em mente:

- ✅ Conformidade com WCAG 2.1 AA
- ✅ Navegação completa por teclado
- ✅ Suporte a leitores de tela
- ✅ Contraste adequado
- ✅ ARIA labels apropriadas

## TypeScript

Todos os componentes são totalmente tipados com TypeScript:

```tsx
import { Button, ButtonProps } from '@/components/ui/Button';

const MyComponent: React.FC = () => {
  const handleClick: ButtonProps['onClick'] = () => {
    console.log('Clicado!');
  };

  return <Button onClick={handleClick}>Clique aqui</Button>;
};
```

---

**Próximo**: [Button](./button)
