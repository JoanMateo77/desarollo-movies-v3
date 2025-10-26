/**
 * Tipos para la API de IMDb
 */

export interface Movie {
  primaryTitle: string;
  genres: string[];
  averageRating: number;
  startYear: number;
  runtimeMinutes: number;
  tconst: string; // ID único de IMDb
}

export interface APIResponse {
  status: number;
  ok: boolean;
  data: Movie[];
}

export interface APIError {
  status: number;
  message: string;
  code: string;
}