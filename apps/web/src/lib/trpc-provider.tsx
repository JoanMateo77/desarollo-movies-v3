/**
 * tRPC Provider
 * 
 * Provider de React que configura tRPC y React Query.
 * Debe envolver toda la aplicación para habilitar los hooks de tRPC.
 *
 * ARQUITECTURA: Provider pattern para inyección de dependencias.
 * JUSTIFICACIÓN: tRPC + React Query proporciona:
 * - Type-safety end-to-end
 * - Caching inteligente automático
 * - Sincronización de estado
 * - Optimistic updates
 * - Background refetching
 */

"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"
import superjson from "superjson"
import { trpc } from "./trpc-client"

/**
 * Determina la URL base para tRPC según el entorno
 * 
 * ESTRATEGIA: Diferentes URLs para cliente y servidor.
 * - Cliente: Ruta relativa (funciona con cualquier puerto)
 * - Servidor: URL absoluta para SSR
 */
function getBaseUrl() {
  if (typeof window !== "undefined") {
    // En el navegador, usar ruta relativa (funciona en localhost:3000)
    return ""
  }

  // En el servidor durante SSR
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // QUERY CLIENT: Configuración optimizada para performance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // CACHE: 1 minuto de stale time para balance entre fresh data y performance
            staleTime: 60 * 1000, // 1 minuto
            // UX: No refetch al cambiar ventana (evita interrupciones)
            refetchOnWindowFocus: false,
            // RESILENCIA: 1 reintento para errores temporales
            retry: 1,
          },
        },
      }),
  )

  // TRPC CLIENT: Configuración del cliente con optimizaciones
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // BATCH LINK: Agrupa múltiples requests en una sola petición HTTP
        // VENTAJA: Reduce latencia y mejora performance
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          
          // TRANSFORMER: SuperJSON para serializar tipos complejos
          // PERMITE: Date, Map, Set, BigInt, etc.
          transformer: superjson,

          // HEADERS: Personalizables para autenticación futura
          headers() {
            return {
              // Agregar headers de autenticación aquí si es necesario
            }
          },
        }),
      ],
    }),
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}