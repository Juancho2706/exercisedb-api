import { Hono } from 'hono'
import { FileLoader } from '../data/load'
import { Exercise } from '../data/types'

export const Home = new Hono()

const BodyVisualizer = () => {
  return (
    <div class="flex flex-col items-center space-y-4 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
      <h2 class="text-xl font-bold text-zinc-100">Filtrar por Grupo Muscular</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {[
          { id: 'abs', label: 'Abdominales' },
          { id: 'biceps', label: 'Bíceps' },
          { id: 'chest', label: 'Pecho' },
          { id: 'back', label: 'Espalda' },
          { id: 'glutes', label: 'Glúteos' },
          { id: 'quads', label: 'Cuádriceps' },
          { id: 'hamstrings', label: 'Isquios' },
          { id: 'shoulders', label: 'Hombros' }
        ].map((muscle) => (
          <button
            onclick={`window.filterByMuscle('${muscle.id}')`}
            class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-xl border border-zinc-700 transition-all text-sm font-medium focus:ring-2 focus:ring-zinc-500"
          >
            {muscle.label}
          </button>
        ))}
      </div>
      <p class="text-xs text-zinc-500 italic">Selecciona un grupo para filtrar instantáneamente</p>
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

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  return (
    <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col space-y-3 hover:border-zinc-700 transition-colors group">
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

Home.get('/', async (c) => {
  const query = c.req.query('q')?.toLowerCase() || ''
  const limit = 24
  const exercisesData = await FileLoader.loadExercises()
  const filteredExercises = exercisesData
    .filter((ex) => !query || ex.name.toLowerCase().includes(query) || ex.targetMuscles.some((m) => m.toLowerCase().includes(query)))

  const initialExercises = filteredExercises.slice(0, limit)
  const hasMore = filteredExercises.length > limit

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
              Explora nuestra base de datos con más de 1,300 ejercicios. Visualiza técnicas, músculos y obtén la data
              estructurada en JSON instantáneamente.
            </p>

            <form method="get" action="/" class="w-full max-w-md relative group">
              <input
                id="search-input"
                type="text"
                name="q"
                value={query}
                placeholder="Busca ejercicios o músculos..."
                class="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 px-6 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all group-hover:border-zinc-700"
              />
              <button type="submit" class="absolute right-3 top-2 bottom-2 px-6 bg-zinc-100 text-black rounded-full font-bold text-sm hover:bg-white transition-colors">
                Buscar
              </button>
            </form>
          </header>

          <div class="relative z-10">
            <BodyVisualizer />
          </div>

          <div id="exercise-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
            {initialExercises.map((exercise) => (
              <ExerciseCard exercise={exercise} />
            ))}
          </div>

          <div id="loading-trigger" class="h-20 flex items-center justify-center relative z-10">
             {hasMore && (
               <div class="flex items-center space-x-2 text-zinc-500 animate-pulse">
                 <div class="w-2 h-2 bg-zinc-500 rounded-full"></div>
                 <div class="w-2 h-2 bg-zinc-500 rounded-full"></div>
                 <div class="w-2 h-2 bg-zinc-500 rounded-full"></div>
                 <span class="text-sm ml-2">Cargando más ejercicios...</span>
               </div>
             )}
          </div>

          {filteredExercises.length === 0 && (
            <div id="no-results" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
              <p class="text-zinc-500">No se encontraron ejercicios que coincidan con "{query}"</p>
            </div>
          )}

          <footer class="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-zinc-900 gap-6">
            <div class="flex items-center space-x-4">
              <a href="/docs" class="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Documentación</a>
              <a href="https://github.com/exercisedb/exercisedb-api" class="text-zinc-400 hover:text-white transition-colors text-sm font-medium">GitHub</a>
            </div>
            <p class="text-zinc-600 text-xs">ExerciseDB API - Open Source Project</p>
          </footer>
        </main>

        <script dangerouslySetInnerHTML={{ __html: `
          let page = 1;
          const limit = ${limit};
          let query = "${query}";
          let loading = false;
          let hasMore = ${hasMore};

          window.filterByMuscle = (muscle) => {
            const input = document.getElementById('search-input');
            input.value = muscle;
            input.form.submit();
          };

          const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !loading && hasMore) {
              loading = true;
              page++;
              
              try {
                const res = await fetch(\`/api/exercises/list?page=\${page}&limit=\${limit}&q=\${query}\`);
                const data = await res.json();
                
                if (data.exercises.length < limit) hasMore = false;
                if (data.exercises.length === 0) {
                  document.getElementById('loading-trigger').style.display = 'none';
                  return;
                }

                const grid = document.getElementById('exercise-grid');
                data.html.forEach(html => {
                  const div = document.createElement('div');
                  div.innerHTML = html;
                  grid.appendChild(div.firstElementChild);
                });

                if (!hasMore) {
                  document.getElementById('loading-trigger').innerHTML = '<p class="text-zinc-600 text-sm">Has llegado al final</p>';
                }
              } catch (err) {
                console.error('Error loading more exercises:', err);
              } finally {
                loading = false;
              }
            }
          }, { threshold: 0.1 });

          const trigger = document.getElementById('loading-trigger');
          if (trigger) observer.observe(trigger);
        `}} />
      </body>
    </html>
  )
})

Home.get('/api/exercises/list', async (c) => {
  const query = c.req.query('q')?.toLowerCase() || ''
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '24')
  
  const exercisesData = await FileLoader.loadExercises()
  const filteredExercises = exercisesData
    .filter((ex) => !query || ex.name.toLowerCase().includes(query) || ex.targetMuscles.some((m) => m.toLowerCase().includes(query)))
  
  const start = (page - 1) * limit
  const paginated = filteredExercises.slice(start, start + limit)

  const htmlCards = paginated.map(ex => `
    <div class="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col space-y-3 hover:border-zinc-700 transition-colors group">
      <div class="relative aspect-square overflow-hidden rounded-lg bg-zinc-800">
        <img
          src="${ex.gifUrl}"
          alt="${ex.name}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div class="flex flex-col flex-grow">
        <h3 class="text-zinc-100 font-bold text-lg capitalize line-clamp-1">${ex.name}</h3>
        <div class="flex flex-wrap gap-1 mt-2">
          ${ex.bodyParts.map(part => `
            <span class="text-[10px] uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
              ${part}
            </span>
          `).join('')}
          ${ex.targetMuscles.map(muscle => `
            <span class="text-[10px] uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-bold">
              ${muscle}
            </span>
          `).join('')}
        </div>
      </div>
      <div class="mt-auto pt-3 border-t border-zinc-800">
        <p class="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-wider">JSON Path</p>
        <pre class="text-[10px] bg-black p-2 rounded overflow-x-auto text-zinc-400 font-mono">${JSON.stringify(ex, null, 2)}</pre>
      </div>
    </div>
  `)

  return c.json({ exercises: paginated, html: htmlCards })
})
