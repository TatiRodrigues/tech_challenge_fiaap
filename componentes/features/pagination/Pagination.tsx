'use client';

import React from 'react';
import { IPaginationState } from '@/utils/filterUtils';

interface PaginationProps {
  pagination: IPaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const { currentPage, totalPages, pageSize, totalItems } = pagination;

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="app-pagination mb-5">
      <div className="row g-2 align-items-center justify-content-between">
        <div className="col-auto">
          <div className="page-info">
            Exibindo <strong>{startIndex}</strong> a <strong>{endIndex}</strong> de{' '}
            <strong>{totalItems}</strong> transações
          </div>
        </div>

        <div className="col-auto">
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select form-select-sm"
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              aria-label="Itens por página"
            >
              <option value="5">5 itens</option>
              <option value="10">10 itens</option>
              <option value="20">20 itens</option>
              <option value="50">50 itens</option>
            </select>

            <nav aria-label="Paginação">
              <ul className="pagination mb-0 justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    &laquo;
                  </button>
                </li>

                {getPageNumbers().map((pageNum, index) => (
                  <li key={index} className={`page-item ${pageNum === currentPage ? 'active' : ''}`}>
                    {pageNum === '...' ? (
                      <span className="page-link">...</span>
                    ) : (
                      <button
                        className="page-link"
                        onClick={() => onPageChange(pageNum as number)}
                        aria-label={`Ir para página ${pageNum}`}
                        aria-current={pageNum === currentPage ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    )}
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Próxima página"
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
