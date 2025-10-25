/**
 * apps/web/src/server/context.ts
 * Contexto de tRPC
 * 
 * Define qué información estará disponible en todos los procedimientos.
 * Puedes agregar: usuario autenticado, base de datos, headers, etc.
 */

// src/server/context.ts
// src/server/context.ts
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

/**
 * Crea el contexto interno. Puedes agregar cosas como:
 * - Usuario autenticado
 * - Base de datos (ej: prisma)
 * - Headers personalizados
 */
const createInnerContext = (opts?: FetchCreateContextFnOptions) => {
  return {
    req: opts?.req,
    // user: null,
    // db: prisma,
  };
};

/**
 * Contexto expuesto a tRPC
 */
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return createInnerContext(opts);
};

/**
 * ✅ Tipo Context sin usar el helper en desuso
 */
export type Context = Awaited<ReturnType<typeof createContext>>;
