// src/server/api/root.ts
import { router } from "../trpc";
import { moviesRouter } from "./routers/movies";

export const appRouter = router({
  movies: moviesRouter,
});

export type AppRouter = typeof appRouter;
