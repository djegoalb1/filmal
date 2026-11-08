import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { MovieCard } from './components/MovieCard';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { ExportCodeModal } from './components/ExportCodeModal';
import { INITIAL_MOVIES } from './data/mockMovies';
import { Movie, ApiConfig } from './types/movie';
import {
  getStoredApiConfig,
  fetchAllTmdbCategories,
  searchTmdb,
  fetchMediaTrailer,
  fetchMediaCredits,
  USER_TMDB_API_KEY
} from './services/apiService';
import { Film, Sparkles, Filter, ChevronRight, CheckCircle2, Flame, Trophy, Clapperboard, Tv } from 'lucide-react';

const WATCHLIST_STORAGE_KEY = 'alfilms24_watchlist';

export default function App() {
  const [allMovies, setAllMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [nowPlayingList, setNowPlayingList] = useState<Movie[]>([]);
  const [popularList, setPopularList] = useState<Movie[]>([]);
  const [topRatedList, setTopRatedList] = useState<Movie[]>([]);
  const [tvSeriesList, setTvSeriesList] = useState<Movie[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getStoredApiConfig());
  const [selectedGenre, setSelectedGenre] = useState<string>('Të Gjithë');

  // Watchlist persisted state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleWatchlist = (movie: Movie) => {
    setWatchlistIds((prev) => {
      const exists = prev.includes(movie.id);
      const next = exists ? prev.filter((id) => id !== movie.id) : [...prev, movie.id];
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save watchlist:', e);
      }
      return next;
    });
  };

  // Load real movies from user's TMDb API
  const loadRealMovies = async (key: string) => {
    setIsLoadingApi(true);
    try {
      const categories = await fetchAllTmdbCategories(key);
      const albanianMovies = INITIAL_MOVIES.filter((m) => m.isAlbanian);

      setNowPlayingList(categories.nowPlaying);
      setPopularList(categories.popular);
      setTopRatedList(categories.topRated);
      setTvSeriesList(categories.tvSeries);

      // Merge unique movies
      const movieMap = new Map<string, Movie>();
      [...categories.nowPlaying, ...categories.popular, ...categories.topRated, ...categories.tvSeries, ...albanianMovies].forEach(
        (m) => {
          if (!movieMap.has(m.id)) {
            movieMap.set(m.id, m);
          }
        }
      );
      setAllMovies(Array.from(movieMap.values()));
    } catch (err) {
      console.warn('Could not fetch real TMDb categories:', err);
    } finally {
      setIsLoadingApi(false);
    }
  };

  useEffect(() => {
    const keyToUse = apiConfig.tmdbApiKey || USER_TMDB_API_KEY;
    loadRealMovies(keyToUse);
  }, [apiConfig.tmdbApiKey]);

  // Handle live search
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const keyToUse = apiConfig.tmdbApiKey || USER_TMDB_API_KEY;
      const timeout = setTimeout(() => {
        searchTmdb(keyToUse, searchQuery)
          .then((results) => {
            if (results && results.length > 0) {
              setAllMovies(results);
            }
          })
          .catch(() => {});
      }, 350);
      return () => clearTimeout(timeout);
    } else if (searchQuery.trim().length === 0) {
      const keyToUse = apiConfig.tmdbApiKey || USER_TMDB_API_KEY;
      loadRealMovies(keyToUse);
    }
  }, [searchQuery, apiConfig.tmdbApiKey]);

  // When a movie is selected to play, enrich with real trailer and real cast & director
  const handleSelectMovieToPlay = async (movie: Movie) => {
    let enriched = { ...movie };
    if (movie.tmdbId) {
      const keyToUse = apiConfig.tmdbApiKey || USER_TMDB_API_KEY;
      try {
        const [trailerUrl, credits] = await Promise.all([
          fetchMediaTrailer(keyToUse, movie.tmdbId, movie.isSeries),
          fetchMediaCredits(keyToUse, movie.tmdbId, movie.isSeries),
        ]);

        if (trailerUrl) {
          const hasTrailer = enriched.sources.some((s) => s.type === 'youtube');
          if (!hasTrailer) {
            enriched.sources = [
              ...enriched.sources,
              {
                id: 'src-youtube-trailer',
                name: 'Server 6 - Trailer Zyrtar 4K',
                type: 'youtube',
                url: trailerUrl,
                quality: 'Trailer 4K',
              },
            ];
          }
        }

        if (credits.cast.length > 0) {
          enriched.cast = credits.cast;
        }
        if (credits.director) {
          enriched.director = credits.director;
        }
      } catch (e) {
        console.warn('Enriching movie info error:', e);
      }
    }
    setSelectedMovie(enriched);
  };

  const handleConfigSaved = (newConfig: ApiConfig, syncedMovies?: Movie[]) => {
    setApiConfig(newConfig);
    if (syncedMovies && syncedMovies.length > 0) {
      const albanianMovies = INITIAL_MOVIES.filter((m) => m.isAlbanian);
      setAllMovies([...syncedMovies, ...albanianMovies]);
    } else if (newConfig.tmdbApiKey) {
      loadRealMovies(newConfig.tmdbApiKey);
    }
  };

  // Filtered movies according to Tab, Search query, and Genre
  const filteredMovies = useMemo(() => {
    return allMovies.filter((movie) => {
      // Tab filter
      if (activeTab === 'cinema' && !nowPlayingList.some((m) => m.id === movie.id)) return false;
      if (activeTab === 'albanian' && !movie.isAlbanian) return false;
      if (activeTab === 'action' && !movie.genres.some((g) => ['Aksion', 'Sci-Fi', 'Thriller', 'Aventurë'].includes(g))) return false;
      if (activeTab === 'series' && !movie.isSeries) return false;
      if (activeTab === 'watchlist' && !watchlistIds.includes(movie.id)) return false;

      // Genre filter
      if (selectedGenre !== 'Të Gjithë' && !movie.genres.includes(selectedGenre)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = movie.title.toLowerCase().includes(q) || movie.originalTitle.toLowerCase().includes(q);
        const matchesGenre = movie.genres.some((g) => g.toLowerCase().includes(q));
        const matchesCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        const matchesDirector = movie.director.toLowerCase().includes(q);
        return matchesTitle || matchesGenre || matchesCast || matchesDirector;
      }

      return true;
    });
  }, [allMovies, activeTab, selectedGenre, searchQuery, watchlistIds, nowPlayingList]);

  // Featured marquee movie: first real movie with a high-res backdrop
  const featuredMovie = useMemo(() => {
    return allMovies.find((m) => m.backdropUrl && !m.backdropUrl.includes('unsplash')) || allMovies[0] || INITIAL_MOVIES[0];
  }, [allMovies]);

  // Albanian heritage movies
  const albanianSectionMovies = useMemo(() => allMovies.filter((m) => m.isAlbanian), [allMovies]);

  // All distinct genres
  const allGenres = ['Të Gjithë', 'Aksion', 'Sci-Fi', 'Dramë', 'Komedi', 'Aventurë', 'Krim', 'Horror', 'Filma Shqip', 'Seriale'];

  return (
    <div className="min-h-screen bg-[#0A090D] text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        apiConfig={apiConfig}
        watchlistCount={watchlistIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Render Hero on 'all' tab when no search query is active */}
        {activeTab === 'all' && !searchQuery.trim() && featuredMovie && (
          <HeroBanner
            movie={featuredMovie}
            onPlay={handleSelectMovieToPlay}
            onToggleWatchlist={toggleWatchlist}
            isInWatchlist={watchlistIds.includes(featuredMovie.id)}
            onOpenApiModal={() => setIsApiModalOpen(true)}
            apiConnected={true}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Active API Status Banner (Permanent API for all users) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/80 border border-emerald-900/50 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  API e Integruar e Përhershme (Permanent):
                </span>
                <span className="text-zinc-200 font-mono text-xs bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  TMDb Key: ab546f5b4161f91cc8e87d32424c041e
                </span>
                <span className="text-emerald-400 text-xs hidden md:inline">· Filmat realë janë të aktivizuar përgjithmonë për të gjithë vizitorët!</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsApiModalOpen(true)}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Ndrysho API</span>
              </button>
            </div>
          </div>

          {/* Genre Filters & Sub-navigation */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Zhanri:</span>
              </span>
              {allGenres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedGenre === genre
                      ? 'bg-red-600 text-white font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-500 whitespace-nowrap shrink-0 hidden md:block">
              <span className="font-mono tabular-nums text-zinc-300 font-semibold">{filteredMovies.length}</span> filma nga API
            </div>
          </div>

          {/* Main Grid View */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
                {activeTab === 'all' && (searchQuery ? `Rezultatet e kërkimit: "${searchQuery}"` : 'Premierat & Filmat Më të Fundit')}
                {activeTab === 'cinema' && 'Premierat e Kinemasë (Now Playing)'}
                {activeTab === 'albanian' && 'Kinematografia Shqiptare (Klasikë & Bashkëkohorë)'}
                {activeTab === 'action' && 'Aksion, Sci-Fi & Thriller'}
                {activeTab === 'series' && 'Serialet më të Ndjekura'}
                {activeTab === 'watchlist' && 'Filmat e Ruajtur në Listën Tuaj'}
              </h2>
            </div>

            {isLoadingApi ? (
              <div key="loading-skeletons" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {['sk1', 'sk2', 'sk3', 'sk4', 'sk5', 'sk6', 'sk7', 'sk8', 'sk9', 'sk10'].map((skId) => (
                  <div key={skId} className="aspect-[3/4] bg-zinc-900/60 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center rounded-xl bg-zinc-950 border border-zinc-900 space-y-3">
                <Film className="w-12 h-12 text-zinc-600 mx-auto" />
                <h3 className="text-base font-semibold text-zinc-300">Nuk u gjet asnjë film</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  {activeTab === 'watchlist'
                    ? 'Nuk keni shtuar ende asnjë film në listën tuaj. Shtoni filma duke klikuar ikonën "+".'
                    : 'Provoni të kërkoni me një fjalë tjetër ose zgjidhni një zhanër tjetër.'}
                </p>
              </div>
            )}
          </div>

          {/* Category Section 1: Premierat e Kinemasë (Now Playing) */}
          {activeTab === 'all' && !searchQuery.trim() && selectedGenre === 'Të Gjithë' && nowPlayingList.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <Clapperboard className="w-5 h-5 text-red-500" />
                    <span>Premierat e Kinemasë (Të Fundit 2026/2025)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Filmat më të freskët të transmetuar në sallat e kinemasë botërore
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {nowPlayingList.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`now-${movie.id}`}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Section 2: Filmat më të Shikuar (Popular) */}
          {activeTab === 'all' && !searchQuery.trim() && selectedGenre === 'Të Gjithë' && popularList.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <span>Më të Shikuarit e Javës</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Titujt më me ndikim dhe më të kërkuar nga shikuesit e ALFilms24
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {popularList.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`pop-${movie.id}`}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Section 3: Serialet më të Ndjekura (TV Series) */}
          {activeTab === 'all' && !searchQuery.trim() && selectedGenre === 'Të Gjithë' && tvSeriesList.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <Tv className="w-5 h-5 text-indigo-400" />
                    <span>Serialet më të Ndjekura me Epizoda</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Transmetim i të gjitha sezoneve me titra shqip
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('series')}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                >
                  <span>Shiko të gjithë</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {tvSeriesList.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`tv-${movie.id}`}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Section 4: Më të Vlerësuarit e të Gjitha Kohërave (Top Rated) */}
          {activeTab === 'all' && !searchQuery.trim() && selectedGenre === 'Të Gjithë' && topRatedList.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span>Më të Vlerësuarit e të Gjitha Kohërave (IMDb Top)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Kryeveprat me notë mbi 8.5 me titra shqip
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {topRatedList.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`top-${movie.id}`}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Section 5: Kinematografia Shqiptare */}
          {activeTab === 'all' && !searchQuery.trim() && selectedGenre === 'Të Gjithë' && albanianSectionMovies.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                    Klasikët dhe Filmat Shqiptarë
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Arkiva e Kinostudios Shqipëria e Re dhe prodhimet moderne
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('albanian')}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
                >
                  <span>Shiko të gjithë</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
                {albanianSectionMovies.slice(0, 5).map((movie) => (
                  <MovieCard
                    key={`alb-${movie.id}`}
                    movie={movie}
                    onPlay={handleSelectMovieToPlay}
                    onToggleWatchlist={toggleWatchlist}
                    isInWatchlist={watchlistIds.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Video Player Modal */}
      {selectedMovie && (
        <VideoPlayerModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          embedTemplate={apiConfig.embedServerTemplate || 'https://autoembed.me/movie/tmdb/{id}'}
        />
      )}

      {/* API Configuration Modal */}
      {isApiModalOpen && (
        <ApiSettingsModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          config={apiConfig}
          onConfigSaved={handleConfigSaved}
        />
      )}

      {/* Export Code Modal (index.php and index.html) */}
      {isExportModalOpen && (
        <ExportCodeModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          apiConfig={apiConfig}
        />
      )}

      {/* Quiet Cinematic Footer */}
      <footer className="mt-16 border-t border-zinc-900 bg-zinc-950 py-10 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-base font-bold font-display text-white">
              ALFilms<span className="text-red-500">24</span>
            </span>
            <p className="text-zinc-400">
              Kinemaja juaj online me filma dhe seriale me titra shqip në HD dhe 4K me API të integruar.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400">
            <button onClick={() => setActiveTab('all')} className="hover:text-white transition-colors cursor-pointer">
              Ballina
            </button>
            <button onClick={() => setActiveTab('albanian')} className="hover:text-white transition-colors cursor-pointer">
              Filma Shqip
            </button>
            <button onClick={() => setActiveTab('action')} className="hover:text-white transition-colors cursor-pointer">
              Aksion
            </button>
            <button onClick={() => setActiveTab('series')} className="hover:text-white transition-colors cursor-pointer">
              Seriale
            </button>
            <button onClick={() => setIsApiModalOpen(true)} className="hover:text-white transition-colors cursor-pointer text-emerald-400">
              API e Lidhur (TMDb)
            </button>
            <button onClick={() => setIsExportModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
              Shkarko index.php / html
            </button>
          </div>

          <div className="text-zinc-600 text-center md:text-right">
            © {new Date().getFullYear()} ALFilms24. Të gjitha të drejtat e rezervuara.
          </div>
        </div>
      </footer>

    </div>
  );
}
