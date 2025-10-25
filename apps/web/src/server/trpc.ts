/**
 * apps/web/src/server/trpc.ts
 * tRPC Configuration
 *
 * Configuración base de tRPC para crear una API tipada end-to-end.
 * Define el contexto, middleware y utilidades para crear routers.
 *
 * VENTAJA: Type-safety completo entre cliente y servidor sin código duplicado.
 */
/**
 * apps/web/src/server/trpc.ts
 * tRPC Configuration
 *
 * Configuración base de tRPC para crear una API tipada end-to-end.
 * Define el contexto, middleware y utilidades para crear routers.
 *
 * VENTAJA: Type-safety completo entre cliente y servidor sin código duplicado.
 */

import { initTRPC } from "@trpc/server"
import { ZodError } from "zod"
import superjson from "superjson"
import type { Context } from "@/server/context"


/**
 * Contexto de tRPC
 * Información disponible en todos los procedimientos (queries/mutations)
 */
// interface Context {
//   // Aquí se pueden agregar: usuario autenticado, headers, etc.
//   headers?: Headers
// }

const t = initTRPC.context<Context>().create({
  // SuperJSON permite serializar Date, Map, Set, etc.
  transformer: superjson,

  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Incluir detalles de validación de Zod
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure

/**
 * Middleware de logging (opcional pero útil para debugging)
 * Registra todas las llamadas a la API con timing
 */
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  console.log(`[tRPC] ${type} ${path} - ${duration}ms`)

  return result
})

export const loggedProcedure = publicProcedure.use(loggerMiddleware)

// Exporta los helpers que usarás en tus routers
export const createTRPCRouter = t.router