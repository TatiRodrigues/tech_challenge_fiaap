# 📖 Referência de Código - Componentes

## AppHeader - Exemplo de Uso

```tsx
// componentes/app-header/AppHeader.tsx
import { useAuth } from '@/app/provedores/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="app-header fixed-top">
      <div className="app-header-inner">
        {/* Menu toggle para mobile */}
        <button 
          id="sidepanel-toggler"
          onClick={() => {
            const sidepanel = document.getElementById('app-sidepanel');
            sidepanel?.classList.toggle('sidepanel-hidden');
          }}
        >
          ☰
        </button>

        {/* User menu */}
        <div className="app-utilities">
          <div ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)}>
              {user?.email}
            </button>
            {showUserMenu && (
              <button onClick={handleLogout}>Logout</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## MenuLateral - Exemplo de Uso

```tsx
// componentes/menu-lateral/MenuLateral.tsx
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/provedores/AuthProvider';

export default function MenuLateral() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const isActive = (href: string) => pathname.includes(href);

  const menuItems = [
    { href: '/resumo-transacao', label: 'Resumo', icon: 'bi-graph-up' },
    { href: '/listar-transacoes', label: 'Transações', icon: 'bi-list-check' },
    { href: '/nova-transacao', label: 'Nova Transação', icon: 'bi-plus-circle' },
  ];

  return (
    <div className="sidepanel-inner">
      <nav className="app-nav app-nav-main">
        <ul className="app-menu">
          {menuItems.map(item => (
            <li key={item.href} className="nav-item">
              <a 
                href={item.href}
                className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
              >
                <span className="nav-icon">
                  <i className={`bi ${item.icon}`}></i>
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="app-sidepanel-footer">
        <button onClick={() => { logout(); router.push('/login'); }}>
          Logout
        </button>
      </div>
    </div>
  );
}
```

---

## CardsResumo - Exemplo de Uso

```tsx
// Simples, recebe transações como prop
<CardsResumo transactions={transactions} />

// Dentro do componente:
const totals = useMemo(() => {
  const totalDeposits = transactions
    .filter(t => t.type === 'deposito')
    .reduce((sum, t) => sum + t.value, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'saque')
    .reduce((sum, t) => sum + t.value, 0);
  
  return {
    totalIncome: totalDeposits + totalTransfers,
    totalWithdrawals,
    balance: totalIncome - totalWithdrawals,
  };
}, [transactions]);

// Output: 4 Cards
<div className="row g-3">
  <div className="col-12 col-md-6 col-lg-3">
    <div className="app-card app-card-stat">
      <h4>Total Ganhos</h4>
      <div className="stats-figure text-success">
        {formatCurrency(totals.totalIncome)}
      </div>
    </div>
  </div>
  {/* ... mais 3 cards */}
</div>
```

---

## FormularioTransacao - Exemplo de Uso

```tsx
// Em uma página
<FormularioTransacao />

// Dentro do componente:
const [formData, setFormData] = useState({
  type: 'deposito',
  value: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validação
  if (!formData.type || !formData.value) {
    setError('Campos obrigatórios');
    return;
  }

  // Salvar em localStorage
  const existing = localStorage.getItem('transactions');
  const transactions = existing ? JSON.parse(existing) : [];
  
  const newTransaction = {
    id: Date.now(),
    ...formData,
    value: parseFloat(formData.value),
    createdAt: new Date().toISOString(),
  };

  transactions.push(newTransaction);
  localStorage.setItem('transactions', JSON.stringify(transactions));

  // Redirecionar
  router.push('/listar-transacoes');
};

return (
  <form onSubmit={handleSubmit}>
    <select 
      name="type" 
      value={formData.type}
      onChange={handleChange}
    >
      <option value="deposito">Depósito</option>
      <option value="transferencia">Transferência</option>
      <option value="saque">Saque</option>
    </select>

    <input 
      type="number" 
      name="value"
      placeholder="0.00"
      onChange={handleChange}
    />

    <input 
      type="date" 
      name="date"
      value={formData.date}
      onChange={handleChange}
    />

    <textarea 
      name="description"
      placeholder="Descrição"
      onChange={handleChange}
    />

    <button type="submit">Criar</button>
  </form>
);
```

---

## ListarTransacoes - Exemplo de Uso

```tsx
// Em uma página
import { useTransactions } from '@/hooks/useTransactions';

export default function PaginaListarTransacoes() {
  const { transactions, searchTerm, setSearchTerm, deleteTransactions } = 
    useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  return (
    <>
      <ListarTransacoes 
        transactions={transactions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        deleteTransactions={deleteTransactions}
        editTransactions={(id) => {
          const tx = transactions.find(t => t.id === id);
          setSelectedTransaction(tx);
        }}
      />

      {selectedTransaction && (
        <ModalEditarTransacao
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onSave={(updated) => {
            // Atualizar em localStorage
            console.log('Atualizado:', updated);
          }}
        />
      )}
    </>
  );
}

// Dentro do componente:
return (
  <div>
    {/* Search */}
    <input 
      type="text" 
      placeholder="Pesquisar"
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    {/* Tabela */}
    <table className="table app-table-hover">
      <thead>
        <tr>
          <th>Data</th>
          <th>Tipo</th>
          <th>Descrição</th>
          <th>Valor</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{formatDate(tx.date)}</td>
            <td>
              <span className={`badge bg-${getTypeBadge(tx.type).color}`}>
                {getTypeBadge(tx.type).label}
              </span>
            </td>
            <td>{tx.description}</td>
            <td>{formatCurrency(tx.value)}</td>
            <td>
              <button onClick={() => editTransactions(tx.id)}>
                Editar
              </button>
              <button onClick={() => deleteTransactions(tx.id)}>
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
```

---

## ModalEditarTransacao - Exemplo de Uso

```tsx
// Propósito: Modal para editar transações
interface ModalEditarTransacaoProps {
  transaction: Transaction | null;
  onSave: (updated: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export function ModalEditarTransacao({ 
  transaction, 
  onSave, 
  onClose 
}: ModalEditarTransacaoProps) {
  const [formData, setFormData] = useState({
    type: 'transferencia',
    value: 0,
    date: '',
    description: '',
    status: 'Concluída',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        value: transaction.value,
        date: transaction.date,
        description: transaction.description,
        status: transaction.status,
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!transaction) return null; // Não renderiza se sem transaction

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Editar Transação</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Campos do formulário */}
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="deposito">Depósito</option>
                <option value="transferencia">Transferência</option>
                <option value="saque">Saque</option>
              </select>

              <input type="number" name="value" value={formData.value} 
                onChange={handleChange} />

              <input type="date" name="date" value={formData.date} 
                onChange={handleChange} />

              <textarea name="description" value={formData.description}
                onChange={handleChange} />

              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Concluída</option>
                <option>Pendente</option>
                <option>Cancelada</option>
              </select>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" 
                onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## ResumoTransacao - Exemplo de Uso

```tsx
// Em uma página
export default function PaginaResumoTransacao() {
  return (
    <ResumoTransacao user={{ name: 'João', email: 'joao@email.com' }} />
  );
}

// Dentro do componente:
export default function ResumoTransacao({ user }: ResumoTransacaoProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  useEffect(() => {
    // Carregar de localStorage
    const saved = localStorage.getItem('transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    }
  }, []);

  const { monthlyData } = useMemo(() => {
    const filtered = transactions.filter(t => {
      const transDate = new Date(t.date).toISOString().slice(0, 7);
      return transDate === selectedMonth;
    });

    const stats = {
      deposits: 0,
      transfers: 0,
      withdrawals: 0,
    };

    filtered.forEach(t => {
      if (t.type === 'deposito') stats.deposits += t.value;
      else if (t.type === 'transferencia') stats.transfers += t.value;
      else if (t.type === 'saque') stats.withdrawals += t.value;
    });

    return { monthlyData: stats };
  }, [transactions, selectedMonth]);

  return (
    <div>
      <h1>Resumo - {selectedMonth}</h1>

      {/* Filtro por mês */}
      <input 
        type="month" 
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />

      {/* Cards */}
      <CardsResumo transactions={transactions} />

      {/* Poderia ter mais conteúdo aqui */}
    </div>
  );
}
```

---

## Layout Autenticado - Exemplo de Uso

```tsx
// app/(autenticado)/layout.tsx
import AppHeader from "@/componentes/app-header/AppHeader";
import MenuLateral from "@/componentes/menu-lateral/MenuLateral";
import Rodape from "@/componentes/rodape/Rodape";

export default function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      {/* Header fixo no topo */}
      <AppHeader />

      {/* Sidepanel à esquerda (fixed) */}
      <div id="app-sidepanel" className="app-sidepanel">
        <MenuLateral />
      </div>

      {/* Content principal */}
      <div className="app-wrapper">
        <div className="app-content">
          <div className="container-xl">
            <main>
              {children}
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <div className="container text-center">
            <Rodape />
          </div>
        </footer>
      </div>
    </div>
  );
}
```

---

## AuthProvider - Exemplo de Uso

```tsx
// app/provedores/AuthProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  const login = async (email: string, password: string) => {
    // Simulado - poderia fazer uma chamada à API real
    setUser({
      name: email.split('@')[0],
      email,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}

// Uso em qualquer componente:
const { user, logout } = useAuth();
```

---

## useTransactions Hook - Exemplo de Uso

```tsx
// hooks/useTransactions/index.tsx
import { useState, useEffect } from 'react';

export interface Transaction {
  id: number;
  type: 'deposito' | 'transferencia' | 'saque';
  description: string;
  value: number;
  date: string;
  status: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/transactions.json')
      .then(res => res.json())
      .then(data => {
        const lista = data.transactions || data.transacoes || [];
        setTransactions(lista);
      })
      .catch(err => {
        console.error("Erro ao carregar:", err);
        setTransactions([]);
      });
  }, []);

  const deleteTransactions = (id: number) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const editTransactions = (id: number) => {
    console.log("Editar ID:", id);
  };

  const filteredTransactions = transactions.filter(tx =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    setSearchTerm,
    transactions: filteredTransactions,
    editTransactions,
    deleteTransactions,
  };
}

// Uso em uma página:
export default function MinhaPage() {
  const { transactions, searchTerm, setSearchTerm } = useTransactions();

  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
      />
      
      {/* Renderizar transactions filtradas */}
    </div>
  );
}
```

---

## Formatação de Dados - Helpers

```tsx
// Moeda (BRL)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Data (DD/MM/YYYY)
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Hora (12h format)
const formatTime12h = (dateStr: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(dateStr));
};

// Tipo com badge
const getTypeBadge = (type: string) => {
  const types: { [key: string]: { color: string; label: string } } = {
    deposito: { color: 'success', label: 'Depósito' },
    transferencia: { color: 'info', label: 'Transferência' },
    saque: { color: 'warning', label: 'Saque' },
  };
  return types[type] || types.transferencia;
};
```

---

## Estilos - Classes Importantes

```scss
// Layout
.app { /* Main container */ }
.app-header { /* Header fixo */ }
.app-sidepanel { /* Sidebar fixo */ }
.app-wrapper { /* Content wrapper */ }
.app-content { /* Content container */ }
.app-footer { /* Footer */ }

// Navegação
.app-nav { /* Nav container */ }
.app-menu { /* Menu list */ }
.nav-item { /* Menu item */ }
.nav-link { /* Menu link */ }
.nav-link.active { /* Active link */ }

// Cards
.app-card { /* Card genérico */ }
.app-card-stat { /* Card de estatísticas */ }
.app-card-header { /* Card header */ }
.app-card-body { /* Card body */ }

// Tabela
.table { /* Table */ }
.app-table-hover { /* Hover effect */ }

// Badges
.badge { /* Badge genérico */ }
.bg-success { /* Verde */ }
.bg-info { /* Azul */ }
.bg-warning { /* Laranja */ }
.bg-danger { /* Vermelho */ }

// Botões
.btn { /* Button base */ }
.btn-primary { /* Button primary */ }
.btn-secondary { /* Button secondary */ }
.app-btn-secondary { /* Custom button */ }

// Formulário
.form-label { /* Label */ }
.form-control { /* Input */ }
.form-select { /* Select */ }
```
