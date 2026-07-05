'use client';

import React, { useState } from 'react';
import { IFilterOptions } from '@/utils/filterUtils';
import { getAllCategories } from '@/utils/validationUtils';

interface AdvancedFiltersProps {
  filters: IFilterOptions;
  onFilterChange: (filters: IFilterOptions) => void;
  onClearFilters: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTipoChange = (tipo: 'receita' | 'despesa' | undefined) => {
    onFilterChange({
      ...filters,
      tipo: tipo === filters.tipo ? undefined : tipo,
    });
  };

  const handleCategoriaChange = (categoria: string) => {
    onFilterChange({
      ...filters,
      categoria: categoria === filters.categoria ? undefined : categoria,
    });
  };

  const handleStatusChange = (status: 'pendente' | 'concluida' | 'cancelada' | undefined) => {
    onFilterChange({
      ...filters,
      status: status === filters.status ? undefined : status,
    });
  };

  const handleDataInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      dataInicio: e.target.value || undefined,
    });
  };

  const handleDataFimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      dataFim: e.target.value || undefined,
    });
  };

  const handleValorMinimoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value ? parseFloat(e.target.value) : undefined;
    onFilterChange({
      ...filters,
      valorMinimo: valor,
    });
  };

  const handleValorMaximoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value ? parseFloat(e.target.value) : undefined;
    onFilterChange({
      ...filters,
      valorMaximo: valor,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value || undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined);

  return (
    <div className="app-filters mb-4">
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <h5 className="mb-0">Filtros Avançados</h5>
            <div className="d-flex align-items-center gap-2">
              {hasActiveFilters && (
                <span className="badge bg-primary">{Object.values(filters).filter((v) => v !== undefined).length}</span>
              )}
              <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
            </div>
          </div>

          {isExpanded && (
            <>
              <hr className="my-3" />

              <div className="row g-3">
                {/* Busca */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Buscar</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Descrição ou categoria..."
                    value={filters.searchTerm || ''}
                    onChange={handleSearchChange}
                    aria-label="Buscar transações"
                  />
                </div>

                {/* Tipo */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Tipo</label>
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="tipo-receita"
                      id="tipo-receita"
                      checked={filters.tipo === 'receita'}
                      onChange={() => handleTipoChange('receita')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="tipo-receita">
                      Receita
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="tipo-despesa"
                      id="tipo-despesa"
                      checked={filters.tipo === 'despesa'}
                      onChange={() => handleTipoChange('despesa')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="tipo-despesa">
                      Despesa
                    </label>
                  </div>
                </div>

                {/* Categoria */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Categoria</label>
                  <select
                    className="form-select"
                    value={filters.categoria || ''}
                    onChange={(e) => handleCategoriaChange(e.target.value)}
                    aria-label="Filtrar por categoria"
                  >
                    <option value="">Todas as categorias</option>
                    {getAllCategories().map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={filters.status || ''}
                    onChange={(e) =>
                      handleStatusChange(e.target.value as 'pendente' | 'concluida' | 'cancelada' | undefined)
                    }
                    aria-label="Filtrar por status"
                  >
                    <option value="">Todos os status</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                {/* Data Início */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Data Início</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.dataInicio || ''}
                    onChange={handleDataInicioChange}
                    aria-label="Filtrar data de início"
                  />
                </div>

                {/* Data Fim */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Data Fim</label>
                  <input
                    type="date"
                    className="form-control"
                    value={filters.dataFim || ''}
                    onChange={handleDataFimChange}
                    aria-label="Filtrar data de fim"
                  />
                </div>

                {/* Valor Mínimo */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Valor Mínimo</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0,00"
                    value={filters.valorMinimo || ''}
                    onChange={handleValorMinimoChange}
                    min="0"
                    step="0.01"
                    aria-label="Filtrar valor mínimo"
                  />
                </div>

                {/* Valor Máximo */}
                <div className="col-md-6 col-lg-3">
                  <label className="form-label">Valor Máximo</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0,00"
                    value={filters.valorMaximo || ''}
                    onChange={handleValorMaximoChange}
                    min="0"
                    step="0.01"
                    aria-label="Filtrar valor máximo"
                  />
                </div>
              </div>

              <div className="mt-3 d-flex gap-2">
                {hasActiveFilters && (
                  <button className="btn btn-secondary btn-sm" onClick={onClearFilters}>
                    <i className="fas fa-times me-2"></i>
                    Limpar Filtros
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
