/**
 * Router de Películas v2
 * 
 * Nueva implementación del router que usa la arquitectura de servicios.
 * Mantiene la misma API externa que el router original.
 */

import { z } from "zod"
import { router, publicProcedure } from "../../trpc"
import { MovieService } from "../../services/movie.service"
import { MovieRepository } from "../../repositories/movie.repository"
import { MovieTransformer } from "../../transformers/movie.transformer"

// Crear instancias de los servicios
const movieRepository = new MovieRepository()
const movieTransformer = new MovieTransformer()
const movieService = new MovieService(movieRepository, movieTransformer)

export const moviesV2Router = router({
  // Obtener Top 250 películas
  getTop250: publicProcedure
    .input(z.object({ 
      genre: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const filters = input.genre ? { genre: input.genre } : undefined
      return await movieService.getTop250Movies(filters)
    }),

  // Obtener géneros disponibles
  getGenres: publicProcedure
    .query(async () => {
      const genres = await movieService.getGenres()
      // Retornar solo los nombres para mantener compatibilidad con el frontend
      return genres.map(genre => genre.name)
    }),

  // Obtener detalles de película específica
  getMovieDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const movie = await movieService.getMovieById(input.id)
      if (!movie) {
        throw new Error("Película no encontrada en el Top 250")
      }
      return movie
    }),
})

