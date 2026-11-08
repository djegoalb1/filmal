import React, { useState, useEffect, useRef } from 'react';
import { X, Server, Subtitles, Maximize, Film, Check, Share2, Layers, ExternalLink, Play, AlertTriangle, Star } from 'lucide-react';
import { Movie, VideoSource, Episode } from '../types/movie';

interface VideoPlayerModalProps {
  movie: Movie | null;
  onClose: () => void;
  embedTemplate: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  movie,
  onClose,
  embedTemplate,
}) => {
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [copiedLink, setCopiedLink] = useState(false);
  const [sandboxMode, setSandboxMode] = useState<'permissive' | 'unrestricted'>('permissive');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Initialize first episode if series
  useEffect(() => {
    if (movie?.isSeries && movie.seasons && movie.seasons.length > 0 && movie.seasons[0].episodes.length > 0) {
      setActiveEpisode(movie.seasons[0].episodes[0]);
    } else {
      setActiveEpisode(null);
    }
    setActiveSourceIndex(0);
  }, [movie]);

  const [hasVideoError, setHasVideoError] = useState(false);

  // Reset video error on source change
  useEffect(() => {
    setHasVideoError(false);
  }, [activeSourceIndex, activeEpisode]);

  if (!movie) return null;

  const allSources: VideoSource[] = movie.sources && movie.sources.length > 0 ? movie.sources : [
    {
      id: 'src-direct-fallback',
      name: 'Server 1 - VIP HD (Player Direkt)',
      type: 'direct',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      quality: '1080p'
    }
  ];

  const currentSource = allSources[activeSourceIndex] || allSources[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Determine current video playback URL
  const currentVideoUrl = activeEpisode ? activeEpisode.streamUrl : currentSource.url;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-5xl bg-[#0E0D14] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top bar inside player modal */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 border-b border-zinc-800/80">
          <div className="flex items-center gap-2 overflow-hidden">
            <Film className="w-4 h-4 text-red-500 shrink-0" />
            <h2 className="text-sm sm:text-base font-semibold text-white truncate font-display">
              {movie.title}
            </h2>
            {activeEpisode && (
              <span className="text-xs text-zinc-400 shrink-0">
                - {activeEpisode.title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              title="Shpërndaj filmin"
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'U Kopjua!' : 'Shpërndaj'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sandbox Notice & Bypass Banner for Embeds */}
        {currentSource.type === 'embed' && (
          <div className="bg-gradient-to-r from-red-950/60 via-zinc-950 to-zinc-950 border-b border-red-900/40 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-zinc-200 font-medium">
                Serveri Aktiv: <span className="text-red-400 font-semibold">{currentSource.name}</span>
              </span>
              <button
                onClick={() => setSandboxMode(sandboxMode === 'permissive' ? 'unrestricted' : 'permissive')}
                title="Kliko për të ndryshuar modalitetin e sandbox-it nëse bllokohet nga celulari"
                className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition cursor-pointer"
              >
                {sandboxMode === 'permissive' ? 'Sandbox: allow-same-origin + allow-scripts' : 'Sandbox: Çaktivizuar (Pa Bllokim)'}
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <a
                href={currentSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                <span>Hap në Ekran të Plotë (Mobile / Pa Sandbox)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Video Player Box */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group">
          {currentSource.type === 'embed' ? (
            <>
              <iframe
                key={`${currentSource.url}-${sandboxMode}`}
                src={currentSource.url}
                title={movie.title}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                sandbox={sandboxMode === 'permissive' ? "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation" : undefined}
                referrerPolicy="origin"
              />
              {/* Floating mobile helper in case mobile browser blocks embedded playback */}
              <div className="sm:hidden absolute bottom-3 right-3 z-20 flex items-center gap-1.5">
                {allSources.length > 1 && (
                  <button
                    onClick={() => setActiveSourceIndex((activeSourceIndex + 1) % allSources.length)}
                    className="px-2.5 py-1.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 text-[11px] font-semibold rounded backdrop-blur-md border border-zinc-700 shadow-lg cursor-pointer"
                  >
                    Tjetri Server
                  </button>
                )}
                <a
                  href={currentSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-red-600/95 hover:bg-red-600 text-white text-[11px] font-bold rounded backdrop-blur-md border border-red-500 flex items-center gap-1 shadow-lg"
                >
                  <span>Hap në Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          ) : currentSource.type === 'youtube' ? (
            /* Safe YouTube Trailer Card: eliminates "The player was loaded inside an <iframe sandbox>" error */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
              />
              <div className="relative z-10 max-w-lg space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white rounded-full text-xs font-semibold">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Traileri Zyrtar 4K</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {movie.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300">
                  Për shkak të rregullave të sigurisë të shfletuesit ndaj frames të mbrojtura (sandbox), trailerat e YouTube shfaqen me cilësi maksimale 4K në një dritare të re.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={currentSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-red-600/40 transition-all cursor-pointer"
                  >
                    <span>Shiko Trailerin në YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => setActiveSourceIndex(0)}
                    className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer border border-zinc-700"
                  >
                    Kalo te Filmi i Plotë (Server Direkt)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {hasVideoError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-zinc-950 text-center space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                  <h3 className="text-sm font-semibold text-white">Ky server video nuk mund të ngarkohet përkohësisht.</h3>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    Mund të kaloni menjëherë te serverat e tjerë të shpejtë të filmit:
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={() => {
                        setHasVideoError(false);
                        setActiveSourceIndex(0);
                      }}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Provo Server 1
                    </button>
                    {allSources.length > 1 && (
                      <button
                        onClick={() => {
                          setHasVideoError(false);
                          setActiveSourceIndex(1);
                        }}
                        className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium cursor-pointer"
                      >
                        Provo Server 2
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <video
                    key={currentVideoUrl}
                    ref={videoRef}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onError={() => setHasVideoError(true)}
                    className="w-full h-full object-contain"
                    poster={movie.backdropUrl}
                  >
                    <source src={currentVideoUrl} type="video/mp4" />
                    <source src={currentVideoUrl} type="video/webm" />
                    Shfletuesi juaj nuk mbështet këtë format video.
                  </video>

                  {/* Simulated Albanian Subtitle track banner when active */}
                  {subtitlesEnabled && (
                    <div className="pointer-events-none absolute bottom-14 inset-x-0 flex justify-center px-4">
                      <span className="bg-black/80 text-yellow-300 px-3 py-1 rounded text-xs sm:text-sm font-medium tracking-wide drop-shadow-md border border-yellow-500/20">
                        [Titra Shqip ALFilms24]: Dialogu transmetohet me cilësi maksimale HD
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Player Controls Strip (Server Switcher, Subtitles & Quality) */}
        <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Server Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="flex items-center gap-1 text-zinc-400 font-medium whitespace-nowrap shrink-0">
              <Server className="w-3.5 h-3.5 text-red-500" />
              <span>Serveri:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {allSources.map((src, index) => (
                <button
                  key={src.id}
                  onClick={() => setActiveSourceIndex(index)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeSourceIndex === index
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {src.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle & Quality Toggles */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Subtitle button */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer ${
                subtitlesEnabled
                  ? 'bg-zinc-800 text-yellow-400 border border-yellow-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span>Titra Shqip: {subtitlesEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Quality selector */}
            <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
              {['1080p', '4K'].map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuality(q)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                    selectedQuality === q
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreen}
              title="Ekran i Plotë"
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Scrollable details and series episode picker */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* TV Series Episode Picker (if series) */}
          {movie.isSeries && movie.seasons && (
            <div className="space-y-3 bg-zinc-900/60 p-4 rounded-lg border border-zinc-800/80">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="w-4 h-4 text-red-500" />
                <span>Zgjidh Episodin:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {movie.seasons[0].episodes.map((ep) => (
                  <button
                    key={ep.episodeNumber}
                    onClick={() => setActiveEpisode(ep)}
                    className={`flex items-center justify-between p-2.5 rounded-md text-left transition-all cursor-pointer ${
                      activeEpisode?.episodeNumber === ep.episodeNumber
                        ? 'bg-red-600/20 border border-red-500 text-white'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800'
                    }`}
                  >
                    <span className="text-xs font-medium truncate">{ep.title}</span>
                    <span className="text-[11px] text-zinc-500 tabular-nums ml-2">{ep.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Movie Metadata Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <span className="text-white font-medium">{movie.title}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{movie.year}</span>
              <span aria-hidden="true">·</span>
              <span>{movie.duration}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="tabular-nums font-mono">{movie.rating.toFixed(1)}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">{movie.audio}</span>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {movie.overview}
            </p>

            {/* Cast & Director */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-zinc-800/60">
              <div>
                <span className="text-zinc-500">Regjisor: </span>
                <span className="text-zinc-300 font-medium">{movie.director}</span>
              </div>
              <div>
                <span className="text-zinc-500">Aktorët kryesorë: </span>
                <span className="text-zinc-300">{movie.cast.join(', ')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
