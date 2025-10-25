// apps/web/src/server/api/routers/movies.ts
import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { TRPCError } from "@trpc/server";

function getRapidBaseUrl(): string {
  // Prioriza BASE_URL explícita
  if (process.env.RAPIDAPI_BASE_URL && process.env.RAPIDAPI_BASE_URL.trim() !== "") {
    return process.env.RAPIDAPI_BASE_URL;
  }

  // Si no hay base, intenta componerla desde el host
  if (process.env.RAPIDAPI_HOST && process.env.RAPIDAPI_HOST.trim() !== "") {
    // Asumo el path /api/imdb según tu API; ajusta si tu host usa otro prefijo
    return `https://${process.env.RAPIDAPI_HOST}/api/imdb`;
  }

  // Ninguna variable presente -> error claro
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message:
      "Falta RAPIDAPI_BASE_URL o RAPIDAPI_HOST en .env.local. Añade RAPIDAPI_BASE_URL o RAPIDAPI_HOST y reinicia el servidor.",
  });
}

export const moviesRouter = router({
  // NUEVO ENDPOINT DE BÚSQUEDA
  
  search: publicProcedure
  .input(z.object({ 
    query: z.string().min(1),
    page: z.number().int().positive().default(1),
    type: z.enum(["movie", "tvSeries", "tvMovie", "tvMiniSeries", "tvSpecial", "all"]).default("all"),
    minRating: z.number().min(0).max(10).optional(), // ✅ NUEVO PARÁMETRO
  }))
    .query(async ({ input }) => {
      const base = getRapidBaseUrl();
      
      // Construir parámetros de búsqueda
      const searchParams = new URLSearchParams({
        q: input.query,
        rows: "101", // Número fijo de resultados por página
        sortOrder: "ASC",
        sortField: "id"
      });

      // Agregar filtro de tipo si no es "all"
      if (input.type !== "all") {
        searchParams.set("type", input.type);
      }

    // ✅ AGREGAR FILTRO DE RATING
    if (input.minRating) {
      searchParams.set("minRating", input.minRating.toString());
    }

      const url = `${base}/search?${searchParams.toString()}`;

      // Verificar que la API key esté presente
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

        // ✅ CÓDIGO CORREGIDO (reemplazar líneas 92-116)
          try {
            const data = JSON.parse(text);
            
            // Transformar la respuesta de la API al formato esperado por el frontend
            let movies = data.results?.map((movie: any) => ({
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
            })) || [];

            // ✅ FILTRAR RESULTADOS POR RATING EN EL CLIENTE SI LA API NO LO SOPORTA
            if (input.minRating) {
              movies = movies.filter((movie: any) => 
                movie.rating && parseFloat(movie.rating) >= input.minRating!
              );
            }

            return {
              movies,
              totalResults: data.numFound || 0,
              page: input.page,
              hasMore: movies.length === 100, // Cambiado a 100 porque pusiste rows: "100"
            };
        } catch {
          return { 
            movies: [], 
            totalResults: 0, 
            page: input.page, 
            hasMore: false 
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

  // ENDPOINT EXISTENTE (mantener)
  getCastTitles: publicProcedure
    .input(z.object({ castId: z.string() }))
    .query(async ({ input }: { input: { castId: string } }) => {
      const base = getRapidBaseUrl();
      const url = `${base}/cast/${encodeURIComponent(input.castId)}/titles`;

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
          return JSON.parse(text);
        } catch {
          return { text };
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno fetching RapidAPI: ${(err as Error).message}`,
        });
      }
    }),
    getDetail: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const base = getRapidBaseUrl();
      const url = `${base}/movie/${encodeURIComponent(input.id)}`;

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
          return {
            id: data.id,
            title: data.primaryTitle || data.title,
            year: data.startYear?.toString(),
            type: data.type,
            poster: data.primaryImage,
            plot: data.description,
            director: data.directors?.[0]?.name || "",
            actors: data.actors?.map((actor: any) => actor.name).join(", ") || "",
            genre: data.genres?.join(", ") || "",
            rating: data.averageRating?.toString(),
            runtime: data.runtimeMinutes?.toString(),
            released: data.releaseDate,
            trailer: data.trailer,
            contentRating: data.contentRating,
            countriesOfOrigin: data.countriesOfOrigin?.join(", ") || "",
            spokenLanguages: data.spokenLanguages?.join(", ") || "",
            filmingLocations: data.filmingLocations?.join(", ") || "",
            productionCompanies: data.productionCompanies?.map((company: any) => company.name).join(", ") || "",
            budget: data.budget,
            grossWorldwide: data.grossWorldwide,
            numVotes: data.numVotes,
            metascore: data.metascore,
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

