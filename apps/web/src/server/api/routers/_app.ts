/**
 * App Router
 *
 * Router principal que combina todos los sub-routers.
 * Define la estructura completa de la API.
 *
 * ESCALABILIDAD: Agregar nuevos routers aquí (ej: users, reviews, etc.)
 */

import { router } from "@/server/trpc"
import { moviesRouter } from "./movies"

export const appRouter = router({
  movies: moviesRouter,
  // Aquí se pueden agregar más routers:
  // users: usersRouter,
  // reviews: reviewsRouter,
})

export type AppRouter = typeof appRouter