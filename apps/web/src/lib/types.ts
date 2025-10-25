/**
 * Type Definitions
 *apps/web/src/lib/types.ts
 * Define todos los tipos compartidos en la aplicación.
 * Mantiene consistencia entre frontend, backend y API externa.
 *
 * PRINCIPIO: Single Source of Truth para los tipos de datos.
 */

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
})

export type Movie = z.infer<typeof movieSchema>

export const searchMoviesInputSchema = z.object({
  query: z.string().min(1, "La búsqueda no puede estar vacía").max(100),
  page: z.number().int().positive().default(1),
  type: z.enum(["movie", "tvSeries", "tvMovie", "tvMiniSeries", "tvSpecial", "all"]).default("all"), // ✅ ACTUALIZADO
  minRating: z.number().min(0).max(10).optional(), // ✅ NUEVO

})

export type SearchMoviesInput = z.infer<typeof searchMoviesInputSchema>

export const getMovieDetailInputSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
})

export type GetMovieDetailInput = z.infer<typeof getMovieDetailInputSchema>

export const searchMoviesResponseSchema = z.object({
  movies: z.array(movieSchema),
  totalResults: z.number(),
  page: z.number(),
  hasMore: z.boolean(),
})

export type SearchMoviesResponse = z.infer<typeof searchMoviesResponseSchema>