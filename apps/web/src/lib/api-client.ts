/**
 * RapidAPI Client
 *apps/web/src/lib/api-client.ts
 * Capa de abstracción para consumir la API externa de RapidAPI.
 * Encapsula toda la lógica de HTTP, headers, rate limiting y transformación.
 *
 * RESPONSABILIDAD: Comunicación con servicios externos.
 * PRINCIPIO: Separation of Concerns - aísla la integración externa.
 */

import { serverEnv } from "./env"
import type { Movie } from "./types"

const getHeaders = () => ({
  "X-RapidAPI-Key": serverEnv.RAPIDAPI_KEY,
  "X-RapidAPI-Host": serverEnv.RAPIDAPI_HOST,
  "Content-Type": "application/json",
})

/**
 * Error personalizado para errores de API
 * Facilita el manejo de errores específicos de la integración externa
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Busca películas en la API externa de IMDB
 *
 * @param query - Término de búsqueda
 * @param page - Número de página (paginación)
 * @returns Lista de películas encontradas
 * @throws ApiError si la petición falla
 */
export async function searchMoviesExternal(
  query: string,
  page = 1,
): Promise<{ movies: Movie[]; totalResults: number }> {
  try {
    const url = `${serverEnv.RAPIDAPI_BASE_URL}/imdb/search?query=${encodeURIComponent(query)}&page=${page}`

    console.log("[v0] Searching movies:", { url, query, page })

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      // Cache strategy para optimizar requests repetidos
      next: { revalidate: 3600 }, // Cache por 1 hora
    })

    console.log("[v0] API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] API Error:", errorText)
      throw new ApiError(`Error al buscar películas: ${response.statusText}`, response.status)
    }

    const data = await response.json()
    console.log("[v0] API Response data:", data)

    if (!data || !data.results) {
      return { movies: [], totalResults: 0 }
    }

    const movies: Movie[] = (data.results || []).map((item: any) => ({
      id: item.id || item.imdb_id,
      title: item.title || item.originalTitle,
      year: item.year || item.releaseYear,
      type: item.type || "movie",
      poster: item.poster || item.image,
    }))

    return {
      movies,
      totalResults: data.total || movies.length,
    }
  } catch (error) {
    console.error("[v0] Search error:", error)
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError("Error de conexión con la API externa", 500, error)
  }
}

/**
 * Obtiene el detalle completo de una película desde IMDB
 *
 * @param id - ID de la película (imdbID)
 * @returns Información detallada de la película
 * @throws ApiError si la petición falla o la película no existe
 */
export async function getMovieDetailExternal(id: string): Promise<Movie> {
  try {
    const url = `${serverEnv.RAPIDAPI_BASE_URL}/imdb/title/${id}`

    console.log("[v0] Getting movie detail:", { url, id })

    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      next: { revalidate: 86400 }, // Cache por 24 horas (datos estáticos)
    })

    console.log("[v0] Detail API Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Detail API Error:", errorText)
      throw new ApiError(`Error al obtener detalle: ${response.statusText}`, response.status)
    }

    const data = await response.json()
    console.log("[v0] Detail API Response data:", data)

    if (!data) {
      throw new ApiError("Película no encontrada", 404)
    }

    return {
      id: data.id || data.imdb_id,
      title: data.title || data.originalTitle,
      year: data.year || data.releaseYear,
      type: data.type || "movie",
      poster: data.poster || data.image,
      plot: data.plot || data.description,
      director: data.director,
      actors: data.cast ? data.cast.join(", ") : undefined,
      genre: data.genres ? data.genres.join(", ") : undefined,
      rating: data.rating?.toString(),
      runtime: data.runtime,
      released: data.releaseDate,
    }
  } catch (error) {
    console.error("[v0] Detail error:", error)
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError("Error al obtener detalle de la película", 500, error)
  }
}
