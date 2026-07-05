'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Transaction } from '@/store/slices/transactionsSlice';
import {
  setFilters,
  clearFilters,
  setPage,
  setPageSize,
  setSort,
} from '@/store/slices/transactionsSlice';
import { IFilterOptions } from '@/utils/filterUtils';
import AdvancedFilters from '../advanced-filters/AdvancedFilters';
import Pagination from '../pagination/Pagination';

interface EnhancedListarTransacoesProps {
  onEditTransaction?: (id: string) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const EnhancedListarTransacoes: React.FC<EnhancedListarTransacoesProps> = ({
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const dispatch = useDispatch();
  const {
    paginatedItems,
    filteredItems,
    pagination,
    filters,
    sort,
    isLoading,
  } = useSelector((state: RootState) => state.transactions);

  const handleFilterChange = (newFilters: IFilterOptions) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handlePageSizeChange = (pageSize: number) => {
    dispatch(setPageSize(pageSize));
  };

  const handleSortChange = (field: 'data' | 'valor' | 'descricao', order?: 'asc' | 'desc') => {
    dispatch(
      setSort({
        field,
        order: order || (sort.order === 'desc' ? 'asc' : 'desc'),
      })
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pendente: 'warning',
      concluida: 'success',
      cancelada: 'danger',
    };
    const color = statusMap[status] || 'secondary';
    const labels: { [key: string]: string } = {
      pendente: 'Pendente',
      concluida: 'Concluída',
      cancelada: 'Cancelada',
    };
    return (
      <span className={`badge bg-${color}`}>{labels[status] || status}</span>
    );
  };

  const getCategoryLabel = (categoria: string) => {
    const labels: { [key: string]: string } = {
      alimentacao: 'Alimentação',
      transporte: 'Transporte',
      saude: 'Saúde',
      educacao: 'Educação',
      entretenimento: 'Entretenimento',
      utilidades: 'Utilidades',
      investimento: 'Investimento',
      outro: 'Outro',
    };
    return labels[categoria] || categoria;
  };

  const getTipoBadge = (tipo: string) => {
    return (
      <span className={`badge ${tipo === 'receita' ? 'bg-success' : 'bg-danger'}`}>
        {tipo === 'receita' ? '↓ Receita' : '↑ Despesa'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-lista-transacoes">
      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <div className="row mb-4 align-items-center">
        <div className="col-auto">
          <h5 className="mb-0">
            {filteredItems.length} transação(ões) encontrada(s)
          </h5>
        </div>
      </div>

      {/* Table */}
      {paginatedItems.length === 0 ? (
        <div className="alert alert-info text-center py-5">
          <i className="fas fa-inbox fa-3x mb-3 d-block text-muted"></i>
          <p className="mb-0">
            Nenhuma transação encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <>
          <div className="app-card shadow-sm mb-4">
            <div className="app-card-body">
              <div className="table-responsive">
                <table className="table app-table-hover mb-0 text-left">
                  <thead>
                    <tr>
                      <th className="cell cursor-pointer" onClick={() => handleSortChange('data')}>
                        <div className="d-flex align-items-center gap-2">
                          Data
                          {sort.field === 'data' && (
                            <i className={`fas fa-sort-${sort.order === 'asc' ? 'up' : 'down'}`}></i>
                          )}
                        </div>
                      </th>
                      <th className="cell">Tipo</th>
                      <th className="cell">Descrição</th>
                      <th className="cell">Categoria</th>
                      <th className="cell cursor-pointer" onClick={() => handleSortChange('valor')}>
                        <div className="d-flex align-items-center gap-2">
                          Valor
                          {sort.field === 'valor' && (
                            <i className={`fas fa-sort-${sort.order === 'asc' ? 'up' : 'down'}`}></i>
                          )}
                        </div>
                      </th>
                      <th className="cell">Status</th>
                      <th className="cell">Anexos</th>
                      <th className="cell">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((transaction: Transaction) => (
                      <tr key={transaction.id}>
                        <td className="cell">{formatDate(transaction.data)}</td>
                        <td className="cell">{getTipoBadge(transaction.tipo)}</td>
                        <td className="cell">
                          <div className="text-truncate" title={transaction.descricao}>
                            {transaction.descricao}
                          </div>
                        </td>
                        <td className="cell">
                          <span className="badge bg-light text-dark">
                            {getCategoryLabel(transaction.categoria)}
                          </span>
                        </td>
                        <td className="cell">
                          <strong className={transaction.tipo === 'receita' ? 'text-success' : 'text-danger'}>
                            {transaction.tipo === 'receita' ? '+' : '-'}
                            {formatCurrency(transaction.valor)}
                          </strong>
                        </td>
                        <td className="cell">{getStatusBadge(transaction.status)}</td>
                        <td className="cell">
                          {transaction.anexos && transaction.anexos.length > 0 ? (
                            <span className="badge bg-info">
                              <i className="fas fa-paperclip me-1"></i>
                              {transaction.anexos.length}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="cell">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => onEditTransaction?.(transaction.id)}
                              title="Editar"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => onDeleteTransaction?.(transaction.id)}
                              title="Deletar"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
};

export default EnhancedListarTransacoes;
