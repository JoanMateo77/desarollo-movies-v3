// apps/web/src/server/api/routers/movies.ts
import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

function getRapidBaseUrl(): string {
  if (process.env.RAPIDAPI_BASE_URL && process.env.RAPIDAPI_BASE_URL.trim() !== "") {
    return process.env.RAPIDAPI_BASE_URL;
  }

  if (process.env.RAPIDAPI_HOST && process.env.RAPIDAPI_HOST.trim() !== "") {
    return `https://${process.env.RAPIDAPI_HOST}/api/imdb`; // ✅ CORRECTO
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Falta RAPIDAPI_BASE_URL o RAPIDAPI_HOST en .env.local",
  });
}

export const moviesRouter = router({
  // ✅ NUEVO: Obtener Top 250 películas
  getTop250: publicProcedure
    .input(z.object({ 
      genre: z.string().optional(), // Filtro por género
    }))
    .query(async ({ input }) => {
      const base = getRapidBaseUrl();
      const url = `${base}/top250-movies`; // ✅ Esto debería dar: https://imdb236.p.rapidapi.com/api/imdb/top250-movies

      console.log("🔍 URL que se está llamando:", url); // ✅ DEBUG

      if (!process.env.RAPIDAPI_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falta RAPIDAPI_KEY en .env.local",
        });
      }

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST ?? "",
          },
        });

        const text = await res.text().catch(() => "");

        if (!res.ok) {
          if (res.status === 429) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: `Rate limit (429) de RapidAPI. Body: ${text}`,
            });
          }

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `RapidAPI returned ${res.status}. Body: ${text}`,
          });
        }

        try {
          const data = JSON.parse(text);
          
          // Transformar la respuesta al formato esperado
          let movies = data?.map((movie: any) => ({
            id: movie.id,
            title: movie.primaryTitle,
            year: movie.startYear?.toString(),
            type: movie.type,
            poster: movie.primaryImage,
            plot: movie.description,
            director: movie.directors?.[0]?.name || "",
            actors: movie.actors?.map((actor: any) => actor.name).join(", ") || "",
            genre: movie.genres?.join(", ") || "",
            rating: movie.averageRating?.toString(),
            runtime: movie.runtimeMinutes?.toString(),
            released: movie.releaseDate,
            trailer: movie.trailer,
            contentRating: movie.contentRating,
            countriesOfOrigin: movie.countriesOfOrigin?.join(", ") || "",
            spokenLanguages: movie.spokenLanguages?.join(", ") || "",
            filmingLocations: movie.filmingLocations?.join(", ") || "",
            productionCompanies: movie.productionCompanies?.map((company: any) => company.name).join(", ") || "",
            budget: movie.budget,
            grossWorldwide: movie.grossWorldwide,
            numVotes: movie.numVotes,
            metascore: movie.metascore,
          })) || [];

          // ✅ FILTRAR POR GÉNERO SI SE ESPECIFICA
          if (input.genre) {
            movies = movies.filter((movie: any) => 
              movie.genre && movie.genre.toLowerCase().includes(input.genre!.toLowerCase())
            );
          }

          return {
            movies,
            totalResults: movies.length,
          };
        } catch {
          return { 
            movies: [], 
            totalResults: 0
          };
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno fetching RapidAPI: ${(err as Error).message}`,
        });
      }
    }),

  // ✅ NUEVO: Obtener géneros disponibles
  getGenres: publicProcedure
    .query(async () => {
      const base = getRapidBaseUrl();
      const url = `${base}/top250-movies`; // ✅ Misma URL

      console.log("🔍 URL géneros:", url); // ✅ DEBUG

      if (!process.env.RAPIDAPI_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falta RAPIDAPI_KEY en .env.local",
        });
      }

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST ?? "",
          },
        });

        const text = await res.text().catch(() => "");

        if (!res.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `RapidAPI returned ${res.status}. Body: ${text}`,
          });
        }

        try {
          const data = JSON.parse(text);
          
          // Extraer todos los géneros únicos
          const allGenres = new Set<string>();
          data?.forEach((movie: any) => {
            if (movie.genres) {
              movie.genres.forEach((genre: string) => allGenres.add(genre));
            }
          });

          return Array.from(allGenres).sort();
        } catch {
          return [];
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno fetching RapidAPI: ${(err as Error).message}`,
        });
      }
    }),

  // ✅ NUEVO: Obtener detalles de película específica
  getMovieDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const base = getRapidBaseUrl();
      const top250Url = `${base}/top250-movies`; // ✅ Misma URL

      console.log("🔍 URL detalles:", top250Url); // ✅ DEBUG

      if (!process.env.RAPIDAPI_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Falta RAPIDAPI_KEY en .env.local",
        });
      }

      try {
        const res = await fetch(top250Url, {
          method: "GET",
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST ?? "",
          },
        });

        const text = await res.text().catch(() => "");

        if (!res.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `RapidAPI returned ${res.status}. Body: ${text}`,
          });
        }

        try {
          const data = JSON.parse(text);
          
          // Buscar la película específica por ID
          const movie = data?.find((m: any) => m.id === input.id);
          
          if (!movie) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Película no encontrada en el Top 250",
            });
          }

          // Transformar la respuesta al formato esperado
          return {
            id: movie.id,
            title: movie.primaryTitle,
            year: movie.startYear?.toString(),
            type: movie.type,
            poster: movie.primaryImage,
            plot: movie.description,
            director: movie.directors?.[0]?.name || "",
            actors: movie.actors?.map((actor: any) => actor.name).join(", ") || "",
            genre: movie.genres?.join(", ") || "",
            rating: movie.averageRating?.toString(),
            runtime: movie.runtimeMinutes?.toString(),
            released: movie.releaseDate,
            trailer: movie.trailer,
            contentRating: movie.contentRating,
            countriesOfOrigin: movie.countriesOfOrigin?.join(", ") || "",
            spokenLanguages: movie.spokenLanguages?.join(", ") || "",
            filmingLocations: movie.filmingLocations?.join(", ") || "",
            productionCompanies: movie.productionCompanies?.map((company: any) => company.name).join(", ") || "",
            budget: movie.budget,
            grossWorldwide: movie.grossWorldwide,
            numVotes: movie.numVotes,
            metascore: movie.metascore,
          };
        } catch {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Error al parsear respuesta de la API",
          });
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno fetching RapidAPI: ${(err as Error).message}`,
        });
      }
    }),
});