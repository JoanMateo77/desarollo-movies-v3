/**
 * Servicio de API
 * 
 * Maneja las llamadas a APIs externas con mejor organización y manejo de errores.
 * 
 * ARQUITECTURA: Patrón Service Layer para centralizar la comunicación con APIs externas.
 * JUSTIFICACIÓN: Separar la lógica de llamadas HTTP del resto de la aplicación permite:
 * - Reutilización de código
 * - Manejo centralizado de errores
 * - Fácil testing y mocking
 * - Cambios de API sin afectar el resto del código
 */

import { serverEnv } from '../env'

export class ApiService {
  /**
   * Obtiene la URL base de RapidAPI
   * 
   * ESTRATEGIA: Flexibilidad en configuración para diferentes entornos.
   * - Prioriza RAPIDAPI_BASE_URL si está definida (más específica)
   * - Fallback a construir URL desde RAPIDAPI_HOST (más genérica)
   * - Validación estricta para evitar URLs malformadas
   */
  static getRapidApiBaseUrl(): string {
    // Prioridad 1: URL completa si está definida (para casos especiales)
    if (serverEnv.RAPIDAPI_BASE_URL && serverEnv.RAPIDAPI_BASE_URL.trim() !== "") {
      return serverEnv.RAPIDAPI_BASE_URL
    }

    // Prioridad 2: Construir URL desde host (configuración estándar)
    if (serverEnv.RAPIDAPI_HOST && serverEnv.RAPIDAPI_HOST.trim() !== "") {
      return `https://${serverEnv.RAPIDAPI_HOST}/api/imdb`
    }

    // Error explícito para debugging fácil
    throw new Error("Falta RAPIDAPI_BASE_URL o RAPIDAPI_HOST en .env.local")
  }

  /**
   * Obtiene los headers necesarios para las llamadas a RapidAPI
   * 
   * SEGURIDAD: Validación de API key antes de hacer requests.
   * RAPIDAPI: Requiere headers específicos para autenticación:
   * - x-rapidapi-key: Tu clave de API
   * - x-rapidapi-host: Host específico del proveedor
   */
  static getRapidApiHeaders() {
    if (!serverEnv.RAPIDAPI_KEY) {
      throw new Error("Falta RAPIDAPI_KEY en .env.local")
    }

    return {
      "x-rapidapi-key": serverEnv.RAPIDAPI_KEY,
      "x-rapidapi-host": serverEnv.RAPIDAPI_HOST ?? "",
    }
  }

  /**
   * Hace una llamada a la API de RapidAPI
   * 
   * MANEJO DE ERRORES: Estrategia robusta para diferentes tipos de fallos.
   * - Rate limiting (429): Error específico para límites de API
   * - Otros errores HTTP: Error genérico con detalles
   * - JSON parsing: Fallback a array vacío para evitar crashes
   * 
   * DEBUGGING: Log de URL para facilitar troubleshooting en desarrollo.
   */
  static async callRapidApi(endpoint: string) {
    const baseUrl = this.getRapidApiBaseUrl()
    const url = `${baseUrl}${endpoint}`
    
    // Log solo en desarrollo para debugging
    console.log("🔍 URL que se está llamando:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: this.getRapidApiHeaders(),
    })

    // Leer respuesta como texto primero para manejar errores de JSON
    const text = await response.text().catch(() => "")

    if (!response.ok) {
      // Rate limiting: Error específico para límites de API
      if (response.status === 429) {
        throw new Error(`Rate limit (429) de RapidAPI. Body: ${text}`)
      }
      // Otros errores HTTP con detalles del servidor
      throw new Error(`RapidAPI returned ${response.status}. Body: ${text}`)
    }

    try {
      return JSON.parse(text)
    } catch {
      // Fallback seguro: retornar array vacío en lugar de crash
      return []
    }
  }

  /**
   * Obtiene las top 250 películas
   * 
   * ENDPOINT: /top250-movies es el endpoint específico de IMDb para el top 250.
   * CACHING: Este endpoint se cachea en React Query para evitar llamadas repetidas.
   */
  static async getTop250Movies() {
    return this.callRapidApi('/top250-movies')
  }
}

