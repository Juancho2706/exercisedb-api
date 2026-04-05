import { Hono } from 'hono'
import { FileLoader } from '../data/load'
import { Exercise } from '../data/types'

export const Home = new Hono()

const BodyVisualizer = () => {
  return (
    <div class="flex flex-col items-center space-y-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
      <div class="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
        <h2 class="text-xl font-bold text-zinc-100">Filter by Target Muscle</h2>
        <button 
          onclick="window.exportFavorites()"
          id="export-btn"
          class="hidden px-4 py-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-full font-bold text-sm hover:bg-zinc-700 transition-all shadow-lg active:scale-95"
        >
          Export
        </button>
        <button 
          onclick="window.toggleFavoritesModal(true)"
          id="favorites-btn"
          class="hidden px-4 py-2 bg-zinc-100 text-black rounded-full font-bold text-sm hover:bg-white transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          View Favorites (0)
        </button>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full">
        {[
          { id: 'abs', label: 'Abs' },
          { id: 'biceps', label: 'Biceps' },
          { id: 'triceps', label: 'Triceps' },
          { id: 'chest', label: 'Chest' },
          { id: 'back', label: 'Back' },
          { id: 'shoulders', label: 'Shoulders' },
          { id: 'glutes', label: 'Glutes' },
          { id: 'quads', label: 'Quads' },
          { id: 'hamstrings', label: 'Hamstrings' },
          { id: 'calves', label: 'Calves' },
          { id: 'cardio', label: 'Cardio' },
          { id: 'full body', label: 'Full Body' }
        ].map((muscle) => (
          <button
            onclick={`window.filterByMuscle('${muscle.id}')`}
            class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-all text-xs font-medium focus:ring-2 focus:ring-zinc-500 truncate"
          >
            {muscle.label}
          </button>
        ))}
      </div>
      <p class="text-xs text-zinc-500 italic">Select a muscle group to filter or search for specific equipment/exercises</p>
    </div>
  )
}

export const Meteors = ({ number }: { number: number }) => {
  return (
    <>
      {Array.from({ length: number || 30 }, (_, idx) => (
        <span
          key={idx}
          class="meteor animate-[meteorAnimation_3s_linear_infinite] absolute h-1 w-1 rounded-[9999px] shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]"
          style={{
            top: 0,
            left: `${Math.floor(Math.random() * (400 - -400) + -400)}px`,
            animationDelay: `${Math.random() * (0.8 - 0.2) + 0.2}s`,
            animationDuration: `${Math.floor(Math.random() * (10 - 2) + 2)}s`
          }}
        />
      ))}
    </>
  )
}

const ExerciseCard = ({ exercise, index }: { exercise: Exercise, index: number }) => {
  return (
    <div id={`exercise-${exercise.exerciseId}`} class="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col space-y-3 hover:border-zinc-700 transition-colors group relative">
      <div class="absolute top-6 left-6 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg border border-zinc-700 text-zinc-300 text-xs font-bold font-mono">
        #{index}
      </div>
      <button 
        onclick={`window.toggleFavorite('${exercise.exerciseId}', ${JSON.stringify(exercise).replace(/"/g, '"')})`}
        class="favorite-btn absolute top-6 right-6 z-20 p-2 bg-black/50 backdrop-blur-md rounded-full border border-zinc-700 text-zinc-400 hover:text-yellow-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="star-icon">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      </button>

      <div class="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div class="flex flex-col flex-grow">
        <h3 class="text-zinc-100 font-bold text-lg capitalize line-clamp-1">{exercise.name}</h3>
        <div class="flex flex-wrap gap-1 mt-2">
          {exercise.bodyParts.map((part) => (
            <span class="text-[10px] uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
              {part}
            </span>
          ))}
          {exercise.targetMuscles.map((muscle) => (
            <span class="text-[10px] uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
              {muscle}
            </span>
          ))}
        </div>
      </div>
      <div class="mt-auto pt-3 border-t border-zinc-800">
        <p class="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">JSON Path</p>
        <pre class="text-[10px] bg-black p-2 rounded overflow-x-auto text-zinc-400 font-mono">
          {JSON.stringify(exercise, null, 2)}
        </pre>
      </div>
    </div>
  )
}

const Pagination = ({ page, totalPages, query }: { page: number, totalPages: number, query: string }) => {
  const createUrl = (p: number) => `/?page=${p}${query ? `&q=${encodeURIComponent(query)}` : ''}`
  return (
    <div class="flex items-center justify-center space-x-2 my-8 z-10 relative">
      {page > 1 ? (
        <a href={createUrl(page - 1)} class="px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors font-medium text-sm">Previous</a>
      ) : (
        <button disabled class="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-lg cursor-not-allowed font-medium text-sm">Previous</button>
      )}
      
      <div class="flex items-center space-x-2 mx-4 text-sm font-medium text-zinc-400">
        <span>Page</span>
        <input 
          type="number" 
          value={page}
          min={1}
          max={totalPages}
          onkeydown={`window.handlePageJump(event, ${totalPages})`}
          class="w-16 bg-zinc-900 border border-zinc-800 text-center text-white py-1 rounded-md focus:outline-none focus:border-zinc-500"
        />
        <span>of {totalPages}</span>
      </div>
      
      {page < totalPages ? (
        <a href={createUrl(page + 1)} class="px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors font-medium text-sm">Next</a>
      ) : (
        <button disabled class="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-lg cursor-not-allowed font-medium text-sm">Next</button>
      )}
    </div>
  )
}

Home.get('/', async (c) => {
  const query = c.req.query('q')?.toLowerCase() || ''
  const page = Math.max(1, parseInt(c.req.query('page') || '1') || 1)
  const limit = 50
  
  const exercisesData = await FileLoader.loadExercises()
  const filteredExercises = exercisesData
    .filter((ex) => !query || ex.name.toLowerCase().includes(query) || ex.targetMuscles.some((m) => m.toLowerCase().includes(query)) || ex.bodyParts.some((b) => b.toLowerCase().includes(query)))

  const totalPages = Math.ceil(filteredExercises.length / limit)
  const validPage = Math.min(page, Math.max(1, totalPages))
  
  const start = (validPage - 1) * limit
  const paginatedExercises = filteredExercises.slice(start, start + limit)

  const title = 'ExerciseDB Explorer'
  const description =
    'Access detailed data on over 1300+ exercises with the ExerciseDB API. This API offers extensive information on each exercise, including target body parts, equipment needed, GIFs for visual guidance, and step-by-step instructions.'
  const keywords =
    'exercisedb api, fitness exercise database api, fitness API, exercise database, workout API, fitness data API, muscle exercises, exercise gif api, gym API, exercise videos, exercise images, exercise instructions, gym workouts api ,  workouts exercises, home workouts, muscle gain workouts, weight loss exercises'

  return c.html(
    <html>
      <head>
        <title>ExerciseDB Explorer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charset="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="ExerciseDB" />
        <meta name="author" content="Ascend API" />
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://cdn.exercisedb.dev/exercisedb/exercisedb_banner.png" />
        <meta property="og:url" content="https://github.com/exercisedb/exercisedb-api" />

        {/* Twitter Card Tags */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://cdn.exercisedb.dev/exercisedb/exercisedb_banner.png" />

        <link rel="icon" href="https://cdn.exercisedb.dev/exercisedb/android-chrome-512x512.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com" />
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="83e304bf-ca81-4b79-a14c-73dcb6e5d035"
        ></script>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            * { font-family: 'Inter', sans-serif; } 
            @keyframes borderAnimation {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            @keyframes meteorAnimation {
              0% { transform: rotate(215deg) translateX(0); opacity: 1; }
              70% { opacity: 1; }
              100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
            }
            .meteor::before {
              content: '';
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 50px;
              height: 1px;
              background: linear-gradient(90deg, #64748b, transparent);
            }
            .animate-meteor-effect {
              animation-name: meteorAnimation;
            }
            .is-favorite .star-icon {
              fill: #eab308;
              stroke: #eab308;
            }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
              -webkit-appearance: none; 
              margin: 0; 
            }
            input[type=number] {
              -moz-appearance: textfield;
            }`
          }}
        />
      </head>{' '}
      <body class="bg-black mx-auto md:min-h-screen max-w-screen-xl flex flex-col">
        <main class="mx-auto my-auto flex flex-col space-y-12 px-6 pb-20 md:py-16 relative overflow-x-hidden">
          <Meteors number={15} />

          <header class="flex flex-col items-center text-center space-y-6 relative z-10">
            <h1 class="text-4xl md:text-6xl text-transparent font-extrabold leading-tight bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
              ExerciseDB Explorer
            </h1>
            <p class="text-zinc-500 max-w-2xl text-lg">
              Explore our database with over 1,300+ exercises. Visualize techniques, muscles and get structured JSON data instantly.
            </p>

            <form method="get" action="/" class="w-full max-w-md relative group">
              <input
                id="search-input"
                type="text"
                name="q"
                value={query}
                placeholder="Search exercises, muscles or body parts..."
                class="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 px-6 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all group-hover:border-zinc-700"
              />
              <button type="submit" class="absolute right-3 top-2 bottom-2 px-6 bg-zinc-100 text-black rounded-full font-bold text-sm hover:bg-white transition-colors">
                Search
              </button>
            </form>
          </header>

          <div class="relative z-10">
            <BodyVisualizer />
          </div>

          {totalPages > 0 && <Pagination page={validPage} totalPages={totalPages} query={query} />}

          <div id="exercise-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-20">
            {paginatedExercises.map((exercise, i) => (
              <ExerciseCard exercise={exercise} index={start + i + 1} />
            ))}
          </div>

          {totalPages > 0 && <Pagination page={validPage} totalPages={totalPages} query={query} />}

          {filteredExercises.length === 0 && (
            <div id="no-results" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800 relative z-10">
              <p class="text-zinc-500">No exercises found for "{query}"</p>
            </div>
          )}

          <footer class="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-zinc-900 gap-6">
            <div class="flex items-center space-x-4">
              <a href="/docs" class="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Documentation</a>
              <a href="https://github.com/exercisedb/exercisedb-api" class="text-zinc-400 hover:text-white transition-colors text-sm font-medium">GitHub</a>
            </div>
            <p class="text-zinc-600 text-xs">ExerciseDB API - Open Source Project</p>
          </footer>
        </main>

        {/* Favorites Modal */}
        <div id="favorites-modal" class="fixed inset-0 z-[100] hidden">
          <div onclick="window.toggleFavoritesModal(false)" class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div class="absolute right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col transform transition-transform duration-300 translate-x-full" id="favorites-panel">
            <div class="p-6 border-b border-zinc-900 flex justify-between items-center">
              <h2 class="text-xl font-bold text-white">Your Favorites</h2>
              <button onclick="window.toggleFavoritesModal(false)" class="text-zinc-500 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div id="favorites-list" class="flex-grow overflow-y-auto p-6 space-y-4">
              {/* Favs will be injected here */}
              <div class="text-center py-10">
                <p class="text-zinc-500">No favorites yet.</p>
              </div>
            </div>
            <div class="p-6 border-t border-zinc-900 bg-zinc-950/50">
              <button 
                onclick="window.exportFavorites()"
                class="w-full py-3 bg-zinc-100 text-black rounded-xl font-bold hover:bg-white transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                <span>Export Routine</span>
              </button>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          let query = "${query}";
          let favorites = JSON.parse(localStorage.getItem('exercisedb_favs') || '{}');

          const updateExportButton = () => {
            const exportBtn = document.getElementById('export-btn');
            const favBtn = document.getElementById('favorites-btn');
            const count = Object.keys(favorites).length;
            
            if (count > 0) {
              exportBtn.classList.remove('hidden');
              favBtn.classList.remove('hidden');
              favBtn.innerText = 'View Favorites (' + count + ')';
            } else {
              exportBtn.classList.add('hidden');
              favBtn.classList.add('hidden');
            }
          };

          const renderFavoritesList = () => {
            const list = document.getElementById('favorites-list');
            const favs = Object.values(favorites);
            
            if (favs.length === 0) {
              list.innerHTML = '<div class="text-center py-10"><p class="text-zinc-500">No favorites yet.</p></div>';
              return;
            }

            list.innerHTML = favs.map(ex => (
              '<div class="flex items-center space-x-4 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-900 group">' +
                '<img src="' + ex.gifUrl + '" class="w-16 h-16 rounded-lg object-cover bg-zinc-800" />' +
                '<div class="flex-grow min-w-0">' +
                  '<h4 class="text-white font-bold text-sm capitalize truncate">' + ex.name + '</h4>' +
                  '<p class="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">' + (ex.targetMuscles[0] || '') + '</p>' +
                '</div>' +
                '<button ' +
                  'onclick="window.toggleFavorite(\\'' + ex.exerciseId + '\\', null)" ' +
                  'class="p-2 text-zinc-600 hover:text-red-500 transition-colors"' +
                '>' +
                  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>' +
                '</button>' +
              '</div>'
            )).join('');
          };

          window.toggleFavoritesModal = (show) => {
            const modal = document.getElementById('favorites-modal');
            const panel = document.getElementById('favorites-panel');
            if (show) {
              renderFavoritesList();
              modal.classList.remove('hidden');
              setTimeout(() => panel.classList.remove('translate-x-full'), 10);
            } else {
              panel.classList.add('translate-x-full');
              setTimeout(() => modal.classList.add('hidden'), 300);
            }
          };

          const updateStarUI = (id) => {
            const card = document.getElementById('exercise-' + id);
            if (!card) return;
            const btn = card.querySelector('.favorite-btn');
            if (favorites[id]) {
              btn.classList.add('is-favorite');
            } else {
              btn.classList.remove('is-favorite');
            }
          };

          window.toggleFavorite = (id, exercise) => {
            if (favorites[id]) {
              delete favorites[id];
            } else {
              favorites[id] = exercise;
            }
            localStorage.setItem('exercisedb_favs', JSON.stringify(favorites));
            updateStarUI(id);
            updateExportButton();
            if (document.getElementById('favorites-modal').classList.contains('hidden') === false) {
              renderFavoritesList();
            }
          };

          window.exportFavorites = () => {
            const favList = Object.values(favorites);
            if (favList.length === 0) return;

            const grouped = favList.reduce((acc, ex) => {
              const muscle = ex.targetMuscles[0] || 'Other';
              if (!acc[muscle]) acc[muscle] = [];
              acc[muscle].push(ex.name);
              return acc;
            }, {});

            let text = "🏋️ MY WORKOUT ROUTINE\\n\\n";
            for (const [muscle, exercises] of Object.entries(grouped)) {
              text += \`🔹 \${muscle.toUpperCase()}:\\n\`;
              exercises.forEach(name => text += \`  • \${name}\\n\`);
              text += "\\n";
            }
            text += "Shared from ExerciseDB Explorer";

            navigator.clipboard.writeText(text).then(() => {
              alert("Routine copied to clipboard! 🎉\\n\\nYou can paste it in WhatsApp or any chat to share with friends.");
            });
          };

          window.filterByMuscle = (muscle) => {
            const input = document.getElementById('search-input');
            input.value = muscle;
            input.form.submit();
          };

          window.handlePageJump = (e, totalPages) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              let val = parseInt(e.target.value);
              if (isNaN(val)) return;
              if (val < 1) val = 1;
              if (val > totalPages) val = totalPages;
              
              const urlParams = new URLSearchParams(window.location.search);
              urlParams.set('page', val);
              window.location.href = '/?' + urlParams.toString();
            }
          };

          // Ejecutar chequeo inicial
          setTimeout(() => {
            Object.keys(favorites).forEach(id => updateStarUI(id));
            updateExportButton();
          }, 100);
        `}} />
      </body>
    </html>
  )
})
