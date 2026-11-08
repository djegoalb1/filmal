import React, { useState } from 'react';
import { Search, Settings, Download, Bookmark, Film, X } from 'lucide-react';
import { ApiConfig } from '../types/movie';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenApiModal: () => void;
  onOpenExportModal: () => void;
  apiConfig: ApiConfig;
  watchlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onOpenApiModal,
  onOpenExportModal,
  apiConfig,
  watchlistCount,
}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const isCustomApiActive = apiConfig.sourceType !== 'default' || !!apiConfig.tmdbApiKey || !!apiConfig.customApiUrl;

  return (
    <header className="sticky top-0 z-40 bg-[#0A090D]/90 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single clean brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onTabChange('all')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:bg-red-500 transition-colors">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1">
                ALFilms<span className="text-red-500">24</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('all')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'all'
                ? 'text-red-500 border-b-2 border-red-500 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Ballina
          </button>
          <button
            onClick={() => onTabChange('albanian')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'albanian'
                ? 'text-red-500 border-b-2 border-red-500 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Filma Shqip
          </button>
          <button
            onClick={() => onTabChange('action')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'action'
                ? 'text-red-500 border-b-2 border-red-500 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Aksion & Sci-Fi
          </button>
          <button
            onClick={() => onTabChange('series')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'series'
                ? 'text-red-500 border-b-2 border-red-500 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            Seriale
          </button>
          <button
            onClick={() => onTabChange('watchlist')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'text-red-500 border-b-2 border-red-500 font-semibold'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Lista Ime</span>
            {watchlistCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 text-zinc-300 font-mono">
                ({watchlistCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster with Search, API Config, and PHP/HTML Export */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Bar / Toggle */}
          <div className="relative flex items-center">
            {showSearchInput ? (
              <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-sm w-44 sm:w-60 focus-within:border-red-500 transition-all">
                <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2" />
                <input
                  type="text"
                  placeholder="Kërko film, serial..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white text-xs sm:text-sm focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setShowSearchInput(false);
                    onSearchChange('');
                  }}
                  className="text-zinc-400 hover:text-white ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                title="Kërko në ALFilms24"
                className="p-2 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* PHP/HTML Export button */}
          <button
            onClick={onOpenExportModal}
            title="Eksporto index.html dhe index.php"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Kodi PHP/HTML</span>
          </button>

          {/* API Configuration Button */}
          <button
            onClick={onOpenApiModal}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              isCustomApiActive
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-600/20'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Konfiguro API</span>
            {isCustomApiActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
