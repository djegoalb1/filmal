export interface VideoSource {
  id: string;
  name: string;
  type: 'direct' | 'embed' | 'youtube';
  url: string;
  quality?: string;
}

export interface SubtitleTrack {
  lang: string;
  label: string;
  default?: boolean;
}

export interface Episode {
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  duration: string;
  streamUrl: string;
}

export interface Season {
  seasonNumber: number;
  title: string;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  rating: number; // e.g. 8.7
  duration: string; // e.g. "2h 15m" or "45m"
  genres: string[];
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  quality: '4K' | '1080p HD' | '720p HD';
  audio: string; // e.g. 'Titra Shqip', 'Dubluar Shqip'
  subtitles: SubtitleTrack[];
  sources: VideoSource[];
  isAlbanian?: boolean;
  isSeries?: boolean;
  seasons?: Season[];
  director: string;
  cast: string[];
  imdbId?: string;
  tmdbId?: number;
}

export interface ApiConfig {
  sourceType: 'default' | 'tmdb' | 'custom_json';
  tmdbApiKey: string;
  tmdbLanguage: string;
  customApiUrl: string;
  embedServerTemplate: string;
  enableLiveSearch: boolean;
}
