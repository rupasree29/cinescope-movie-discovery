import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MovieType, SortOption } from '../types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  availableGenres: string[];
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
  isSearchingApi?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedType,
  onSelectType,
  selectedGenre,
  onSelectGenre,
  selectedLanguage,
  onSelectLanguage,
  selectedSort,
  onSelectSort,
  availableGenres,
  suggestions,
  onSelectSuggestion,
  isSearchingApi = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit(searchQuery);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative z-20">
        <div
          ref={searchContainerRef}
          className="relative flex flex-col md:flex-row items-stretch gap-2 p-2 rounded-2xl bg-[#121826]/90 border border-white/10 shadow-2xl backdrop-blur-xl focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300"
        >
          {/* Search Input Box */}
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-purple-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search movies, TV shows, and series by title, actor, director..."
              className="w-full px-3 py-3 bg-transparent text-white placeholder-slate-400 text-sm md:text-base focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  onSearchSubmit('');
                }}
                className="p-1.5 mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && searchQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121826] border border-white/15 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-purple-400 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectSuggestion(item);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-sm text-slate-200 hover:text-white hover:bg-purple-600/20 flex items-center gap-2 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-2">
            {/* Category / Type Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => onSelectType(e.target.value)}
                className="appearance-none w-full md:w-32 px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs md:text-sm font-medium text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer transition-colors pr-7"
              >
                <option value="all" className="bg-[#121826] text-white">
                  All Types
                </option>
                <option value="movie" className="bg-[#121826] text-white">
                  Movies
                </option>
                <option value="tv" className="bg-[#121826] text-white">
                  TV Shows
                </option>
                <option value="series" className="bg-[#121826] text-white">
                  Series
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value)}
                className={`appearance-none w-full md:w-36 px-3 py-2.5 border rounded-xl text-xs md:text-sm font-semibold cursor-pointer transition-colors pr-7 ${
                  selectedLanguage === 'Telugu'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 focus:border-purple-500/50'
                }`}
              >
                <option value="all" className="bg-[#121826] text-white">
                  All Languages
                </option>
                <option value="Telugu" className="bg-[#121826] text-amber-300 font-bold">
                  Telugu (తెలుగు)
                </option>
                <option value="English" className="bg-[#121826] text-white">
                  English
                </option>
                <option value="Korean" className="bg-[#121826] text-white">
                  Korean
                </option>
                <option value="Japanese" className="bg-[#121826] text-white">
                  Japanese
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Filter Toggle for mobile */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-xl border transition-all md:hidden ${
                showFilters || selectedGenre !== 'All'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Filters & Sorting"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearchingApi}
              className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:opacity-95 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearchingApi ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>Search</span>
            </button>
          </div>
        </div>
      </form>

      {/* Genres & Sorting Bar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 ${
          showFilters ? 'block' : 'hidden md:flex'
        }`}
      >
        {/* Quick Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {/* Quick Telugu Movies button */}
          <button
            type="button"
            onClick={() => onSelectLanguage(selectedLanguage === 'Telugu' ? 'all' : 'Telugu')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
              selectedLanguage === 'Telugu'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300'
            }`}
          >
            <span>🎬 Telugu Movies (Tollywood)</span>
          </button>

          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden lg:inline ml-1">
            Genre:
          </span>
          {availableGenres.map((genre) => {
            const isActive = selectedGenre === genre;
            return (
              <button
                key={genre}
                type="button"
                onClick={() => onSelectGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/30 border border-purple-500/70 text-purple-200 shadow-sm shadow-purple-500/20'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Sort:
          </span>
          <select
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500/50 cursor-pointer transition-colors"
          >
            <option value="popularity" className="bg-[#121826] text-white">
              Trending / Popularity
            </option>
            <option value="rating-desc" className="bg-[#121826] text-white">
              Highest IMDb Rating
            </option>
            <option value="year-desc" className="bg-[#121826] text-white">
              Newest Release
            </option>
            <option value="year-asc" className="bg-[#121826] text-white">
              Oldest Release
            </option>
            <option value="title-asc" className="bg-[#121826] text-white">
              Title (A-Z)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
