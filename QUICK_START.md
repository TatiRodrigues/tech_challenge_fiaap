# 🚀 Guia Rápido — Alecrim Wallet

## ⚡ Iniciar em 3 passos

### 1️⃣ Pré-requisitos

| Ferramenta | Versão mínima | Download |
|-----------|--------------|---------|
| **Node.js** | 20 LTS | https://nodejs.org |
| **npm** | 10+ | (incluso no Node.js) |

### 2️⃣ Instalar e iniciar

```bash
git clone https://github.com/TatiRodrigues/tech_challenge_fiaap.git
cd tech_challenge_fiaap
npm install
npm run dev
```

### 3️⃣ Acessar

Abra no navegador: **http://localhost:3001**

```
Email: teste@gmail.com
Senha: testes
Username: Aluno Carequinha
```

---

## 🆘 Problemas comuns

### "Porta 3001 em uso"
```bash
npx kill-port 3001
npm run dev
```

### "Erro de módulo / Cannot find module"
```bash
rm -rf node_modules
npm install
npm run dev
```

### "Token inválido" ao fazer login
```javascript
// No console do navegador (F12):
localStorage.clear()
// Recarregue a página
```

---

## 📚 Mais informações

- **[README.md](README.md)** — Documentação completa do projeto
- **[docs/](docs/)** — Documentação técnica (Docusaurus)
