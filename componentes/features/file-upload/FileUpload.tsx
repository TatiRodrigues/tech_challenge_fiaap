'use client';

import React, { useRef, useState } from 'react';
import { validateFiles, formatFileSize, IFileValidationError, DEFAULT_UPLOAD_CONFIG } from '@/utils/uploadUtils';

export interface IAttachment {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
}

interface FileUploadProps {
  onFilesSelected: (files: IAttachment[]) => void;
  attachments?: IAttachment[];
  onRemoveAttachment?: (id: string) => void;
  maxFiles?: number;
  maxFileSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  attachments = [],
  onRemoveAttachment,
  maxFiles = DEFAULT_UPLOAD_CONFIG.maxFiles,
  maxFileSize = DEFAULT_UPLOAD_CONFIG.maxFileSize,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationErrors, setValidationErrors] = useState<Map<string, IFileValidationError[]>>(new Map());
  const [dragActive, setDragActive] = useState(false);

  const handleValidateAndAdd = (files: FileList) => {
    const fileArray = Array.from(files);
    const errors = validateFiles(fileArray, {
      ...DEFAULT_UPLOAD_CONFIG,
      maxFiles,
      maxFileSize,
    });

    if (errors.size > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors(new Map());

    const newAttachments: IAttachment[] = fileArray.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      nome: file.name,
      url: URL.createObjectURL(file),
      tipo: file.type,
      tamanho: file.size,
    }));

    onFilesSelected(newAttachments);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleValidateAndAdd(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleValidateAndAdd(e.dataTransfer.files);
    }
  };

  return (
    <div className="file-upload-container">
      {/* Drag and Drop Area */}
      <div
        className={`file-upload-area border-2 border-dashed rounded p-4 text-center cursor-pointer ${
          dragActive ? 'border-primary bg-light' : 'border-secondary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
        aria-label="Arraste arquivos aqui ou clique para selecionar"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          accept={DEFAULT_UPLOAD_CONFIG.allowedMimeTypes.join(',')}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="file-upload-icon mb-3">
          <i className="bi bi-cloud-upload" style={{ fontSize: '3rem' }}></i>
        </div>

        <p className="mb-2">
          <strong>Arraste arquivos aqui ou clique para selecionar</strong>
        </p>

        <p className="text-muted small mb-0">
          Máximo {maxFiles} arquivo(s), até {formatFileSize(maxFileSize)} cada
        </p>

        <p className="text-muted small">
          Tipos aceitos: PDF, Imagens, DOC, XLS
        </p>
      </div>

      {/* Validation Errors */}
      {validationErrors.size > 0 && (
        <div className="alert alert-warning mt-3" role="alert">
          <strong>Erros ao validar arquivos:</strong>
          <ul className="mb-0 mt-2">
            {Array.from(validationErrors.entries()).map(([fileName, errors]) => (
              <li key={fileName}>
                <strong>{fileName}:</strong>
                <ul className="mb-0">
                  {errors.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="attachments-list mt-4">
          <h6 className="mb-3">Arquivos anexados ({attachments.length})</h6>
          <div className="list-group">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-file-earmark text-secondary"></i>
                  <div>
                    <div className="fw-bold">{attachment.nome}</div>
                    <small className="text-muted">{formatFileSize(attachment.tamanho)}</small>
                  </div>
                </div>

                <div className="d-flex gap-1">
                  <a
                    href={attachment.url}
                    download={attachment.nome}
                    className="btn btn-sm btn-outline-primary"
                    title={`Baixar ${attachment.nome}`}
                    aria-label={`Baixar ${attachment.nome}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-download"></i>
                  </a>
                  {onRemoveAttachment && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemoveAttachment(attachment.id)}
                      aria-label={`Remover ${attachment.nome}`}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
