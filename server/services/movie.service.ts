/**
 * Servicio de Películas
 * 
 * Implementación real del servicio que maneja la lógica de negocio
 * de películas usando el patrón Service Layer.
 */

import type { IMovieService } from './movie.service.interface'
import type { IMovieRepository } from '../repositories/movie.repository.interface'
import type { IMovieTransformer } from '../transformers/movie.transformer.interface'
import type { Movie, MovieFilters, MovieSearchResult, Genre } from '../../../shared/types/movie.types'
import { ErrorService } from './error.service'

export class MovieService implements IMovieService {
  constructor(
    private movieRepository: IMovieRepository,
    private movieTransformer: IMovieTransformer
  ) {}

  /**
   * Obtiene las top 250 películas con filtros opcionales
   */
  async getTop250Movies(filters?: MovieFilters): Promise<MovieSearchResult> {
    try {
      // Obtener datos de la API externa
      const apiResponse = await this.movieRepository.getTop250Movies()
      
      if (!apiResponse.data) {
        throw ErrorService.createNotFoundError('Películas')
      }

      // Transformar datos
      const movies = this.movieTransformer.fromImdbApiList(apiResponse.data)

      // Aplicar filtros
      const filteredMovies = filters ? this.filterMovies(movies, filters) : movies

      return {
        movies: filteredMovies,
        totalResults: filteredMovies.length,
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Error de conexión')) {
        throw ErrorService.createNetworkError('Error al obtener películas', error)
      }
      throw ErrorService.createInternalError('Error al obtener películas', error)
    }
  }

  /**
   * Busca películas por término de búsqueda
   */
  async searchMovies(query: string, filters?: MovieFilters): Promise<MovieSearchResult> {
    try {
      if (!query.trim()) {
        return { movies: [], totalResults: 0 }
      }

      // Obtener datos de la API externa
      const apiResponse = await this.movieRepository.searchMovies(query, filters)
      
      if (!apiResponse.data) {
        return { movies: [], totalResults: 0 }
      }

      // Transformar datos
      const movies = this.movieTransformer.fromImdbApiList(apiResponse.data)

      // Aplicar filtros adicionales
      const filteredMovies = filters ? this.filterMovies(movies, filters) : movies

      return {
        movies: filteredMovies,
        totalResults: filteredMovies.length,
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Error de conexión')) {
        throw ErrorService.createNetworkError('Error al buscar películas', error)
      }
      throw ErrorService.createInternalError('Error al buscar películas', error)
    }
  }

  /**
   * Obtiene una película por su ID
   */
  async getMovieById(id: string): Promise<Movie | null> {
    try {
      if (!id) {
        throw ErrorService.createValidationError('ID de película es requerido')
      }

      // Obtener datos de la API externa
      const apiResponse = await this.movieRepository.getMovieById(id)
      
      if (!apiResponse.data) {
        return null
      }

      // Transformar datos
      const movie = this.movieTransformer.fromImdbApi(apiResponse.data)

      return movie
    } catch (error) {
      if (error instanceof Error && error.message.includes('Error de conexión')) {
        throw ErrorService.createNetworkError('Error al obtener película', error)
      }
      throw ErrorService.createInternalError('Error al obtener película', error)
    }
  }

  /**
   * Obtiene todos los géneros disponibles
   */
  async getGenres(): Promise<Genre[]> {
    try {
      // Obtener datos de la API externa
      const apiResponse = await this.movieRepository.getGenres()
      
      if (!apiResponse.data) {
        return []
      }

      // Transformar datos
      const genres = this.movieTransformer.fromImdbGenres(apiResponse.data)

      // Contar películas por género
      const top250Response = await this.movieRepository.getTop250Movies()
      if (top250Response.data) {
        const movies = this.movieTransformer.fromImdbApiList(top250Response.data)
        
        genres.forEach(genre => {
          genre.count = movies.filter(movie => 
            movie.genre?.toLowerCase().includes(genre.name.toLowerCase())
          ).length
        })
      }

      return genres
    } catch (error) {
      if (error instanceof Error && error.message.includes('Error de conexión')) {
        throw ErrorService.createNetworkError('Error al obtener géneros', error)
      }
      throw ErrorService.createInternalError('Error al obtener géneros', error)
    }
  }

  /**
   * Filtra películas por criterios específicos
   */
  filterMovies(movies: Movie[], filters: MovieFilters): Movie[] {
    return movies.filter(movie => this.validateMovieFilters(movie, filters))
  }

  /**
   * Valida si una película cumple con los filtros
   */
  validateMovieFilters(movie: Movie, filters: MovieFilters): boolean {
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
}


