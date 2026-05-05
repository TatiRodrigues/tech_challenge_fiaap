'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  type: 'deposito' | 'transferencia' | 'saque';
  value: number;
  date: string;
  description: string;
  createdAt: string;
  status: string;
}

export default function FormularioTransacao() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    type: 'deposito',
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    // Converte para número e divide por 100 para trabalhar com centavos
    const numberValue = parseInt(numericValue, 10) / 100;
    
    // Formata como moeda em Real Brasileiro
    return isNaN(numberValue) ? '' : numberValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDisplayValue = (value: string): string => {
    if (!value) return '';
    const numericValue = (parseInt(value, 10) || 0) / 100;
    if (numericValue === 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Aplicar máscara de dinheiro apenas para o campo de valor
    let finalValue = value;
    if (name === 'value') {
      // Remove formatação anterior e armazena apenas o número
      const numericValue = value.replace(/\D/g, '');
      finalValue = numericValue;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validar campos
      if (!formData.type || !formData.value || !formData.date || !formData.description) {
        setError('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      const numericValue = parseInt(formData.value, 10) || 0;
      const valueNum = numericValue / 100;
      if (isNaN(valueNum) || valueNum <= 0) {
        setError('Valor deve ser um número positivo');
        setIsLoading(false);
        return;
      }

      // Buscar transações existentes
      const existing = localStorage.getItem('transactions');
      const transactions: Transaction[] = existing ? JSON.parse(existing) : [];

      // Criar nova transação
      const now = new Date();
      const [year, month, day] = formData.date.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds());
      
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: formData.type as 'deposito' | 'transferencia' | 'saque',
        value: valueNum,
        date: date.toISOString(),
        description: formData.description,
        createdAt: new Date().toISOString(),
        status: 'Concluído',
      };

      // Salvar com as existentes
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setSuccess('Transação criada com sucesso! Redirecionando...');
      
      setTimeout(() => {
        router.push('/resumo-transacao');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar transação. Tente novamente.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row g-4 mb-4">
      <div className="col-12 col-lg-8">
        <div className="app-card shadow-sm">
          <div className="app-card-header p-4 border-bottom">
            <h1 className="app-card-title mb-0">
              <i className="bi bi-plus-circle me-2"></i>
              Nova Transação
            </h1>
          </div>

          <div className="app-card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Type */}
              <div className="mb-4">
                <label htmlFor="type" className="form-label fw-500">
                  Tipo de Transação
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                >
                  <option value="deposito">Depósito</option>
                  <option value="transferencia">Transferência</option>
                  <option value="saque">Saque</option>
                </select>
              </div>

              {/* Value */}
              <div className="mb-4">
                <label htmlFor="value" className="form-label fw-500">
                  Valor
                </label>
                <input
                  id="value"
                  type="text"
                  inputMode="decimal"
                  name="value"
                  className="form-control"
                  placeholder="0,00"
                  value={formatDisplayValue(formData.value)}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="date" className="form-label fw-500">
                  Data
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-500">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows={4}
                  placeholder="Descreva esta transação..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                ></textarea>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isLoading}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {isLoading ? 'Salvando...' : 'Salvar Transação'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="col-12 col-lg-4">
        <div className="app-card shadow-sm">
          <div className="app-card-header p-4 border-bottom">
            <h5 className="app-card-title mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Informações
            </h5>
          </div>

          <div className="app-card-body p-4">
            <div className="mb-3">
              <h6 className="mb-2">
                <i className="bi bi-arrow-down-circle text-success me-2"></i>
                Depósito
              </h6>
              <p className="text-muted small">
                Transferência de dinheiro para sua conta.
              </p>
            </div>

            <hr />

            <div className="mb-3">
              <h6 className="mb-2">
                <i className="bi bi-arrow-left-right text-info me-2"></i>
                Transferência
              </h6>
              <p className="text-muted small">
                Movimento de dinheiro entre contas.
              </p>
            </div>

            <hr />

            <div className="mb-3">
              <h6 className="mb-2">
                <i className="bi bi-arrow-up-circle text-danger me-2"></i>
                Saque
              </h6>
              <p className="text-muted small">
                Retirada de dinheiro da sua conta.
              </p>
            </div>

            <hr />

            <div>
              <h6 className="mb-2">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Dica
              </h6>
              <p className="text-muted small">
                Mantenha descrições claras e detalhadas para facilitar o controle de suas finanças.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}