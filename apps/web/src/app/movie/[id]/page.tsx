// apps/web/src/app/movie/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type Movie = {
  id: string;
  primaryTitle?: string;
  description?: string;
  primaryImage?: string;
  genres?: string[];
  releaseDate?: string | null;
  runtimeMinutes?: number | null;
  averageRating?: number | null;
  productionCompanies?: { id: string; name: string }[];
};

export default function MovieDetailPage() {
  const params = useParams();
  const id = (params as any)?.id;
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`/api/trpc/movies.getById?input=${encodeURIComponent(JSON.stringify({ id }))}`)
      .then((r) => r.json())
      .then((j) => {
        const payload = j.result?.data ?? j;
        setMovie(payload ?? null);
      })
      .catch((e) => setError(e?.message ?? String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <main className="p-6">
      <button onClick={() => router.back()} className="mb-4 px-3 py-1 border rounded">
        ← Volver
      </button>

      {loading && <div>Cargando...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {movie && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <img src={movie.primaryImage ?? "/placeholder-portrait.png"} alt={movie.primaryTitle} className="w-full h-auto rounded" />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{movie.primaryTitle}</h1>
            <div className="text-sm text-gray-600">
              {movie.releaseDate ?? ""} · {movie.runtimeMinutes ?? "—"} min · ⭐ {movie.averageRating ?? "—"}
            </div>

            <div className="mt-4 text-gray-800">{movie.description ?? "Sin descripción."}</div>

            <div className="mt-4">
              <h4 className="font-semibold">Géneros</h4>
              <div className="text-sm text-gray-600">{movie.genres?.join(", ") ?? "—"}</div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Compañías de producción</h4>
              <ul className="text-sm text-gray-600">
                {movie.productionCompanies?.map((c) => (
                  <li key={c.id}>{c.name}</li>
                )) ?? <li>—</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
