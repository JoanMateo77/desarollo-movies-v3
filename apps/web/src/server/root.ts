/**
 * apps/web/src/server/root.ts
 * Router principal de tRPC
 * 
 * Combina todos los sub-routers (movies, users, etc.)
 * Este es el punto de entrada de toda tu API.
 */

import { createTRPCRouter } from "./trpc"
import { moviesRouter } from "../server/api/routers/movies"

export const appRouter = createTRPCRouter({
  movies: moviesRouter,
  // Agrega más routers aquí:
  // users: usersRouter,
  // posts: postsRouter,
})

// Exporta el tipo para usarlo en el cliente
export type AppRouter = typeof appRouter