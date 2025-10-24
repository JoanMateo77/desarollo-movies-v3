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
  getCastTitles: publicProcedure
    .input(z.object({ castId: z.string() }))
    .query(async ({ input }: { input: { castId: string } }) => {
      const base = getRapidBaseUrl(); // valida y obtiene base
      const url = `${base}/cast/${encodeURIComponent(input.castId)}/titles`;

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
          // 429 rate limit handling
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

        // Intentar parsear JSON
        try {
          return JSON.parse(text);
        } catch {
          // Si el body no es JSON, devolver el texto
          return { text };
        }
      } catch (err) {
        // Re-lanzar como TRPCError para que el cliente reciba información clara
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Error interno fetching RapidAPI: ${(err as Error).message}`,
        });
      }
    }),
});
