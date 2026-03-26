"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";
import type { Movie } from "@/data/movies";

export default function MovieSearch({
  onAdded,
}: {
  onAdded: (movie: Movie) => void;
}) {
  const { token } = useAdmin();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `/api/movies/search?q=${encodeURIComponent(query.trim())}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.movies ?? []);
      }
    } finally {
      setSearching(false);
    }
  }, [query, token]);

  const handleAdd = useCallback(
    async (movie: Movie) => {
      const key = `${movie.title}-${movie.year}`;
      setAdding(key);
      try {
        const res = await fetch("/api/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(movie),
        });
        if (res.ok) {
          onAdded(movie);
          // Remove from search results
          setResults((prev) =>
            prev.filter((m) => !(m.title === movie.title && m.year === movie.year))
          );
        } else {
          const err = await res.json();
          if (err.error === "Movie already exists") {
            // Still remove from results
            setResults((prev) =>
              prev.filter(
                (m) => !(m.title === movie.title && m.year === movie.year)
              )
            );
          }
        }
      } finally {
        setAdding(null);
      }
    },
    [token, onAdded]
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-sm border border-dashed border-charcoal/20 px-4 py-2.5 text-sm text-warm-gray transition-colors hover:border-royal-green/40 hover:text-royal-green"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {t("movie.add_button")}
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-charcoal/10 bg-cream-dark/30 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-charcoal">
          {t("movie.search_title")}
        </h3>
        <button
          onClick={() => {
            setOpen(false);
            setQuery("");
            setResults([]);
          }}
          className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-charcoal"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("movie.search_placeholder")}
          className="flex-1 rounded-sm border border-charcoal/10 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/50 focus:border-royal-green/30 focus:outline-none"
          autoFocus
        />
        <button
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="rounded-sm bg-royal-green px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-royal-green/90 disabled:opacity-50"
        >
          {searching ? t("common.searching") : t("common.search")}
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-4 space-y-3">
          {results.map((movie) => {
            const key = `${movie.title}-${movie.year}`;
            return (
              <div
                key={key}
                className="flex items-center gap-3 rounded-sm border border-charcoal/5 bg-cream p-3"
              >
                {/* Poster thumbnail */}
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                  <Image
                    src={movie.posterUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-sm font-medium text-charcoal truncate">
                    {movie.title}
                  </p>
                  {movie.originalTitle !== movie.title && (
                    <p className="text-xs text-charcoal-light truncate">
                      {movie.originalTitle}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-warm-gray">
                    {movie.year} · {movie.director}
                  </p>
                  <p className="text-xs text-warm-gray/60 truncate">
                    {movie.cast.slice(0, 3).join(", ")}
                  </p>
                </div>

                {/* Add button */}
                <button
                  onClick={() => handleAdd(movie)}
                  disabled={adding === key}
                  className="shrink-0 rounded-sm bg-royal-green/10 px-3 py-1.5 text-xs font-medium text-royal-green transition-colors hover:bg-royal-green/20 disabled:opacity-50"
                >
                  {adding === key ? t("common.adding") : t("common.add")}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state after search */}
      {!searching && results.length === 0 && query && (
        <p className="mt-4 text-center text-xs text-warm-gray/60">
          {t("movie.no_results")}
        </p>
      )}
    </div>
  );
}
