/**
 * Utilitários de Formatação e Conversão
 */

/**
 * Formata números como moeda brasileira
 */
export const formatCurrency = (value: number, locale = "pt-BR"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

/**
 * Formata datas para formato brasileiro
 */
export const formatDate = (date: Date | string, format: "short" | "long" = "short"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = 
    format === "short"
      ? { day: "2-digit", month: "2-digit", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" };

  return new Intl.DateTimeFormat("pt-BR", options).format(dateObj);
};

/**
 * Formata hora
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

/**
 * Formata data e hora juntas
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return `${formatDate(dateObj, "short")} às ${formatTime(dateObj)}`;
};

/**
 * Calcula diferença entre datas em dias
 */
export const getDaysDifference = (from: Date | string, to: Date | string): number => {
  const fromDate = typeof from === "string" ? new Date(from) : from;
  const toDate = typeof to === "string" ? new Date(to) : to;
  const diffTime = toDate.getTime() - fromDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Validação de Email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validação de Senha (força)
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  strength: "weak" | "medium" | "strong";
  requirements: {
    hasMinLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
  };
} => {
  const requirements = {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumbers: /[0-9]/.test(password),
    hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const metCount = Object.values(requirements).filter(Boolean).length;

  return {
    isValid: requirements.hasMinLength && metCount >= 3,
    strength:
      metCount <= 2 ? "weak" : metCount === 3 ? "medium" : "strong",
    requirements,
  };
};

/**
 * Máscara de CPF
 */
export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};

/**
 * Máscara de Telefone
 */
export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .replace(/(\d{4})-(\d)(\d{4})$/, "$1-$2$3")
    .slice(0, 15);
};

/**
 * Máscara de CEP
 */
export const maskCEP = (value: string): string => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

/**
 * Remove espaços em branco extras
 */
export const trimWhitespace = (value: string): string => {
  return value.trim().replace(/\s+/g, " ");
};

/**
 * Converte string para slug
 */
export const toSlug = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Capitaliza primeira letra de cada palavra
 */
export const toTitleCase = (value: string): string => {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

/**
 * Comparação de strings case-insensitive
 */
export const compareStrings = (a: string, b: string): boolean => {
  return a.toLowerCase() === b.toLowerCase();
};

/**
 * Busca fuzzy em array de strings
 */
export const fuzzySearch = (query: string, items: string[]): string[] => {
  const queryLower = query.toLowerCase();
  return items.filter((item) =>
    item.toLowerCase().includes(queryLower)
  );
};

/**
 * Gera string aleatória
 */
export const generateRandomString = (length: number = 12): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Gera UUID v4
 */
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Debounce para funções
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle para funções
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Retry para promises
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retry(fn, retries - 1, delay);
  }
};

/**
 * Deep clone de objetos
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T;
  if (obj instanceof Object) {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Merge de objetos deep
 */
export const deepMerge = <T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T => {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
};
