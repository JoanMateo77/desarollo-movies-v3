/**
 * Servicio de API
 * 
 * Maneja las llamadas a APIs externas con mejor organización y manejo de errores.
 */

import { serverEnv } from '../env'

export class ApiService {
  /**
   * Obtiene la URL base de RapidAPI
   */
  static getRapidApiBaseUrl(): string {
    if (serverEnv.RAPIDAPI_BASE_URL && serverEnv.RAPIDAPI_BASE_URL.trim() !== "") {
      return serverEnv.RAPIDAPI_BASE_URL
    }

    if (serverEnv.RAPIDAPI_HOST && serverEnv.RAPIDAPI_HOST.trim() !== "") {
      return `https://${serverEnv.RAPIDAPI_HOST}/api/imdb`
    }

    throw new Error("Falta RAPIDAPI_BASE_URL o RAPIDAPI_HOST en .env.local")
  }

  /**
   * Obtiene los headers necesarios para las llamadas a RapidAPI
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
   */
  static async callRapidApi(endpoint: string) {
    const baseUrl = this.getRapidApiBaseUrl()
    const url = `${baseUrl}${endpoint}`
    
    console.log("🔍 URL que se está llamando:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: this.getRapidApiHeaders(),
    })

    const text = await response.text().catch(() => "")

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error(`Rate limit (429) de RapidAPI. Body: ${text}`)
      }
      throw new Error(`RapidAPI returned ${response.status}. Body: ${text}`)
    }

    try {
      return JSON.parse(text)
    } catch {
      return []
    }
  }

  /**
   * Obtiene las top 250 películas
   */
  static async getTop250Movies() {
    return this.callRapidApi('/top250-movies')
  }
}
