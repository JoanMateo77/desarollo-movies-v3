/**
 * Componente de Imagen con Loading State
 * 
 * Componente optimizado que muestra un loading state mientras carga la imagen
 * y maneja errores de carga de forma elegante.
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
    onError?.()
  }

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
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn(
          "object-cover transition-all duration-300",
          loading ? "opacity-0" : "opacity-100"
        )}
        priority={priority}
        quality={quality}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
