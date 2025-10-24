// apps/web/src/server/types.ts
export type Thumbnail = { url: string; width?: number; height?: number };

export type ProductionCompany = { id: string; name: string };

export type Movie = {
  id: string;
  url: string;
  primaryTitle: string;
  originalTitle: string;
  type: string;
  description: string | null;
  primaryImage: string | null;
  thumbnails?: {
    url: string;
    width: number;
    height: number;
  }[];
  trailer: string | null;
  contentRating: string | null;
  startYear: number | null;
  endYear: number | null;
  releaseDate: string | null;
  runtimeMinutes: number | null;
  genres: string[];
  interests: string[];
  countriesOfOrigin: string[];
  averageRating: number | null;
  productionCompanies?: {
    id: string;
    name: string;
  }[];
};
