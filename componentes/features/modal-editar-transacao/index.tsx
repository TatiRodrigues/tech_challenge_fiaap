'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { validateTransaction, CATEGORY_SUGGESTIONS } from '@/utils/transactionValidation';
import { FileUpload } from '../file-upload/FileUpload';

interface IAttachment {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
}

interface Transaction {
  id: number | string;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
  attachments?: IAttachment[];
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
    status: 'Concluído',
  });
  const [attachments, setAttachments] = useState<IAttachment[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showDescSuggestions, setShowDescSuggestions] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        value: transaction.value,
        date: transaction.date.split('T')[0],
        description: transaction.description,
        status: transaction.status,
      });
      setAttachments(transaction.attachments || []);
      setErrors({});
    }
  }, [transaction]);

  // Focus modal on open
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  // Close on ESC
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const formatDisplayValue = (value: number): string =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let finalValue: string | number = value;
    if (name === 'value') {
      const numericValue = value.replace(/\D/g, '');
      finalValue = parseInt(numericValue, 10) / 100 || 0;
    }
    setFormData({ ...formData, [name]: finalValue });
    const newErrs = { ...errors };
    delete newErrs[name];
    setErrors(newErrs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valueInCents = String(Math.round(formData.value * 100));
    const validation = validateTransaction({ type: formData.type, value: valueInCents, date: formData.date, description: formData.description });
    if (!validation.isValid) {
      const errorMap: { [key: string]: string } = {};
      validation.errors.forEach(err => { errorMap[err.field] = err.message; });
      setErrors(errorMap);
      return;
    }
    const dataFormatada = { ...formData };
    if (typeof formData.date === 'string' && formData.date.length === 10) {
      const now = new Date();
      const [year, month, day] = formData.date.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), now.getHours(), now.getMinutes(), now.getSeconds());
      dataFormatada.date = date.toISOString();
    }
    onSave({ ...dataFormatada, attachments });
    onClose();
  };

  if (!transaction) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-editar-titulo"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="modal-editar-titulo">
              <i className="bi bi-pencil-square me-2" aria-hidden="true"></i>Editar Transação
            </h2>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Fechar modal de edição"></button>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="edit-tipo" className="form-label fw-500">
                    Tipo <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <select id="edit-tipo" name="type" value={formData.type}
                    className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                    onChange={(e) => { handleChange(e); setShowDescSuggestions(false); }}>
                    <option value="deposito">📥 Depósito</option>
                    <option value="transferencia">💸 Transferência</option>
                    <option value="saque">💰 Saque</option>
                  </select>
                  {errors.type && <div className="invalid-feedback" role="alert">{errors.type}</div>}
                </div>

                <div className="col-md-6">
                  <label htmlFor="edit-status" className="form-label fw-500">Status</label>
                  <select id="edit-status" name="status" value={formData.status}
                    className="form-select" onChange={handleChange}>
                    <option value="Concluído">✅ Concluído</option>
                    <option value="Pendente">⏳ Pendente</option>
                    <option value="Cancelada">❌ Cancelada</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="edit-valor" className="form-label fw-500">
                    Valor <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text" aria-hidden="true">R$</span>
                    <input id="edit-valor" type="text" inputMode="decimal" name="value"
                      value={formatDisplayValue(formData.value)} onChange={handleChange}
                      className={`form-control ${errors.value ? 'is-invalid' : ''}`}
                      aria-label="Valor em reais" required />
                    {errors.value && <div className="invalid-feedback" role="alert">{errors.value}</div>}
                  </div>
                  <small className="text-muted">Mín: R$ 1,00 | Máx: R$ 1.000.000,00</small>
                </div>

                <div className="col-md-6">
                  <label htmlFor="edit-data" className="form-label fw-500">
                    Data <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input id="edit-data" type="date" name="date" value={formData.date}
                    onChange={handleChange}
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`} required />
                  {errors.date && <div className="invalid-feedback" role="alert">{errors.date}</div>}
                </div>

                <div className="col-12">
                  <label htmlFor="edit-descricao" className="form-label fw-500">
                    Descrição <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  {showDescSuggestions && CATEGORY_SUGGESTIONS[formData.type]?.length > 0 && (
                    <div className="list-group mb-2" style={{ maxHeight: '100px', overflowY: 'auto' }}
                      role="listbox" aria-label="Sugestões de descrição">
                      <p className="small text-muted ps-2 pt-2 mb-1">
                        <i className="bi bi-lightbulb me-1" aria-hidden="true"></i>Sugestões:
                      </p>
                      {CATEGORY_SUGGESTIONS[formData.type].map((suggestion, idx) => (
                        <button key={idx} type="button" role="option"
                          className="list-group-item list-group-item-action py-1 text-start"
                          onClick={() => { setFormData({ ...formData, description: suggestion }); setShowDescSuggestions(false); }}>
                          <i className="bi bi-check-circle-fill text-success me-2" style={{ opacity: 0.5 }} aria-hidden="true"></i>
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea id="edit-descricao" name="description" value={formData.description} rows={3} maxLength={500}
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    aria-describedby="edit-descricao-count"
                    onChange={(e) => { handleChange(e); setShowDescSuggestions(e.target.value.length > 0); }} />
                  <small id="edit-descricao-count" className="text-muted">
                    {formData.description.length}/500 caracteres
                  </small>
                  {errors.description && <div className="invalid-feedback d-block" role="alert">{errors.description}</div>}
                </div>

                <div className="col-12">
                  <label className="form-label fw-500">
                    <i className="bi bi-paperclip me-2" aria-hidden="true"></i>Anexos (Recibos e Documentos)
                  </label>
                  <FileUpload
                    onFilesSelected={(files) => setAttachments(prev => [...prev, ...files])}
                    attachments={attachments}
                    onRemoveAttachment={(id) => setAttachments(prev => prev.filter(a => a.id !== id))}
                    maxFiles={5} maxFileSize={10 * 1024 * 1024} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-success">
                <i className="bi bi-check-circle me-2" aria-hidden="true"></i>Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}