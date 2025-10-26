/**
 * Servicio de Películas
 * 
 * Lógica de negocio para películas con mejor separación de responsabilidades.
 * Mantiene la funcionalidad existente pero con mejor organización.
 */

import type { Movie, MovieFilters } from '../types'

export class MovieService {
  /**
   * Transforma una película de la API de IMDb al formato interno
   */
  static transformImdbMovie(imdbMovie: any): Movie {
    return {
      id: imdbMovie.id,
      title: imdbMovie.primaryTitle || '',
      year: imdbMovie.startYear?.toString(),
      type: imdbMovie.type || 'movie',
      poster: imdbMovie.primaryImage,
      plot: imdbMovie.description,
      director: imdbMovie.directors?.[0]?.name || '',
      actors: imdbMovie.actors?.map((actor: any) => actor.name).join(', ') || '',
      genre: imdbMovie.genres?.join(', ') || '',
      rating: imdbMovie.averageRating?.toString(),
      runtime: imdbMovie.runtimeMinutes?.toString(),
      released: imdbMovie.releaseDate,
      trailer: imdbMovie.trailer,
      contentRating: imdbMovie.contentRating,
      countriesOfOrigin: imdbMovie.countriesOfOrigin?.join(', ') || '',
      spokenLanguages: imdbMovie.spokenLanguages?.join(', ') || '',
      filmingLocations: imdbMovie.filmingLocations?.join(', ') || '',
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
   */
  static filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    return movies.filter(movie => this.validateMovieFilters(movie, filters))
  }

  /**
   * Valida si una película cumple con los filtros
   */
  static validateMovieFilters(movie: Movie, filters: MovieFilters): boolean {
    // Filtro por género
    if (filters.genre && movie.genre) {
      const movieGenres = movie.genre.toLowerCase().split(',').map(g => g.trim())
      if (!movieGenres.some(genre => genre.includes(filters.genre!.toLowerCase()))) {
        return false
      }
    }

    // Filtro por año
    if (filters.year && movie.year) {
      if (movie.year !== filters.year) {
        return false
      }
    }

    // Filtro por rating
    if (filters.rating && movie.rating) {
      const movieRating = parseFloat(movie.rating)
      if (movieRating < filters.rating) {
        return false
      }
    }

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const searchableFields = [
        movie.title,
        movie.director,
        movie.actors,
        movie.plot,
      ].filter(Boolean).join(' ').toLowerCase()

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
