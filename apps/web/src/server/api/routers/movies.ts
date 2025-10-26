// apps/web/src/server/api/routers/movies.ts
import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";
import { ApiService } from "../../../lib/services/api.service";
import { MovieService } from "../../../lib/services/movie.service";

export const moviesRouter = router({
  // ✅ Obtener Top 250 películas (refactorizado)
  getTop250: publicProcedure
    .input(z.object({ 
      genre: z.string().optional(), // Filtro por género
    }))
    .query(async ({ input }) => {
      try {
        // Obtener datos de la API
        const data = await ApiService.getTop250Movies();
        
        // Transformar datos usando el servicio
        let movies = MovieService.transformImdbMovies(data || []);

        // Aplicar filtro por género si se especifica
        if (input.genre) {
          const filters = { genre: input.genre };
          movies = MovieService.filterMovies(movies, filters);
        }

        return {
          movies,
          totalResults: movies.length,
        };
      } catch (err) {
        if (err instanceof Error && err.message.includes('Rate limit')) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: err.message,
          });
        }
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno: ${(err as Error).message}`,
        });
      }
    }),

  // ✅ Obtener géneros disponibles (refactorizado)
  getGenres: publicProcedure
    .query(async () => {
      try {
        // Obtener datos de la API
        const data = await ApiService.getTop250Movies();
        
        // Transformar datos usando el servicio
        const movies = MovieService.transformImdbMovies(data || []);
        
        // Extraer géneros únicos usando el servicio
        return MovieService.extractGenres(movies);
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno: ${(err as Error).message}`,
        });
      }
    }),

  // ✅ Obtener detalles de película específica (refactorizado)
  getMovieDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        // Obtener datos de la API
        const data = await ApiService.getTop250Movies();
        
        // Transformar datos usando el servicio
        const movies = MovieService.transformImdbMovies(data || []);
        
        // Buscar la película específica por ID
        const movie = MovieService.findMovieById(movies, input.id);
        
        if (!movie) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Película no encontrada en el Top 250",
          });
        }

        return movie;
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno: ${(err as Error).message}`,
        });
      }
    }),
});