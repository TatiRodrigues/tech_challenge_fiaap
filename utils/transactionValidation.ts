/**
 * Validações avançadas para transações
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Categorias sugeridas por tipo de transação
export const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  saque: [
    'Saque em Caixa Eletrônico',
    'Levantamento Agência',
    'Saque por Transação',
  ],
  deposito: [
    'Salário',
    'Freelancer',
    'Venda de Produto',
    'Devolução/Reembolso',
    'Juros',
    'Presente',
  ],
  transferencia: [
    'Aluguel',
    'Fatura de Cartão',
    'Empréstimo',
    'Pagamento Pessoa Física',
    'Compra Online',
    'Boleto',
  ],
};

// Limites de transação (em centavos)
export const TRANSACTION_LIMITS = {
  MIN_VALUE: 100, // R$1,00
  MAX_VALUE: 100000000, // R$1.000.000,00
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
};

export function validateTransaction(data: {
  type: string;
  value: string;
  date: string;
  description: string;
  origin?: string;
  destination?: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Validar tipo
  if (!['saque', 'deposito', 'transferencia'].includes(data.type)) {
    errors.push({
      field: 'type',
      message: 'Tipo de transação inválido',
    });
  }

  // Validar valor
  const value = parseInt(data.value, 10) || 0;
  if (value < TRANSACTION_LIMITS.MIN_VALUE) {
    errors.push({
      field: 'value',
      message: `Valor mínimo é R$ ${(TRANSACTION_LIMITS.MIN_VALUE / 100).toFixed(2)}`,
    });
  }
  if (value > TRANSACTION_LIMITS.MAX_VALUE) {
    errors.push({
      field: 'value',
      message: `Valor máximo é R$ ${(TRANSACTION_LIMITS.MAX_VALUE / 100).toFixed(2)}`,
    });
  }

  // Validar data
  if (!data.date) {
    errors.push({
      field: 'date',
      message: 'Data é obrigatória',
    });
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Máximo 30 dias no futuro

    if (selectedDate > maxDate) {
      errors.push({
        field: 'date',
        message: 'Data não pode ser mais de 30 dias no futuro',
      });
    }
  }

  // Validar descrição
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Descrição é obrigatória',
    });
  } else if (data.description.length > TRANSACTION_LIMITS.MAX_DESCRIPTION_LENGTH) {
    errors.push({
      field: 'description',
      message: `Descrição não pode exceder ${TRANSACTION_LIMITS.MAX_DESCRIPTION_LENGTH} caracteres`,
    });
  }

  // Validar origem/destino para transferência
  if (data.type === 'transferencia') {
    if (!data.origin || data.origin.trim().length === 0) {
      errors.push({
        field: 'origin',
        message: 'Origem é obrigatória para transferências',
      });
    }
    if (!data.destination || data.destination.trim().length === 0) {
      errors.push({
        field: 'destination',
        message: 'Destino é obrigatório para transferências',
      });
    }

    // Validar se origem e destino são diferentes
    if (data.origin && data.destination && data.origin === data.destination) {
      errors.push({
        field: 'destination',
        message: 'Origem e destino não podem ser iguais',
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFile(file: File): ValidationError | null {
  if (!file) {
    return {
      field: 'file',
      message: 'Arquivo é obrigatório',
    };
  }

  if (file.size > TRANSACTION_LIMITS.MAX_FILE_SIZE) {
    return {
      field: 'file',
      message: `Arquivo não pode exceder ${(TRANSACTION_LIMITS.MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`,
    };
  }

  if (!TRANSACTION_LIMITS.ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      field: 'file',
      message: 'Tipo de arquivo não permitido. Use PDF, imagens ou planilhas.',
    };
  }

  return null;
}

export function getFileNameWithoutExtension(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, '');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
