/**
* Home Page
*
* Página principal de la aplicación.
* Muestra el componente de búsqueda de películas.
*
* ARQUITECTURA: Client Component que coordina la UI principal.
*/

"use client"

import { MovieSearch } from "@/components/movie-search"

export default function HomePage() {
return (
<div className="container mx-auto max-w-7xl px-4 py-8">
{/* Header */}
<header className="mb-8">
<h1 className="mb-2 text-4xl font-bold text-balance">Explorador de Películas</h1>
<p className="text-lg text-muted-foreground text-pretty">
Busca y descubre información sobre tus películas y series favoritas
</p>
</header>

{/* Componente principal de búsqueda */}
<MovieSearch />
</div>
)
}