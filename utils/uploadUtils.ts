/**
 * Utilities for handling file uploads and attachments
 */

export interface IUploadConfig {
  maxFileSize: number; // in bytes
  allowedMimeTypes: string[];
  maxFiles: number;
}

export const DEFAULT_UPLOAD_CONFIG: IUploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  maxFiles: 5,
};

export interface IFileValidationError {
  field: string;
  message: string;
}

/**
 * Validate file before upload
 */
export const validateFile = (
  file: File,
  config: IUploadConfig = DEFAULT_UPLOAD_CONFIG
): IFileValidationError[] => {
  const errors: IFileValidationError[] = [];

  // Validate file size
  if (file.size > config.maxFileSize) {
    errors.push({
      field: "size",
      message: `Arquivo excede o tamanho máximo de ${formatFileSize(config.maxFileSize)}`,
    });
  }

  // Validate file type
  if (!config.allowedMimeTypes.includes(file.type)) {
    errors.push({
      field: "type",
      message: `Tipo de arquivo não permitido. Tipos aceitos: ${getAcceptedFileTypes(config.allowedMimeTypes)}`,
    });
  }

  return errors;
};

/**
 * Validate multiple files
 */
export const validateFiles = (
  files: File[],
  config: IUploadConfig = DEFAULT_UPLOAD_CONFIG
): Map<string, IFileValidationError[]> => {
  const errors = new Map<string, IFileValidationError[]>();

  if (files.length > config.maxFiles) {
    const fileErrors = [
      {
        field: "maxFiles",
        message: `Número máximo de arquivos é ${config.maxFiles}`,
      },
    ];
    files.forEach((file) => {
      errors.set(file.name, fileErrors);
    });
    return errors;
  }

  files.forEach((file) => {
    const fileErrors = validateFile(file, config);
    if (fileErrors.length > 0) {
      errors.set(file.name, fileErrors);
    }
  });

  return errors;
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get human-readable accepted file types
 */
export const getAcceptedFileTypes = (mimeTypes: string[]): string => {
  const typeMap: { [key: string]: string } = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };

  return mimeTypes.map((type) => typeMap[type] || type).join(", ");
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Convert base64 to blob
 */
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64.split(",")[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

/**
 * Get file extension from file name
 */
export const getFileExtension = (fileName: string): string => {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

/**
 * Generate unique file name
 */
export const generateUniqueFileName = (fileName: string): string => {
  const timestamp = Date.now();
  const extension = getFileExtension(fileName);
  const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));
  return `${nameWithoutExtension}-${timestamp}.${extension}`;
};
