import React, { useState, useRef, useEffect } from 'react';
import { Film, Heart, Globe, ChevronDown, Check } from 'lucide-react';
import { SUPPORTED_REGIONS, Region } from '../types';

interface NavbarProps {
  currentTab: 'explore' | 'favorites';
  onSelectTab: (tab: 'explore' | 'favorites') => void;
  favoritesCount: number;
  selectedRegion: string;
  onSelectRegion: (regionCode: string) => void;
  onLogoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  favoritesCount,
  selectedRegion,
  onSelectRegion,
  onLogoClick,
}) => {
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);
  const regionDropdownRef = useRef<HTMLDivElement>(null);

  const currentRegionObj =
    SUPPORTED_REGIONS.find((r) => r.code === selectedRegion) || SUPPORTED_REGIONS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(event.target as Node)
      ) {
        setRegionMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                CineScope
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-medium tracking-wider uppercase text-purple-400/80 -mt-0.5">
              Streaming & Discovery
            </p>
          </div>
        </button>

        {/* Center / Right Nav Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Navigation Links */}
          <nav className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
            <button
              onClick={() => onSelectTab('explore')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentTab === 'explore'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => onSelectTab('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                currentTab === 'favorites'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  favoritesCount > 0
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-400'
                }`}
              />
              <span>My Favorites</span>
              {favoritesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Region / Country Selector */}
          <div className="relative" ref={regionDropdownRef}>
            <button
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium transition-all duration-200"
              title="Change streaming region"
            >
              <Globe className="w-4 h-4 text-purple-400" />
              <span className="text-base leading-none">{currentRegionObj.flag}</span>
              <span className="hidden md:inline">{currentRegionObj.code}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  regionMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {regionMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121826] border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    OTT Streaming Region
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Sets available OTT platforms & prices
                  </p>
                </div>
                {SUPPORTED_REGIONS.map((region) => (
                  <button
                    key={region.code}
                    onClick={() => {
                      onSelectRegion(region.code);
                      setRegionMenuOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between text-sm hover:bg-purple-600/10 transition-colors ${
                      region.code === selectedRegion
                        ? 'text-purple-300 font-semibold bg-purple-600/15'
                        : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{region.flag}</span>
                      <span>{region.name}</span>
                    </div>
                    {region.code === selectedRegion && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
