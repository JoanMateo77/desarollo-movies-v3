# Explorador de películas: Top 250 de IMDb

Aplicación web para explorar, buscar y filtrar las 250 películas mejor valoradas de IMDb, con página de detalle por película. Construida con Next.js 16, React 19 y tRPC, con tipado de extremo a extremo entre cliente y servidor.

**Demo:** https://desarollo-movies-v3-web-yykh.vercel.app/

**Capturas y video:** [carpeta en Google Drive](https://drive.google.com/drive/folders/19W5YGJGuVVl5J8UnzMjy4tObj8Xgq9Nt?usp=sharing)

## Qué hace

- Lista las 250 películas que devuelve el endpoint `top250-movies` de la API de IMDb en RapidAPI.
- Busca en tiempo real por título, sinopsis, director o actores.
- Filtra por género con una lista de géneros generada a partir de los datos.
- Muestra la página de detalle `/movie/[id]` con póster, año, calificación, duración, fecha de estreno, géneros, sinopsis, director y reparto.
- Maneja los estados de carga (skeletons), error con botón de reintento y búsqueda sin resultados.

## Stack

| Parte | Tecnología |
| --- | --- |
| Framework | Next.js 16.0 (App Router, React Compiler activado), React 19.2, TypeScript 5.9 |
| API | tRPC 11.6 con SuperJSON, Zod 4.1 para validar entradas y variables de entorno |
| Datos en el cliente | TanStack Query 5.90 (vía `@trpc/react-query`) |
| Interfaz | Tailwind CSS 4.1, componentes Radix UI, Lucide React |
| Pruebas | Jest 29 con ts-jest |
| Monorepo | pnpm 10.19 workspaces y Turborepo 2.5 |
| Despliegue | Vercel, con Vercel Analytics |

Las versiones exactas están en [`package.json`](package.json) y [`apps/web/package.json`](apps/web/package.json).

## Estructura

```
apps/web/
├─ src/app/                    # Rutas: inicio, /movie/[id] y /api/trpc/[trpc]
├─ src/components/             # MovieSearch, MovieCard, estados vacío/error/carga y componentes ui/
├─ src/server/                 # Configuración de tRPC y router `movies`
├─ src/lib/services/           # ApiService (llamadas a RapidAPI) y MovieService (transformar y filtrar)
├─ src/lib/env.ts              # Validación de variables de entorno con Zod
├─ src/__tests__/              # Pruebas del router tRPC
└─ docs/                       # Arquitectura, API, componentes y diagramas de flujo
packages/                      # Configuración compartida de ESLint y TypeScript, y paquete ui
docs/                          # Guías de instalación, pruebas y despliegue
scripts/verify-tests.js        # Instala dependencias y corre las pruebas con cobertura
```

## Cómo correrlo

Requisitos: Node.js 18 o superior, pnpm 10 y una clave de la API de IMDb en [RapidAPI](https://rapidapi.com/).

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # agrega tu RAPIDAPI_KEY
pnpm dev                                        # http://localhost:3000
```

Variables en `apps/web/.env.local`:

```env
RAPIDAPI_KEY=tu_clave
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb   # opcional
```

Otros comandos:

```bash
pnpm build                    # compila el monorepo con Turborepo
pnpm lint                     # ESLint en los paquetes
pnpm --filter web test        # pruebas del router tRPC con Jest
node scripts/verify-tests.js  # instala dependencias, corre las pruebas y genera cobertura
```

## Decisiones técnicas

- **tRPC en lugar de una API REST propia.** El cliente usa los tipos del router directamente y Zod valida la entrada de cada procedimiento (`getTop250`, `getGenres`, `getMovieDetail`).
- **La clave de RapidAPI solo vive en el servidor.** Las llamadas salen desde los procedimientos tRPC, `env.ts` valida las variables con Zod y un error 429 de RapidAPI se traduce en `TOO_MANY_REQUESTS`.
- **Búsqueda y filtro en el cliente.** Las 250 películas se cargan una vez (TanStack Query con `staleTime` de 60 s y sin recarga al volver a la ventana) y se filtran en memoria, sin una petición por cada tecla.
- **Capa de servicios separada del router.** `ApiService` encapsula la llamada externa y `MovieService` transforma la respuesta de IMDb a un modelo `Movie` estable para la interfaz.

## Documentación

- [Instalación paso a paso](docs/SETUP_INSTRUCTIONS.md)
- [Guía de pruebas](docs/TESTING_GUIDE.md)
- [Guía de despliegue](docs/DEPLOYMENT_GUIDE.md)
- [Resumen de la documentación](docs/DOCUMENTATION_SUMMARY.md)
- [Arquitectura](apps/web/docs/ARCHITECTURE.md), [API tRPC](apps/web/docs/API_DOCUMENTATION.md), [Componentes](apps/web/docs/COMPONENT_DOCUMENTATION.md) y [Diagramas de flujo](apps/web/docs/FLOW_DIAGRAMS.md)

---

Hecho por [Joan Mateo Cardona](https://github.com/JoanMateo77).
