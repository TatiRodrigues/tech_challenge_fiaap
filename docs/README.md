# 📚 Documentação do Tech Challenge FIAAP

Bem-vindo à documentação do projeto Tech Challenge FIAAP!

## 📖 Sobre

Esta pasta contém a documentação completa do projeto usando **Docusaurus**, incluindo:

- ✅ Design System - Componentes reutilizáveis
- ✅ Guia de uso dos componentes
- ✅ Padrões e boas práticas
- ✅ Exemplos de código
- ✅ Estrutura de dados

## 🚀 Começar

### 1. Instalar Dependências

```bash
cd docs
npm install
```

### 2. Iniciar Servidor de Desenvolvimento

```bash
npm start
```

Isso abrirá a documentação em: **http://localhost:3000**

### 3. Compilar para Produção

```bash
npm run build
```

A documentação compilada estará em `build/`

## 📁 Estrutura

```
docs/
├── docs/                    # Documentação Markdown
│   ├── intro.md
│   ├── design-system.md
│   ├── componentes-layout.md
│   ├── componentes-recursos.md
│   └── guia-uso.md
├── blog/                    # Posts do blog
├── src/
│   ├── pages/              # Páginas customizadas
│   └── css/
│       └── custom.css      # Estilos customizados
├── static/                 # Assets estáticos
├── docusaurus.config.js    # Configuração principal
├── sidebars.js             # Estrutura da sidebar
└── package.json
```

## 📝 Editando a Documentação

### Adicionar Nova Página

1. Crie um arquivo `.md` em `docs/docs/`
2. Adicione frontmatter com `sidebar_position`:

```markdown
---
sidebar_position: 6
title: Minha Nova Página
---

# Conteúdo da página...
```

3. Atualize `sidebars.js` se necessário

### Adicionar Nova Seção

Edite `sidebars.js`:

```javascript
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      label: 'Nova Seção',
      items: [
        'nova-pagina-1',
        'nova-pagina-2',
      ],
    },
  ],
};
```

## 🎨 Customizando

### Cores e Estilos

Edite `src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #2e8555;
  /* mais cores... */
}
```

### Configuração Global

Edite `docusaurus.config.js`:

```javascript
const config = {
  title: 'Tech Challenge FIAAP',
  url: 'https://seu-dominio.com',
  // mais configurações...
};
```

## 🌐 Deploy

### Deploy no GitHub Pages

1. Compile o projeto:
```bash
npm run build
```

2. Faça commit e push:
```bash
git add .
git commit -m "Docs: atualizar documentação"
git push
```

3. Configure GitHub Pages (Settings → Pages)

### Deploy Alternativo

- **Netlify**: Conecte seu repositório e configure como site estático
- **Vercel**: Importe o projeto e deixe a CI/CD fazer o deploy
- **Servidor próprio**: Faça upload da pasta `build/`

## 📚 Recursos Úteis

- [Documentação Docusaurus](https://docusaurus.io/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Syntax](https://mdxjs.com/)

## 🐛 Solução de Problemas

### Erro: "Cannot find module"

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta 3000 já está em uso

```bash
# Use outra porta
npm start -- --port 3001
```

### Build falha

```bash
# Verifique erros de sintaxe
npm run build -- --debug
```

## 📞 Suporte

Para dúvidas ou sugestões, crie uma issue no repositório GitHub.

---

**Última atualização:** Abril 2026  
**Versão:** 1.0.0
