/**
 * Advanced validation and suggestion utilities for transaction forms
 */

export type CategoriaTransacao =
  | "alimentacao"
  | "transporte"
  | "saude"
  | "educacao"
  | "entretenimento"
  | "utilidades"
  | "investimento"
  | "outro";

export interface IValidationError {
  field: string;
  message: string;
}

export interface ISuggestion {
  categoria: CategoriaTransacao;
  confianca: number; // 0-1
}

// Mapa de palavras-chave para categorias
const CATEGORIA_KEYWORDS: { [key in CategoriaTransacao]: string[] } = {
  alimentacao: [
    "restaurante",
    "lanchonete",
    "supermercado",
    "comida",
    "pizza",
    "hambúrguer",
    "padaria",
    "café",
    "açougue",
    "peixaria",
    "açúcar",
    "leite",
    "pão",
    "arroz",
  ],
  transporte: [
    "uber",
    "taxi",
    "ônibus",
    "combustível",
    "gasolina",
    "estacionamento",
    "passagem",
    "tarifa",
    "metrô",
    "trem",
    "vibração",
    "carro",
    "moto",
  ],
  saude: [
    "farmácia",
    "médico",
    "hospital",
    "consulta",
    "medicamento",
    "dentista",
    "oftalmologista",
    "academia",
    "ginásio",
    "fisioterapia",
    "vacinação",
    "exame",
  ],
  educacao: [
    "escola",
    "faculdade",
    "universidade",
    "curso",
    "aula",
    "livro",
    "material escolar",
    "mensalidade",
    "tutor",
    "professor",
    "educação",
    "apostila",
  ],
  entretenimento: [
    "cinema",
    "teatro",
    "show",
    "jogo",
    "streaming",
    "netflix",
    "spotify",
    "diversão",
    "passeio",
    "viagem",
    "turismo",
    "ingressos",
  ],
  utilidades: [
    "energia",
    "água",
    "internet",
    "telefone",
    "condomínio",
    "aluguel",
    "conta",
    "conta de luz",
    "conta de água",
    "gás",
    "telefonia",
  ],
  investimento: [
    "ações",
    "criptomoeda",
    "imóvel",
    "fundo",
    "poupança",
    "tesouro",
    "investimento",
    "renda fixa",
    "renda variável",
  ],
  outro: [],
};

/**
 * Validate transaction form data
 */
export const validateTransactionForm = (data: {
  tipo?: string;
  valor?: number | string;
  descricao?: string;
  categoria?: string;
  data?: string;
}): IValidationError[] => {
  const errors: IValidationError[] = [];

  // Validate tipo
  if (!data.tipo) {
    errors.push({
      field: "tipo",
      message: "Tipo de transação é obrigatório",
    });
  } else if (!["receita", "despesa"].includes(data.tipo)) {
    errors.push({
      field: "tipo",
      message: "Tipo de transação inválido",
    });
  }

  // Validate valor
  if (!data.valor) {
    errors.push({
      field: "valor",
      message: "Valor é obrigatório",
    });
  } else {
    const valor = typeof data.valor === "string" ? parseFloat(data.valor) : data.valor;
    if (isNaN(valor) || valor <= 0) {
      errors.push({
        field: "valor",
        message: "Valor deve ser um número positivo",
      });
    }
    if (valor > 1000000) {
      errors.push({
        field: "valor",
        message: "Valor não pode exceder R$ 1.000.000,00",
      });
    }
  }

  // Validate descricao
  if (!data.descricao || data.descricao.trim().length === 0) {
    errors.push({
      field: "descricao",
      message: "Descrição é obrigatória",
    });
  } else if (data.descricao.trim().length < 3) {
    errors.push({
      field: "descricao",
      message: "Descrição deve ter no mínimo 3 caracteres",
    });
  } else if (data.descricao.length > 500) {
    errors.push({
      field: "descricao",
      message: "Descrição não pode exceder 500 caracteres",
    });
  }

  // Validate categoria
  if (!data.categoria) {
    errors.push({
      field: "categoria",
      message: "Categoria é obrigatória",
    });
  } else {
    const validCategories = Object.keys(CATEGORIA_KEYWORDS);
    if (!validCategories.includes(data.categoria)) {
      errors.push({
        field: "categoria",
        message: "Categoria inválida",
      });
    }
  }

  // Validate data
  if (!data.data) {
    errors.push({
      field: "data",
      message: "Data é obrigatória",
    });
  } else {
    const date = new Date(data.data);
    if (isNaN(date.getTime())) {
      errors.push({
        field: "data",
        message: "Data inválida",
      });
    } else if (date > new Date()) {
      errors.push({
        field: "data",
        message: "Data não pode ser no futuro",
      });
    }
  }

  return errors;
};

/**
 * Suggest categories based on transaction description
 */
export const suggestCategories = (descricao: string): ISuggestion[] => {
  const descricaoLower = descricao.toLowerCase();
  const suggestions: ISuggestion[] = [];

  Object.entries(CATEGORIA_KEYWORDS).forEach(([categoria, keywords]) => {
    let matches = 0;
    let totalKeywords = keywords.length;

    keywords.forEach((keyword) => {
      if (descricaoLower.includes(keyword)) {
        matches++;
      }
    });

    if (matches > 0) {
      const confianca = totalKeywords > 0 ? matches / totalKeywords : 0;
      suggestions.push({
        categoria: categoria as CategoriaTransacao,
        confianca,
      });
    }
  });

  // Sort by confidence
  suggestions.sort((a, b) => b.confianca - a.confianca);

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

/**
 * Get category label in Portuguese
 */
export const getCategoryLabel = (categoria: CategoriaTransacao): string => {
  const labels: { [key in CategoriaTransacao]: string } = {
    alimentacao: "Alimentação",
    transporte: "Transporte",
    saude: "Saúde",
    educacao: "Educação",
    entretenimento: "Entretenimento",
    utilidades: "Utilidades",
    investimento: "Investimento",
    outro: "Outro",
  };

  return labels[categoria] || categoria;
};

/**
 * Get all available categories
 */
export const getAllCategories = (): { value: CategoriaTransacao; label: string }[] => {
  return Object.keys(CATEGORIA_KEYWORDS).map((categoria) => ({
    value: categoria as CategoriaTransacao,
    label: getCategoryLabel(categoria as CategoriaTransacao),
  }));
};

/**
 * Format currency value for display
 */
export const formatCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue);
};

/**
 * Parse currency input to number
 */
export const parseCurrencyInput = (value: string): number => {
  // Remove formatting characters
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) / 100;
};

/**
 * Format currency input for display while typing
 */
export const formatCurrencyInputDisplay = (value: string): string => {
  // Remove all non-numeric characters
  const numericValue = value.replace(/\D/g, "");

  if (!numericValue) return "";

  // Convert to number and divide by 100
  const numberValue = parseInt(numericValue, 10) / 100;

  return formatCurrency(numberValue);
};
