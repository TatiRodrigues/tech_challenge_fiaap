'use client';

import { useProtectedRoute } from '@/app/hooks/useProtectedRoute';
import CardsResumo from '@/componentes/features/cards-resumo/page';
import { ModalEditarTransacao } from '@/componentes/features/modal-editar-transacao';
import { useState, useEffect, useMemo } from 'react';

interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
}

interface Filters {
  searchTerm: string;
  type: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'value' | 'type';
  sortOrder: 'asc' | 'desc';
}

export default function PaginaListarTransacoes() {
  const { isAuthorized, user } = useProtectedRoute();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [newTransaction, setNewTransaction] = useState({
    type: 'deposito',
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  // Carregar transações ao iniciar
  useEffect(() => {
    if (!isAuthorized) return;

    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      } else {
        const defaultTransactions: Transaction[] = [
          {
            id: 1,
            date: new Date().toISOString(),
            type: 'deposito',
            description: 'Depósito inicial',
            value: 1000,
            status: 'Concluída',
          },
        ];
        setTransactions(defaultTransactions);
        localStorage.setItem('transactions', JSON.stringify(defaultTransactions));
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
      setTransactions([]);
    }
    setIsLoading(false);
  }, [isAuthorized]);

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Aplicar filtros
    if (filters.searchTerm) {
      result = result.filter(t =>
        t.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.type) {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.status) {
      result = result.filter(t => t.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= endDate);
    }

    // Ordenar
    result.sort((a, b) => {
      let compareValue = 0;
      
      if (filters.sortBy === 'date') {
        compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === 'value') {
        compareValue = a.value - b.value;
      } else if (filters.sortBy === 'type') {
        compareValue = a.type.localeCompare(b.type);
      }

      return filters.sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return result;
  }, [transactions, filters]);

  // Calcular estatísticas dos filtrados
  const filteredStats = useMemo(() => {
    const deposits = filteredTransactions
      .filter(t => t.type === 'deposito')
      .reduce((sum, t) => sum + t.value, 0);
    
    const transfers = filteredTransactions
      .filter(t => t.type === 'transferencia')
      .reduce((sum, t) => sum + t.value, 0);
    
    const withdrawals = filteredTransactions
      .filter(t => t.type === 'saque')
      .reduce((sum, t) => sum + t.value, 0);

    return {
      deposits,
      transfers,
      withdrawals,
      total: deposits + transfers - withdrawals,
    };
  }, [filteredTransactions]);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTransaction.value || !newTransaction.description) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    const transaction: Transaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      date: new Date(newTransaction.date).toISOString(),
      type: newTransaction.type,
      description: newTransaction.description,
      value: parseFloat(newTransaction.value),
      status: 'Concluída',
    };

    const updated = [...transactions, transaction];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    
    setShowModal(false);
    setNewTransaction({
      type: 'deposito',
      value: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
  };

  const editTransactions = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = (updatedData: Omit<Transaction, 'id'>) => {
    if (!selectedTransaction) return;

    const updated = transactions.map(t =>
      t.id === selectedTransaction.id
        ? { ...t, ...updatedData }
        : t
    );

    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const deleteTransactions = (id: number) => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      const updated = transactions.filter(t => t.id !== id);
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
    }
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      type: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
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
    return new Intl.DateTimeFormat('pt-BR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const getTypeBadge = (type: string) => {
    const types: { [key: string]: { color: string; label: string } } = {
      deposito: { color: 'success', label: 'Depósito' },
      transferencia: { color: 'info', label: 'Transferência' },
      saque: { color: 'warning', label: 'Saque' },
    };
    return types[type] || types.transferencia;
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.type ||
      filters.status ||
      filters.dateFrom ||
      filters.dateTo
    );
  };

  if (!isAuthorized || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando transações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl pt-4">
      {/* Cards de Resumo Geral */}
      <CardsResumo transactions={transactions} />

      {/* Título e Botão Nova Transação */}
      <div className="row g-3 mb-4 align-items-center justify-content-between">
        <div className="col-auto">
          <h1 className="app-page-title mb-0">Minhas Transações</h1>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nova Transação
          </button>
        </div>
      </div>

      {/* Dashboard com 2 Colunas */}
      <div className="row g-4 mb-4">
        {/* Coluna 1: Filtros */}
        <div className="col-12 col-lg-3">
          <div className="app-card shadow-sm">
            <div className="app-card-header p-4 border-bottom">
              <h5 className="app-card-title mb-0">
                <i className="bi bi-funnel me-2"></i>
                Filtros
              </h5>
            </div>
            <div className="app-card-body p-4">
              {/* Pesquisa */}
              <div className="mb-4">
                <label htmlFor="search" className="form-label fw-500">
                  Pesquisar
                </label>
                <input
                  id="search"
                  type="text"
                  className="form-control"
                  placeholder="Descrição..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                />
              </div>

              {/* Filtro por Tipo */}
              <div className="mb-4">
                <label htmlFor="filterType" className="form-label fw-500">
                  Tipo
                </label>
                <select
                  id="filterType"
                  className="form-select"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="">Todos</option>
                  <option value="deposito">Depósito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="saque">Saque</option>
                </select>
              </div>

              {/* Filtro por Status */}
              <div className="mb-4">
                <label htmlFor="filterStatus" className="form-label fw-500">
                  Status
                </label>
                <select
                  id="filterStatus"
                  className="form-select"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">Todos</option>
                  <option value="Concluída">Concluída</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <hr />

              {/* Filtro por Período */}
              <div className="mb-4">
                <label htmlFor="dateFrom" className="form-label fw-500">
                  Data Inicial
                </label>
                <input
                  id="dateFrom"
                  type="date"
                  className="form-control"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="dateTo" className="form-label fw-500">
                  Data Final
                </label>
                <input
                  id="dateTo"
                  type="date"
                  className="form-control"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>

              <hr />

              {/* Ordenação */}
              <div className="mb-4">
                <label htmlFor="sortBy" className="form-label fw-500">
                  Ordenar por
                </label>
                <select
                  id="sortBy"
                  className="form-select"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'value' | 'type' })}
                >
                  <option value="date">Data</option>
                  <option value="value">Valor</option>
                  <option value="type">Tipo</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="sortOrder" className="form-label fw-500">
                  Ordem
                </label>
                <select
                  id="sortOrder"
                  className="form-select"
                  value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                >
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>

              {/* Botão Limpar Filtros */}
              {hasActiveFilters() && (
                <button
                  className="btn btn-outline-secondary w-100 mb-3"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Limpar Filtros
                </button>
              )}

              <hr />

              {/* Resumo dos Filtrados */}
              <div className="mt-4">
                <h6 className="mb-3">
                  <i className="bi bi-bar-chart me-2"></i>
                  Resumo Filtrado
                </h6>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Depósitos:</small>
                  <strong className="text-success text-end">{formatCurrency(filteredStats.deposits)}</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Transferências:</small>
                  <strong className="text-info text-end">{formatCurrency(filteredStats.transfers)}</strong>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">Saques:</small>
                  <strong className="text-warning text-end">{formatCurrency(filteredStats.withdrawals)}</strong>
                </div>

                <div className="border-top pt-3 d-flex justify-content-between align-items-center">
                  <span className="fw-500">Total:</span>
                  <span className={`h6 mb-0 ${filteredStats.total >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(filteredStats.total)}
                  </span>
                </div>

                <small className="text-muted d-block mt-2 text-center">
                  <i className="bi bi-info-circle me-1"></i>
                  {filteredTransactions.length} transação(ões)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2: Resultados */}
        <div className="col-12 col-lg-9">
          <div className="app-card shadow-sm">
            <div className="app-card-header p-4 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="app-card-title mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Resultado({filteredTransactions.length})
              </h5>
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'table' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')}
                  title="Visualizar como tabela"
                >
                  <i className="bi bi-table"></i>
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'cards' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('cards')}
                  title="Visualizar como cards"
                >
                  <i className="bi bi-credit-card"></i>
                </button>
              </div>
            </div>

            <div className="app-card-body p-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
                  <p className="text-muted mt-3">
                    {hasActiveFilters() ? 'Nenhuma transação encontrada com esses filtros.' : 'Nenhuma transação encontrada.'}
                  </p>
                </div>
              ) : viewMode === 'table' ? (
                // Vista de Tabela
                <div className="table-responsive">
                  <table className="table app-table-hover mb-0 text-left">
                    <thead>
                      <tr>
                        <th className="cell">Data</th>
                        <th className="cell">Tipo</th>
                        <th className="cell">Descrição</th>
                        <th className="cell">Valor</th>
                        <th className="cell">Status</th>
                        <th className="cell">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => {
                        const badge = getTypeBadge(transaction.type);
                        return (
                          <tr key={transaction.id}>
                            <td className="cell">
                              <span>{formatDate(transaction.date)}</span>
                              <br />
                              <span className="text-muted small">{formatTime12h(transaction.date)}</span>
                            </td>
                            <td className="cell">
                              <span className={`badge bg-${badge.color}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="cell">
                              <span>{transaction.description}</span>
                            </td>
                            <td className="cell">
                              <span className={transaction.type === 'saque' ? 'text-danger' : 'text-success'}>
                                {transaction.type === 'saque' ? '-' : '+'} {formatCurrency(transaction.value)}
                              </span>
                            </td>
                            <td className="cell">
                              <span className={`badge ${transaction.status === 'Concluída' ? 'bg-success' : transaction.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="cell">
                              <div className="btn-group" role="group">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => editTransactions(transaction.id)}
                                  title="Editar"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteTransactions(transaction.id)}
                                  title="Deletar"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Vista de Cards
                <div className="row g-3">
                  {filteredTransactions.map((transaction) => {
                    const badge = getTypeBadge(transaction.type);
                    return (
                      <div key={transaction.id} className="col-12 col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <span className={`badge bg-${badge.color}`}>
                                  {badge.label}
                                </span>
                              </div>
                              <span className={`badge ${transaction.status === 'Concluída' ? 'bg-success' : transaction.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}`}>
                                {transaction.status}
                              </span>
                            </div>

                            <h6 className="card-title mb-1">{transaction.description}</h6>
                            <small className="text-muted d-block mb-3">
                              {formatDate(transaction.date)} às {formatTime12h(transaction.date)}
                            </small>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Valor:</span>
                              <span className={`h5 mb-0 ${transaction.type === 'saque' ? 'text-danger' : 'text-success'}`}>
                                {transaction.type === 'saque' ? '-' : '+'} {formatCurrency(transaction.value)}
                              </span>
                            </div>

                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary flex-grow-1"
                                onClick={() => editTransactions(transaction.id)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Editar
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger flex-grow-1"
                                onClick={() => deleteTransactions(transaction.id)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Deletar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Nova Transação */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nova Transação</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddTransaction}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label">
                      Tipo de transação:
                    </label>
                    <select
                      id="tipo"
                      className="form-select"
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                    >
                      <option value="deposito">Depósito</option>
                      <option value="transferencia">Transferência</option>
                      <option value="saque">Saque</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="valor" className="form-label">
                      Valor (R$):
                    </label>
                    <input
                      id="valor"
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      placeholder="0,00"
                      value={newTransaction.value}
                      onChange={(e) => setNewTransaction({ ...newTransaction, value: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="data" className="form-label">
                      Data:
                    </label>
                    <input
                      id="data"
                      type="date"
                      className="form-control"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descricao" className="form-label">
                      Descrição:
                    </label>
                    <textarea
                      id="descricao"
                      className="form-control"
                      rows={3}
                      placeholder="Digite a descrição da transação"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      required
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Adicionar Transação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Transação */}
      {showEditModal && (
        <ModalEditarTransacao
          transaction={selectedTransaction}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
}
