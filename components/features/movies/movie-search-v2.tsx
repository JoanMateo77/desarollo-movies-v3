/**
 * Movie Search Component v2
 * 
 * Versión mejorada del componente de búsqueda que usa la nueva arquitectura.
 * Mantiene la misma funcionalidad pero con mejor separación de responsabilidades.
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "@/components/movie-card"
import { MovieCardSkeleton } from "@/components/movie-card-skeleton"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { trpc } from "@/lib/trpc-client"

export function MovieSearchV2() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [filteredMovies, setFilteredMovies] = useState<any[]>([])

  // ✅ Obtener Top 250 películas usando el nuevo router
  const { data: top250Data, isLoading: isLoadingTop250, error: top250Error } = trpc.moviesV2.getTop250.useQuery({})
  
  // ✅ Obtener géneros disponibles usando el nuevo router
  const { data: genres, isLoading: isLoadingGenres } = trpc.moviesV2.getGenres.useQuery()

  // ✅ Filtrar películas por búsqueda y género
  useEffect(() => {
    if (top250Data?.movies) {
      let filtered = top250Data.movies

      // Filtrar por búsqueda de texto
      if (searchQuery.trim()) {
        filtered = filtered.filter((movie: any) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.plot?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.actors?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Filtrar por género
      if (selectedGenre !== "all") {
        filtered = filtered.filter((movie: any) =>
          movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
        )
      }

      setFilteredMovies(filtered)
    }
  }, [top250Data, searchQuery, selectedGenre])

  if (isLoadingTop250) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres || []}
          isLoadingGenres={isLoadingGenres}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (top250Error) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres || []}
          isLoadingGenres={isLoadingGenres}
        />
        <ErrorState message={top250Error.message} onRetry={() => window.location.reload()} />
      </div>
    )
  }

  if (filteredMovies.length === 0) {
    return (
      <div className="space-y-6">
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres || []}
          isLoadingGenres={isLoadingGenres}
        />
        <EmptyState
          query={searchQuery}
          onClear={() => {
            setSearchQuery("")
            setSelectedGenre("all")
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
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres || []}
        isLoadingGenres={isLoadingGenres}
      />

      {/* Información de resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMovies.length} de {top250Data?.totalResults || 0} películas
        </p>
        <p className="text-sm text-muted-foreground">Top 250 IMDB (v2)</p>
      </div>

      {/* Grid de películas */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

// Interface para SearchForm
interface SearchFormProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  genres: string[]
  isLoadingGenres: boolean
}

function SearchForm({ 
  searchQuery, 
  setSearchQuery, 
  selectedGenre, 
  setSelectedGenre, 
  genres, 
  isLoadingGenres 
}: SearchFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Input de búsqueda */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título, director, actores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selector de género */}
        <div className="flex gap-2">
          <Select 
            value={selectedGenre} 
            onValueChange={setSelectedGenre}
            disabled={isLoadingGenres}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder={isLoadingGenres ? "Cargando..." : "Filtrar por género"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los géneros</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
