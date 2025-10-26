import type { NextConfig } from "next";

/**
 * Configuración de Next.js Optimizada
 * 
 * ESTRATEGIA: Optimizaciones específicas para la aplicación de películas.
 * JUSTIFICACIÓN: Cada configuración está diseñada para mejorar performance y UX.
 */

const nextConfig: NextConfig = {
  // REACT COMPILER: Optimizaciones automáticas de React
  // VENTAJA: Mejora performance sin cambios de código
  reactCompiler: true,
  
  // OPTIMIZACIONES DE COMPILACIÓN: Mejoras para desarrollo más rápido
  experimental: {
    // PACKAGE IMPORTS: Optimización de imports de librerías grandes
    // JUSTIFICACIÓN: Lucide React y Radix UI tienen muchos iconos/componentes
    // RESULTADO: Bundle splitting automático y tree shaking mejorado
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // OPTIMIZACIONES DE IMÁGENES: Configuración específica para posters de películas
  images: {
    // REMOTE PATTERNS: Permitir imágenes de dominios específicos
    // SEGURIDAD: Solo dominios confiables de IMDb/Amazon
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // Posters oficiales de Amazon
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'ia.media-imdb.com', // Imágenes de IMDb
        port: '',
        pathname: '/**',
      },
    ],
    // FORMATOS MODERNOS: WebP y AVIF para mejor compresión
    // VENTAJA: 25-50% menos tamaño que JPEG/PNG
    formats: ['image/webp', 'image/avif'],
    // CACHE: 7 días para imágenes estáticas (posters no cambian)
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 días
    // SEGURIDAD: Deshabilitar SVG para prevenir ataques
    dangerouslyAllowSVG: false,
    // CSP: Política de seguridad estricta
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // OPTIMIZACIONES DE COMPILACIÓN: Mejoras para producción
  compiler: {
    // CONSOLE REMOVAL: Eliminar console.log en producción
    // VENTAJA: Bundle más pequeño y mejor performance
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // TURBOPACK: Compilador más rápido que Webpack
  // VENTAJA: 10x más rápido en desarrollo
  turbopack: {
    // Configuración vacía para usar Turbopack por defecto
  },
};

export default nextConfig;