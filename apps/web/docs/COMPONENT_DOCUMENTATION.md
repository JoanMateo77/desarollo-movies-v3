# 🧩 Documentación de Componentes - Explorador de Películas

## 📋 Resumen

Esta documentación describe todos los componentes principales de la aplicación, sus responsabilidades, props, y ejemplos de uso.

## 🎨 Componentes UI Base

### `components/ui/`

Componentes base construidos con Radix UI y Tailwind CSS para mantener consistencia en toda la aplicación.

---

## 🎬 Componentes de Películas

### `MovieSearch` - Componente Principal

**Archivo**: `components/movie-search.tsx`

**Responsabilidad**: Componente principal que coordina la búsqueda, filtros y visualización de películas.

**Props**: Ninguna (componente autónomo)

**Estado Interno**:
```typescript
const [searchQuery, setSearchQuery] = useState("")
const [selectedGenre, setSelectedGenre] = useState<string>("all")
const [filteredMovies, setFilteredMovies] = useState<any[]>([])
```

**Hooks Utilizados**:
- `trpc.movies.getTop250.useQuery({})` - Obtener películas
- `trpc.movies.getGenres.useQuery()` - Obtener géneros

**Funcionalidades**:
- Búsqueda en tiempo real por título, director, actores
- Filtrado por género
- Manejo de estados de carga y error
- Filtrado local para mejor performance

**Ejemplo de Uso**:
```typescript
import { MovieSearch } from '@/components/movie-search'

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <MovieSearch />
    </div>
  )
}
```

---

### `MovieCard` - Tarjeta de Película

**Archivo**: `components/movie-card.tsx`

**Responsabilidad**: Mostrar información resumida de una película individual.

**Props**:
```typescript
interface MovieCardProps {
  movie: Movie
}
```

**Características**:
- Poster optimizado con `ImageWithLoading`
- Información esencial: título, año, tipo
- Navegación a página de detalle
- Hover effects y transiciones

**Ejemplo de Uso**:
```typescript
import { MovieCard } from '@/components/movie-card'

<MovieCard movie={movie} />
```

---

### `MovieCardSkeleton` - Loading Skeleton

**Archivo**: `components/movie-card-skeleton.tsx`

**Responsabilidad**: Mostrar placeholder mientras cargan las películas.

**Props**: Ninguna

**Características**:
- Skeleton que coincide con la estructura de `MovieCard`
- Animación de shimmer
- Responsive design

**Ejemplo de Uso**:
```typescript
import { MovieCardSkeleton } from '@/components/movie-card-skeleton'

{isLoading && (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <MovieCardSkeleton key={i} />
    ))}
  </div>
)}
```

---

## 🔍 Componentes de Estado

### `EmptyState` - Estado Vacío

**Archivo**: `components/empty-state.tsx`

**Responsabilidad**: Mostrar mensaje cuando no hay resultados de búsqueda.

**Props**:
```typescript
interface EmptyStateProps {
  query: string
  onClear: () => void
}
```

**Características**:
- Mensaje personalizado con la consulta de búsqueda
- Botón para limpiar búsqueda
- Icono ilustrativo

**Ejemplo de Uso**:
```typescript
import { EmptyState } from '@/components/empty-state'

<EmptyState
  query={searchQuery}
  onClear={() => {
    setSearchQuery("")
    setSelectedGenre("all")
  }}
/>
```

---

### `ErrorState` - Estado de Error

**Archivo**: `components/error-state.tsx`

**Responsabilidad**: Mostrar errores de forma amigable con opción de reintento.

**Props**:
```typescript
interface ErrorStateProps {
  message: string
  onRetry: () => void
}
```

**Características**:
- Mensaje de error claro
- Botón de reintento
- Diseño consistente con el sistema

**Ejemplo de Uso**:
```typescript
import { ErrorState } from '@/components/error-state'

<ErrorState
  message={error.message}
  onRetry={() => refetch()}
/>
```

---

## 🖼️ Componentes de Imagen

### `ImageWithLoading` - Imagen con Loading State

**Archivo**: `components/ui/image-with-loading.tsx`

**Responsabilidad**: Mostrar imágenes con estados de carga y manejo de errores.

**Props**:
```typescript
interface ImageWithLoadingProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}
```

**Características**:
- Loading state con spinner
- Manejo de errores con fallback
- Optimización automática de Next.js
- Transiciones suaves

**Ejemplo de Uso**:
```typescript
import { ImageWithLoading } from '@/components/ui/image-with-loading'

<ImageWithLoading
  src={movie.poster}
  alt={movie.title}
  fill
  className="object-cover transition-transform group-hover:scale-105"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  priority={false}
  quality={75}
  blurDataURL="data:image/jpeg;base64,..."
/>
```

---

## 🎛️ Componentes de Formulario

### `SearchForm` - Formulario de Búsqueda

**Archivo**: `components/movie-search.tsx` (componente interno)

**Responsabilidad**: Formulario de búsqueda y filtros reutilizable.

**Props**:
```typescript
interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  genres: string[]
  isLoadingGenres: boolean
}
```

**Características**:
- Input de búsqueda con icono
- Selector de género con Radix UI
- Diseño responsivo
- Estados de carga

**Ejemplo de Uso**:
```typescript
<SearchForm
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  selectedGenre={selectedGenre}
  setSelectedGenre={setSelectedGenre}
  genres={genres || []}
  isLoadingGenres={isLoadingGenres}
/>
```

---

## 📄 Componentes de Página

### `MovieDetailPage` - Página de Detalle

**Archivo**: `app/movie/[id]/page.tsx`

**Responsabilidad**: Página individual de película con información completa.

**Props**:
```typescript
interface MovieDetailPageProps {
  params: Promise<{ id: string }>
}
```

**Características**:
- Información completa de la película
- Poster grande con loading state
- Metadatos detallados
- Navegación de vuelta
- Responsive design

**Hooks Utilizados**:
- `trpc.movies.getMovieDetail.useQuery({ id })`

**Ejemplo de Uso**:
```typescript
// Accesible en /movie/[id]
// Ejemplo: /movie/tt0111161
```

---

## 🔧 Componentes de Layout

### `RootLayout` - Layout Principal

**Archivo**: `app/layout.tsx`

**Responsabilidad**: Layout principal de la aplicación con providers.

**Características**:
- Configuración de fuentes (Geist)
- TRPCProvider para tRPC
- Vercel Analytics
- Configuración global

**Ejemplo de Uso**:
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <TRPCProvider>{children}</TRPCProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

---

## 🎨 Componentes UI Base

### Componentes Radix UI

Todos los componentes base están construidos con Radix UI para accesibilidad:

- **`Button`** - Botones con variantes
- **`Card`** - Tarjetas y contenedores
- **`Input`** - Inputs de formulario
- **`Select`** - Selectores desplegables
- **`Badge`** - Etiquetas y badges
- **`Alert`** - Alertas y notificaciones
- **`Skeleton`** - Loading skeletons
- **`Separator`** - Separadores visuales
- **`Dialog`** - Modales y diálogos
- **`Label`** - Labels de formulario

**Ejemplo de Uso**:
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

<Card>
  <CardContent>
    <Input placeholder="Buscar películas..." />
    <Button>Buscar</Button>
  </CardContent>
</Card>
```

---

## 🔄 Patrones de Componentes

### 1. **Composición de Componentes**
```typescript
// Componente principal que compone otros
export function MovieSearch() {
  return (
    <div>
      <SearchForm {...formProps} />
      <MovieGrid movies={filteredMovies} />
    </div>
  )
}
```

### 2. **Props Drilling Minimizado**
```typescript
// Usar context o estado local en lugar de pasar props profundamente
const [searchQuery, setSearchQuery] = useState("")
// En lugar de pasar por múltiples niveles
```

### 3. **Estados de Carga Consistentes**
```typescript
// Patrón consistente para loading states
if (isLoading) return <LoadingSkeleton />
if (error) return <ErrorState error={error} />
if (!data) return <EmptyState />
return <DataComponent data={data} />
```

### 4. **Type Safety en Props**
```typescript
// Siempre tipar las props
interface ComponentProps {
  data: SomeType
  onAction: (id: string) => void
  isLoading?: boolean
}
```

---

## 🎯 Mejores Prácticas

### 1. **Separación de Responsabilidades**
- **Presentación**: Solo renderizado y eventos de UI
- **Lógica**: Hooks personalizados o servicios
- **Datos**: tRPC queries y estado

### 2. **Reutilización**
- Componentes base en `ui/`
- Componentes específicos en `components/`
- Composición sobre herencia

### 3. **Performance**
- `React.memo` para componentes pesados
- `useMemo` para cálculos costosos
- `useCallback` para funciones estables

### 4. **Accesibilidad**
- Componentes Radix UI
- ARIA labels apropiados
- Navegación por teclado
- Contraste de colores

---

## 🚀 Extensibilidad

### Agregar Nuevos Componentes

1. **Crear archivo** en `components/`
2. **Definir props** con TypeScript
3. **Implementar lógica** de presentación
4. **Exportar** desde el archivo
5. **Documentar** uso y props

### Ejemplo de Nuevo Componente

```typescript
// components/movie-filters.tsx
interface MovieFiltersProps {
  genres: string[]
  selectedGenre: string
  onGenreChange: (genre: string) => void
  onYearChange: (year: string) => void
}

export function MovieFilters({
  genres,
  selectedGenre,
  onGenreChange,
  onYearChange
}: MovieFiltersProps) {
  return (
    <div className="flex gap-4">
      <Select value={selectedGenre} onValueChange={onGenreChange}>
        {/* Select options */}
      </Select>
      {/* Más filtros */}
    </div>
  )
}
```

---

## 📝 Testing de Componentes

### Estructura de Tests
```
components/
├── __tests__/
│   ├── movie-card.test.tsx
│   ├── movie-search.test.tsx
│   └── ui/
│       ├── button.test.tsx
│       └── input.test.tsx
```

### Ejemplo de Test
```typescript
import { render, screen } from '@testing-library/react'
import { MovieCard } from '../movie-card'

const mockMovie = {
  id: 'tt0111161',
  title: 'The Shawshank Redemption',
  year: '1994',
  poster: 'https://example.com/poster.jpg'
}

test('renders movie card with title and year', () => {
  render(<MovieCard movie={mockMovie} />)
  
  expect(screen.getByText('The Shawshank Redemption')).toBeInTheDocument()
  expect(screen.getByText('1994')).toBeInTheDocument()
})
```

---

## 🔗 Enlaces Útiles

- [Documentación de Radix UI](https://www.radix-ui.com/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

**Última actualización**: Diciembre 2024
