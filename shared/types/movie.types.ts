/**
 * Tipos Compartidos de Películas
 * 
 * Definiciones de tipos que se usan tanto en frontend como backend.
 * Centraliza la definición de tipos para evitar duplicación.
 */

export interface Movie {
  id: string
  title: string
  year?: string
  type?: string
  poster?: string
  plot?: string
  director?: string
  actors?: string
  genre?: string
  rating?: string
  runtime?: string
  released?: string
  trailer?: string
  contentRating?: string
  countriesOfOrigin?: string
  spokenLanguages?: string
  filmingLocations?: string
  productionCompanies?: string
  budget?: number
  grossWorldwide?: number
  numVotes?: number
  metascore?: number
}

export interface MovieFilters {
  genre?: string
  year?: string
  rating?: number
  search?: string
}

export interface MovieSearchResult {
  movies: Movie[]
  totalResults: number
  page?: number
  totalPages?: number
}

export interface Genre {
  id: string
  name: string
  count: number
}

// Tipos para APIs externas
export interface ImdbMovie {
  id: string
  primaryTitle: string
  startYear?: number
  type?: string
  primaryImage?: string
  description?: string
  directors?: Array<{ name: string }>
  actors?: Array<{ name: string }>
  genres?: string[]
  averageRating?: number
  runtimeMinutes?: number
  releaseDate?: string
  trailer?: string
  contentRating?: string
  countriesOfOrigin?: string[]
  spokenLanguages?: string[]
  filmingLocations?: string[]
  productionCompanies?: Array<{ name: string }>
  budget?: number
  grossWorldwide?: number
  numVotes?: number
  metascore?: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}
