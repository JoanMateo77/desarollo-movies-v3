// src/app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../../../../server/api/root";
import { createContext } from "../../../../server/context";

/**
 * Nota: la ruta de import es relativa desde este archivo:
 * src/app/api/trpc/[trpc]/route.ts  -> subir 4 niveles hasta src -> server/api/root
 */

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createContext(opts),
  });

export { handler as GET, handler as POST };
