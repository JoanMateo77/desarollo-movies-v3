# 🔄 Diagramas de Flujo - Explorador de Películas

## 📋 Resumen

Esta documentación contiene diagramas de flujo que explican cómo funciona la aplicación, desde la carga inicial hasta las interacciones del usuario.

## 🚀 Flujo de Carga Inicial

```mermaid
graph TD
    A[Usuario accede a la app] --> B[Next.js carga layout.tsx]
    B --> C[TRPCProvider se inicializa]
    C --> D[QueryClient se configura]
    D --> E[Página principal se renderiza]
    E --> F[MovieSearch component se monta]
    F --> G[tRPC hooks se ejecutan]
    G --> H[API calls a /api/trpc/movies]
    H --> I[Server procesa requests]
    I --> J[ApiService llama a RapidAPI]
    J --> K[IMDb devuelve datos]
    K --> L[MovieService transforma datos]
    L --> M[React Query cachea datos]
    M --> N[UI se actualiza con películas]
```

## 🔍 Flujo de Búsqueda

```mermaid
graph TD
    A[Usuario escribe en input] --> B[useState actualiza searchQuery]
    B --> C[useEffect detecta cambio]
    C --> D[Filtrado local de películas]
    D --> E[Verificar filtro por género]
    E --> F[Filtrar por texto de búsqueda]
    F --> G[Actualizar filteredMovies state]
    G --> H[Re-renderizar MovieGrid]
    H --> I[Mostrar resultados filtrados]
    
    J[Usuario selecciona género] --> K[useState actualiza selectedGenre]
    K --> C
```

## 🎬 Flujo de Detalle de Película

```mermaid
graph TD
    A[Usuario hace click en MovieCard] --> B[Next.js navega a /movie/[id]]
    B --> C[Página de detalle se carga]
    C --> D[tRPC hook getMovieDetail se ejecuta]
    D --> E[API call con ID de película]
    E --> F[Server busca película por ID]
    F --> G{¿Película encontrada?}
    G -->|Sí| H[Devolver datos de película]
    G -->|No| I[Devolver error 404]
    H --> J[React Query cachea datos]
    I --> K[Mostrar error state]
    J --> L[Renderizar detalle completo]
    K --> M[Mostrar mensaje de error]
```

## 🔄 Flujo de Datos Completo

```mermaid
graph TD
    A[Frontend: MovieSearch] --> B[tRPC Client]
    B --> C[HTTP Request]
    C --> D[Next.js API Route]
    D --> E[tRPC Router]
    E --> F[MovieService]
    F --> G[ApiService]
    G --> H[RapidAPI/IMDb]
    H --> I[Raw Data]
    I --> J[Data Transformation]
    J --> K[Type Validation]
    K --> L[Response]
    L --> M[React Query Cache]
    M --> N[Component Re-render]
    N --> O[UI Update]
```

## 🎨 Flujo de Estados de UI

```mermaid
graph TD
    A[Componente se monta] --> B{¿Datos en cache?}
    B -->|Sí| C[Mostrar datos cacheados]
    B -->|No| D[Mostrar loading state]
    D --> E[Ejecutar query]
    E --> F{¿Query exitosa?}
    F -->|Sí| G[Mostrar datos]
    F -->|No| H[Mostrar error state]
    G --> I[Usuario interactúa]
    I --> J[Actualizar estado local]
    J --> K[Re-renderizar con nuevos datos]
    H --> L[Usuario hace retry]
    L --> E
```

## 🔧 Flujo de Configuración

```mermaid
graph TD
    A[App inicia] --> B[Cargar variables de entorno]
    B --> C[Validar con Zod schema]
    C --> D{¿Variables válidas?}
    D -->|No| E[Error de configuración]
    D -->|Sí| F[Inicializar ApiService]
    F --> G[Configurar headers de RapidAPI]
    G --> H[Inicializar tRPC]
    H --> I[Configurar React Query]
    I --> J[App lista para usar]
    E --> K[Mostrar error de configuración]
```

## 📱 Flujo de Responsive Design

```mermaid
graph TD
    A[Usuario accede desde dispositivo] --> B[Next.js detecta viewport]
    B --> C[CSS media queries se aplican]
    C --> D[Grid layout se adapta]
    D --> E{¿Dispositivo móvil?}
    E -->|Sí| F[1 columna, cards grandes]
    E -->|No| G[Multiple columnas]
    G --> H{¿Tablet?}
    H -->|Sí| I[2-3 columnas]
    H -->|No| J[4+ columnas]
    F --> K[Optimizar imágenes para móvil]
    I --> L[Optimizar para tablet]
    J --> M[Optimizar para desktop]
    K --> N[Renderizar UI final]
    L --> N
    M --> N
```

## 🚨 Flujo de Manejo de Errores

```mermaid
graph TD
    A[Error ocurre] --> B{¿Tipo de error?}
    B -->|Network| C[Mostrar error de conexión]
    B -->|API Rate Limit| D[Mostrar error de límite]
    B -->|Not Found| E[Mostrar error 404]
    B -->|Server Error| F[Mostrar error genérico]
    C --> G[Botón de reintentar]
    D --> H[Mensaje de espera]
    E --> I[Botón de volver]
    F --> G
    G --> J[Ejecutar query nuevamente]
    H --> K[Esperar y reintentar]
    I --> L[Navegar a página anterior]
    J --> M{¿Reintento exitoso?}
    M -->|Sí| N[Mostrar datos]
    M -->|No| O[Mostrar error persistente]
```

## 🔄 Flujo de Cache y Performance

```mermaid
graph TD
    A[Query se ejecuta] --> B{¿Datos en cache?}
    B -->|Sí| C[Verificar staleTime]
    C --> D{¿Datos frescos?}
    D -->|Sí| E[Devolver datos del cache]
    D -->|No| F[Refetch en background]
    F --> G[Actualizar cache]
    G --> H[Devolver datos actualizados]
    B -->|No| I[Ejecutar query]
    I --> J[Obtener datos de API]
    J --> K[Transformar datos]
    K --> L[Guardar en cache]
    L --> M[Devolver datos]
    E --> N[UI se actualiza]
    H --> N
    M --> N
```

## 🎯 Flujo de Optimización de Imágenes

```mermaid
graph TD
    A[Imagen se carga] --> B[Next.js Image component]
    B --> C[Generar blur placeholder]
    C --> D[Mostrar loading state]
    D --> E[Descargar imagen optimizada]
    E --> F[Convertir a WebP/AVIF]
    F --> G[Redimensionar según viewport]
    G --> H[Mostrar imagen final]
    H --> I[Fade in transition]
    I --> J[Imagen visible]
    
    K[Error de carga] --> L[Mostrar fallback icon]
    L --> M[Usuario puede reintentar]
```

## 📊 Flujo de Métricas y Analytics

```mermaid
graph TD
    A[Usuario interactúa] --> B[Vercel Analytics captura evento]
    B --> C[Enviar métricas a Vercel]
    C --> D[Procesar en dashboard]
    D --> E[Generar reportes]
    E --> F[Mostrar Core Web Vitals]
    F --> G[Identificar optimizaciones]
    G --> H[Mejorar performance]
```

## 🔐 Flujo de Seguridad

```mermaid
graph TD
    A[Request llega al servidor] --> B[Validar headers]
    B --> C[Verificar API key]
    C --> D{¿API key válida?}
    D -->|No| E[Rechazar request]
    D -->|Sí| F[Validar input con Zod]
    F --> G{¿Input válido?}
    G -->|No| H[Devolver error de validación]
    G -->|Sí| I[Procesar request]
    I --> J[Sanitizar datos de respuesta]
    J --> K[Devolver respuesta segura]
    E --> L[Log de seguridad]
    H --> L
```

## 🚀 Flujo de Despliegue

```mermaid
graph TD
    A[Push a repositorio] --> B[Vercel detecta cambios]
    B --> C[Instalar dependencias]
    C --> D[Ejecutar build]
    D --> E[TypeScript compilation]
    E --> F[Next.js build]
    F --> G[Optimizar assets]
    G --> H[Generar static files]
    H --> I[Deploy a CDN]
    I --> J[Configurar variables de entorno]
    J --> K[App disponible en producción]
    K --> L[Health check]
    L --> M[Monitoreo activo]
```

---

## 📝 Notas sobre los Diagramas

### Convenciones Utilizadas
- **Rectángulos**: Procesos o acciones
- **Diamantes**: Decisiones o condiciones
- **Círculos**: Puntos de inicio/fin
- **Flechas**: Flujo de datos o control

### Colores Sugeridos
- **Verde**: Procesos exitosos
- **Rojo**: Errores o fallos
- **Azul**: Procesos de datos
- **Amarillo**: Advertencias o validaciones

### Herramientas Recomendadas
- **Mermaid**: Para crear y editar diagramas
- **Draw.io**: Para diagramas más complejos
- **Figma**: Para diagramas de UI/UX

---

**Última actualización**: Diciembre 2024
