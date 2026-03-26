"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";
import type { Album } from "@/data/albums";

export default function AlbumSearch({
  onAdded,
}: {
  onAdded: (album: Album) => void;
}) {
  const { token } = useAdmin();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [searching, setSearching] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    try {
      const res = await fetch(
        `/api/music/search?q=${encodeURIComponent(query.trim())}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } finally {
      setSearching(false);
    }
  }, [query, token]);

  const handleAdd = useCallback(
    async (album: Album) => {
      setAdding(album.spotifyId);
      try {
        const res = await fetch("/api/music", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(album),
        });
        if (res.ok || (await res.json()).error === "Album already exists") {
          onAdded(album);
          setResults((prev) => prev.filter((a) => a.spotifyId !== album.spotifyId));
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {t("music.add_button")}
      </button>
    );
  }

  return (
    <div className="rounded-sm border border-charcoal/10 bg-cream-dark/30 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-charcoal">
          {t("music.search_title")}
        </h3>
        <button
          onClick={() => { setOpen(false); setQuery(""); setResults([]); }}
          className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-charcoal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={t("music.search_placeholder")}
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

      {results.length > 0 && (
        <div className="mt-4 max-h-96 overflow-y-auto space-y-3 pr-1">
          {results.map((album) => (
            <div
              key={`${album.type}-${album.spotifyId}`}
              className="flex items-center gap-3 rounded-sm border border-charcoal/5 bg-cream p-3"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                <Image
                  src={album.coverUrl}
                  alt={album.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-serif text-sm font-medium text-charcoal truncate">
                    {album.title}
                  </p>
                  <span className="shrink-0 rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-warm-gray">
                    {album.type === "track" ? t("music.type_song") : t("music.type_album")}
                  </span>
                </div>
                <p className="text-xs text-warm-gray">
                  {album.artist} · {album.year}
                </p>
              </div>
              <button
                onClick={() => handleAdd(album)}
                disabled={adding === album.spotifyId}
                className="shrink-0 rounded-sm bg-royal-green/10 px-3 py-1.5 text-xs font-medium text-royal-green transition-colors hover:bg-royal-green/20 disabled:opacity-50"
              >
                {adding === album.spotifyId ? t("common.adding") : t("common.add")}
              </button>
            </div>
          ))}
        </div>
      )}

      {!searching && results.length === 0 && query && (
        <p className="mt-4 text-center text-xs text-warm-gray/60">
          {t("music.no_results")}
        </p>
      )}
    </div>
  );
}
