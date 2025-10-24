/**
 * Movie Card Skeleton
 *
 * Skeleton loader para MovieCard.
 * Muestra un placeholder mientras cargan los datos reales.
 *
 * UX: Mejora la percepción de velocidad mostrando estructura antes de datos.
 */

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Skeleton del poster */}
      <Skeleton className="aspect-[2/3] w-full" />

      <CardContent className="p-4">
        {/* Skeleton del título */}
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        {/* Skeleton de año y tipo */}
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-5 w-16" />
      </CardFooter>
    </Card>
  )
}
