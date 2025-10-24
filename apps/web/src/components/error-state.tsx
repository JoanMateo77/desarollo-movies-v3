"use client"

/**
 * Error State Component
 *
 * Muestra errores de forma amigable con opción de reintentar.
 *
 * UX: Errores claros y accionables, no técnicos.
 */

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{message}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="w-fit bg-transparent">
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  )
}
