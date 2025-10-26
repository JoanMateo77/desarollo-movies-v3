/**
 * Movie Card Component
 *
 * Tarjeta individual para mostrar información resumida de una película.
 * Clickeable para navegar al detalle.
 *
 * RESPONSABILIDAD: Presentación de datos de película en formato card.
 */

"use client"

import Link from "next/link"
import { Film } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageWithLoading } from "@/components/ui/image-with-loading"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        {/* Poster de la película */}
        <div className="relative aspect-2/3 overflow-hidden bg-muted">
          {movie.poster ? (
            <ImageWithLoading
              src={movie.poster}
              alt={movie.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={false}
              quality={ 70}
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            // Placeholder cuando no hay poster
            <div className="flex size-full items-center justify-center">
              <Film className="size-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Título */}
          <h3 className="line-clamp-2 font-semibold leading-tight text-balance">
            {movie.title}
          </h3>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          {/* Año */}
          {movie.year && (
            <span className="text-sm text-muted-foreground">{movie.year}</span>
          )}

          {/* Tipo (movie, series, etc) */}
          {movie.type && (
            <Badge variant="secondary" className="capitalize">
              {movie.type}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}