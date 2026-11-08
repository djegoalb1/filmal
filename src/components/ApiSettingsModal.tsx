import React, { useState } from 'react';
import { X, Key, Globe, PlaySquare, CheckCircle2, AlertCircle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { ApiConfig } from '../types/movie';
import { saveApiConfig, fetchFromTmdb, fetchFromCustomApi } from '../services/apiService';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onConfigSaved: (newConfig: ApiConfig, syncedMovies?: any[]) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'tmdb' | 'custom_json' | 'embed'>('tmdb');
  const [tmdbApiKey, setTmdbApiKey] = useState(config.tmdbApiKey);
  const [customApiUrl, setCustomApiUrl] = useState(config.customApiUrl);
  const [embedServerTemplate, setEmbedServerTemplate] = useState(
    config.embedServerTemplate || 'https://autoembed.me/movie/tmdb/{id}'
  );
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTestTmdb = async () => {
    if (!tmdbApiKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Ju lutem shkruani çelësin tuaj TMDb API më parë.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const movies = await fetchFromTmdb(tmdbApiKey.trim(), 'movie/popular');
      setStatusMessage({
        type: 'success',
        text: `Sukses! Lidhja me TMDb u krye. U gjetën ${movies.length} filma premierë në kohë reale.`
      });
      // Save config automatically
      const updated: ApiConfig = {
        ...config,
        sourceType: 'tmdb',
        tmdbApiKey: tmdbApiKey.trim(),
        embedServerTemplate,
      };
      saveApiConfig(updated);
      onConfigSaved(updated, movies);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Dështoi lidhja me TMDb: ${err.message || 'Kontrolloni çelësin API dhe lidhjen e internetit.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCustomApi = async () => {
    if (!customApiUrl.trim()) {
      setStatusMessage({ type: 'error', text: 'Ju lutem shkruani URL-në e API-së tuaj JSON.' });
      return;
    }
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const movies = await fetchFromCustomApi(customApiUrl.trim());
      setStatusMessage({
        type: 'success',
        text: `Sukses! U sinkronizuan ${movies.length} filma nga API juaj e personalizuar.`
      });
      const updated: ApiConfig = {
        ...config,
        sourceType: 'custom_json',
        customApiUrl: customApiUrl.trim(),
        embedServerTemplate,
      };
      saveApiConfig(updated);
      onConfigSaved(updated, movies);
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Gabim lidhjeje: ${err.message || 'Kontrolloni nëse URL suporton CORS dhe formatin JSON.'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOnly = () => {
    const updated: ApiConfig = {
      ...config,
      tmdbApiKey: tmdbApiKey.trim(),
      customApiUrl: customApiUrl.trim(),
      embedServerTemplate: embedServerTemplate.trim(),
      sourceType: tmdbApiKey.trim() ? 'tmdb' : customApiUrl.trim() ? 'custom_json' : 'default',
    };
    saveApiConfig(updated);
    setStatusMessage({ type: 'success', text: 'Konfigurimi u ruajt me sukses!' });
    setTimeout(() => {
      onConfigSaved(updated);
      onClose();
    }, 900);
  };

  const handleResetToDefault = () => {
    const defaultConf: ApiConfig = {
      sourceType: 'default',
      tmdbApiKey: '',
      tmdbLanguage: 'sq-AL,en-US',
      customApiUrl: '',
      embedServerTemplate: 'https://autoembed.me/movie/tmdb/{id}',
      enableLiveSearch: true,
    };
    setTmdbApiKey('');
    setCustomApiUrl('');
    setEmbedServerTemplate('https://autoembed.me/movie/tmdb/{id}');
    saveApiConfig(defaultConf);
    setStatusMessage({ type: 'info', text: 'U rivendos katalogu standard i ALFilms24.' });
    onConfigSaved(defaultConf);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-2xl bg-[#0F0E16] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-950/80 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Konfigurimi i API të Filmave (ALFilms24)
              </h2>
              <p className="text-xs text-zinc-400">
                Lidh çelësin tënd të API-së për të ngarkuar filmat dhe player-in tënd
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selection for API type */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('tmdb')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tmdb'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>TMDb API (Katalogu & Detajet)</span>
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'embed'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PlaySquare className="w-3.5 h-3.5" />
            <span>Serveri Embed i Player-it</span>
          </button>
          <button
            onClick={() => setActiveTab('custom_json')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'custom_json'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>API JSON e Personalizuar</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Status Message Banner if present */}
          {statusMessage && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-red-950/60 border border-red-800/80 text-red-300'
                  : 'bg-zinc-900 border border-zinc-700 text-zinc-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: TMDb API */}
          {activeTab === 'tmdb' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Çelësi TMDb API (API Key v3 ose Read Access Token v4):
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="psh: 3b1a8f946e492b45e99812..."
                    value={tmdbApiKey}
                    onChange={(e) => setTmdbApiKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Mund ta merrni falas në themoviedb.org ose të vendosni çelësin tuaj privat të filmave.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={handleTestTmdb}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Duke u lidhur...' : 'Testo & Sinkronizo Filmat'}</span>
                </button>
              </div>

              <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-200 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>Si funksionon me ALFilms24?</span>
                </div>
                <p>
                  Sapo të fusni API-në tuaj, faqja shfaq automatikisht filmat më të fundit, premierat, posterat origjinalë dhe përshkrimet me titra shqip!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Embed Player Server */}
          {activeTab === 'embed' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Shablloni i Serverit Embed për Transmetim:
                </label>
                <input
                  type="text"
                  placeholder="psh: https://autoembed.me/movie/tmdb/{id}"
                  value={embedServerTemplate}
                  onChange={(e) => setEmbedServerTemplate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Përdorni <code className="text-red-400">{"{id}"}</code>, <code className="text-red-400">{"{tmdb_id}"}</code>, ose <code className="text-red-400">{"{imdb_id}"}</code> si vendmbajtës të kodit të filmit.
                </p>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-zinc-400">Shembuj të serverave të gatshëm dhe të testuar:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setEmbedServerTemplate('https://autoembed.me/movie/tmdb/{id}')}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-left text-zinc-300 font-mono text-[11px] cursor-pointer"
                  >
                    AutoEmbed (Rekomanduar): autoembed.me/movie/tmdb/{"{id}"}
                  </button>
                  <button
                    onClick={() => setEmbedServerTemplate('https://vidlink.pro/movie/{id}')}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 text-left text-zinc-300 font-mono text-[11px] cursor-pointer"
                  >
                    VidLink VIP: vidlink.pro/movie/{"{id}"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Custom REST / JSON API */}
          {activeTab === 'custom_json' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  URL e API-së tuaj JSON (REST Endpoint):
                </label>
                <input
                  type="url"
                  placeholder="https://api.filmat-e-mi.com/filma.json"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[11px] text-zinc-500 mt-1.5">
                  Endpoint-i duhet të kthejë një listë me filma (me fusha: id, title, poster, year, rating, streamUrl).
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleTestCustomApi}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>{isLoading ? 'Duke testuar...' : 'Testo & Ngarko nga URL'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-950 border-t border-zinc-800">
          <button
            onClick={handleResetToDefault}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Rivendos Katalogun Standard
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Mbyll
            </button>
            <button
              onClick={handleSaveOnly}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer shadow-md shadow-red-600/30"
            >
              Ruaj Konfigurimin
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
