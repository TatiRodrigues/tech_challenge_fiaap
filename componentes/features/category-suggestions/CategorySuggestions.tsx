'use client';

import React, { useState, useEffect } from 'react';
import { suggestCategories, getCategoryLabel, ISuggestion } from '@/utils/validationUtils';

interface CategorySuggestionsProps {
  description: string;
  selectedCategory?: string;
  onCategorySelect: (category: string) => void;
}

export const CategorySuggestions: React.FC<CategorySuggestionsProps> = ({
  description,
  selectedCategory,
  onCategorySelect,
}) => {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (description && description.trim().length > 2) {
      const suggested = suggestCategories(description);
      setSuggestions(suggested);
      setShowSuggestions(suggested.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [description]);

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="category-suggestions mt-2">
      <p className="small text-muted mb-2">
        <i className="fas fa-lightbulb me-1"></i>
        Sugestões de categoria:
      </p>
      <div className="d-flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.categoria}
            type="button"
            className={`btn btn-sm ${
              selectedCategory === suggestion.categoria
                ? 'btn-primary'
                : 'btn-outline-primary'
            }`}
            onClick={() => {
              onCategorySelect(suggestion.categoria);
              setShowSuggestions(false);
            }}
            title={`Confiança: ${Math.round(suggestion.confianca * 100)}%`}
          >
            {getCategoryLabel(suggestion.categoria)}
            <span className="ms-1 badge bg-info">
              {Math.round(suggestion.confianca * 100)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySuggestions;
