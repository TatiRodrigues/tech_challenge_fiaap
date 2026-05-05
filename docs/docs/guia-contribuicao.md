---
sidebar_position: 2
title: Guia de Contribuição
description: Processo de pull request
---

# 📝 Guia de Contribuição

Processo detalhado para contribuições.

## Setup para Contribuir

```bash
# 1. Fork e clone
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git

# 2. Instale dependências
npm install

# 3. Crie uma branch
git checkout -b fix/issue-123

# 4. Faça suas mudanças
# ...

# 5. Teste
npm run test
npm run lint

# 6. Commit
git commit -m "fix: descrição breve"

# 7. Push
git push origin fix/issue-123
```

## Padrão de Commit

```
<type>: <description>

<body>

<footer>
```

**Types:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes

**Exemplo:**
```
feat: adicionar componente Button

Implementa novo componente Button com:
- Variantes: primary, secondary, outline
- Tamanhos: sm, md, lg
- Estados: normal, loading, disabled

Closes #123
```

## Checklist

- [ ] Código segue padrões do projeto
- [ ] Testes passam
- [ ] Documentação atualizada
- [ ] Sem warnings no lint
- [ ] Acessibilidade verificada

---

[Próximo: Governança →](./governanca)
