/**
 * Movie Search Component
 *
 * Componente principal de búsqueda de películas.
 * Maneja el estado de búsqueda, filtros y muestra resultados.
 *
 * RESPONSABILIDAD: UI de búsqueda y coordinación de estado.
 * INTERACCIÓN: Usa tRPC hooks para comunicarse con el backend.
 */

"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "./movie-card"
import { MovieCardSkeleton } from "./movie-card-skeleton"
import { EmptyState } from "./empty-state"
import { ErrorState } from "./error-state"
import { trpc } from "@/lib/trpc-client"

export function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial">("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Este hook es completamente tipado - TypeScript conoce la estructura exacta
  const { data, isLoading, error, refetch } = trpc.movies.search.useQuery(
    {
      query: searchQuery || "batman", // Query por defecto para mostrar contenido inicial
      page: currentPage,
      type: searchType,
    },
    {
      // Solo ejecutar si hay query
      enabled: searchQuery.length > 0,
      // Mantener datos previos mientras carga nuevos (mejor UX)
       placeholderData: (previousData) => previousData,
    },
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset a primera página en nueva búsqueda
    refetch()
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSubmit={handleSearch}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSubmit={handleSearch}
        />
        <ErrorState message={error.message} onRetry={() => refetch()} />
      </div>
    )
  }

  if (data && data.movies.length === 0) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          onSubmit={handleSearch}
        />
        <EmptyState
          query={searchQuery}
          onClear={() => {
            setSearchQuery("")
            setSearchType("all")
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        onSubmit={handleSearch}
      />

      {/* Información de resultados */}
      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data.totalResults} resultados encontrados</p>
          <p className="text-sm text-muted-foreground">Página {data.page}</p>
        </div>
      )}

      {/* Grid de películas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Paginación */}
      {data && (data.page > 1 || data.hasMore) && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página {currentPage}</span>
          <Button variant="outline" onClick={() => setCurrentPage((p) => p + 1)} disabled={!data.hasMore || isLoading}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Search Form Component
 *
 * Formulario de búsqueda separado para mejor organización.
 * Incluye input de texto y selector de tipo.
 */
interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial" // ✅ ACTUALIZADO
  setSearchType: (type: "all" | "movie" | "tvSeries" | "tvMovie" | "tvMiniSeries" | "tvSpecial") => void // ✅ ACTUALIZADO
  onSubmit: (e: React.FormEvent) => void
}

function SearchForm({ searchQuery, setSearchQuery, searchType, setSearchType, onSubmit }: SearchFormProps) {
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
            onChange={(e) => setSearchQuery(e.target.value)}
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

          <Button type="submit">Buscar</Button>
        </div>
      </div>
    </form>
  )
}
