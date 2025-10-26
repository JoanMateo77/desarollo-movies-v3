/**
 * apps/web/src/app/movie/[id]/movie.tsx
 * Movie Detail Page
 *
 * Página de detalle de película individual.
 * Muestra información completa: poster, plot, director, actores, etc.
 *
 * ARQUITECTURA: Server Component que usa tRPC para fetch de datos.
 * NAVEGACIÓN: Accesible desde MovieCard al hacer click.
 */

"use client"

import { use, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, Film, Star, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { trpc } from "@/lib/trpc-client"
import { ErrorState } from "@/components/error-state"

    interface MovieDetailPageProps {
    params: Promise<{ id: string }>
    }

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = use(params)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = trpc.movies.getMovieDetail.useQuery(
    { id },
    {
      // Retry automático en caso de error
      retry: 2,
    },
  )

  if (isLoading) {
    return <MovieDetailSkeleton />
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 size-4" />
            Volver
          </Link>
        </Button>
        <ErrorState message={error?.message || "No se pudo cargar la película"} onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Botón de volver */}
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Volver
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Poster */}
        <div className="relative lg:top-8 lg:self-start lg:col-span-1 aspect-[2/3] overflow-hidden rounded-lg bg-muted">
          {movie.poster && !imageError ? (
            <>
              {/* Loading state */}
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="size-12 animate-spin text-muted-foreground" />
                </div>
              )}
              
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className={`object-cover transition-all duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                priority
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 1024px) 100vw, 300px"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false)
                  setImageError(true)
                }}
              />
            </>
          ) : (
            <div className="flex size-full items-center justify-center">
              <Film className="size-24 text-muted-foreground" />
            </div>
          )}
        </div>


        {/* Información detallada */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {movie.type && (
                <Badge variant="secondary" className="capitalize">
                  {movie.type}
                </Badge>
              )}
              {movie.year && <Badge variant="outline">{movie.year}</Badge>}
            </div>
            <h1 className="text-4xl font-bold leading-tight text-balance">{movie.title}</h1>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm">
            {movie.rating && (
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{movie.rating}</span>
                <span className="text-muted-foreground">/ 10</span>
              </div>
            )}
            {movie.runtime && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="size-4" />
                <span>{movie.runtime}</span>
              </div>
            )}
            {movie.released && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span>{movie.released}</span>
              </div>
            )}
          </div>

          {/* Géneros */}
          {movie.genre && (
            <div>
              <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Géneros</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genre.split(",").map((genre) => (
                  <Badge key={genre.trim()} variant="outline">
                    {genre.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Plot */}
          {movie.plot && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-3 text-lg font-semibold">Sinopsis</h2>
                <p className="leading-relaxed text-muted-foreground text-pretty">{movie.plot}</p>
              </CardContent>
            </Card>
          )}

          {/* Director */}
          {movie.director && (
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                Director
              </h2>
              <p className="text-foreground">{movie.director}</p>
            </div>
          )}

          {/* Actores */}
          {movie.actors && (
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Users className="size-4" />
                Reparto
              </h2>
              <p className="leading-relaxed text-foreground">{movie.actors}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Skeleton para página de detalle
 */
function MovieDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="mb-6 h-10 w-24" />

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <Skeleton className="aspect-[2/3] w-full rounded-lg" />

        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
          </div>

          <div className="flex gap-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>

          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  )
}
