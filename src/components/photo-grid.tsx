"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import type { Photo } from "@/data/photos";

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  ariaClose,
  ariaPrev,
  ariaNext,
  isAdmin,
  onDelete,
}: {
  photo: Photo;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  ariaClose: string;
  ariaPrev: string;
  ariaNext: string;
  isAdmin?: boolean;
  onDelete?: () => void;
}) {
  const { t } = useLanguage();
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-cream/60 transition-colors hover:text-cream"
        aria-label={ariaClose}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Admin delete */}
      {isAdmin && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-6 left-6 z-10 rounded-sm bg-burgundy/80 px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-burgundy"
        >
          {t("common.remove")}
        </button>
      )}

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 z-10 rounded-full p-2 text-cream/40 transition-colors hover:text-cream sm:left-8"
        aria-label={ariaPrev}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 z-10 rounded-full p-2 text-cream/40 transition-colors hover:text-cream sm:right-8"
        aria-label={ariaNext}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.orientation === "horizontal" ? 1920 : 1200}
          height={photo.orientation === "horizontal" ? 1280 : 1920}
          className="h-auto max-h-[90vh] w-auto rounded-sm object-contain"
          quality={95}
          priority
          sizes="90vw"
        />
        {photo.alt && (
          <p className="mt-4 text-center text-sm text-cream/50">{photo.alt}</p>
        )}
      </div>
    </div>
  );
}

export default function PhotoGrid({
  photos,
  isAdmin,
  token,
  onDeleted,
}: {
  photos: Photo[];
  isAdmin?: boolean;
  token?: string | null;
  onDeleted?: (id: string) => void;
}) {
  const { t } = useLanguage();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  // Build filter options from collections
  const collections = [...new Set(photos.map((p) => p.collection).filter(Boolean))];
  const filterOptions: string[] = ["all", ...collections.map((c) => c!)];

  const filtered = filter === "all"
    ? photos
    : photos.filter((p) => p.collection === filter);

  const selected = selectedIdx !== null ? filtered[selectedIdx] : null;

  const handlePrev = useCallback(() => {
    setSelectedIdx((i) => (i !== null && i > 0 ? i - 1 : filtered.length - 1));
  }, [filtered.length]);

  const handleNext = useCallback(() => {
    setSelectedIdx((i) => (i !== null && i < filtered.length - 1 ? i + 1 : 0));
  }, [filtered.length]);

  const handleDelete = useCallback(async () => {
    if (!selected || !token || !onDeleted) return;
    if (!confirm(t("photography.confirm_remove"))) return;

    const res = await fetch("/api/photos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: selected.id }),
    });

    if (res.ok) {
      onDeleted(selected.id);
      setSelectedIdx(null);
    }
  }, [selected, token, onDeleted, t]);

  return (
    <>
      {/* Filter tabs */}
      {filterOptions.length > 1 && (
        <div className="mb-12 flex flex-wrap items-center gap-3">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setSelectedIdx(null); }}
              className={`rounded-sm px-4 py-1.5 text-xs font-medium tracking-wide transition-colors ${
                filter === f
                  ? "bg-royal-green text-cream"
                  : "bg-cream-dark text-charcoal-light hover:text-charcoal"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid — 2 columns on desktop for generous sizing */}
      <div className="columns-1 gap-5 sm:columns-2">
        {filtered.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIdx(i)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-sm focus:outline-none"
          >
            <div className="relative overflow-hidden bg-cream-dark">
              <Image
                src={photo.thumb}
                alt={photo.alt}
                width={photo.orientation === "horizontal" ? 1200 : 800}
                height={photo.orientation === "horizontal" ? 800 : 1200}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                unoptimized
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-charcoal/0 transition-colors duration-500 group-hover:bg-charcoal/5" />
            </div>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p className="py-20 text-center text-sm text-warm-gray">
          {t("common.no_photos")}
        </p>
      )}

      {/* Lightbox with navigation */}
      {selected && (
        <Lightbox
          photo={selected}
          onClose={() => setSelectedIdx(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          ariaClose={t("a11y.close")}
          ariaPrev={t("a11y.prev_photo")}
          ariaNext={t("a11y.next_photo")}
          isAdmin={isAdmin}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
