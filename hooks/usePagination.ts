import { useState, useCallback, useRef, useEffect } from 'react';

export interface PaginationConfig {
  pageSize: number;
  initialPage?: number;
}

export interface UsePaginationResult<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  reset: () => void;
}

export function usePagination<T>(
  allItems: T[],
  config: PaginationConfig
): UsePaginationResult<T> {
  const pageSize = config.pageSize || 10;
  const initialPage = config.initialPage || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(allItems.length / pageSize) || 1;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const items = allItems.slice(startIndex, endIndex);

  const nextPage = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
      setIsLoading(false);
    }, 300);
  }, [totalPages]);

  const previousPage = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
      setIsLoading(false);
    }, 300);
  }, []);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(validPage);
      setIsLoading(false);
    }, 300);
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setIsLoading(false);
  }, [initialPage]);

  return {
    items,
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    isLoading,
    nextPage,
    previousPage,
    goToPage,
    reset,
  };
}

export interface UseInfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  setItems: (items: T[]) => void;
}

export function useInfiniteScroll<T>(
  initialItems: T[],
  pageSize: number = 10
): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>(initialItems.slice(0, pageSize));
  const [currentIndex, setCurrentIndex] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = currentIndex < initialItems.length;

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const newItems = initialItems.slice(0, currentIndex + pageSize);
      setItems(newItems);
      setCurrentIndex(prev => prev + pageSize);
      setIsLoading(false);
    }, 500);
  }, [currentIndex, initialItems, pageSize, hasMore, isLoading]);

  const reset = useCallback(() => {
    setItems(initialItems.slice(0, pageSize));
    setCurrentIndex(pageSize);
    setIsLoading(false);
  }, [initialItems, pageSize]);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    reset,
    setItems,
  };
}

export function useInfiniteScrollObserver(
  callback: () => void,
  options?: { threshold?: number; rootMargin?: string }
) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      {
        threshold: options?.threshold || 0.1,
        rootMargin: options?.rootMargin || '100px',
      }
    );

    observer.observe(observerTarget.current);

    return () => {
      observer.disconnect();
    };
  }, [callback, options]);

  return observerTarget;
}
