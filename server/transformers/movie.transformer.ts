/**
 * Transformador de Películas
 * 
 * Implementación real del transformador que convierte datos de la API de IMDb
 * al formato interno de la aplicación.
 */

import type { IMovieTransformer } from './movie.transformer.interface'
import type { Movie, Genre } from '../../../shared/types/movie.types'
import type { ImdbMovie } from '../../../shared/types/movie.types'

export class MovieTransformer implements IMovieTransformer {
  /**
   * Transforma una película de la API de IMDb al formato interno
   */
  fromImdbApi(imdbMovie: ImdbMovie): Movie {
    return {
      id: imdbMovie.id,
      title: imdbMovie.primaryTitle || '',
      year: imdbMovie.startYear?.toString(),
      type: imdbMovie.type || 'movie',
      poster: imdbMovie.primaryImage,
      plot: imdbMovie.description,
      director: imdbMovie.directors?.[0]?.name || '',
      actors: imdbMovie.actors?.map(actor => actor.name).join(', ') || '',
      genre: imdbMovie.genres?.join(', ') || '',
      rating: imdbMovie.averageRating?.toString(),
      runtime: imdbMovie.runtimeMinutes?.toString(),
      released: imdbMovie.releaseDate,
      trailer: imdbMovie.trailer,
      contentRating: imdbMovie.contentRating,
      countriesOfOrigin: imdbMovie.countriesOfOrigin?.join(', ') || '',
      spokenLanguages: imdbMovie.spokenLanguages?.join(', ') || '',
      filmingLocations: imdbMovie.filmingLocations?.join(', ') || '',
      productionCompanies: imdbMovie.productionCompanies?.map(company => company.name).join(', ') || '',
      budget: imdbMovie.budget,
      grossWorldwide: imdbMovie.grossWorldwide,
      numVotes: imdbMovie.numVotes,
      metascore: imdbMovie.metascore,
    }
  }

  /**
   * Transforma múltiples películas de la API de IMDb
   */
  fromImdbApiList(imdbMovies: ImdbMovie[]): Movie[] {
    return imdbMovies.map(movie => this.fromImdbApi(movie))
  }

  /**
   * Transforma géneros de la API de IMDb al formato interno
   */
  fromImdbGenres(imdbGenres: string[]): Genre[] {
    // Contar cuántas películas hay por género (esto se haría en el servicio)
    return imdbGenres.map(genre => ({
      id: genre.toLowerCase().replace(/\s+/g, '-'),
      name: genre,
      count: 0, // Se calculará en el servicio
    }))
  }

  /**
   * Valida que una película tenga los campos requeridos
   */
  validateMovie(movie: Movie): boolean {
    return !!(movie.id && movie.title)
  }

  /**
   * Sanitiza los datos de una película
   */
  sanitizeMovie(movie: Movie): Movie {
    return {
      ...movie,
      title: movie.title?.trim() || '',
      plot: movie.plot?.trim() || '',
      director: movie.director?.trim() || '',
      actors: movie.actors?.trim() || '',
      genre: movie.genre?.trim() || '',
    }
  }

  /**
   * Formatea el rating de una película
   */
  formatRating(rating?: number): string {
    if (!rating) return 'N/A'
    return rating.toFixed(1)
  }

  /**
   * Formatea la duración de una película
   */
  formatRuntime(runtime?: number): string {
    if (!runtime) return 'N/A'
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return `${hours}h ${minutes}m`
  }

  /**
   * Formatea el presupuesto de una película
   */
  formatBudget(budget?: number): string {
    if (!budget) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget)
  }

  /**
   * Formatea la recaudación de una película
   */
  formatGross(gross?: number): string {
    if (!gross) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(gross)
  }
}


