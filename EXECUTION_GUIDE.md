# 🚀 GUIA RÁPIDO DE EXECUÇÃO

## Passos para Executar o Projeto

### 1️⃣ **Abra o Terminal no Diretório do Projeto**

```bash
cd "C:\Users\tatir\OneDrive\Desktop\pos_graduacao\tech_challenge_fase_um"
```

---

### 2️⃣ **Limpe o Build Anterior**

```bash
# Windows CMD
rmdir /s /q .next
del package-lock.json
```

---

### 3️⃣ **Instale as Dependências**

```bash
npm install
```

Isso vai demorar 1-2 minutos...

---

### 4️⃣ **Faça o Build**

```bash
npm run build
```

**Esperado**: Mensagem `✓ Compiled successfully`

Se houver erro aqui, anote a mensagem e envie para diagnóstico.

---

### 5️⃣ **Rode em Produção** (ou Dev)

**Opção A - Produção:**
```bash
npm start
```

**Opção B - Desenvolvimento (auto-reload):**
```bash
npm run dev
```

**Recomendado**: Use `npm run dev` para desenvolvimento

---

### 6️⃣ **Acesse no Navegador**

```
http://localhost:3000
```

---

## 🧪 Teste Rápido

### Se conseguir acessar:

1. Clique em "Cadastro"
2. Preencha:
   - Nome: `Seu Nome`
   - Email: `teste@email.com`
   - Senha: `123456`
   - Confirme Senha: `123456`
3. Clique em "Criar Conta"

**Esperado**: 
- Vê mensagem de sucesso
- Redireciona para dashboard em 1.5s
- Vê seu nome/email no avatar do canto superior direito

---

## 🚨 Se Tiver Erro

### Erro: "Module not found"
- [ ] Verificar que .next foi deletado
- [ ] Rodar `npm install` novamente

### Erro: "Could not find production build"
- [ ] Rodar `npm run build` antes de `npm start`

### Erro: "TypeScript Error"
- [ ] Parar servidor (Ctrl+C)
- [ ] Rodar limpeza novamente
- [ ] Anotar mensagem de erro exata

---

## 📝 Arquivos Modificados Nesta Sessão

| Arquivo | Mudança |
|---------|---------|
| `app/servicos/banking-api.ts` | Import path corrigido |
| `app/hooks/useBankingApi.ts` | Import path corrigido |
| `app/hooks/useProtectedRoute.ts` | Agora usa Redux |
| `app/(autenticado)/layout.tsx` | Validação de token |
| `componentes/header/Header.tsx` | Redux logout |
| `app/login/page.tsx` | Redux login |
| `app/cadastro/page.tsx` | Redux cadastro |
| `app/esqueceu-senha/page.tsx` | Melhorado |
| `app/provedores/AuthProvider.tsx` | Deprecated (use Redux) |
| `next.config.ts` | Turbopack habilitado |

---

## ✅ Checklist

- [ ] Projeto clonado/atualizado
- [ ] `npm install` executado
- [ ] `npm run build` sem erros
- [ ] Servidor rodando em `npm run dev` ou `npm start`
- [ ] Consegue acessar `http://localhost:3000`
- [ ] Consegue fazer login/cadastro
- [ ] Avatar no header mostra nome do usuário
- [ ] Pode fazer logout
- [ ] Redireciona para login se token expirado

---

## 💡 Dicas

- **Modo Desenvolvimento** é mais fácil para testar (auto-reload)
- **DevTools** (F12) > Application > LocalStorage > vê o token armazenado
- **Redux DevTools** (extensão do Chrome) para debug de estado

---

## 📞 Suporte

Se tiver problemas:

1. Anote a mensagem de erro exata
2. Verifique qual etapa falhou
3. Tente limpar cache e rodar novamente
4. Consulte o arquivo `DIAGNOSTIC.md` para problemas conhecidos

---

**Sucesso!** 🎉
