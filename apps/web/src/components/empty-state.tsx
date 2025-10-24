"use client"

/**
 * Empty State Component
 *
 * Muestra un mensaje amigable cuando no hay resultados.
 * Incluye acción para limpiar búsqueda.
 *
 * UX: Evita pantallas vacías confusas, guía al usuario.
 */

import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  query: string
  onClear: () => void
}

export function EmptyState({ query, onClear }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <SearchX className="mb-4 size-16 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No se encontraron resultados</h3>
        <p className="mb-6 text-center text-sm text-muted-foreground text-balance">
          No encontramos películas que coincidan con &ldquo;{query}&rdquo;.
          <br />
          Intenta con otros términos de búsqueda.
        </p>
        <Button onClick={onClear} variant="outline">
          Limpiar búsqueda
        </Button>
      </CardContent>
    </Card>
  )
}