# 📚 Documentación de APIs - Explorador de Películas

## 📋 Resumen

Esta documentación describe todas las APIs tRPC implementadas en la aplicación, incluyendo endpoints, parámetros, respuestas y ejemplos de uso.

## 🔧 Configuración Base

### Cliente tRPC
```typescript
import { trpc } from '@/lib/trpc-client'

// Uso en componentes React
const { data, isLoading, error } = trpc.movies.getTop250.useQuery({})
```

### Configuración del Provider
```typescript
// lib/trpc-provider.tsx
<TRPCProvider>
  <App />
</TRPCProvider>
```

## 🎬 API de Películas

### Base URL
```
/api/trpc/movies
```

---

## 📖 Endpoints Disponibles

### 1. `getTop250` - Obtener Top 250 Películas

**Descripción**: Obtiene las 250 mejores películas según IMDb con filtros opcionales.

**Endpoint**: `movies.getTop250`

**Tipo**: `Query`

**Parámetros de Entrada**:
```typescript
interface GetTop250Input {
  genre?: string  // Filtro opcional por género
}
```

**Ejemplo de Uso**:
```typescript
// Obtener todas las películas
const { data: allMovies } = trpc.movies.getTop250.useQuery({})

// Filtrar por género
const { data: dramaMovies } = trpc.movies.getTop250.useQuery({ 
  genre: 'Drama' 
})
```

**Respuesta**:
```typescript
interface GetTop250Response {
  movies: Movie[]
  totalResults: number
}

interface Movie {
  id: string
  title: string
  year?: string
  type?: string
  poster?: string
  plot?: string
  director?: string
  actors?: string
  genre?: string
  rating?: string
  runtime?: string
  released?: string
  trailer?: string
  contentRating?: string
  countriesOfOrigin?: string
  spokenLanguages?: string
  filmingLocations?: string
  productionCompanies?: string
  budget?: number
  grossWorldwide?: number
  numVotes?: number
  metascore?: number
}
```

**Ejemplo de Respuesta**:
```json
{
  "movies": [
    {
      "id": "tt0111161",
      "title": "The Shawshank Redemption",
      "year": "1994",
      "type": "movie",
      "poster": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_UX67_CR0,0,67,98_AL_.jpg",
      "plot": "Two imprisoned men bond over a number of years...",
      "director": "Frank Darabont",
      "actors": "Tim Robbins, Morgan Freeman, Bob Gunton",
      "genre": "Drama",
      "rating": "9.3",
      "runtime": "142",
      "released": "1994-10-14",
      "contentRating": "R",
      "countriesOfOrigin": "United States",
      "spokenLanguages": "English",
      "filmingLocations": "Mansfield, Ohio, USA",
      "productionCompanies": "Castle Rock Entertainment",
      "budget": 25000000,
      "grossWorldwide": 28834169,
      "numVotes": 2700000,
      "metascore": 80
    }
  ],
  "totalResults": 250
}
```

**Códigos de Error**:
- `429`: Rate limit excedido
- `500`: Error interno del servidor

---

### 2. `getGenres` - Obtener Géneros Disponibles

**Descripción**: Obtiene la lista de géneros únicos disponibles en el Top 250.

**Endpoint**: `movies.getGenres`

**Tipo**: `Query`

**Parámetros de Entrada**: Ninguno

**Ejemplo de Uso**:
```typescript
const { data: genres, isLoading } = trpc.movies.getGenres.useQuery()
```

**Respuesta**:
```typescript
string[]  // Array de strings con nombres de géneros
```

**Ejemplo de Respuesta**:
```json
[
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Family",
  "Fantasy",
  "Film-Noir",
  "History",
  "Horror",
  "Music",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western"
]
```

**Códigos de Error**:
- `500`: Error interno del servidor

---

### 3. `getMovieDetail` - Obtener Detalle de Película

**Descripción**: Obtiene información detallada de una película específica por su ID.

**Endpoint**: `movies.getMovieDetail`

**Tipo**: `Query`

**Parámetros de Entrada**:
```typescript
interface GetMovieDetailInput {
  id: string  // ID único de la película (requerido)
}
```

**Ejemplo de Uso**:
```typescript
const { data: movie, isLoading, error } = trpc.movies.getMovieDetail.useQuery({
  id: 'tt0111161'
})
```

**Respuesta**:
```typescript
Movie  // Objeto Movie completo (ver interfaz arriba)
```

**Ejemplo de Respuesta**:
```json
{
  "id": "tt0111161",
  "title": "The Shawshank Redemption",
  "year": "1994",
  "type": "movie",
  "poster": "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_UX67_CR0,0,67,98_AL_.jpg",
  "plot": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  "director": "Frank Darabont",
  "actors": "Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler, Clancy Brown, Gil Bellows, Mark Rolston, James Whitmore, Jeffrey DeMunn, Larry Brandenburg, Neil Giuntoli, Brian Libby, David Proval, Joseph Ragno, Jude Ciccolella, Paul McCrane, Renee Blaine, Scott Mann, Ned Bellamy, Don McManus",
  "genre": "Drama",
  "rating": "9.3",
  "runtime": "142",
  "released": "1994-10-14",
  "trailer": "https://www.imdb.com/video/vi3877612057",
  "contentRating": "R",
  "countriesOfOrigin": "United States",
  "spokenLanguages": "English",
  "filmingLocations": "Mansfield, Ohio, USA",
  "productionCompanies": "Castle Rock Entertainment",
  "budget": 25000000,
  "grossWorldwide": 28834169,
  "numVotes": 2700000,
  "metascore": 80
}
```

**Códigos de Error**:
- `404`: Película no encontrada en el Top 250
- `500`: Error interno del servidor

---

## 🔄 Configuración de React Query

### Opciones por Defecto
```typescript
// lib/trpc-provider.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minuto
      refetchOnWindowFocus: false,  // No refetch al cambiar ventana
      retry: 1,                     // 1 reintento en caso de error
    },
  },
})
```

### Opciones Personalizadas
```typescript
// Ejemplo con opciones personalizadas
const { data, isLoading, error } = trpc.movies.getTop250.useQuery(
  { genre: 'Drama' },
  {
    staleTime: 5 * 60 * 1000,  // 5 minutos
    retry: 3,                   // 3 reintentos
    enabled: true,              // Habilitar query
  }
)
```

---

## 🛠️ Implementación del Servidor

### Router de Películas
```typescript
// server/api/routers/movies.ts
export const moviesRouter = router({
  getTop250: publicProcedure
    .input(z.object({ 
      genre: z.string().optional() 
    }))
    .query(async ({ input }) => {
      // Implementación del endpoint
    }),

  getGenres: publicProcedure
    .query(async () => {
      // Implementación del endpoint
    }),

  getMovieDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Implementación del endpoint
    }),
})
```

### Configuración de tRPC
```typescript
// server/trpc.ts
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})
```

---

## 🔍 Manejo de Errores

### Tipos de Errores
```typescript
// Códigos de error tRPC
enum TRPCErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  METHOD_NOT_SUPPORTED = 'METHOD_NOT_SUPPORTED',
  TIMEOUT = 'TIMEOUT',
  CONFLICT = 'CONFLICT',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  PAYLOAD_TOO_LARGE = 'PAYLOAD_TOO_LARGE',
  UNPROCESSABLE_CONTENT = 'UNPROCESSABLE_CONTENT',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  CLIENT_CLOSED_REQUEST = 'CLIENT_CLOSED_REQUEST',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
```

### Manejo en el Cliente
```typescript
const { data, error, isLoading } = trpc.movies.getTop250.useQuery({})

if (error) {
  // Manejar error específico
  if (error.data?.code === 'TOO_MANY_REQUESTS') {
    // Rate limit excedido
  } else if (error.data?.code === 'INTERNAL_SERVER_ERROR') {
    // Error interno
  }
}
```

---

## 📊 Monitoreo y Debugging

### Logging de Requests
```typescript
// server/trpc.ts
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  console.log(`[tRPC] ${type} ${path} - ${duration}ms`)

  return result
})
```

### Debugging en Desarrollo
```typescript
// Habilitar logging detallado
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      transformer: superjson,
      headers() {
        return {
          'x-debug': 'true',  // Header para debugging
        }
      },
    }),
  ],
})
```

---

## 🚀 Mejores Prácticas

### 1. Uso de Hooks
```typescript
// ✅ Correcto: Usar hooks de tRPC
const { data, isLoading, error } = trpc.movies.getTop250.useQuery({})

// ❌ Incorrecto: Llamadas directas
const movies = await trpc.movies.getTop250.query({})
```

### 2. Manejo de Estados
```typescript
// ✅ Correcto: Manejar todos los estados
if (isLoading) return <LoadingSkeleton />
if (error) return <ErrorState error={error} />
if (!data) return <EmptyState />

return <MovieList movies={data.movies} />
```

### 3. Optimización de Queries
```typescript
// ✅ Correcto: Usar opciones de React Query
const { data } = trpc.movies.getTop250.useQuery(
  { genre: selectedGenre },
  {
    staleTime: 5 * 60 * 1000,  // Cache por 5 minutos
    enabled: !!selectedGenre,   // Solo ejecutar si hay género seleccionado
  }
)
```

### 4. Type Safety
```typescript
// ✅ Correcto: Usar tipos inferidos
const { data } = trpc.movies.getTop250.useQuery({})
// data es automáticamente tipado como GetTop250Response

// ✅ Correcto: Tipos explícitos para props
interface MovieCardProps {
  movie: Movie  // Tipo importado de lib/types.ts
}
```

---

## 📝 Ejemplos Completos

### Componente de Búsqueda
```typescript
'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc-client'

export function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')

  // Obtener películas
  const { data: moviesData, isLoading: isLoadingMovies } = trpc.movies.getTop250.useQuery({})
  
  // Obtener géneros
  const { data: genres, isLoading: isLoadingGenres } = trpc.movies.getGenres.useQuery()

  // Filtrar películas localmente
  const filteredMovies = useMemo(() => {
    if (!moviesData?.movies) return []
    
    let filtered = moviesData.movies

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.actors?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrar por género
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(movie =>
        movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
      )
    }

    return filtered
  }, [moviesData?.movies, searchQuery, selectedGenre])

  if (isLoadingMovies) return <LoadingSkeleton />
  if (!moviesData) return <ErrorState />

  return (
    <div>
      {/* UI de búsqueda y filtros */}
      <SearchForm 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres || []}
        isLoadingGenres={isLoadingGenres}
      />
      
      {/* Lista de películas */}
      <MovieGrid movies={filteredMovies} />
    </div>
  )
}
```

### Página de Detalle
```typescript
'use client'

import { use } from 'react'
import { trpc } from '@/lib/trpc-client'

interface MovieDetailPageProps {
  params: Promise<{ id: string }>
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = use(params)

  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = trpc.movies.getMovieDetail.useQuery(
    { id },
    {
      retry: 2,
      enabled: !!id,
    }
  )

  if (isLoading) return <MovieDetailSkeleton />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (!movie) return <NotFoundState />

  return (
    <div>
      <MovieHeader movie={movie} />
      <MovieContent movie={movie} />
    </div>
  )
}
```

---

## 🔗 Enlaces Útiles

- [Documentación oficial de tRPC](https://trpc.io/docs)
- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Zod](https://zod.dev/)

---

**Última actualización**: Diciembre 2024
