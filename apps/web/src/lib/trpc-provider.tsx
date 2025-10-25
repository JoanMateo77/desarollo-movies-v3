/**
 * tRPC Provider
 * 
 * 
 * Provider de React que configura tRPC y React Query.
 * Debe envolver toda la aplicación para habilitar los hooks de tRPC.
 *
 * CONFIGURACIÓN: Incluye QueryClient con opciones optimizadas.
 */

"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { useState } from "react"
import superjson from "superjson"
import { trpc } from "./trpc-client"

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // En el navegador, usar ruta relativa (funciona en localhost:3000)
    return ""
  }

  // En el servidor durante SSR
  return `http://localhost:${process.env.PORT ?? 3000}`
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración de cache y refetch
            staleTime: 60 * 1000, // 1 minuto
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // Batch multiple requests en una sola petición HTTP
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          
          // ✅ El transformer va AQUÍ dentro del httpBatchLink
          transformer: superjson,

          // Headers personalizados si es necesario
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