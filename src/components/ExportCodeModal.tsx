import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Server } from 'lucide-react';

interface ExportCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: any;
}

export const ExportCodeModal: React.FC<ExportCodeModalProps> = ({
  isOpen,
  onClose,
  apiConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'php' | 'html'>('php');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const phpCode = `<?php
/**
 * ALFilms24 - Kinemaja Juaj Online (index.php)
 * Faqe e plotë me transmetim filmash, titra shqip dhe mbështetje API.
 */

// Konfigurimi i API nga përdoruesi
$TMDB_API_KEY = "${apiConfig.tmdbApiKey || 'ab546f5b4161f91cc8e87d32424c041e'}";
$DEFAULT_EMBED = "${apiConfig.embedServerTemplate || 'https://autoembed.me/movie/tmdb/{id}'}";

// Funksion për të marrë filma nga API me cURL
function merrFilmaTmdb($apiKey, $endpoint = 'movie/popular') {
    if (empty($apiKey) || $apiKey === 'VENDOS_KETU_CELASIN_TUAJ_TMDB') {
        return null;
    }
    $ch = curl_init("https://api.themoviedb.org/3/$endpoint?api_key=$apiKey&language=en-US&page=1");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

$filmat = merrFilmaTmdb($TMDB_API_KEY);
?>
<!DOCTYPE html>
<html lang="sq" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALFilms24 - Filma me Titra Shqip në HD & 4K</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0A090D; color: #F4F4F5; }
        .font-display { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="min-h-screen">
    <!-- Header ALFilms24 -->
    <header class="border-b border-zinc-800 bg-[#0A090D]/90 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <a href="index.php" class="text-2xl font-bold font-display text-white">
            ALFilms<span class="text-red-500">24</span>
        </a>
        <nav class="flex gap-6 text-sm text-zinc-300">
            <a href="index.php" class="text-red-500 font-semibold">Ballina</a>
            <a href="#shqip" class="hover:text-white">Filma Shqip</a>
            <a href="#aksion" class="hover:text-white">Aksion</a>
            <a href="#seriale" class="hover:text-white">Seriale</a>
        </nav>
        <span class="text-xs text-zinc-400">PHP 8.x + API Ready</span>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
        <h1 class="text-3xl font-bold font-display text-white mb-6">Filmat më të Fundit me Titra Shqip</h1>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <?php if (!empty($filmat['results'])): ?>
                <?php foreach ($filmat['results'] as $film): ?>
                    <div class="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden group">
                        <img src="https://image.tmdb.org/t/p/w500<?= htmlspecialchars($film['poster_path']) ?>" 
                             alt="<?= htmlspecialchars($film['title']) ?>" 
                             class="w-full aspect-[3/4] object-cover group-hover:scale-105 transition duration-300">
                        <div class="p-3">
                            <h3 class="font-semibold text-sm truncate"><?= htmlspecialchars($film['title']) ?></h3>
                            <div class="text-xs text-zinc-400 mt-1"><?= substr($film['release_date'] ?? '2024', 0, 4) ?> · ★ <?= number_format($film['vote_average'] ?? 7.5, 1) ?></div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-span-full p-8 text-center bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <p class="text-zinc-300 text-base">Vendosni çelësin tuaj të API-së në $TMDB_API_KEY në fillim të këtij skedari index.php për të ngarkuar filmat live!</p>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>`;

  const htmlCode = `<!DOCTYPE html>
<html lang="sq" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ALFilms24 - Filma me Titra Shqip në HD & 4K</title>
    <meta name="description" content="Kinemaja juaj online me filmat dhe serialet më të fundit me titra shqip.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0A090D; color: #F4F4F5; }
        .font-display { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="min-h-screen">
    <!-- Header -->
    <header class="border-b border-zinc-800 bg-[#0A090D]/90 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div class="text-2xl font-bold font-display text-white">
            ALFilms<span class="text-red-500">24</span>
        </div>
        <div class="flex items-center gap-3">
            <span class="text-xs text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">Cilësi 4K & Titra Shqip</span>
        </div>
    </header>

    <!-- Hero Player & Catalog Container -->
    <main class="max-w-7xl mx-auto px-6 py-8">
        <div id="player-container" class="hidden mb-8 aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
            <iframe id="stream-frame" src="" class="w-full h-full border-0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation" referrerpolicy="origin"></iframe>
        </div>

        <h2 class="text-2xl font-bold font-display text-white mb-6">Katalogu i Filmave ALFilms24</h2>
        <div id="movies-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <!-- Filmat do të ngarkohen nga API me JavaScript -->
        </div>
    </main>

    <script>
        const TMDB_KEY = "${apiConfig.tmdbApiKey || 'ab546f5b4161f91cc8e87d32424c041e'}";
        const EMBED_SERVER = "${apiConfig.embedServerTemplate || 'https://autoembed.me/movie/tmdb/{id}'}";

        async function ngarkoFilmat() {
            const grid = document.getElementById('movies-grid');
            if (!TMDB_KEY) {
                grid.innerHTML = '<div class="col-span-full p-8 text-center bg-zinc-900 rounded-lg text-zinc-300">Ju lutem vendosni TMDB_KEY në kod ose përdorni aplikacionin kryesor ALFilms24!</div>';
                return;
            }
            try {
                const res = await fetch(\`https://api.themoviedb.org/3/movie/popular?api_key=\${TMDB_KEY}&language=en-US\`);
                const data = await res.json();
                grid.innerHTML = data.results.map(film => \`
                    <div class="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-red-500 transition" onclick="luajFilmin('\${film.id}')">
                        <img src="https://image.tmdb.org/t/p/w500\${film.poster_path}" class="w-full aspect-[3/4] object-cover">
                        <div class="p-3">
                            <div class="text-sm font-semibold truncate">\${film.title}</div>
                            <div class="text-xs text-zinc-400 mt-1">\${film.release_date.slice(0,4)} · ★ \${film.vote_average.toFixed(1)}</div>
                        </div>
                    </div>
                \`).join('');
            } catch (e) {
                grid.innerHTML = '<p class="text-red-400">Dështoi ngarkimi nga API.</p>';
            }
        }

        function luajFilmin(id) {
            const box = document.getElementById('player-container');
            const frame = document.getElementById('stream-frame');
            frame.src = EMBED_SERVER.replace('{id}', id);
            box.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        ngarkoFilmat();
    </script>
</body>
</html>`;

  const currentCode = activeTab === 'php' ? phpCode : htmlCode;
  const filename = activeTab === 'php' ? 'index.php' : 'index.html';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-3xl bg-[#0F0E16] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-950/80 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Eksportimi i Skedarëve (index.php & index.html)
              </h2>
              <p className="text-xs text-zinc-400">
                Gati për t'u ngarkuar në çdo hosting cPanel, Apache ose Nginx
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

        {/* Tab Switcher */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/40 px-5 pt-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('php')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'php'
                  ? 'border-red-500 text-red-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>index.php (PHP me cURL Proxy)</span>
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'border-red-500 text-red-400 font-semibold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>index.html (HTML5 Standalone)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-md border border-zinc-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'U Kopjua!' : 'Kopjo'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors cursor-pointer shadow-sm shadow-red-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Shkarko {filename}</span>
            </button>
          </div>
        </div>

        {/* Code Preview Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-grow bg-[#09080E]">
          <pre className="text-xs font-mono text-zinc-300 bg-black/60 p-4 rounded-lg border border-zinc-800/80 overflow-x-auto selection:bg-red-600">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-zinc-950 border-t border-zinc-800 text-xs text-zinc-400 flex items-center justify-between">
          <span>Skedari përmban automatikisht parametrat dhe shabllonet tuaja aktuale të API.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 rounded text-xs cursor-pointer"
          >
            Mbyll
          </button>
        </div>

      </div>

    </div>
  );
};
