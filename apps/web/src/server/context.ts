// src/server/context.ts
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export const createContext = async (_opts?: FetchCreateContextFnOptions) => {
  // Por ahora vacío. Aquí podés agregar auth, DB, etc.
  return {};
};

export type Context = Awaited<ReturnType<typeof createContext>>;
