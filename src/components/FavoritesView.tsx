import React, { useState } from 'react';
import { Heart, Search, Film, ArrowRight, Trash2 } from 'lucide-react';
import { Movie, MovieType } from '../types';
import { MovieCard } from './MovieCard';

interface FavoritesViewProps {
  favorites: Movie[];
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onExploreClick: () => void;
  onClearAllFavorites: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onToggleFavorite,
  onViewDetails,
  onExploreClick,
  onClearAllFavorites,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = favorites.filter((movie) => {
    const matchesType =
      filterType === 'all' || movie.type === filterType;
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                My Favorites
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {favorites.length} {favorites.length === 1 ? 'title' : 'titles'} saved to your watchlist
              </p>
            </div>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={onClearAllFavorites}
            className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No favorites saved yet</h2>
          <p className="text-sm text-slate-400 mb-6">
            Click the heart icon on any movie or TV series card to save it here for quick access and tracking where to stream it.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 hover:opacity-95 flex items-center gap-2 cursor-pointer transition-all duration-200"
          >
            <span>Explore Movies & Shows</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Controls: Type filter & search within favorites */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 self-start">
              {['all', 'movie', 'tv', 'series'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    filterType === type
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'all'
                    ? 'All'
                    : type === 'movie'
                    ? 'Movies'
                    : type === 'tv'
                    ? 'TV Shows'
                    : 'Series'}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter saved titles..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Favorites Grid */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No saved titles match your current filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
