<?php
/**
 * ALFilms24 - Kinemaja Juaj Online (index.php)
 * Faqe e plotë me transmetim filmash, titra shqip dhe mbështetje API.
 */

// Konfigurimi i API nga përdoruesi:
$TMDB_API_KEY = "ab546f5b4161f91cc8e87d32424c041e";
$DEFAULT_EMBED = "https://autoembed.me/movie/tmdb/{id}";

// Merr filmat më të fundit nga TMDb API me cURL
function merrFilmaTmdb($apiKey, $endpoint = 'movie/popular') {
    if (empty($apiKey) || $apiKey === 'VENDOS_KETU_CELASIN_TUAJ_TMDB') {
        return null;
    }
    $ch = curl_init("https://api.themoviedb.org/3/$endpoint?api_key=$apiKey&language=en-US&page=1");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
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
    <title>ALFilms24 - Filma me Titra Shqip në HD & 4K (PHP Version)</title>
    <meta name="description" content="Kinemaja juaj online me filmat më të fundit me titra shqip në HD dhe 4K.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0A090D; color: #F4F4F5; }
        .font-display { font-family: 'Outfit', sans-serif; }
    </style>
</head>
<body class="min-h-screen">
    <!-- Header ALFilms24 -->
    <header class="border-b border-zinc-800 bg-[#0A090D]/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <a href="index.php" class="text-2xl font-bold font-display text-white">
            ALFilms<span class="text-red-500">24</span>
        </a>
        <nav class="hidden md:flex gap-6 text-sm text-zinc-300">
            <a href="index.php" class="text-red-500 font-semibold">Ballina</a>
            <a href="#shqip" class="hover:text-white">Filma Shqip</a>
            <a href="#aksion" class="hover:text-white">Aksion</a>
            <a href="#seriale" class="hover:text-white">Seriale</a>
        </nav>
        <div class="flex items-center gap-2">
            <span class="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">PHP Server Ready</span>
        </div>
    </header>

    <!-- Video Player Container (Hidden by default, shown when user clicks a movie) -->
    <section id="player-section" class="hidden max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div class="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div class="p-3 bg-zinc-900 border-b border-zinc-800 flex flex-wrap justify-between items-center gap-2">
                <span id="player-title" class="font-semibold text-sm text-white truncate max-w-md">Duke transmetuar filmin...</span>
                <div class="flex items-center gap-2">
                    <a id="player-external-link" href="#" target="_blank" rel="noopener noreferrer" class="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-white font-bold shadow transition">Hap në Ekran të Plotë (Mobile / Pa Sandbox)</a>
                    <button onclick="mbyllPlayer()" class="text-xs px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-300">Mbyll</button>
                </div>
            </div>

            <!-- Server Switcher Bar -->
            <div class="px-3 py-2 bg-zinc-950 border-b border-zinc-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span class="text-zinc-400 font-medium">Serveri:</span>
                <button onclick="ndryshoServer(1)" id="srv-btn-1" class="px-2.5 py-1 rounded bg-red-600 text-white font-medium text-xs">Server 1 (AutoEmbed HD)</button>
                <button onclick="ndryshoServer(2)" id="srv-btn-2" class="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs">Server 2 (VidLink VIP)</button>
                <button onclick="ndryshoServer(3)" id="srv-btn-3" class="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs">Server 3 (VidSrc HD)</button>
                <button onclick="ndryshoServer(4)" id="srv-btn-4" class="px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs">Server 4 (MultiEmbed)</button>
            </div>

            <div class="aspect-video w-full bg-black relative">
                <iframe id="stream-frame" src="" class="w-full h-full border-0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation" referrerpolicy="origin"></iframe>
            </div>
        </div>
    </section>

    <!-- Main Catalog -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 class="text-2xl sm:text-3xl font-bold font-display text-white mb-6">Filmat më të Fundit me Titra Shqip</h1>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <?php if (!empty($filmat['results'])): ?>
                <?php foreach ($filmat['results'] as $film): ?>
                    <div class="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden group cursor-pointer hover:border-red-500 transition-all"
                         onclick="hapPlayer('<?= $film['id'] ?>', '<?= htmlspecialchars(addslashes($film['title'])) ?>')">
                        <div class="aspect-[3/4] overflow-hidden bg-zinc-900">
                            <img src="https://image.tmdb.org/t/p/w500<?= htmlspecialchars($film['poster_path']) ?>" 
                                 alt="<?= htmlspecialchars($film['title']) ?>" 
                                 class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                        </div>
                        <div class="p-3">
                            <h3 class="font-semibold text-sm truncate text-zinc-100"><?= htmlspecialchars($film['title']) ?></h3>
                            <div class="text-xs text-zinc-400 mt-1 flex items-center justify-between">
                                <span><?= substr($film['release_date'] ?? '2024', 0, 4) ?></span>
                                <span class="text-amber-400 font-medium">★ <?= number_format($film['vote_average'] ?? 7.5, 1) ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="col-span-full p-8 text-center bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-3">
                    <h3 class="text-lg font-bold text-white font-display">Mirësevini në ALFilms24 (PHP)!</h3>
                    <p class="text-zinc-400 text-sm max-w-xl mx-auto">
                        Vendosni çelësin tuaj të API-së në variablin <code class="text-red-400 font-mono bg-zinc-900 px-1 py-0.5 rounded">$TMDB_API_KEY</code> në fillim të këtij skedari për të ngarkuar menjëherë qindra filma të fundit me titra shqip!
                    </p>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <script>
        let currentMovieId = null;
        let currentTitle = '';
        let currentServerNum = 1;

        function merrUrlServeri(serverNum, id) {
            switch(serverNum) {
                case 1: return `https://autoembed.me/movie/tmdb/${id}`;
                case 2: return `https://vidlink.pro/movie/${id}`;
                case 3: return `https://vidsrc.to/embed/movie/${id}`;
                case 4: return `https://multiembed.mov/?video_id=${id}&tmdb=1`;
                default: return `https://autoembed.me/movie/tmdb/${id}`;
            }
        }

        function ndryshoServer(serverNum) {
            currentServerNum = serverNum;
            for (let i = 1; i <= 4; i++) {
                const btn = document.getElementById('srv-btn-' + i);
                if (btn) {
                    if (i === serverNum) {
                        btn.className = 'px-2.5 py-1 rounded bg-red-600 text-white font-medium text-xs';
                    } else {
                        btn.className = 'px-2.5 py-1 rounded bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs';
                    }
                }
            }
            if (currentMovieId) {
                const targetUrl = merrUrlServeri(serverNum, currentMovieId);
                const frame = document.getElementById('stream-frame');
                frame.src = targetUrl;
                document.getElementById('player-external-link').href = targetUrl;
            }
        }

        function hapPlayer(id, titulli) {
            currentMovieId = id;
            currentTitle = titulli;
            const sec = document.getElementById('player-section');
            const frame = document.getElementById('stream-frame');
            const titleElem = document.getElementById('player-title');
            
            const targetUrl = merrUrlServeri(currentServerNum, id);
            frame.src = targetUrl;
            document.getElementById('player-external-link').href = targetUrl;
            titleElem.innerText = titulli + ' - ALFilms24 HD Stream';
            sec.classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function mbyllPlayer() {
            const sec = document.getElementById('player-section');
            const frame = document.getElementById('stream-frame');
            frame.src = '';
            sec.classList.add('hidden');
        }
    </script>
</body>
</html>
