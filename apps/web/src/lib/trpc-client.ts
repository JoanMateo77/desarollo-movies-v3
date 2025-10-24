/**
 * tRPC Client Configuration
 *
 * Configuración del cliente tRPC para uso en componentes React.
 * Proporciona hooks tipados para llamar a la API.
 *
 * MAGIA: Los hooks son completamente tipados basados en el servidor.
 * TypeScript conoce todos los endpoints, inputs y outputs automáticamente.
 */

import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "@/server/api/routers/_app"

export const trpc = createTRPCReact<AppRouter>()
