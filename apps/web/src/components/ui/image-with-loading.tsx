/**
 * Componente de Imagen con Loading State
 * 
 * Componente optimizado que muestra un loading state mientras carga la imagen
 * y maneja errores de carga de forma elegante.
 * 
 * ARQUITECTURA: Componente wrapper sobre Next.js Image con estados adicionales.
 * JUSTIFICACIÓN: Next.js Image no proporciona loading states nativos, este componente:
 * - Mejora la UX con feedback visual inmediato
 * - Maneja errores de carga de forma elegante
 * - Mantiene todas las optimizaciones de Next.js Image
 * - Proporciona fallbacks consistentes
 */

"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageWithLoadingProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: "blur" | "empty"
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

export function ImageWithLoading({
  src,
  alt,
  fill = false,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes,
  placeholder = "blur",
  blurDataURL,
  onLoad,
  onError,
}: ImageWithLoadingProps) {
  // ESTADO LOCAL: Control de loading y error states
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // HANDLERS: Callbacks para eventos de imagen
  const handleLoad = () => {
    setLoading(false)
    onLoad?.() // Callback opcional del padre
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
    onError?.() // Callback opcional del padre
  }

  // FALLBACK: Estado de error con icono genérico
  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground",
        fill ? "absolute inset-0" : "",
        className
      )}>
        <ImageIcon className="size-8" />
      </div>
    )
  }

  return (
    <div className={cn("relative", fill ? "size-full" : "", className)}>
      {/* LOADING STATE: Spinner mientras carga la imagen */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      {/* NEXT.JS IMAGE: Con todas las optimizaciones habilitadas */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn(
          "object-cover transition-all duration-300",
          loading ? "opacity-0" : "opacity-100" // Fade in cuando termina de cargar
        )}
        priority={priority} // Para imágenes above-the-fold
        quality={quality} // Balance entre calidad y tamaño
        sizes={sizes} // Responsive images
        placeholder={placeholder} // Blur placeholder
        blurDataURL={blurDataURL} // Base64 para blur
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

