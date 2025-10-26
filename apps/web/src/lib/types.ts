/**
 * Type Definitions
 * 
 * Define todos los tipos compartidos en la aplicación.
 * Mantiene consistencia entre frontend, backend y API externa.
 *
 * ARQUITECTURA: Single Source of Truth para los tipos de datos.
 * JUSTIFICACIÓN: Zod + TypeScript proporciona:
 * - Validación runtime y compile-time
 * - Type inference automático
 * - Error messages descriptivos
 * - Refactoring seguro
 */

import { z } from "zod"

/**
 * Esquema de película con validación completa
 * 
 * ESTRATEGIA: Todos los campos opcionales para manejar datos incompletos de API.
 * VALIDACIÓN: Zod valida tipos y formatos en runtime.
 * FLEXIBILIDAD: Campos opcionales permiten datos parciales de diferentes fuentes.
 */
export const movieSchema = z.object({
  id: z.string(), // ID único requerido
  title: z.string(), // Título requerido
  year: z.string().optional(), // Año como string para flexibilidad
  type: z.string().optional(), // movie, tv, etc.
  poster: z.string().url().optional(), // URL del poster con validación de URL
  plot: z.string().optional(), // Sinopsis
  director: z.string().optional(), // Director(es) como string
  actors: z.string().optional(), // Actores como string separado por comas
  genre: z.string().optional(), // Géneros como string separado por comas
  rating: z.string().optional(), // Rating como string para UI
  runtime: z.string().optional(), // Duración en minutos
  released: z.string().optional(), // Fecha de estreno
  trailer: z.string().optional(), // URL del trailer
  contentRating: z.string().optional(), // Clasificación (PG-13, R, etc.)
  countriesOfOrigin: z.string().optional(), // Países de origen
  spokenLanguages: z.string().optional(), // Idiomas
  filmingLocations: z.string().optional(), // Ubicaciones de filmación
  productionCompanies: z.string().optional(), // Compañías productoras
  budget: z.number().optional(), // Presupuesto como número
  grossWorldwide: z.number().optional(), // Recaudación mundial como número
  numVotes: z.number().optional(), // Número de votos como número
  metascore: z.number().optional(), // Puntuación Metacritic como número
})

// Tipo de película inferido del esquema
// VENTAJA: Cambios en el esquema se reflejan automáticamente en el tipo
export type Movie = z.infer<typeof movieSchema>

/**
 * Interfaz para filtros de películas
 * 
 * DISEÑO: Interfaz simple para filtros del lado del cliente.
 * FLEXIBILIDAD: Todos los filtros son opcionales para búsquedas abiertas.
 */
export interface MovieFilters {
  genre?: string
  year?: string
  rating?: number // Número para comparaciones numéricas
  search?: string
}

/**
 * Esquemas para endpoints de tRPC
 * 
 * ESTRATEGIA: Esquemas separados para input y output de cada endpoint.
 * VENTAJA: Validación automática de parámetros y respuestas.
 */

// Input para getTop250
export const getTop250InputSchema = z.object({
  genre: z.string().optional(), // Filtro opcional por género
})

export type GetTop250Input = z.infer<typeof getTop250InputSchema>

// Response para getTop250
export const getTop250ResponseSchema = z.object({
  movies: z.array(movieSchema), // Array de películas validadas
  totalResults: z.number(), // Contador total de resultados
})

export type GetTop250Response = z.infer<typeof getTop250ResponseSchema>

// Input para getMovieDetail
export const getMovieDetailInputSchema = z.object({
  id: z.string().min(1, "ID es requerido"), // ID requerido con validación mínima
})

export type GetMovieDetailInput = z.infer<typeof getMovieDetailInputSchema>