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
      type: z.enum(["movie", "tvSeries", "tvMovie", "tvMiniSeries", "tvSpecial", "all"]).default("all")
    }))
    .query(async ({ input }) => {
      const base = getRapidBaseUrl();
      
      // Construir parámetros de búsqueda
      const searchParams = new URLSearchParams({
        q: input.query,
        rows: "25", // Número fijo de resultados por página
        sortOrder: "ASC",
        sortField: "id"
      });

      // Agregar filtro de tipo si no es "all"
      if (input.type !== "all") {
        searchParams.set("type", input.type);
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

        try {
          const data = JSON.parse(text);
          
          // Transformar la respuesta de la API al formato esperado por el frontend
          const movies = data.results?.map((movie: any) => ({
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

          return {
            movies,
            totalResults: data.numFound || 0,
            page: input.page,
            hasMore: movies.length === 25, // Si devolvió 25, probablemente hay más
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
});
