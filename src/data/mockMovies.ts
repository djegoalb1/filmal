import { Movie } from '../types/movie';

// Generated high fidelity image assets
const HERO_BACKDROP = '/src/assets/images/alfilms_hero_blockbuster_1794158650974.jpg';
const ACTION_POSTER = '/src/assets/images/movie_action_thriller_1794158651108.jpg';
const SCIFI_POSTER = '/src/assets/images/movie_scifi_cyber_1794158651787.jpg';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'hero-blockbuster',
    title: 'Neo-Tirana: Rruga e Hijeve',
    originalTitle: 'Neo-Tirana: Shadow Protocol',
    year: 2026,
    rating: 9.3,
    duration: '2h 28m',
    genres: ['Aksion', 'Sci-Fi', 'Thriller'],
    overview: 'Në një metropol futuristik të mbushur me drita neoni dhe teknologji të avancuar, një ish-agjent i inteligjencës duhet të zbulojë një komplot që kërcënon lirinë e gjithë qytetit.',
    posterUrl: ACTION_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [
      { lang: 'sq', label: 'Shqip (ALFilms24 HD)', default: true },
      { lang: 'en', label: 'English CC' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP HD (Direkt)',
        type: 'direct',
        url: 'https://vjs.zencdn.net/v/oceans.mp4',
        quality: '4K Ultra HD'
      },
      {
        id: 's2',
        name: 'Server 2 - CDN Shpejtë',
        type: 'direct',
        url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        quality: '1080p Full HD'
      },
      {
        id: 's3',
        name: 'Server 3 - Trailer HD (Direkt)',
        type: 'direct',
        url: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
        quality: 'Trailer 1080p'
      }
    ],
    isAlbanian: false,
    isSeries: false,
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Ana de Armas', 'Blerim Destani', 'Harrison Ford'],
    imdbId: 'tt13824900',
    tmdbId: 823464
  },
  {
    id: 'movie-silent-protocol',
    title: 'Protokolli i Heshtjes',
    originalTitle: 'The Silent Protocol',
    year: 2025,
    rating: 8.9,
    duration: '2h 12m',
    genres: ['Aksion', 'Thriller', 'Krim'],
    overview: 'Në hijet e diplomacisë evropiane, një agjent i fshehtë tradhtohet nga organizata e tij dhe nis një garë kundër kohës për të zbardhur të vërtetën para se të jetë tepër vonë.',
    posterUrl: ACTION_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [
      { lang: 'sq', label: 'Shqip (Zyrtar)', default: true },
      { lang: 'en', label: 'English' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP HD',
        type: 'direct',
        url: 'https://vjs.zencdn.net/v/oceans.mp4',
        quality: '1080p'
      },
      {
        id: 's2',
        name: 'Server 2 - Rezervë',
        type: 'direct',
        url: 'https://archive.org/download/ElephantsDream/ed_hd.mp4',
        quality: '720p'
      }
    ],
    director: 'Eliza Vance',
    cast: ['Conrad Gordon', 'Liam Fisher', 'Benjamin Lee'],
    imdbId: 'tt11905399',
    tmdbId: 693134
  },
  {
    id: 'movie-cosmic-odyssey',
    title: 'Odiseja Kozmike',
    originalTitle: 'Cosmic Odyssey',
    year: 2024,
    rating: 8.8,
    duration: '2h 45m',
    genres: ['Sci-Fi', 'Aventurë', 'Dramë'],
    overview: 'Një ekspeditë epike përtej kufijve të njohur të hapësirës, ku një ekuipazh zbuluesish përballet me misteret e kohës dhe gravitetit në kërkim të një shtëpie të re për njerëzimin.',
    posterUrl: SCIFI_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [
      { lang: 'sq', label: 'Shqip (HD Master)', default: true },
      { lang: 'en', label: 'English' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP HD',
        type: 'direct',
        url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        quality: '1080p'
      }
    ],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Jessica Chastain', 'Anne Hathaway'],
    imdbId: 'tt0816692',
    tmdbId: 157336
  },
  {
    id: 'al-zgjoi',
    title: 'Zgjoi (Hive)',
    originalTitle: 'Hive',
    year: 2021,
    rating: 8.1,
    duration: '1h 24m',
    genres: ['Dramë', 'Filma Shqip', 'Biografi'],
    overview: 'Bazuar në ngjarje të vërtetë: Fahrije Hoti, burri i së cilës është zhdukur gjatë luftës në Kosovë, sfidon paragjykimet patriarkale të shoqërisë duke themeluar një biznes me gratë e fshatit të Krushës.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
    backdropUrl: HERO_BACKDROP,
    quality: '1080p HD',
    audio: 'Shqip (Origjinale)',
    subtitles: [
      { lang: 'sq', label: 'Shqip CC', default: true },
      { lang: 'en', label: 'English Subtitles' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP Shqip HD',
        type: 'direct',
        url: 'https://vjs.zencdn.net/v/oceans.mp4',
        quality: '1080p'
      }
    ],
    isAlbanian: true,
    director: 'Blerta Basholli',
    cast: ['Yllka Gashi', 'Çun Lajçi', 'Aurita Agushi', 'Kumrije Hoxha'],
    imdbId: 'tt13648212',
    tmdbId: 785536
  },
  {
    id: 'al-nentori-dyte',
    title: 'Nëntori i Dytë (Remastered)',
    originalTitle: 'Nëntori i Dytë',
    year: 1982,
    rating: 9.4,
    duration: '1h 35m',
    genres: ['Histori', 'Filma Shqip', 'Dramë'],
    overview: 'Klasiku i përjetshëm i kinematografisë shqiptare: Udhëtimi historik i Ismail Qemalit dhe delegatëve patriotë nga Durrësi në Vlorë për shpalljen e Pavarësisë së Shqipërisë më 28 Nëntor 1912.',
    posterUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    backdropUrl: HERO_BACKDROP,
    quality: '1080p HD',
    audio: 'Shqip (Origjinale Remastered)',
    subtitles: [
      { lang: 'sq', label: 'Shqip', default: true },
      { lang: 'en', label: 'English' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - Kinostudio HD',
        type: 'direct',
        url: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
        quality: '1080p'
      }
    ],
    isAlbanian: true,
    director: 'Viktor Gjika',
    cast: ['Sandër Prosi', 'Reshat Arbana', 'Bujar Lako', 'Robert Ndrenika'],
    imdbId: 'tt0170314',
    tmdbId: 284144
  },
  {
    id: 'al-perralle-kaluara',
    title: 'Përrallë nga e Kaluara',
    originalTitle: 'Përrallë nga e Kaluara',
    year: 1987,
    rating: 9.1,
    duration: '1h 22m',
    genres: ['Komedi', 'Filma Shqip', 'Romancë'],
    overview: 'Bazuar në novelën e Andon Zako Çajupit: Gjino 14-vjeçar martohet me Marigonë 28-vjeçare sipas zakonit të prapambetur, por Marigoja hakmerret me mençuri ndaj vjehrrit dhe rrethit.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    backdropUrl: HERO_BACKDROP,
    quality: '1080p HD',
    audio: 'Shqip (Origjinale)',
    subtitles: [{ lang: 'sq', label: 'Shqip', default: true }],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - HD',
        type: 'direct',
        url: 'https://vjs.zencdn.net/v/oceans.mp4',
        quality: '1080p'
      }
    ],
    isAlbanian: true,
    director: 'Anxhon Zhegu',
    cast: ['Elvira Diamanti', 'Admir Sorra', 'Robert Ndrenika', 'Hajrie Rondo'],
    imdbId: 'tt0298099',
    tmdbId: 279512
  },
  {
    id: 'movie-gladiator-2',
    title: 'Gladiator II',
    originalTitle: 'Gladiator II',
    year: 2024,
    rating: 7.8,
    duration: '2h 28m',
    genres: ['Aksion', 'Dramë', 'Histori'],
    overview: 'Vite pasi dëshmoi vdekjen e heroit Maximus nga xhaxhai i tij, Lucius duhet të hyjë në Koloseum pasi shtëpia e tij pushtohet nga perandorët tiranikë që udhëheqin Romën.',
    posterUrl: ACTION_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [
      { lang: 'sq', label: 'Titra Shqip ALFilms', default: true },
      { lang: 'en', label: 'English' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP 4K',
        type: 'direct',
        url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        quality: '4K'
      }
    ],
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    imdbId: 'tt9218128',
    tmdbId: 558449
  },
  {
    id: 'movie-dune-2',
    title: 'Dune: Part Two',
    originalTitle: 'Dune: Part Two',
    year: 2024,
    rating: 8.6,
    duration: '2h 46m',
    genres: ['Sci-Fi', 'Aventurë', 'Dramë'],
    overview: 'Paul Atreides bashkohet me Chani dhe Fremen ndërsa kërkon hakmarrje kundër komplotistëve që shkatërruan familjen e tij, duke u përballur me zgjedhjen midis dashurisë së jetës së tij dhe fatit të universit.',
    posterUrl: SCIFI_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [
      { lang: 'sq', label: 'Titra Shqip HD', default: true },
      { lang: 'en', label: 'English' }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - Stream HD',
        type: 'direct',
        url: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
        quality: '4K HDR'
      }
    ],
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    imdbId: 'tt15239678',
    tmdbId: 693134
  },
  {
    id: 'series-breaking-bad',
    title: 'Breaking Bad (Sezoni 1-5)',
    originalTitle: 'Breaking Bad',
    year: 2023,
    rating: 9.5,
    duration: '48m / epizod',
    genres: ['Seriale', 'Krim', 'Dramë', 'Thriller'],
    overview: 'Një profesor kimie në shkollë të mesme, i diagnostikuar me kancer në mushkëri në fazë të terminale, bashkohet me një ish-nxënës për të prodhuar dhe shitur metamfetaminë me qëllim të sigurojë të ardhmen e familjes.',
    posterUrl: ACTION_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '1080p HD',
    audio: 'Origjinale (Titra Shqip)',
    isSeries: true,
    subtitles: [{ lang: 'sq', label: 'Titra Shqip (Të Gjithë Sezonet)', default: true }],
    seasons: [
      {
        seasonNumber: 1,
        title: 'Sezoni 1',
        episodes: [
          {
            episodeNumber: 1,
            seasonNumber: 1,
            title: 'Episodi 1: Piloti',
            duration: '58m',
            streamUrl: 'https://vjs.zencdn.net/v/oceans.mp4'
          },
          {
            episodeNumber: 2,
            seasonNumber: 1,
            title: 'Episodi 2: Macja në Thes',
            duration: '48m',
            streamUrl: 'https://archive.org/download/ElephantsDream/ed_hd.mp4'
          },
          {
            episodeNumber: 3,
            seasonNumber: 1,
            title: 'Episodi 3: ...Dhe Çanta është në Ibrik',
            duration: '48m',
            streamUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4'
          }
        ]
      }
    ],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - Seriale VIP',
        type: 'direct',
        url: 'https://vjs.zencdn.net/v/oceans.mp4',
        quality: '1080p'
      }
    ],
    director: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn', 'Giancarlo Esposito'],
    imdbId: 'tt0903747',
    tmdbId: 1396
  },
  {
    id: 'movie-oppenheimer',
    title: 'Oppenheimer',
    originalTitle: 'Oppenheimer',
    year: 2023,
    rating: 8.9,
    duration: '3h 0m',
    genres: ['Biografi', 'Dramë', 'Histori'],
    overview: 'Historia e shkencëtarit amerikan J. Robert Oppenheimer dhe roli i tij drejtues në zhvillimin e bombës së parë atomike gjatë Projektit Manhattan.',
    posterUrl: ACTION_POSTER,
    backdropUrl: HERO_BACKDROP,
    quality: '4K',
    audio: 'Origjinale (Titra Shqip)',
    subtitles: [{ lang: 'sq', label: 'Titra Shqip (Master HD)', default: true }],
    sources: [
      {
        id: 's1',
        name: 'Server 1 - VIP IMAX HD',
        type: 'direct',
        url: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
        quality: '4K'
      }
    ],
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    imdbId: 'tt15398776',
    tmdbId: 872585
  }
];
