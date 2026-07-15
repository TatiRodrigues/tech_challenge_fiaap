'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  validateTransaction,
  CATEGORY_SUGGESTIONS,
  ValidationError,
} from '@/utils/transactionValidation';
import { FileUpload } from '../file-upload/FileUpload';
import { MicrofrontendBus, MFEEvents } from '@/config/microfrontend-advanced';

interface IAttachment {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
}

interface Transaction {
  id: string;
  type: 'deposito' | 'transferencia' | 'saque';
  value: number;
  date: string;
  description: string;
  origin?: string;
  destination?: string;
  attachments?: IAttachment[];
  createdAt: string;
  status: string;
}

export default function FormularioTransacao() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [attachments, setAttachments] = useState<IAttachment[]>([]);

  const [formData, setFormData] = useState({
    type: 'deposito',
    value: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    origin: '',
    destination: '',
  });

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

    // Clear validation errors for this field when user starts typing
    setValidationErrors((prev) =>
      prev.filter((err) => err.field !== name)
    );

    // Apply currency mask only for value field
    let finalValue = value;
    if (name === 'value') {
      const numericValue = value.replace(/\D/g, '');
      finalValue = numericValue;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Show suggestions when typing description
    if (name === 'description') {
      setShowSuggestions(value.length > 0);
    }
  };

  const handleAttachmentsSelected = (files: IAttachment[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors([]);
    setIsLoading(true);

    try {
      // Validate with advanced function
      const validation = validateTransaction({
        type: formData.type,
        value: formData.value,
        date: formData.date,
        description: formData.description,
        origin: formData.origin,
        destination: formData.destination,
      });

      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setError('Por favor, corrija os erros no formulário');
        setIsLoading(false);
        return;
      }

      // Fetch existing transactions
      const existing = localStorage.getItem('transactions');
      const transactions: Transaction[] = existing ? JSON.parse(existing) : [];

      // Create new transaction
      const now = new Date();
      const [year, month, day] = formData.date.split('-');
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
      );

      const numericValue = parseInt(formData.value, 10) / 100;

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: formData.type as 'deposito' | 'transferencia' | 'saque',
        value: numericValue,
        date: date.toISOString(),
        description: formData.description,
        origin: formData.origin || undefined,
        destination: formData.destination || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        createdAt: new Date().toISOString(),
        status: 'Concluído',
      };

      // Salvar transação
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      // Emitir evento para outros microfrontends via MFE Bus
      MicrofrontendBus.getInstance().emit({
        source: 'alecrim_wallet_transactions',
        target: 'broadcast',
        type: MFEEvents.TRANSACTION_CREATED,
        payload: { id: newTransaction.id, type: newTransaction.type, value: newTransaction.value },
        timestamp: Date.now(),
      });

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
              {/* Error Alert */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError('')}
                    aria-label="Fechar"
                  ></button>
                </div>
              )}

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Erros na validação:</strong>
                  <ul className="mb-0 mt-2">
                    {validationErrors.map((err, idx) => (
                      <li key={idx}>{err.message}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setValidationErrors([])}
                    aria-label="Fechar"
                  ></button>
                </div>
              )}

              {/* Success Alert */}
              {success && (
                <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  {success}
                </div>
              )}

              {/* Type */}
              <div className="mb-4">
                <label htmlFor="type" className="form-label fw-500">
                  <i className="bi bi-tag me-2"></i>
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
                  <option value="deposito">📥 Depósito</option>
                  <option value="transferencia">💸 Transferência</option>
                  <option value="saque">💰 Saque</option>
                </select>
              </div>

              {/* Value */}
              <div className="mb-4">
                <label htmlFor="value" className="form-label fw-500">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Valor <span className="text-danger">*</span>
                </label>
                <input
                  id="value"
                  type="text"
                  inputMode="decimal"
                  name="value"
                  className={`form-control ${
                    validationErrors.some((e) => e.field === 'value') ? 'is-invalid' : ''
                  }`}
                  placeholder="R$ 0,00"
                  value={formatDisplayValue(formData.value)}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <small className="text-muted d-block mt-1">
                  Mín: R$ 1,00 | Máx: R$ 1.000.000,00
                </small>
              </div>

              {/* Date */}
              <div className="mb-4">
                <label htmlFor="date" className="form-label fw-500">
                  <i className="bi bi-calendar-event me-2"></i>
                  Data <span className="text-danger">*</span>
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  className={`form-control ${
                    validationErrors.some((e) => e.field === 'date') ? 'is-invalid' : ''
                  }`}
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <small className="text-muted d-block mt-1">
                  Máximo 30 dias no futuro
                </small>
              </div>

              {/* Origin/Destination for Transfers */}
              {formData.type === 'transferencia' && (
                <>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                      <label htmlFor="origin" className="form-label fw-500">
                        <i className="bi bi-arrow-left-circle me-2"></i>
                        Origem (Conta/CPF/Email) <span className="text-danger">*</span>
                      </label>
                      <input
                        id="origin"
                        type="text"
                        name="origin"
                        className={`form-control ${
                          validationErrors.some((e) => e.field === 'origin')
                            ? 'is-invalid'
                            : ''
                        }`}
                        placeholder="Ex: 123.456.789-00"
                        value={formData.origin}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                      <label htmlFor="destination" className="form-label fw-500">
                        <i className="bi bi-arrow-right-circle me-2"></i>
                        Destino (Conta/CPF/Email) <span className="text-danger">*</span>
                      </label>
                      <input
                        id="destination"
                        type="text"
                        name="destination"
                        className={`form-control ${
                          validationErrors.some((e) => e.field === 'destination')
                            ? 'is-invalid'
                            : ''
                        }`}
                        placeholder="Ex: 987.654.321-00"
                        value={formData.destination}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Description with Suggestions */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-500">
                  <i className="bi bi-pencil me-2"></i>
                  Descrição <span className="text-danger">*</span>
                </label>

                {/* Suggestions */}
                {showSuggestions && CATEGORY_SUGGESTIONS[formData.type].length > 0 && (
                  <div className="list-group mb-3" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    <p className="small text-muted ps-3 pt-2 mb-1">Sugestões:</p>
                    {CATEGORY_SUGGESTIONS[formData.type].map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="list-group-item list-group-item-action text-start py-2"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            description: suggestion,
                          }));
                          setShowSuggestions(false);
                        }}
                        disabled={isLoading}
                      >
                        <i className="bi bi-check-circle-fill text-success me-2" style={{ opacity: 0.5 }}></i>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                <textarea
                  id="description"
                  name="description"
                  className={`form-control ${
                    validationErrors.some((e) => e.field === 'description')
                      ? 'is-invalid'
                      : ''
                  }`}
                  rows={4}
                  placeholder="Descreva esta transação..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength={500}
                  required
                ></textarea>
                <small className="text-muted d-block mt-1">
                  {formData.description.length}/500 caracteres
                </small>
              </div>

              {/* File Upload */}
              <div className="mb-4">
                <label className="form-label fw-500">
                  <i className="bi bi-file-earmark-arrow-up me-2"></i>
                  Anexar Recibos/Documentos
                </label>
                <FileUpload
                  onFilesSelected={handleAttachmentsSelected}
                  attachments={attachments}
                  onRemoveAttachment={handleRemoveAttachment}
                  maxFiles={5}
                  maxFileSize={10 * 1024 * 1024}
                />
              </div>

              {/* Attachments List */}
              {attachments.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-500 mb-3">
                    <i className="bi bi-paperclip me-2"></i>
                    Documentos Anexados ({attachments.length})
                  </h6>
                  <div className="list-group">
                    {attachments.map((att) => (
                      <div
                        key={att.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div className="d-flex align-items-center flex-grow-1">
                          <i className="bi bi-file-text me-2 text-primary"></i>
                          <div>
                            <p className="mb-0 text-break">{att.nome}</p>
                            <small className="text-muted">{att.tamanho} bytes</small>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleRemoveAttachment(att.id)}
                          disabled={isLoading}
                          title="Remover documento"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
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
                <i className="bi bi-shield-check text-info me-2"></i>
                Validação Avançada
              </h6>
              <p className="text-muted small">
                Seus dados são validados automaticamente com limites de segurança.
              </p>
            </div>

            <hr />

            <div>
              <h6 className="mb-2">
                <i className="bi bi-file-earmark-check text-primary me-2"></i>
                Documentos
              </h6>
              <p className="text-muted small">
                Anexe recibos ou comprovantes junto à transação para manter um histórico completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
