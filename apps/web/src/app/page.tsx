"use client";

import { useState } from "react";

export default function Page() {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function safeStringify(obj: unknown): string {
    try {
      const seen = new WeakSet();
      return JSON.stringify(
        obj,
        (_key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return "[Circular]";
            seen.add(value);
          }
          if (typeof value === "bigint") return value.toString();
          return value;
        },
        2
      );
    } catch {
      return String(obj);
    }
  }

  async function handleFetch() {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const inputObj = { castId: "nm0000190" }; // cambia por otro ID si quieres
      const url =
        "/api/trpc/movies.getCastTitles?input=" +
        encodeURIComponent(JSON.stringify(inputObj));

      const res = await fetch(url);

      if (!res.ok) {
        const txt = await res.text().catch(() => "No body");
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      // leer como texto e intentar parsear JSON
      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = text;
      }

      // Adaptaciones comunes de tRPC/Next/standalone: busca result.data, data o la respuesta directa
      const payload =
        (parsed && typeof parsed === "object" && (parsed as any).result?.data) ??
        (parsed && typeof parsed === "object" && (parsed as any).data) ??
        parsed;

      setData(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Fetch error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // Prepara el string que se pasará al <pre> (garantizado string | null)
  const rendered: string | null =
    data === null ? null : typeof data === "string" ? data : safeStringify(data);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">🎬 IMDb API con tRPC — Prueba</h1>

      <div className="flex gap-2 items-center mb-4">
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Obtener títulos de actor"}
        </button>

        <button
          onClick={() => {
            setData(null);
            setError(null);
          }}
          className="px-3 py-1 border rounded text-sm"
        >
          Limpiar
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && rendered === null && (
        <div className="mt-4 text-gray-600">Sin datos. Haz clic en Obtener títulos de actor.</div>
      )}

      {rendered && (
        <pre className="mt-4 bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
          {rendered}
        </pre>
      )}
    </main>
  );
}
