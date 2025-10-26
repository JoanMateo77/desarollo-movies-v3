# 🎬 Explorador de Películas - Documentación Técnica

## 📋 Descripción del Proyecto

**Explorador de Películas** es una aplicación web moderna desarrollada con Next.js 16, React 19 y TypeScript que permite a los usuarios explorar, buscar y filtrar las mejores 250 películas según IMDb. La aplicación ofrece una experiencia de usuario fluida con búsqueda en tiempo real y filtros por género.

## 🎯 Características Principales

- **Top 250 Películas**: Acceso completo a las mejores 250 películas de IMDb
- **Búsqueda en Tiempo Real**: Búsqueda instantánea por título, director, actores o descripción
- **Filtros por Género**: Filtrado dinámico por género cinematográfico
- **Información Detallada**: Datos completos de cada película incluyendo rating, director, actores, etc.
- **Interfaz Moderna**: UI responsiva y atractiva construida con Tailwind CSS y Radix UI
- **Arquitectura Escalable**: Backend con tRPC y frontend con React Query
- **Optimizaciones de Performance**: Imágenes optimizadas, lazy loading y caching inteligente

## 🔧 Stack Tecnológico

### Frontend
- **Next.js 16** - Framework React con App Router y Turbopack
- **React 19** - Biblioteca de UI con React Compiler
- **TypeScript 5.9** - Tipado estático completo
- **Tailwind CSS 4.1** - Framework de estilos utilitarios
- **Radix UI** - Componentes accesibles (Dialog, Select, Label, etc.)
- **Lucide React** - Iconografía moderna
- **React Query (TanStack)** - Manejo de estado del servidor y caching

### Backend
- **tRPC 11.6** - End-to-end typesafe APIs
- **Zod 4.1** - Validación de esquemas y tipos
- **Node.js 18+** - Runtime de JavaScript
- **SuperJSON** - Serialización de datos complejos

### Herramientas de Desarrollo
- **ESLint 9** - Linting de código
- **PostCSS** - Procesamiento de CSS
- **pnpm 10.19** - Gestor de paquetes
- **Turborepo** - Monorepo management
- **Vercel Analytics** - Métricas de performance

## 🌐 API Externa: IMDb a través de RapidAPI

### ¿Por qué elegimos esta API?

La decisión de utilizar la **API de IMDb a través de RapidAPI** se basó en varios factores estratégicos y técnicos:

#### 1. **Acceso a Datos de Calidad y Reconocimiento Mundial**
- **IMDb (Internet Movie Database)** es la base de datos de películas más completa y confiable del mundo
- Contiene información verificada y actualizada de millones de títulos
- Los datos incluyen ratings oficiales, información de casting, directores, y metadatos detallados
- La credibilidad de IMDb garantiza la calidad de la información mostrada a los usuarios

#### 2. **Endpoint Específico: Top 250 Movies**
```http
GET https://imdb236.p.rapidapi.com/api/imdb/top250-movies
```

**Ventajas del endpoint seleccionado:**
- **Datos Curated**: Las 250 mejores películas según IMDb representan una selección curada de excelencia cinematográfica
- **Información Completa**: Cada película incluye datos detallados como:
  - Título original y año de lanzamiento
  - Poster oficial de alta calidad
  - Rating promedio y número de votos
  - Géneros cinematográficos
  - Director y reparto principal
  - Información de producción (presupuesto, recaudación)
  - Países de origen y idiomas
  - Ubicaciones de filmación

#### 3. **Capacidades de Filtrado y Búsqueda**

**Filtrado por Género:**
- La API proporciona géneros específicos para cada película
- Permite filtrar dinámicamente por categorías como Drama, Acción, Comedia, etc.
- Los géneros están normalizados y son consistentes

**Búsqueda en Tiempo Real:**
- Los datos incluyen múltiples campos de búsqueda:
  # 🎬 Explorador de Películas

  Aplicación web para explorar, buscar y filtrar las mejores **250 películas** según IMDb. Construida con **Next.js + tRPC** y orientada a tipado end-to-end y mantenibilidad.

  ---

  ## 🚀 Resumen rápido (evaluadores)

  - Clonar, instalar deps y arrancar:

  ```bash
  pnpm install
  pnpm dev
  ```

  - Variables mínimas: `RAPIDAPI_KEY`, `RAPIDAPI_HOST` (ver sección "Configuración").

  ---

  ## Funcionalidades principales

  | Funcionalidad                  | Estado | Descripción breve                                |
  | ------------------------------ | :----: | ------------------------------------------------ |
  | Listado Top 250 IMDb           | ✅     | Catálogo completo                                |
  | Búsqueda en tiempo real        | ✅     | Filtrado por título, director, actores, trama   |
  | Filtro por género              | ✅     | Géneros normalizados y selección dinámica       |
  | Página de detalle              | ✅     | Información extendida por película              |
  | Estados UI (loading/empty)     | ✅     | Skeletons / mensajes de error                    |

  ---

  ## 🧱 Stack (resumen)

  - Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
  - Backend: tRPC (routers en `server/`), Zod
  - Infra: RapidAPI (IMDb), Vercel (deploy), pnpm + Turborepo

  > Las versiones exactas están en `package.json`.

  ---

  ## 🌐 API externa

  Endpoint principal:

  ```http
  GET https://imdb236.p.rapidapi.com/api/imdb/top250-movies
  ```

  Datos clave por película: título, año, poster, rating, votos, director, actores, géneros, duración y sinopsis. El backend transforma la respuesta a un formato estable para la UI.

  Para detalles técnicos y ejemplos de respuesta consulta `API_DOCUMENTATION.md`.

  ---

  ## 🏗️ Arquitectura (breve)

  - Capas: Presentación (`/components`), Aplicación (`trpc-client`), Servicios (`/lib/services`), Infraestructura (`api.service`), Datos/Tipos (`/shared`, Zod).
  - Estructura principal de la app web: `apps/web/src/{app,components,lib,server}`.

  Para un diagrama completo y decisiones de diseño revisa `ARCHITECTURE.md`.

  ---

  ## 🔑 Configuración

  Crea `.env.local` en `apps/web` con estas variables mínimas:

  ```env
  RAPIDAPI_KEY=tu_key_aqui
  RAPIDAPI_HOST=imdb236.p.rapidapi.com
  RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
  ```

  No subas `.env.local` al repositorio.

  ---

  ## 🧪 Tests y calidad

  Este repo incluye configuración y guías de testing. Para instrucciones y cómo ejecutar tests revisa `TESTING_GUIDE.md`.

  ---

  ## 🚀 Deploy

  Deploy recomendado: Vercel. Para pasos y variables de entorno en producción, ver `DEPLOYMENT_GUIDE.md`.

  ---

  ## � Documentación adicional

  - `ARCHITECTURE.md` — arquitectura y decisiones de diseño
  - `DEPLOYMENT_GUIDE.md` — pasos para deploy y configuración en Vercel
  - `API_DOCUMENTATION.md` — endpoints, ejemplos de respuesta y headers
  - `TESTING_GUIDE.md` — cómo ejecutar tests y configuración de CI

  ---

  ## Estado actual

  - Arquitectura modular y tipado end-to-end
  - UI responsiva y optimizada
  - Caching y manejo básico de errores implementados

  ---

  ## � Capturas y demo

  Puedes ver capturas y videos de la app en:
  [Google Drive - Demo y Screenshots](https://drive.google.com/file/d/1xxEK8DEUD1hjBIu7GLYDXpOiobPHepcL/view?usp=drive_link)

  ---

  ## �📝 Licencia

  MIT License

  ---

  Desarrollado con foco en arquitectura clara, escalabilidad y experiencia fluida de usuario.
```

#### **2. Centralización de Configuración de API**
**Problema Actual**: Configuración dispersa en múltiples archivos
```typescript
// ❌ ANTES: Configuración duplicada
const headers = {
  "x-rapidapi-key": process.env.RAPIDAPI_KEY,
  "x-rapidapi-host": process.env.RAPIDAPI_HOST,
}
```

**Solución Propuesta**: Configuración centralizada
```typescript
// ✅ DESPUÉS: Configuración centralizada
class ApiConfig {
  static getHeaders() {
    return {
      "x-rapidapi-key": serverEnv.RAPIDAPI_KEY,
      "x-rapidapi-host": serverEnv.RAPIDAPI_HOST,
    }
  }
}
```

#### **3. Mejora del Manejo de Errores**
**Problema Actual**: Manejo de errores inconsistente
```typescript
// ❌ ANTES: Manejo básico de errores
if (!res.ok) {
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: `RapidAPI returned ${res.status}`
  })
}
```

**Solución Propuesta**: Sistema de errores centralizado
```typescript
// ✅ DESPUÉS: Manejo centralizado de errores
class ErrorHandler {
  static handleApiError(response: Response): never {
    const error = this.createErrorFromResponse(response)
    throw error
  }
}
```

#### **4. Implementación de Caching Inteligente**
**Problema Actual**: Cache básico sin estrategias
```typescript
// ❌ ANTES: Cache simple
next: { revalidate: 3600 }
```

**Solución Propuesta**: Cache estratégico por tipo de dato
```typescript
// ✅ DESPUÉS: Cache inteligente
class CacheService {
  static getCacheStrategy(dataType: 'movies' | 'genres' | 'details') {
    const strategies = {
      movies: { revalidate: 3600 }, // 1 hora
      genres: { revalidate: 86400 }, // 24 horas
      details: { revalidate: 7200 } // 2 horas
    }
    return strategies[dataType]
  }
}
```

### 📋 Plan de Implementación Detallado

#### **Semana 1: Reorganización Estructural**
- [ ] Crear nueva estructura de carpetas
- [ ] Mover archivos existentes
- [ ] Actualizar imports y paths
- [ ] Verificar que todo funcione correctamente

#### **Semana 2: Extracción de Servicios**
- [ ] Crear `MovieService` con lógica de negocio
- [ ] Crear `MovieRepository` para acceso a datos
- [ ] Crear `MovieTransformer` para transformaciones
- [ ] Migrar router a usar servicios

#### **Semana 3: Custom Hooks**
- [ ] Crear `useMovies` hook
- [ ] Crear `useSearch` hook
- [ ] Crear `useGenres` hook
- [ ] Migrar componentes a usar hooks

#### **Semana 4: Optimización y Testing**
- [ ] Implementar cache inteligente
- [ ] Mejorar manejo de errores
- [ ] Agregar tests unitarios
- [ ] Optimizar rendimiento

### 🎯 Métricas de Éxito

#### **Mantenibilidad**
- ✅ Reducción del 60% en líneas de código por archivo
- ✅ Separación clara de responsabilidades
- ✅ Documentación completa de cada capa

#### **Rendimiento**
- ✅ Tiempo de carga inicial < 2 segundos
- ✅ Cache hit rate > 80%
- ✅ Bundle size reducido en 20%

#### **Desarrollador Experience**
- ✅ Autocompletado mejorado con TypeScript
- ✅ Tests unitarios con > 80% coverage
- ✅ Hot reload < 1 segundo

### 🚨 Consideraciones de Seguridad

#### **Variables de Entorno**
- ✅ Todas las claves de API en variables de entorno
- ✅ Validación de variables con Zod
- ✅ No exposición de secretos al cliente

#### **Validación de Datos**
- ✅ Validación de entrada con Zod schemas
- ✅ Sanitización de datos de APIs externas
- ✅ Manejo seguro de errores sin información sensible

#### **Rate Limiting**
- ✅ Implementación de rate limiting en tRPC
- ✅ Cache para reducir llamadas a APIs externas
- ✅ Manejo graceful de límites de API

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+ 
- pnpm (recomendado) o npm

### Variables de Entorno

Crear archivo `.env.local`:

```env
# RapidAPI Configuration
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
```

### Instalación

```bash
# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm dev

# Construir para producción
pnpm build
```

## 📱 Funcionalidades Implementadas

### 1. Búsqueda de Películas
- **Búsqueda en Tiempo Real**: Filtrado instantáneo mientras el usuario escribe
- **Múltiples Campos**: Búsqueda por título, director, actores o descripción
- **Filtrado del Cliente**: Búsqueda optimizada sin llamadas adicionales a la API
- **Debouncing**: Hook `use-debounce.ts` para optimizar rendimiento

### 2. Filtrado por Género
- **Géneros Dinámicos**: Lista extraída automáticamente de los datos de IMDb
- **Filtrado Combinado**: Funciona junto con la búsqueda de texto
- **UI Intuitiva**: Selector Radix UI con iconografía Lucide React
- **Estado Persistente**: Mantiene filtros durante la sesión

### 3. Visualización de Datos
- **Cards Responsivas**: Diseño adaptativo con Tailwind CSS
- **Información Completa**: Rating, año, director, poster y tipo
- **Estados de Carga**: Skeletons personalizados para mejor UX
- **Imágenes Optimizadas**: Componente `ImageWithLoading` con lazy loading

### 4. Detalles de Película
- **Página Individual**: Vista detallada en `/movie/[id]`
- **Información Extendida**: Plot, director, actores, géneros, metadatos
- **Navegación Fluida**: Botón de volver y enlaces internos
- **Loading States**: Skeleton completo para la página de detalle

### 5. Optimizaciones de Performance
- **React Query**: Caching inteligente y sincronización de estado
- **Next.js Image**: Optimización automática de imágenes
- **Turbopack**: Compilación más rápida en desarrollo
- **Bundle Splitting**: Carga eficiente de código

## 🔧 Configuración de la API

### Autenticación

La aplicación utiliza RapidAPI para acceder a los datos de IMDb:

```typescript
// lib/services/api.service.ts
static getRapidApiHeaders() {
  return {
    "x-rapidapi-key": serverEnv.RAPIDAPI_KEY,
    "x-rapidapi-host": serverEnv.RAPIDAPI_HOST,
  }
}
```

### Variables de Entorno

```env
# apps/web/.env.local
RAPIDAPI_KEY=tu_rapidapi_key_aqui
RAPIDAPI_HOST=imdb236.p.rapidapi.com
RAPIDAPI_BASE_URL=https://imdb236.p.rapidapi.com/api/imdb
```

### Rate Limiting

- **Manejo de Errores**: Gestión específica de errores 429 (rate limit)
- **Retry Logic**: Configurado en React Query con 1 reintento
- **Error Handling**: Mensajes de error amigables para el usuario

### Transformación de Datos

Los datos de la API se transforman usando `MovieService`:

```typescript
// lib/services/movie.service.ts
static transformImdbMovie(imdbMovie: any): Movie {
  return {
    id: imdbMovie.id,
    title: imdbMovie.primaryTitle || '',
    year: imdbMovie.startYear?.toString(),
    poster: imdbMovie.primaryImage,
    // ... más campos transformados
  }
}
```

## 🎨 Diseño y UX

### Principios de Diseño

1. **Mobile First**: Diseño responsivo con Tailwind CSS que funciona en todos los dispositivos
2. **Accesibilidad**: Componentes Radix UI con soporte completo de accesibilidad
3. **Performance**: Carga rápida con Next.js Image y React Query
4. **Consistencia**: Sistema de diseño unificado con Tailwind CSS y Radix UI

### Componentes UI Implementados

- **MovieCard**: Tarjeta individual con poster, título, año y tipo
- **MovieSearch**: Componente principal con búsqueda y filtros
- **EmptyState**: Estado vacío con mensaje amigable y acción de limpiar
- **ErrorState**: Manejo de errores con opción de reintento
- **MovieCardSkeleton**: Loading skeleton para tarjetas
- **ImageWithLoading**: Componente de imagen con loading state
- **SearchForm**: Formulario de búsqueda reutilizable

### Estados de la Aplicación

- **Loading**: Skeletons y spinners durante la carga
- **Error**: Mensajes de error claros con opción de reintento
- **Empty**: Estado vacío cuando no hay resultados
- **Success**: Visualización de datos con transiciones suaves

## 🔍 Optimizaciones Implementadas

### Frontend
- **React Query**: Caching inteligente con `staleTime: 60s` y `refetchOnWindowFocus: false`
- **Debouncing**: Hook `use-debounce.ts` para búsqueda optimizada
- **Next.js Image**: Optimización automática con WebP/AVIF y lazy loading
- **Turbopack**: Compilación más rápida en desarrollo
- **Bundle Splitting**: Optimización automática de chunks

### Backend
- **tRPC**: Type-safe APIs con validación automática de entrada y salida
- **Zod Schemas**: Validación robusta en `lib/types.ts`
- **Error Handling**: Manejo centralizado con códigos específicos (429, 404, 500)
- **Service Layer**: Separación clara entre lógica de negocio y acceso a datos

### Performance
- **Image Optimization**: Componente `ImageWithLoading` con loading states
- **Skeleton Loading**: Estados de carga para mejor percepción de velocidad
- **React Compiler**: Optimizaciones automáticas de React
- **Console Removal**: Eliminación de console.log en producción

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar desde la raíz del proyecto
vercel --prod

# O desde apps/web
cd apps/web
vercel --prod
```

### Variables de Entorno en Producción

Configurar en el dashboard de Vercel:
- `RAPIDAPI_KEY`: Tu clave de RapidAPI
- `RAPIDAPI_HOST`: `imdb236.p.rapidapi.com`
- `RAPIDAPI_BASE_URL`: `https://imdb236.p.rapidapi.com/api/imdb` (opcional)

### Configuración de Build

```json
// package.json scripts
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

### Monorepo con Turborepo

```bash
# Build completo del monorepo
pnpm build

# Solo la aplicación web
cd apps/web && pnpm build
```

## 📊 Métricas y Monitoreo

### Analytics
- **Vercel Analytics**: Métricas de rendimiento y uso
- **Error Tracking**: Monitoreo de errores en producción

### Performance
- **Core Web Vitals**: Optimización para métricas de Google
- **Lighthouse Score**: Puntuación alta en todas las categorías

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Favoritos**: Sistema de películas favoritas del usuario
- **Comparación**: Comparar películas lado a lado
- **Recomendaciones**: Sistema de recomendaciones basado en preferencias
- **Reviews**: Sistema de reseñas y calificaciones de usuarios
- **Listas Personalizadas**: Crear listas temáticas personalizadas

### Mejoras Técnicas
- **PWA**: Convertir en Progressive Web App
- **Offline Support**: Funcionalidad offline básica
- **Internationalization**: Soporte para múltiples idiomas
- **Advanced Search**: Filtros avanzados (año, rating, duración)

## 🤝 Contribución

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: pruebas
```

### Desarrollo Local
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollo Frontend**: React, Next.js, TypeScript
- **Desarrollo Backend**: tRPC, Node.js
- **Diseño UI/UX**: Tailwind CSS, Radix UI
- **Integración API**: RapidAPI, IMDb

---

**Desarrollado con ❤️ usando las mejores prácticas de desarrollo web moderno**