/**
 * Tipos de API Compartidos
 * 
 * Tipos relacionados con la comunicación con APIs externas
 * y respuestas de la API interna.
 */

export interface ApiError {
  code: string
  message: string
  statusCode?: number
  details?: Record<string, unknown>
}

export interface ApiConfig {
  baseUrl: string
  apiKey: string
  host: string
  timeout?: number
  retries?: number
}

export interface CacheConfig {
  ttl: number // Time to live in seconds
  maxSize?: number
  strategy: 'memory' | 'redis' | 'file'
}

export interface RateLimitConfig {
  requests: number
  window: number // in seconds
  retryAfter?: number
}

export interface ExternalApiResponse<T> {
  data: T
  status: number
  headers: Record<string, string>
  cached?: boolean
  cachedAt?: Date
}

export interface PaginationParams {
  page: number
  limit: number
  offset?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

