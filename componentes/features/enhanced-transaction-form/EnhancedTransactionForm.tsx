'use client';

import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addTransaction, updateTransaction, Transaction } from '@/store/slices/transactionsSlice';
import { validateTransactionForm, IValidationError, getAllCategories } from '@/utils/validationUtils';
import CategorySuggestions from '../category-suggestions/CategorySuggestions';
import FileUpload, { IAttachment } from '../file-upload/FileUpload';

interface TransactionFormProps {
  transactionId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EnhancedTransactionForm: React.FC<TransactionFormProps> = ({
  transactionId,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const allTransactions = useSelector((state: RootState) => state.transactions.items);
  const selectedTransaction = transactionId ? allTransactions.find((t: Transaction) => t.id === transactionId) : null;

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [successMessage, setSuccessMessage] = useState('');
  const [attachments, setAttachments] = useState<IAttachment[]>(selectedTransaction?.anexos || []);

  const [formData, setFormData] = useState({
    tipo: selectedTransaction?.tipo || 'despesa',
    valor: selectedTransaction?.valor?.toString() || '',
    descricao: selectedTransaction?.descricao || '',
    categoria: selectedTransaction?.categoria || '',
    data: selectedTransaction?.data?.split('T')[0] || new Date().toISOString().split('T')[0],
  });

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    const newErrors = new Map(errors);
    newErrors.delete(field);
    setErrors(newErrors);
  }, [errors]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers and decimals
    const numericValue = value.replace(/[^\d.]/g, '');
    handleInputChange('valor', numericValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange('descricao', e.target.value);
  };

  const handleFilesSelected = (files: IAttachment[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    const newErrors = new Map<string, string>();

    // Validate form
    const validationErrors = validateTransactionForm({
      tipo: formData.tipo,
      valor: formData.valor,
      descricao: formData.descricao,
      categoria: formData.categoria,
      data: formData.data,
    });

    if (validationErrors.length > 0) {
      validationErrors.forEach((error: IValidationError) => {
        newErrors.set(error.field, error.message);
      });
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const valor = parseFloat(formData.valor);
      const now = new Date();

      const isoDate = new Date(`${formData.data}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`).toISOString();
      const attachmentData = attachments.map((a) => ({
        id: a.id,
        nome: a.nome,
        url: a.url,
        tipo: a.tipo,
        tamanho: a.tamanho,
        dataCriacao: new Date().toISOString(),
      }));

      if (selectedTransaction) {
        // Update existing transaction
        const updatedTransaction: Transaction = {
          ...selectedTransaction,
          id: selectedTransaction.id,
          type: formData.tipo,
          value: valor,
          date: isoDate,
          tipo: formData.tipo as 'receita' | 'despesa',
          valor,
          descricao: formData.descricao,
          categoria: formData.categoria,
          data: isoDate,
          status: selectedTransaction.status || 'concluida',
          usuarioId: selectedTransaction.usuarioId || 'current-user',
          dataCriacao: selectedTransaction.dataCriacao || new Date().toISOString(),
          anexos: attachmentData,
        };
        dispatch(updateTransaction(updatedTransaction));
        setSuccessMessage('Transação atualizada com sucesso!');
      } else {
        // Create new transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          type: formData.tipo,
          value: valor,
          date: isoDate,
          tipo: formData.tipo as 'receita' | 'despesa',
          valor,
          descricao: formData.descricao,
          categoria: formData.categoria,
          data: isoDate,
          status: 'concluida',
          usuarioId: 'current-user',
          dataCriacao: new Date().toISOString(),
          anexos: attachmentData,
        };
        dispatch(addTransaction(newTransaction));
        setSuccessMessage('Transação criada com sucesso!');
        setFormData({
          tipo: 'despesa',
          valor: '',
          descricao: '',
          categoria: '',
          data: new Date().toISOString().split('T')[0],
        });
        setAttachments([]);
      }

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      newErrors.set('submit', 'Erro ao salvar transação. Tente novamente.');
      setErrors(newErrors);
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="enhanced-transaction-form">
      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage('')}
            aria-label="Fechar"
          ></button>
        </div>
      )}

      {/* Submit Error */}
      {errors.has('submit') && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="fas fa-exclamation-circle me-2"></i>
          {errors.get('submit')}
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              const newErrors = new Map(errors);
              newErrors.delete('submit');
              setErrors(newErrors);
            }}
            aria-label="Fechar"
          ></button>
        </div>
      )}

      <div className="row g-4">
        {/* Type */}
        <div className="col-md-6">
          <label htmlFor="tipo" className="form-label fw-600">
            Tipo de Transação *
          </label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="tipo"
              id="tipo-receita"
              value="receita"
              checked={formData.tipo === 'receita'}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="tipo-receita">
              <i className="fas fa-arrow-down me-2"></i>
              Receita
            </label>

            <input
              type="radio"
              className="btn-check"
              name="tipo"
              id="tipo-despesa"
              value="despesa"
              checked={formData.tipo === 'despesa'}
              onChange={(e) => handleInputChange('tipo', e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="tipo-despesa">
              <i className="fas fa-arrow-up me-2"></i>
              Despesa
            </label>
          </div>
          {errors.has('tipo') && (
            <div className="invalid-feedback d-block mt-2">{errors.get('tipo')}</div>
          )}
        </div>

        {/* Value */}
        <div className="col-md-6">
          <label htmlFor="valor" className="form-label fw-600">
            Valor *
          </label>
          <div className="input-group">
            <span className="input-group-text">R$</span>
            <input
              type="text"
              id="valor"
              className={`form-control ${errors.has('valor') ? 'is-invalid' : ''}`}
              placeholder="0,00"
              value={formData.valor}
              onChange={handleValueChange}
              inputMode="decimal"
            />
          </div>
          {errors.has('valor') && (
            <div className="invalid-feedback d-block mt-2">{errors.get('valor')}</div>
          )}
        </div>

        {/* Date */}
        <div className="col-md-6">
          <label htmlFor="data" className="form-label fw-600">
            Data *
          </label>
          <input
            type="date"
            id="data"
            className={`form-control ${errors.has('data') ? 'is-invalid' : ''}`}
            value={formData.data}
            onChange={(e) => handleInputChange('data', e.target.value)}
          />
          {errors.has('data') && (
            <div className="invalid-feedback d-block mt-2">{errors.get('data')}</div>
          )}
        </div>

        {/* Category */}
        <div className="col-md-6">
          <label htmlFor="categoria" className="form-label fw-600">
            Categoria *
          </label>
          <select
            id="categoria"
            className={`form-select ${errors.has('categoria') ? 'is-invalid' : ''}`}
            value={formData.categoria}
            onChange={(e) => handleInputChange('categoria', e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {getAllCategories().map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.has('categoria') && (
            <div className="invalid-feedback d-block mt-2">{errors.get('categoria')}</div>
          )}
        </div>

        {/* Description */}
        <div className="col-12">
          <label htmlFor="descricao" className="form-label fw-600">
            Descrição *
          </label>
          <textarea
            id="descricao"
            className={`form-control ${errors.has('descricao') ? 'is-invalid' : ''}`}
            placeholder="Digite a descrição da transação..."
            value={formData.descricao}
            onChange={handleDescriptionChange}
            rows={3}
            maxLength={500}
          />
          <small className="text-muted">
            {formData.descricao.length}/500 caracteres
          </small>
          {errors.has('descricao') && (
            <div className="invalid-feedback d-block mt-2">{errors.get('descricao')}</div>
          )}

          {/* Category Suggestions */}
          <CategorySuggestions
            description={formData.descricao}
            selectedCategory={formData.categoria}
            onCategorySelect={(category) => handleInputChange('categoria', category)}
          />
        </div>

        {/* File Upload */}
        <div className="col-12">
          <label className="form-label fw-600 mb-3">
            <i className="fas fa-paperclip me-2"></i>
            Anexos (Recibos e Documentos)
          </label>
          <FileUpload
            onFilesSelected={handleFilesSelected}
            attachments={attachments}
            onRemoveAttachment={handleRemoveAttachment}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-4 d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Salvando...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              {selectedTransaction ? 'Atualizar' : 'Criar'} Transação
            </>
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            <i className="fas fa-times me-2"></i>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default EnhancedTransactionForm;
