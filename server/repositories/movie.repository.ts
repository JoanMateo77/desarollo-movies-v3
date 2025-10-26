/**
 * Repositorio de Películas
 * 
 * Implementación real del repositorio que maneja el acceso a datos
 * de la API externa de IMDb a través de RapidAPI.
 */

import type { IMovieRepository } from './movie.repository.interface'
import type { Movie, MovieFilters } from '../../../shared/types/movie.types'
import type { ExternalApiResponse } from '../../../shared/types/api.types'
import { ApiConfig } from '../../lib/config/api.config'
import { CacheService } from '../services/cache.service'
import { ErrorService } from '../services/error.service'

export class MovieRepository implements IMovieRepository {
  /**
   * Obtiene las top 250 películas desde la API externa
   */
  async getTop250Movies(): Promise<ExternalApiResponse<Movie[]>> {
    const url = ApiConfig.buildUrl('/top250-movies')
    const cacheKey = CacheService.getMoviesCacheKey()

    // Verificar caché primero
    const cached = CacheService.get<Movie[]>(cacheKey)
    if (cached) {
      return {
        data: cached,
        status: 200,
        headers: {},
        cached: true,
        cachedAt: new Date(),
      }
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: ApiConfig.getRapidApiHeaders(),
      })

      if (!response.ok) {
        throw ErrorService.handleHttpError(response, 'obtener top 250 películas')
      }

      const data = await response.json()
      
      // Guardar en caché
      const cacheConfig = CacheService.getCacheConfig('MOVIES')
      CacheService.set(cacheKey, data, cacheConfig.ttl)

      return {
        data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        cached: false,
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('fetch')) {
        throw ErrorService.createNetworkError('Error de conexión con RapidAPI', error)
      }
      throw error
    }
  }

  /**
   * Busca películas en la API externa
   */
  async searchMovies(query: string, filters?: MovieFilters): Promise<ExternalApiResponse<Movie[]>> {
    // Para la búsqueda, usamos el mismo endpoint y filtramos localmente
    // ya que la API de IMDb no tiene un endpoint de búsqueda específico
    const response = await this.getTop250Movies()
    
    if (!response.data) {
      return {
        data: [],
        status: 200,
        headers: {},
        cached: response.cached,
        cachedAt: response.cachedAt,
      }
    }

    // Filtrar por query de búsqueda
    const filteredMovies = response.data.filter(movie => {
      const searchTerm = query.toLowerCase()
      return (
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.plot?.toLowerCase().includes(searchTerm) ||
        movie.director?.toLowerCase().includes(searchTerm) ||
        movie.actors?.toLowerCase().includes(searchTerm)
      )
    })

    return {
      ...response,
      data: filteredMovies,
    }
  }

  /**
   * Obtiene una película específica por ID
   */
  async getMovieById(id: string): Promise<ExternalApiResponse<Movie | null>> {
    const cacheKey = CacheService.getMovieDetailCacheKey(id)

    // Verificar caché primero
    const cached = CacheService.get<Movie>(cacheKey)
    if (cached) {
      return {
        data: cached,
        status: 200,
        headers: {},
        cached: true,
        cachedAt: new Date(),
      }
    }

    // Obtener todas las películas y buscar por ID
    const response = await this.getTop250Movies()
    
    if (!response.data) {
      return {
        data: null,
        status: 404,
        headers: {},
        cached: response.cached,
        cachedAt: response.cachedAt,
      }
    }

    const movie = response.data.find(m => m.id === id)
    
    if (movie) {
      // Guardar en caché
      const cacheConfig = CacheService.getCacheConfig('DETAILS')
      CacheService.set(cacheKey, movie, cacheConfig.ttl)
    }

    return {
      data: movie || null,
      status: movie ? 200 : 404,
      headers: response.headers,
      cached: response.cached,
      cachedAt: response.cachedAt,
    }
  }

  /**
   * Obtiene géneros disponibles desde la API externa
   */
  async getGenres(): Promise<ExternalApiResponse<string[]>> {
    const cacheKey = CacheService.getGenresCacheKey()

    // Verificar caché primero
    const cached = CacheService.get<string[]>(cacheKey)
    if (cached) {
      return {
        data: cached,
        status: 200,
        headers: {},
        cached: true,
        cachedAt: new Date(),
      }
    }

    // Obtener películas y extraer géneros
    const response = await this.getTop250Movies()
    
    if (!response.data) {
      return {
        data: [],
        status: 200,
        headers: {},
        cached: response.cached,
        cachedAt: response.cachedAt,
      }
    }

    // Extraer géneros únicos
    const allGenres = new Set<string>()
    response.data.forEach(movie => {
      if (movie.genre) {
        movie.genre.split(',').forEach(genre => {
          allGenres.add(genre.trim())
        })
      }
    })

    const genres = Array.from(allGenres).sort()

    // Guardar en caché
    const cacheConfig = CacheService.getCacheConfig('GENRES')
    CacheService.set(cacheKey, genres, cacheConfig.ttl)

    return {
      data: genres,
      status: 200,
      headers: response.headers,
      cached: response.cached,
      cachedAt: response.cachedAt,
    }
  }

  /**
   * Verifica si los datos están en caché
   */
  async isCached(key: string): Promise<boolean> {
    return CacheService.has(key)
  }

  /**
   * Obtiene datos del caché
   */
  async getFromCache<T>(key: string): Promise<T | null> {
    return CacheService.get<T>(key)
  }

  /**
   * Guarda datos en el caché
   */
  async setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
    CacheService.set(key, data, ttl)
  }

  /**
   * Limpia el caché
   */
  async clearCache(pattern?: string): Promise<void> {
    if (pattern) {
      CacheService.clearPattern(pattern)
    } else {
      CacheService.clear()
    }
  }
}
