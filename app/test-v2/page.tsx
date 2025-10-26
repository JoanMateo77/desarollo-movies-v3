// /**
//  * Página de Prueba v2
//  * 
//  * Página para probar la nueva implementación de la arquitectura
//  * sin afectar la página principal.
//  */

// "use client"

// import { MovieSearchV2 } from "@/components/features/movies/movie-search-v2"

// export default function TestV2Page() {
//   return (
//     <div className="container mx-auto max-w-7xl px-4 py-8">
//       {/* Header */}
//       <header className="mb-8">
//         <h1 className="mb-2 text-4xl font-bold text-balance">Explorador de Películas v2</h1>
//         <p className="text-lg text-muted-foreground text-pretty">
//           Prueba de la nueva arquitectura con mejor separación de responsabilidades
//         </p>
//         <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <p className="text-sm text-blue-800">
//             <strong>Nota:</strong> Esta página usa la nueva implementación con servicios, repositorios y transformadores.
//             Compara el funcionamiento con la página principal.
//           </p>
//         </div>
//       </header>

//       {/* Componente principal de búsqueda v2 */}
//       <MovieSearchV2 />
//     </div>
//   )
// }
