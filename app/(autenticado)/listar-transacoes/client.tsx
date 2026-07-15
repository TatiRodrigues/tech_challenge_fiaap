'use client';

import { useAppSelector } from '@/store/hooks';
import CardsResumo from '@/componentes/features/cards-resumo/page';
import { ModalEditarTransacao } from '@/componentes/features/modal-editar-transacao';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Pagination from '@/componentes/features/pagination/Pagination';
import type { IPaginationState } from '@/utils/filterUtils';
import { validateTransaction, CATEGORY_SUGGESTIONS } from '@/utils/transactionValidation';
import { FileUpload } from '@/componentes/features/file-upload/FileUpload';

interface IAttachment {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
}

interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
  attachments?: IAttachment[];
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

export default function ListarTransacoesClient() {
  const { user } = useAppSelector((state) => state.auth);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [newTransaction, setNewTransaction] = useState({
    type: 'deposito',
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [modalAttachments, setModalAttachments] = useState<IAttachment[]>([]);
  const [modalErrors, setModalErrors] = useState<{ [key: string]: string }>({});
  const [showDescSuggestions, setShowDescSuggestions] = useState(false);

  // Refs para focus management nos modais
  const novaTransacaoModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const resetModal = () => {
    setNewTransaction({ type: 'deposito', value: '', date: new Date().toISOString().split('T')[0], description: '' });
    setModalAttachments([]);
    setModalErrors({});
    setShowDescSuggestions(false);
  };

  // ── Fechar qualquer modal aberto com ESC ────────────────────────────────────
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    if (showModal) { setShowModal(false); resetModal(); }
    else if (showEditModal) { setShowEditModal(false); setSelectedTransaction(null); }
    else if (showDeleteConfirmModal) { setShowDeleteConfirmModal(false); setTransactionToDelete(null); }
  }, [showModal, showEditModal, showDeleteConfirmModal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Focar o modal ao abrir
  useEffect(() => {
    if (showModal) novaTransacaoModalRef.current?.focus();
  }, [showModal]);
  useEffect(() => {
    if (showDeleteConfirmModal) deleteModalRef.current?.focus();
  }, [showDeleteConfirmModal]);

  // Carregar transações ao iniciar
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const savedTransactions = localStorage.getItem('transactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          try {
            const res = await fetch('/transactions.json', { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            const txs = data.transactions || [];
            setTransactions(txs);
            localStorage.setItem('transactions', JSON.stringify(txs));
          } catch {
            clearTimeout(timeoutId);
            setTransactions([]);
          }
        }
      } catch {
        setTransactions([]);
      }
      setIsLoading(false);
    };
    loadTransactions();
  }, []);

  // Filtrar e ordenar transações
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (filters.searchTerm)
      result = result.filter(t => t.description.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    if (filters.type) result = result.filter(t => t.type === filters.type);
    if (filters.status) result = result.filter(t => t.status === filters.status);
    if (filters.dateFrom) result = result.filter(t => new Date(t.date) >= new Date(filters.dateFrom));
    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= endDate);
    }
    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (filters.sortBy === 'value') cmp = a.value - b.value;
      else cmp = a.type.localeCompare(b.type);
      return filters.sortOrder === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [transactions, filters]);

  useEffect(() => { setCurrentPage(1); }, [filters]);

  const filteredStats = useMemo(() => {
    const deposits = filteredTransactions.filter(t => t.type === 'deposito' && t.status === 'Concluído').reduce((s, t) => s + t.value, 0);
    const transfers = filteredTransactions.filter(t => t.type === 'transferencia' && t.status === 'Concluído').reduce((s, t) => s + t.value, 0);
    const withdrawals = filteredTransactions.filter(t => t.type === 'saque' && t.status === 'Concluído').reduce((s, t) => s + t.value, 0);
    return { deposits, transfers, withdrawals, total: deposits - transfers - withdrawals };
  }, [filteredTransactions]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const paginationState: IPaginationState = {
    currentPage,
    pageSize,
    totalItems: filteredTransactions.length,
    totalPages: Math.ceil(filteredTransactions.length / pageSize) || 1,
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTransaction({
      type: newTransaction.type,
      value: newTransaction.value,
      date: newTransaction.date,
      description: newTransaction.description,
    });
    if (!validation.isValid) {
      const errorMap: { [key: string]: string } = {};
      validation.errors.forEach(err => { errorMap[err.field] = err.message; });
      setModalErrors(errorMap);
      return;
    }
    setModalErrors({});
    const numericValue = (parseInt(newTransaction.value, 10) || 0) / 100;
    const [year, month, day] = newTransaction.date.split('-');
    const now = new Date();
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds());
    const transaction: Transaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      date: date.toISOString(),
      type: newTransaction.type,
      description: newTransaction.description,
      value: numericValue,
      status: 'Concluído',
      attachments: modalAttachments.length > 0 ? modalAttachments : undefined,
    };
    const updated = [...transactions, transaction];
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    setShowModal(false);
    resetModal();
  };

  const editTransactions = (id: number) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) { setSelectedTransaction(transaction); setShowEditModal(true); }
  };

  const handleSaveEdit = (updatedData: Omit<Transaction, 'id'>) => {
    if (!selectedTransaction) return;
    const updated = transactions.map(t => t.id === selectedTransaction.id ? { ...t, ...updatedData } : t);
    setTransactions(updated);
    localStorage.setItem('transactions', JSON.stringify(updated));
    setShowEditModal(false);
    setSelectedTransaction(null);
  };

  const deleteTransactions = (id: number) => { setTransactionToDelete(id); setShowDeleteConfirmModal(true); };

  const confirmDelete = () => {
    if (transactionToDelete !== null) {
      const updated = transactions.filter(t => t.id !== transactionToDelete);
      setTransactions(updated);
      localStorage.setItem('transactions', JSON.stringify(updated));
      setShowDeleteConfirmModal(false);
      setTransactionToDelete(null);
    }
  };

  const clearFilters = () => setFilters({ searchTerm: '', type: '', status: '', dateFrom: '', dateTo: '', sortBy: 'date', sortOrder: 'desc' });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const formatDisplayValue = (value: string): string => {
    if (!value) return '';
    const numericValue = (parseInt(value, 10) || 0) / 100;
    if (numericValue === 0) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numericValue);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR');
  const formatTime12h = (dateStr: string) => {
    const d = new Date(dateStr);
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h % 12 || 12}:${m < 10 ? '0' + m : m} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { color: string; label: string }> = {
      deposito: { color: 'success', label: 'Depósito' },
      transferencia: { color: 'info', label: 'Transferência' },
      saque: { color: 'warning', label: 'Saque' },
    };
    return types[type] || types.transferencia;
  };

  const hasActiveFilters = () => filters.searchTerm || filters.type || filters.status || filters.dateFrom || filters.dateTo;

  if (!user || isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{isLoading ? 'Carregando transações...' : 'Carregando...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl pt-4">
      <CardsResumo transactions={transactions} />

      <div className="row g-3 mb-4 align-items-center justify-content-between">
        <div className="col-auto">
          <h1 className="app-page-title mb-0">Minhas Transações</h1>
        </div>
        <div className="col-auto">
          <button
            type="button"
            className="btn btn-success btn-lg"
            onClick={() => setShowModal(true)}
            aria-haspopup="dialog"
          >
            <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
            Nova Transação
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Filtros */}
        <div className="col-12 col-lg-3">
          <div className="app-card shadow-sm" role="search" aria-label="Filtros de transações">
            <div className="app-card-header p-4 border-bottom">
              <h2 className="app-card-title mb-0 h5">
                <i className="bi bi-funnel me-2" aria-hidden="true"></i>Filtros
              </h2>
            </div>
            <div className="app-card-body p-4">
              <div className="mb-4">
                <label htmlFor="search" className="form-label fw-500">Pesquisar</label>
                <input id="search" type="search" className="form-control" placeholder="Descrição..."
                  value={filters.searchTerm} aria-label="Buscar por descrição"
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })} />
              </div>
              <div className="mb-4">
                <label htmlFor="filterType" className="form-label fw-500">Tipo</label>
                <select id="filterType" className="form-select" value={filters.type}
                  aria-label="Filtrar por tipo de transação"
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="deposito">Depósito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="saque">Saque</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="filterStatus" className="form-label fw-500">Status</label>
                <select id="filterStatus" className="form-select" value={filters.status}
                  aria-label="Filtrar por status"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <hr />
              <div className="mb-4">
                <label htmlFor="dateFrom" className="form-label fw-500">Data Inicial</label>
                <input id="dateFrom" type="date" className="form-control" value={filters.dateFrom}
                  aria-label="Filtrar data inicial"
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
              </div>
              <div className="mb-4">
                <label htmlFor="dateTo" className="form-label fw-500">Data Final</label>
                <input id="dateTo" type="date" className="form-control" value={filters.dateTo}
                  aria-label="Filtrar data final"
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
              </div>
              <hr />
              <div className="mb-4">
                <label htmlFor="sortBy" className="form-label fw-500">Ordenar por</label>
                <select id="sortBy" className="form-select" value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'date' | 'value' | 'type' })}>
                  <option value="date">Data</option>
                  <option value="value">Valor</option>
                  <option value="type">Tipo</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="sortOrder" className="form-label fw-500">Ordem</label>
                <select id="sortOrder" className="form-select" value={filters.sortOrder}
                  onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}>
                  <option value="desc">Decrescente</option>
                  <option value="asc">Crescente</option>
                </select>
              </div>
              {hasActiveFilters() && (
                <button className="btn btn-outline-secondary w-100 mb-3" onClick={clearFilters}
                  aria-label="Limpar todos os filtros ativos">
                  <i className="bi bi-x-circle me-2" aria-hidden="true"></i>Limpar Filtros
                </button>
              )}
              <hr />
              <div className="mt-4" aria-live="polite" aria-label="Resumo financeiro dos resultados filtrados">
                <h3 className="mb-3 h6">
                  <i className="bi bi-bar-chart me-2" aria-hidden="true"></i>Resumo Filtrado
                </h3>
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
                  <i className="bi bi-info-circle me-1" aria-hidden="true"></i>
                  {filteredTransactions.length} transação(ões)
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="col-12 col-lg-9">
          <div className="app-card shadow-sm">
            <div className="app-card-header p-4 border-bottom d-flex justify-content-between align-items-center">
              <h2 className="app-card-title mb-0 h5">
                <i className="bi bi-list-ul me-2" aria-hidden="true"></i>
                Resultado ({filteredTransactions.length})
              </h2>
              <div className="btn-group" role="group" aria-label="Alternar modo de visualização">
                <button type="button"
                  className={`btn btn-sm ${viewMode === 'table' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')} aria-label="Visualizar como tabela"
                  aria-pressed={viewMode === 'table'}>
                  <i className="bi bi-table" aria-hidden="true"></i>
                </button>
                <button type="button"
                  className={`btn btn-sm ${viewMode === 'cards' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('cards')} aria-label="Visualizar como cards"
                  aria-pressed={viewMode === 'cards'}>
                  <i className="bi bi-credit-card" aria-hidden="true"></i>
                </button>
              </div>
            </div>

            <div className="app-card-body p-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-5" role="status">
                  <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }} aria-hidden="true"></i>
                  <p className="text-muted mt-3">
                    {hasActiveFilters() ? 'Nenhuma transação encontrada com esses filtros.' : 'Nenhuma transação encontrada.'}
                  </p>
                </div>
              ) : viewMode === 'table' ? (
                <div className="table-responsive">
                  <table className="table app-table-hover mb-0 text-left" aria-label="Lista de transações">
                    <thead>
                      <tr>
                        <th scope="col" className="cell">Data</th>
                        <th scope="col" className="cell">Tipo</th>
                        <th scope="col" className="cell">Descrição</th>
                        <th scope="col" className="cell">Valor</th>
                        <th scope="col" className="cell">Status</th>
                        <th scope="col" className="cell">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => {
                        const badge = getTypeBadge(transaction.type);
                        return (
                          <tr key={transaction.id}>
                            <td className="cell">
                              <span>{formatDate(transaction.date)}</span><br />
                              <span className="text-muted small">{formatTime12h(transaction.date)}</span>
                            </td>
                            <td className="cell">
                              <span className={`badge bg-${badge.color}`}>{badge.label}</span>
                            </td>
                            <td className="cell"><span>{transaction.description}</span></td>
                            <td className="cell">
                              <span className={transaction.type === 'saque' || transaction.type === 'transferencia' ? 'text-danger' : 'text-success'}>
                                {transaction.type === 'saque' || transaction.type === 'transferencia' ? '-' : '+'} {formatCurrency(transaction.value)}
                              </span>
                            </td>
                            <td className="cell">
                              <span className={`badge ${transaction.status === 'Concluído' ? 'bg-success' : transaction.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="cell">
                              <div className="btn-group" role="group" aria-label={`Ações para ${transaction.description}`}>
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                  onClick={() => editTransactions(transaction.id)}
                                  aria-label={`Editar transação: ${transaction.description}`}>
                                  <i className="bi bi-pencil" aria-hidden="true"></i>
                                </button>
                                <button type="button" className="btn btn-sm btn-outline-danger"
                                  onClick={() => deleteTransactions(transaction.id)}
                                  aria-label={`Deletar transação: ${transaction.description}`}>
                                  <i className="bi bi-trash" aria-hidden="true"></i>
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
                <div className="row g-3">
                  {paginatedTransactions.map((transaction) => {
                    const badge = getTypeBadge(transaction.type);
                    return (
                      <div key={transaction.id} className="col-12 col-md-6">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className={`badge bg-${badge.color}`}>{badge.label}</span>
                              <span className={`badge ${transaction.status === 'Concluído' ? 'bg-success' : transaction.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}`}>
                                {transaction.status}
                              </span>
                            </div>
                            <h3 className="h6 card-title mb-1">{transaction.description}</h3>
                            <small className="text-muted d-block mb-3">
                              <time dateTime={transaction.date}>{formatDate(transaction.date)}</time> às {formatTime12h(transaction.date)}
                            </small>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <span className="text-muted">Valor:</span>
                              <span className={`h5 mb-0 ${transaction.type === 'saque' || transaction.type === 'transferencia' ? 'text-danger' : 'text-success'}`}>
                                {transaction.type === 'saque' || transaction.type === 'transferencia' ? '-' : '+'} {formatCurrency(transaction.value)}
                              </span>
                            </div>
                            <div className="d-flex gap-2">
                              <button type="button" className="btn btn-sm btn-outline-secondary flex-grow-1"
                                onClick={() => editTransactions(transaction.id)}
                                aria-label={`Editar: ${transaction.description}`}>
                                <i className="bi bi-pencil me-1" aria-hidden="true"></i>Editar
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger flex-grow-1"
                                onClick={() => deleteTransactions(transaction.id)}
                                aria-label={`Deletar: ${transaction.description}`}>
                                <i className="bi bi-trash me-1" aria-hidden="true"></i>Deletar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredTransactions.length > 0 && (
                <Pagination
                  pagination={paginationState}
                  onPageChange={(page) => setCurrentPage(page)}
                  onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal: Nova Transação ─────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-nova-titulo"
          onClick={(e) => { if (e.target === e.currentTarget) { setShowModal(false); resetModal(); } }}
          ref={novaTransacaoModalRef}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5" id="modal-nova-titulo">
                  <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>Nova Transação
                </h2>
                <button type="button" className="btn-close" aria-label="Fechar modal Nova Transação"
                  onClick={() => { setShowModal(false); resetModal(); }}></button>
              </div>
              <form onSubmit={handleAddTransaction}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="modal-tipo" className="form-label fw-500">
                        Tipo de transação <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <select id="modal-tipo" className={`form-select ${modalErrors.type ? 'is-invalid' : ''}`}
                        value={newTransaction.type}
                        onChange={(e) => { setNewTransaction({ ...newTransaction, type: e.target.value }); setShowDescSuggestions(false); }}>
                        <option value="deposito">📥 Depósito</option>
                        <option value="transferencia">💸 Transferência</option>
                        <option value="saque">💰 Saque</option>
                      </select>
                      {modalErrors.type && <div className="invalid-feedback" role="alert">{modalErrors.type}</div>}
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="modal-valor" className="form-label fw-500">
                        Valor <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text" aria-hidden="true">R$</span>
                        <input id="modal-valor" type="text" inputMode="decimal"
                          className={`form-control ${modalErrors.value ? 'is-invalid' : ''}`}
                          placeholder="0,00" aria-label="Valor em reais"
                          value={formatDisplayValue(newTransaction.value)}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            setNewTransaction({ ...newTransaction, value: numericValue });
                            const newErrs = { ...modalErrors }; delete newErrs.value; setModalErrors(newErrs);
                          }} />
                        {modalErrors.value && <div className="invalid-feedback" role="alert">{modalErrors.value}</div>}
                      </div>
                      <small className="text-muted">Mín: R$ 1,00 | Máx: R$ 1.000.000,00</small>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="modal-data" className="form-label fw-500">
                        Data <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      <input id="modal-data" type="date"
                        className={`form-control ${modalErrors.date ? 'is-invalid' : ''}`}
                        value={newTransaction.date}
                        onChange={(e) => {
                          setNewTransaction({ ...newTransaction, date: e.target.value });
                          const newErrs = { ...modalErrors }; delete newErrs.date; setModalErrors(newErrs);
                        }} />
                      {modalErrors.date && <div className="invalid-feedback" role="alert">{modalErrors.date}</div>}
                      <small className="text-muted">Máximo 30 dias no futuro</small>
                    </div>
                    <div className="col-12">
                      <label htmlFor="modal-descricao" className="form-label fw-500">
                        Descrição <span className="text-danger" aria-hidden="true">*</span>
                      </label>
                      {showDescSuggestions && CATEGORY_SUGGESTIONS[newTransaction.type]?.length > 0 && (
                        <div className="list-group mb-2" style={{ maxHeight: '100px', overflowY: 'auto' }}
                          role="listbox" aria-label="Sugestões de descrição">
                          <p className="small text-muted ps-2 pt-2 mb-1">
                            <i className="bi bi-lightbulb me-1" aria-hidden="true"></i>Sugestões:
                          </p>
                          {CATEGORY_SUGGESTIONS[newTransaction.type].map((suggestion, idx) => (
                            <button key={idx} type="button" role="option"
                              className="list-group-item list-group-item-action py-1 text-start"
                              onClick={() => { setNewTransaction({ ...newTransaction, description: suggestion }); setShowDescSuggestions(false); }}>
                              <i className="bi bi-check-circle-fill text-success me-2" style={{ opacity: 0.5 }} aria-hidden="true"></i>
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                      <textarea id="modal-descricao" rows={3} placeholder="Descreva esta transação..."
                        className={`form-control ${modalErrors.description ? 'is-invalid' : ''}`}
                        value={newTransaction.description} maxLength={500}
                        aria-describedby="modal-descricao-count"
                        onChange={(e) => {
                          setNewTransaction({ ...newTransaction, description: e.target.value });
                          setShowDescSuggestions(e.target.value.length > 0);
                          const newErrs = { ...modalErrors }; delete newErrs.description; setModalErrors(newErrs);
                        }} />
                      <small id="modal-descricao-count" className="text-muted">
                        {newTransaction.description.length}/500 caracteres
                      </small>
                      {modalErrors.description && <div className="invalid-feedback d-block" role="alert">{modalErrors.description}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-500">
                        <i className="bi bi-paperclip me-2" aria-hidden="true"></i>Anexar Recibos/Documentos
                      </label>
                      <FileUpload
                        onFilesSelected={(files) => setModalAttachments(prev => [...prev, ...files])}
                        attachments={modalAttachments}
                        onRemoveAttachment={(id) => setModalAttachments(prev => prev.filter(a => a.id !== id))}
                        maxFiles={5} maxFileSize={10 * 1024 * 1024} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                    onClick={() => { setShowModal(false); resetModal(); }}>Cancelar</button>
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-check-circle me-2" aria-hidden="true"></i>Adicionar Transação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Editar Transação ───────────────────────────────────────────── */}
      {showEditModal && (
        <ModalEditarTransacao
          transaction={selectedTransaction}
          onSave={handleSaveEdit}
          onClose={() => { setShowEditModal(false); setSelectedTransaction(null); }}
        />
      )}

      {/* ── Modal: Confirmar Deleção ──────────────────────────────────────────── */}
      {showDeleteConfirmModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,.5)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-delete-titulo"
          aria-describedby="modal-delete-body"
          onClick={(e) => {
            if (e.target === e.currentTarget) { setShowDeleteConfirmModal(false); setTransactionToDelete(null); }
          }}
          ref={deleteModalRef}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5" id="modal-delete-titulo">
                  <i className="bi bi-exclamation-triangle text-danger me-2" aria-hidden="true"></i>
                  Deletar Transação
                </h2>
                <button type="button" className="btn-close" aria-label="Fechar modal de confirmação"
                  onClick={() => { setShowDeleteConfirmModal(false); setTransactionToDelete(null); }}></button>
              </div>
              <div className="modal-body" id="modal-delete-body">
                <p>Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={() => { setShowDeleteConfirmModal(false); setTransactionToDelete(null); }}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}
                  aria-label="Confirmar exclusão da transação">
                  <i className="bi bi-trash me-2" aria-hidden="true"></i>Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
