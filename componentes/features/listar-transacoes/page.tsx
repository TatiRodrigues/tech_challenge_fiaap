'use client';
import { Transaction } from '@/hooks/useTransactions';

interface ListarTransacoesProps {
  transactions: Transaction[];
  deleteTransactions: (id: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ListarTransacoes: React.FC<ListarTransacoesProps> = ({ transactions, deleteTransactions,
  setSearchTerm }) => {

  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchTerm(event.target.value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime12h = (dateStr: string): string => {
    const date = new Date(dateStr);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const getTypeBadge = (type: string) => {
    const types: { [key: string]: { color: string; label: string } } = {
      deposito: { color: 'success', label: 'Depósito' },
      transferencia: { color: 'info', label: 'Transferência' },
      saque: { color: 'warning', label: 'Saque' },
    };
    return types[type] || types.transferencia;
  };

  return (
    <div className="container-xl">
      <div className="row g-3 mb-4 align-items-center justify-content-between">
        <div className="col-auto">
          <h1 className="app-page-title mb-0">Minhas transações</h1>
        </div>

        <div className="col-auto">
          <div className="page-utilities">
            <div className="row g-2 justify-content-start justify-content-md-end align-items-center">
              <div className="col-auto">
                <form className="table-search-form row gx-1 align-items-center" onSubmit={(e) => e.preventDefault()}>
                  <div className="col-auto">
                    <input type="text" className="form-control search-orders" placeholder="Pesquisar" onChange={handleSearch}/>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content" id="orders-table-tab-content">
        <div className="tab-pane fade show active" id="orders-all" role="tabpanel" aria-labelledby="orders-all-tab">
          <div className="app-card app-card-orders-table shadow-sm mb-5">
            <div className="app-card-body">
              <div className="table-responsive">
                <table className="table app-table-hover mb-0 text-left">
                  <thead>
                    <tr>
                      <th className="cell">Data da transação</th>
                      <th className="cell">Transação</th>
                      <th className="cell">Descição</th>
                      <th className="cell">Valor</th>
                      <th className="cell">Status</th>
                      <th className="cell">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="cell">
                            Nenhuma transação encontrada.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((transaction) => {
                          return (
                            <tr key={transaction.id}>
                              <td className="cell">
                                <span>{formatDate(transaction.date)}</span>
                                <span className="note">{formatTime12h(transaction.date)}</span>
                              </td>
                              <td className="cell">
                                <span className={`badge bg-${getTypeBadge(transaction.type).color}`}>
                                  {getTypeBadge(transaction.type).label}
                                </span>
                              </td>
                              <td className="cell">{transaction.description}</td>
                              <td className="cell">{formatCurrency(transaction.value)}</td>
                              <td className="cell">{transaction.status}</td>
                              <td className="cell">
                                <a className="btn-sm app-btn-secondary me-2">Editar</a>
                                <a className="btn-sm app-btn-secondary" onClick={() => deleteTransactions(transaction.id)}>Excluir</a>
                              </td>
                            </tr>
                          );
                        })
                      )
                    }
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListarTransacoes;