'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
}

interface ModalEditarTransacaoProps {
  transaction: Transaction | null;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export function ModalEditarTransacao({ transaction, onSave, onClose }: ModalEditarTransacaoProps) {
  const [formData, setFormData] = useState<{
    type: string;
    value: number;
    date: string;
    description: string;
    status: string;
  }>({
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

  const formatCurrencyInput = (value: string | number): string => {
    // Converter para string se for número
    const strValue = typeof value === 'number' ? value.toString() : value;
    
    // Remove tudo que não é número
    const numericValue = strValue.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para trabalhar com centavos
    const numberValue = parseInt(numericValue, 10) / 100;
    
    // Retorna o valor formatado em Real Brasileiro
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDisplayValue = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara de dinheiro apenas para o campo de valor
    let finalValue: any = value;
    if (name === 'value') {
      // Remove formatação e converte para número
      const numericValue = value.replace(/\D/g, '');
      finalValue = parseInt(numericValue, 10) / 100 || 0;
    } else if (name !== 'value' && typeof value === 'string') {
      finalValue = value;
    }
    
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  const handleValueBlur = () => {
    // Formatar o valor quando o usuário sai do campo
    setFormData({
      ...formData,
      value: formData.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!transaction) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Transação</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="deposito">Depósito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="saque">Saque</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Valor</label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="value"
                  value={formatDisplayValue(formData.value)}
                  onChange={handleChange}
                  onBlur={handleValueBlur}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Data</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Concluída">Concluída</option>
                  <option value="Pendente">Pendente</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-check-circle me-2"></i>
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}