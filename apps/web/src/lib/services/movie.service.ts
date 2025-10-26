/**
 * Servicio de Películas
 * 
 * Lógica de negocio para películas con mejor separación de responsabilidades.
 * Mantiene la funcionalidad existente pero con mejor organización.
 * 
 * ARQUITECTURA: Patrón Service Layer para centralizar la lógica de negocio.
 * JUSTIFICACIÓN: Separar la transformación y filtrado de datos permite:
 * - Reutilización de lógica de negocio
 * - Testing independiente de la UI
 * - Fácil modificación de reglas de negocio
 * - Consistencia en el manejo de datos
 */

import type { Movie, MovieFilters } from '../types'

export class MovieService {
  /**
   * Transforma una película de la API de IMDb al formato interno
   * 
   * TRANSFORMACIÓN: Mapeo de datos externos a formato consistente.
   * ESTRATEGIA: 
   * - Valores por defecto para campos opcionales (evita undefined)
   * - Conversión de tipos (números a strings para UI)
   * - Manejo de arrays (join para mostrar como texto)
   * - Extracción de datos anidados (directors[0].name)
   * 
   * ROBUSTEZ: Uso de optional chaining (?.) y fallbacks para evitar crashes.
   */
  static transformImdbMovie(imdbMovie: any): Movie {
    return {
      id: imdbMovie.id,
      title: imdbMovie.primaryTitle || '', // Fallback a string vacío
      year: imdbMovie.startYear?.toString(), // Convertir número a string
      type: imdbMovie.type || 'movie', // Default a 'movie'
      poster: imdbMovie.primaryImage,
      plot: imdbMovie.description,
      // Extraer primer director del array
      director: imdbMovie.directors?.[0]?.name || '',
      // Mapear array de actores a string separado por comas
      actors: imdbMovie.actors?.map((actor: any) => actor.name).join(', ') || '',
      // Unir géneros en string
      genre: imdbMovie.genres?.join(', ') || '',
      // Convertir rating numérico a string para UI
      rating: imdbMovie.averageRating?.toString(),
      // Convertir duración a string
      runtime: imdbMovie.runtimeMinutes?.toString(),
      released: imdbMovie.releaseDate,
      trailer: imdbMovie.trailer,
      contentRating: imdbMovie.contentRating,
      // Unir arrays en strings para display
      countriesOfOrigin: imdbMovie.countriesOfOrigin?.join(', ') || '',
      spokenLanguages: imdbMovie.spokenLanguages?.join(', ') || '',
      filmingLocations: imdbMovie.filmingLocations?.join(', ') || '',
      // Mapear compañías productoras
      productionCompanies: imdbMovie.productionCompanies?.map((company: any) => company.name).join(', ') || '',
      budget: imdbMovie.budget,
      grossWorldwide: imdbMovie.grossWorldwide,
      numVotes: imdbMovie.numVotes,
      metascore: imdbMovie.metascore,
    }
  }

  /**
   * Transforma múltiples películas de la API de IMDb
   */
  static transformImdbMovies(imdbMovies: any[]): Movie[] {
    return imdbMovies.map(movie => this.transformImdbMovie(movie))
  }

  /**
   * Filtra películas por criterios específicos
   * 
   * PERFORMANCE: Filtrado del lado del cliente para mejor UX.
   * ESTRATEGIA: Una vez cargados los datos, el filtrado es instantáneo.
   * ALTERNATIVA: Filtrado del servidor requeriría llamadas adicionales a la API.
   */
  static filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    return movies.filter(movie => this.validateMovieFilters(movie, filters))
  }

  /**
   * Valida si una película cumple con los filtros
   * 
   * LÓGICA: Filtros acumulativos (AND) - todos deben cumplirse.
   * OPTIMIZACIÓN: Early return en cada filtro para mejor performance.
   * FLEXIBILIDAD: Cada filtro es independiente y opcional.
   */
  static validateMovieFilters(movie: Movie, filters: MovieFilters): boolean {
    // FILTRO POR GÉNERO: Búsqueda parcial e insensible a mayúsculas
    if (filters.genre && movie.genre) {
      const movieGenres = movie.genre.toLowerCase().split(',').map(g => g.trim())
      // some() para búsqueda parcial: "Drama" encuentra "Drama, Romance"
      if (!movieGenres.some(genre => genre.includes(filters.genre!.toLowerCase()))) {
        return false
      }
    }

    // FILTRO POR AÑO: Comparación exacta
    if (filters.year && movie.year) {
      if (movie.year !== filters.year) {
        return false
      }
    }

    // FILTRO POR RATING: Comparación numérica (rating >= filtro)
    if (filters.rating && movie.rating) {
      const movieRating = parseFloat(movie.rating)
      if (movieRating < filters.rating) {
        return false
      }
    }

    // FILTRO POR BÚSQUEDA: Búsqueda en múltiples campos
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      // Combinar todos los campos de búsqueda en un solo string
      const searchableFields = [
        movie.title,
        movie.director,
        movie.actors,
        movie.plot,
      ].filter(Boolean).join(' ').toLowerCase() // filter(Boolean) elimina valores falsy

      // Búsqueda parcial en el texto combinado
      if (!searchableFields.includes(searchTerm)) {
        return false
      }
    }

    return true
  }

  /**
   * Extrae géneros únicos de una lista de películas
   */
  static extractGenres(movies: Movie[]): string[] {
    const allGenres = new Set<string>()
    movies.forEach(movie => {
      if (movie.genre) {
        movie.genre.split(',').forEach(genre => {
          allGenres.add(genre.trim())
        })
      }
    })
    return Array.from(allGenres).sort()
  }

  /**
   * Busca una película por ID en una lista
   */
  static findMovieById(movies: Movie[], id: string): Movie | null {
    return movies.find(movie => movie.id === id) || null
  }
}

