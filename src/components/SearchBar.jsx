// Search component with debounced input for better performance
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar component with debounced search functionality
 * @param {Object} props
 * @param {(query: string) => void} props.onSearch - Callback function when search query changes
 * @param {string} [props.placeholder] - Placeholder text for input
 * @param {string} [props.className] - Additional CSS classes
 */
export const SearchBar = ({
  onSearch,
  placeholder = "Search movies...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [query]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};