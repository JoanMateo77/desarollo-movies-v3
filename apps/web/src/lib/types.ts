/**
 * Type Definitions
 *apps/web/src/lib/types.ts
 * Define todos los tipos compartidos en la aplicación.
 * Mantiene consistencia entre frontend, backend y API externa.
 *
 * PRINCIPIO: Single Source of Truth para los tipos de datos.
 */

// apps/web/src/lib/types.ts
// apps/web/src/lib/types.ts
// apps/web/src/lib/types.ts
import { z } from "zod"

export const movieSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string().optional(),
  type: z.string().optional(),
  poster: z.string().url().optional(),
  plot: z.string().optional(),
  director: z.string().optional(),
  actors: z.string().optional(),
  genre: z.string().optional(),
  rating: z.string().optional(),
  runtime: z.string().optional(),
  released: z.string().optional(),
  trailer: z.string().optional(),
  contentRating: z.string().optional(),
  countriesOfOrigin: z.string().optional(),
  spokenLanguages: z.string().optional(),
  filmingLocations: z.string().optional(),
  productionCompanies: z.string().optional(),
  budget: z.number().optional(),
  grossWorldwide: z.number().optional(),
  numVotes: z.number().optional(),
  metascore: z.number().optional(),
})

export type Movie = z.infer<typeof movieSchema>

// ✅ NUEVO: Tipos para filtros
export interface MovieFilters {
  genre?: string
  year?: string
  rating?: number
  search?: string
}

// ✅ NUEVO: Esquemas para Top 250
export const getTop250InputSchema = z.object({
  genre: z.string().optional(),
})

export type GetTop250Input = z.infer<typeof getTop250InputSchema>

export const getTop250ResponseSchema = z.object({
  movies: z.array(movieSchema),
  totalResults: z.number(),
})

export type GetTop250Response = z.infer<typeof getTop250ResponseSchema>

// ✅ NUEVO: Esquema para obtener detalles de película individual
export const getMovieDetailInputSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
})

export type GetMovieDetailInput = z.infer<typeof getMovieDetailInputSchema>