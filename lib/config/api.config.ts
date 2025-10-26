/**
 * Configuración Centralizada de API
 * 
 * Centraliza toda la configuración relacionada con APIs externas
 * y proporciona métodos para obtener headers y URLs.
 */

import { serverEnv } from '../env'
import { API_ENDPOINTS, RATE_LIMITS } from '../../../shared/constants/api.constants'

export class ApiConfig {
  /**
   * Obtiene los headers necesarios para las llamadas a RapidAPI
   */
  static getRapidApiHeaders() {
    return {
      'x-rapidapi-key': serverEnv.RAPIDAPI_KEY,
      'x-rapidapi-host': serverEnv.RAPIDAPI_HOST,
      'Content-Type': 'application/json',
    }
  }

  /**
   * Obtiene la URL base de RapidAPI
   */
  static getRapidApiBaseUrl(): string {
    if (serverEnv.RAPIDAPI_BASE_URL) {
      return serverEnv.RAPIDAPI_BASE_URL
    }
    return `https://${serverEnv.RAPIDAPI_HOST}/api/imdb`
  }

  /**
   * Construye la URL completa para un endpoint específico
   */
  static buildUrl(endpoint: string): string {
    const baseUrl = this.getRapidApiBaseUrl()
    return `${baseUrl}${endpoint}`
  }

  /**
   * Obtiene la configuración de rate limiting para RapidAPI
   */
  static getRateLimitConfig() {
    return RATE_LIMITS.RAPIDAPI
  }

  /**
   * Obtiene la configuración de timeout para las llamadas
   */
  static getTimeoutConfig() {
    return {
      timeout: 10000, // 10 segundos
      retries: 3,
      retryDelay: 1000, // 1 segundo
    }
  }

  /**
   * Valida que la configuración de API esté completa
   */
  static validateConfig(): boolean {
    return !!(
      serverEnv.RAPIDAPI_KEY &&
      serverEnv.RAPIDAPI_HOST
    )
  }

  /**
   * Obtiene información de debug de la configuración (sin secretos)
   */
  static getDebugInfo() {
    return {
      hasApiKey: !!serverEnv.RAPIDAPI_KEY,
      hasHost: !!serverEnv.RAPIDAPI_HOST,
      hasBaseUrl: !!serverEnv.RAPIDAPI_BASE_URL,
      baseUrl: this.getRapidApiBaseUrl(),
      endpoints: API_ENDPOINTS,
    }
  }
}


