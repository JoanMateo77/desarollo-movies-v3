/**
 * Environment Variables Configuration
 *
 * apps/web/src/lib/env.ts
 * Centraliza y valida todas las variables de entorno necesarias.
 * Usa Zod para validación en tiempo de ejecución y tipado estricto.
 *
 * SEGURIDAD: Las claves de API NUNCA se exponen al cliente.
 * Todas las variables son server-side only.
 */

// apps/web/src/lib/env.ts
import { z } from "zod"

const serverEnvSchema = z.object({
  // RapidAPI credentials - SOLO disponibles en el servidor
  RAPIDAPI_KEY: z.string().min(1, "RAPIDAPI_KEY es requerida"),
  RAPIDAPI_HOST: z.string().min(1, "RAPIDAPI_HOST es requerido"),
  RAPIDAPI_BASE_URL: z.string().url("RAPIDAPI_BASE_URL debe ser una URL válida").optional(), // ✅ OPCIONAL

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

export const serverEnv = serverEnvSchema.parse({
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  RAPIDAPI_HOST: process.env.RAPIDAPI_HOST,
  RAPIDAPI_BASE_URL: process.env.RAPIDAPI_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
})

export type ServerEnv = z.infer<typeof serverEnvSchema>