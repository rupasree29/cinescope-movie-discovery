/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Sparkles,
  Flame,
  Search,
  RotateCcw,
  ArrowRight,
  Play,
  Heart,
  Info,
  Tv,
} from 'lucide-react';
import { Movie, SortOption } from './types';
import { INITIAL_MOVIES } from './data/movies';
import { getSavedRegion, saveRegion } from './services/streamingService';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { MovieCard } from './components/MovieCard';
import { MovieDetails } from './components/MovieDetails';
import { FavoritesView } from './components/FavoritesView';
import { TrailerModal } from './components/TrailerModal';

const FAVORITES_STORAGE_KEY = 'cinescope_saved_favorites_v1';

export default function App() {
  // Navigation & Active View state
  const [currentTab, setCurrentTab] = useState<'explore' | 'favorites'>('explore');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Region State
  const [selectedRegion, setSelectedRegion] = useState<string>('US');

  // Favorites State with LocalStorage
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Movie Catalog State (can be enriched by live searches)
  const [movieList, setMovieList] = useState<Movie[]>(INITIAL_MOVIES);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedSort, setSelectedSort] = useState<SortOption>('popularity');
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiSearchError, setApiSearchError] = useState<string | null>(null);

  // Trailer Modal State
  const [quickTrailerMovie, setQuickTrailerMovie] = useState<Movie | null>(null);

  // Initialize region
  useEffect(() => {
    setSelectedRegion(getSavedRegion());
  }, []);

  // Save region changes
  const handleRegionChange = (newRegion: string) => {
    setSelectedRegion(newRegion);
    saveRegion(newRegion);
  };

  // Persist favorites
  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      let updated: Movie[];
      if (exists) {
        updated = prev.filter((m) => m.id !== movie.id);
      } else {
        updated = [movie, ...prev];
      }
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to store favorites in localStorage:', err);
      }
      return updated;
    });
  };

  const handleClearAllFavorites = () => {
    if (window.confirm('Are you sure you want to clear your favorites list?')) {
      setFavorites([]);
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    }
  };

  const isFavorite = (movieId: string) => {
    return favorites.some((m) => m.id === movieId);
  };

  // Available Genres
  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    INITIAL_MOVIES.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Search Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const suggestions: string[] = [];

    movieList.forEach((m) => {
      if (m.title.toLowerCase().includes(q)) suggestions.push(m.title);
      m.genres.forEach((g) => {
        if (g.toLowerCase().includes(q) && !suggestions.includes(g)) {
          suggestions.push(g);
        }
      });
    });

    return Array.from(new Set(suggestions)).slice(0, 5);
  }, [searchQuery, movieList]);

  // Handle Search Submission (checks local movies first, and attempts AI lookup if zero local results)
  const handleSearchSubmit = async (query: string) => {
    setApiSearchError(null);
    if (!query.trim()) return;

    // Check if any match exists in current list
    const q = query.trim().toLowerCase();
    const localMatch = movieList.some(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.cast.some((c) => c.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q)
    );

    if (!localMatch) {
      // Try querying the AI movie lookup backend endpoint
      setIsSearchingApi(true);
      try {
        const response = await fetch('/api/movies/ai-lookup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: query.trim(),
            type: selectedType,
            region: selectedRegion,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.movie) {
            const newMovie: Movie = {
              ...data.movie,
              ottAvailability: {},
            };
            setMovieList((prev) => [newMovie, ...prev]);
            setSelectedMovie(newMovie);
          }
        }
      } catch (err) {
        console.warn('AI lookup error:', err);
      } finally {
        setIsSearchingApi(false);
      }
    }
  };

  // Filtered & Sorted Movies
  const filteredMovies = useMemo(() => {
    return movieList
      .filter((movie) => {
        // Type filter
        if (selectedType !== 'all' && movie.type !== selectedType) {
          return false;
        }

        // Genre filter
        if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
          return false;
        }

        // Language filter
        if (selectedLanguage !== 'all') {
          const langMatch = movie.language.toLowerCase().includes(selectedLanguage.toLowerCase());
          if (!langMatch) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = movie.title.toLowerCase().includes(q);
          const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
          const matchDirector = movie.director.toLowerCase().includes(q);
          const matchPlot = movie.plot.toLowerCase().includes(q);
          const matchGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
          const matchLanguage = movie.language.toLowerCase().includes(q);
          return matchTitle || matchCast || matchDirector || matchPlot || matchGenre || matchLanguage;
        }

        return true;
      })
      .sort((a, b) => {
        switch (selectedSort) {
          case 'rating-desc':
            return b.rating - a.rating;
          case 'year-desc':
            return String(b.year).localeCompare(String(a.year));
          case 'year-asc':
            return String(a.year).localeCompare(String(b.year));
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'popularity':
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [movieList, selectedType, selectedGenre, selectedLanguage, searchQuery, selectedSort]);

  // Featured Spotlight Movie (RRR, Oppenheimer, or Kalki 2898 AD)
  const spotlightMovie = useMemo(() => {
    if (selectedLanguage === 'Telugu') {
      return movieList.find((m) => m.id === 'rrr-2022') || movieList[0];
    }
    return movieList.find((m) => m.id === 'rrr-2022') || movieList.find((m) => m.id === 'oppenheimer-2023') || movieList[0];
  }, [movieList, selectedLanguage]);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToExplore = () => {
    setSelectedMovie(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedGenre('All');
    setSelectedLanguage('all');
    setSelectedSort('popularity');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white font-sans antialiased">
      {/* Glow Effects Backdrop */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-[500px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 1. Header / Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedMovie(null);
        }}
        favoritesCount={favorites.length}
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionChange}
        onLogoClick={() => {
          setCurrentTab('explore');
          setSelectedMovie(null);
          handleResetFilters();
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If a Movie is selected, render the detailed Movie Details page */}
        {selectedMovie ? (
          <MovieDetails
            movie={selectedMovie}
            onBack={handleBackToExplore}
            isFavorite={isFavorite(selectedMovie.id)}
            onToggleFavorite={toggleFavorite}
            selectedRegion={selectedRegion}
            onRegionChange={handleRegionChange}
            allMovies={movieList}
            onSelectMovie={handleSelectMovie}
          />
        ) : currentTab === 'favorites' ? (
          /* 5. Favorites View */
          <FavoritesView
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={handleSelectMovie}
            onExploreClick={() => setCurrentTab('explore')}
            onClearAllFavorites={handleClearAllFavorites}
          />
        ) : (
          /* 1. Home / Explore Page */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero / Spotlight Section */}
            {!searchQuery && selectedGenre === 'All' && selectedType === 'all' && (
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-r from-[#111625] to-[#0A0D17]">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  {/* Left Column: Spotlight Info */}
                  <div className="lg:col-span-7 p-6 sm:p-10 z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm">
                        <Flame className="w-3.5 h-3.5 text-purple-400" />
                        Featured Spotlight
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        ★ {spotlightMovie.rating.toFixed(1)} IMDb Score
                      </span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                      {spotlightMovie.title}
                    </h2>

                    <p className="text-sm sm:text-base text-slate-300 line-clamp-3 leading-relaxed max-w-xl">
                      {spotlightMovie.plot}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSelectMovie(spotlightMovie)}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center gap-2 transition-all duration-200 cursor-pointer"
                      >
                        <Info className="w-4 h-4" />
                        <span>View Details & OTT Links</span>
                      </button>

                      {spotlightMovie.trailerYoutubeId && (
                        <button
                          type="button"
                          onClick={() => setQuickTrailerMovie(spotlightMovie)}
                          className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Watch Trailer</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleFavorite(spotlightMovie)}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                          isFavorite(spotlightMovie.id)
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                        title="Add to Favorites"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite(spotlightMovie.id) ? 'fill-rose-500' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* OTT streaming teaser for featured movie */}
                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                      <Tv className="w-4 h-4 text-purple-400" />
                      <span>Available on Netflix, Prime Video, Apple TV & more</span>
                    </div>
                  </div>

                  {/* Right Column: Hero Image with Ambient Glow */}
                  <div className="lg:col-span-5 relative h-64 lg:h-[380px] overflow-hidden">
                    <img
                      src={spotlightMovie.backdropUrl || spotlightMovie.posterUrl}
                      alt={spotlightMovie.title}
                      className="w-full h-full object-cover object-center scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111625] via-[#111625]/60 to-transparent" />
                  </div>
                </div>
              </div>
            )}

            {/* 1. Search Bar & Category Controls */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Discover Movies & TV Shows
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Search by title and find where to stream, rent, or buy across all major OTT platforms.
                </p>
              </div>

              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                selectedType={selectedType}
                onSelectType={setSelectedType}
                selectedGenre={selectedGenre}
                onSelectGenre={setSelectedGenre}
                selectedLanguage={selectedLanguage}
                onSelectLanguage={setSelectedLanguage}
                selectedSort={selectedSort}
                onSelectSort={setSelectedSort}
                availableGenres={availableGenres}
                suggestions={searchSuggestions}
                onSelectSuggestion={(sug) => {
                  setSearchQuery(sug);
                  handleSearchSubmit(sug);
                }}
                isSearchingApi={isSearchingApi}
              />
            </div>

            {/* 1. Popular Releases Section Header */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {searchQuery
                    ? `Search Results for "${searchQuery}"`
                    : selectedLanguage === 'Telugu'
                    ? 'Telugu Blockbusters & Classics (Tollywood)'
                    : 'Popular Releases'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-purple-300 border border-white/10">
                  {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'}
                </span>
              </div>

              {(searchQuery || selectedGenre !== 'All' || selectedType !== 'all' || selectedLanguage !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Movie Grid or Empty Results */}
            {filteredMovies.length === 0 ? (
              <div className="py-20 rounded-2xl bg-[#121826]/40 border border-white/5 flex flex-col items-center justify-center text-center max-w-lg mx-auto p-8">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <Search className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No matching titles found</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">
                  We couldn't find any movie or TV series matching{' '}
                  <span className="text-purple-300 font-semibold">"{searchQuery}"</span> with the selected filters.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit(searchQuery)}
                      disabled={isSearchingApi}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Search via Live AI Engine</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    isFavorite={isFavorite(movie.id)}
                    onToggleFavorite={toggleFavorite}
                    onViewDetails={handleSelectMovie}
                    onQuickTrailer={(m) => setQuickTrailerMovie(m)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global Quick Trailer Modal */}
      {quickTrailerMovie && (
        <TrailerModal
          isOpen={!!quickTrailerMovie}
          onClose={() => setQuickTrailerMovie(null)}
          youtubeId={quickTrailerMovie.trailerYoutubeId}
          movieTitle={quickTrailerMovie.title}
        />
      )}

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-[#0B0F19]/90 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white text-sm">CineScope</span>
            <span>• Movie Discovery & OTT Streaming Availability Guide</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Dynamic OTT Links for Netflix, Prime Video, Disney+, Max, Apple TV & more</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
