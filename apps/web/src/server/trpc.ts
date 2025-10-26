/**
 * tRPC Configuration
 *
 * Configuración base de tRPC para crear una API tipada end-to-end.
 * Define el contexto, middleware y utilidades para crear routers.
 *
 * ARQUITECTURA: Configuración centralizada de tRPC.
 * JUSTIFICACIÓN: tRPC proporciona type-safety end-to-end y validación automática.
 * VENTAJA: Type-safety completo entre cliente y servidor sin código duplicado.
 */

import { initTRPC } from "@trpc/server"
import { ZodError } from "zod"
import superjson from "superjson"
import type { Context } from "@/server/context"

/**
 * Inicialización de tRPC con configuración optimizada
 * 
 * TRANSFORMER: SuperJSON para serializar tipos complejos (Date, Map, Set, etc.)
 * ERROR FORMATTER: Formato personalizado que incluye detalles de validación Zod
 */
const t = initTRPC.context<Context>().create({
  // TRANSFORMER: Permite serializar tipos complejos entre cliente y servidor
  // VENTAJA: Date, Map, Set, BigInt, etc. se serializan correctamente
  transformer: superjson,

  // ERROR FORMATTER: Formato personalizado para errores más informativos
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // Incluir detalles de validación de Zod para debugging
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// EXPORTS: Procedimientos y utilidades de tRPC
export const router = t.router
export const publicProcedure = t.procedure

/**
 * Middleware de logging para debugging y monitoreo
 * 
 * FUNCIONALIDAD: Registra tiempo de ejecución de cada procedimiento.
 * VENTAJA: Facilita debugging y monitoreo de performance.
 * USO: Aplicar a procedimientos que necesiten logging detallado.
 */
export const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const duration = Date.now() - start

  // Log estructurado para fácil parsing
  console.log(`[tRPC] ${type} ${path} - ${duration}ms`)

  return result
})

// Procedimiento con logging automático
export const loggedProcedure = publicProcedure.use(loggerMiddleware)

// Helper para crear routers (alias para consistencia)
export const createTRPCRouter = t.router