/**
 * Constantes de API Compartidas
 * 
 * Constantes que se usan tanto en frontend como backend
 * para mantener consistencia en la configuración.
 */

export const API_ENDPOINTS = {
  MOVIES: {
    TOP_250: '/api/imdb/top250-movies',
    SEARCH: '/api/imdb/search',
    DETAIL: '/api/imdb/title',
  },
  INTERNAL: {
    MOVIES: '/api/trpc/movies',
    GENRES: '/api/trpc/movies.getGenres',
  },
} as const

export const CACHE_STRATEGIES = {
  MOVIES: {
    ttl: 3600, // 1 hora
    strategy: 'memory' as const,
  },
  GENRES: {
    ttl: 86400, // 24 horas
    strategy: 'memory' as const,
  },
  DETAILS: {
    ttl: 7200, // 2 horas
    strategy: 'memory' as const,
  },
} as const

export const RATE_LIMITS = {
  RAPIDAPI: {
    requests: 100,
    window: 60, // 1 minuto
    retryAfter: 60,
  },
  INTERNAL: {
    requests: 1000,
    window: 60,
    retryAfter: 5,
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

