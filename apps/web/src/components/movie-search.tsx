/**
 * Movie Search Component
 *
 * Componente principal de búsqueda de películas.
 * Maneja el estado de búsqueda, filtros y muestra resultados.
 *
 * RESPONSABILIDAD: UI de búsqueda y coordinación de estado.
 * INTERACCIÓN: Usa tRPC hooks para comunicarse con el backend.
 */

// apps/web/src/components/movie-search.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react" // ✅ AGREGAR useEffect
import { Search, Filter, Star } from "lucide-react" // ✅ AGREGAR Star
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "./movie-card"
import { MovieCardSkeleton } from "./movie-card-skeleton"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { trpc } from "@/lib/trpc-client"

// ✅ HOOK DE DEBOUNCE PERSONALIZADO
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [minRating, setMinRating] = useState<number | undefined>(7)
  
  // ✅ BÚSQUEDA EN TIEMPO REAL CON DEBOUNCE
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  
  // ✅ USAR debouncedSearchQuery EN LUGAR DE searchQuery
  const { data, isLoading, error, refetch } = trpc.movies.search.useQuery(
    {
      query: debouncedSearchQuery || "batman", // ✅ CAMBIAR AQUÍ
      page: currentPage,
      type: searchType,
      minRating: minRating,
    },
    {
      enabled: debouncedSearchQuery.length > 0, // ✅ CAMBIAR AQUÍ
      // ✅ REMOVER keepPreviousData (deprecado) y usar placeholderData
      placeholderData: (previousData) => previousData,
    },
  )
  
  // ✅ ACTUALIZAR BÚSQUEDA CUANDO CAMBIA EL QUERY DEBOUNCED
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1) // Reset a primera página en nueva búsqueda
    }
  }, [debouncedSearchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    refetch()
  }

  // ... resto del componente igual hasta SearchForm ...

  return (
    <div className="space-y-6">
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        minRating={minRating} // ✅ AGREGAR
        setMinRating={setMinRating} // ✅ AGREGAR
        onSubmit={handleSearch}
      />

      {/* ... resto igual ... */}
    </div>
  )
}

// ✅ ACTUALIZAR INTERFACE Y COMPONENTE SearchForm
interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial"
  setSearchType: (type: "all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial") => void
  minRating: number | undefined // ✅ AGREGAR
  setMinRating: (rating: number | undefined) => void // ✅ AGREGAR
  onSubmit: (e: React.FormEvent) => void
}

function SearchForm({ 
  searchQuery, 
  setSearchQuery, 
  searchType, 
  setSearchType, 
  minRating, 
  setMinRating, 
  onSubmit 
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Input de búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar películas, series..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // ✅ BÚSQUEDA EN TIEMPO REAL
            className="pl-10"
          />
        </div>

        {/* Selector de tipo */}
        <div className="flex gap-2">
          <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="movie">Películas</SelectItem>
              <SelectItem value="tvSeries">Series</SelectItem>
              <SelectItem value="tvMovie">TV Movies</SelectItem>
              <SelectItem value="tvMiniSeries">Mini Series</SelectItem>
              <SelectItem value="tvSpecial">TV Specials</SelectItem>
            </SelectContent>
          </Select>

          {/* ✅ NUEVO: Filtro de rating */}
          <Select 
            value={minRating?.toString() || "all"} 
            onValueChange={(value) => setMinRating(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-[120px]">
              <Star className="mr-2 size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="7">7+ Rating</SelectItem>
              <SelectItem value="8">8+ Rating</SelectItem>
              <SelectItem value="9">9+ Rating</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit">Buscar</Button>
        </div>
      </div>
    </form>
  )
}