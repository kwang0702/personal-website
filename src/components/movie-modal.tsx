"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";
import type { Movie } from "@/data/movies";

function slugify(title: string, year: number) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${year}`;
}

export default function MovieModal({
  movie,
  onClose,
  onRemove,
}: {
  movie: Movie;
  onClose: () => void;
  onRemove?: (movie: Movie) => void;
}) {
  const { isAdmin, token } = useAdmin();
  const { t } = useLanguage();
  const [review, setReview] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const slug = slugify(movie.title, movie.year);

  // Fetch existing review
  useEffect(() => {
    fetch(`/api/reviews/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setReview(data.review || "");
        setDraft(data.review || "");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const res = await fetch(`/api/reviews/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: draft }),
    });
    if (res.ok) {
      setReview(draft);
      setEditing(false);
    }
    setSaving(false);
  }, [slug, token, draft]);

  const handleRemove = useCallback(async () => {
    if (!confirm(t("movie.confirm_remove", movie.title))) return;
    setRemoving(true);
    const res = await fetch("/api/movies", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: movie.title, year: movie.year }),
    });
    if (res.ok) {
      onRemove?.(movie);
      onClose();
    }
    setRemoving(false);
  }, [movie, token, onRemove, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-4xl h-[80vh] overflow-hidden rounded-sm bg-cream shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side — poster with padding */}
        <div className="hidden sm:flex sm:w-80 shrink-0 bg-charcoal/5 items-center justify-center p-6">
          <div className="relative aspect-[2/3] h-full w-full">
            <Image
              src={movie.posterUrl}
              alt={`${movie.title} poster`}
              fill
              className="rounded-sm object-contain"
              sizes="320px"
              priority
            />
          </div>
        </div>

        {/* Right side — details & review */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Header bar */}
          <div className="flex items-start justify-between border-b border-charcoal/8 px-6 py-5">
            <div className="min-w-0">
              <h2 className="font-serif text-2xl font-medium tracking-tight text-charcoal">
                {movie.originalTitle}
              </h2>
              {movie.originalTitle !== movie.title && (
                <p className="mt-1 text-sm text-charcoal-light">{movie.title}</p>
              )}
              <p className="mt-2 text-xs text-warm-gray">
                {movie.year} · {movie.director}
              </p>
              <p className="mt-0.5 text-xs text-warm-gray/70">
                {movie.cast.slice(0, 3).join(", ")}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              {isAdmin && !editing && (
                <>
                  <button
                    onClick={() => {
                      setDraft(review);
                      setEditing(true);
                    }}
                    className="rounded-sm bg-royal-green/10 px-3 py-1.5 text-xs font-medium text-royal-green transition-colors hover:bg-royal-green/20"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="rounded-sm bg-burgundy/10 px-3 py-1.5 text-xs font-medium text-burgundy transition-colors hover:bg-burgundy/20 disabled:opacity-50"
                  >
                    {removing ? t("common.removing") : t("common.remove")}
                  </button>
                </>
              )}
              {isAdmin && editing && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-sm bg-royal-green px-3 py-1.5 text-xs font-medium text-cream transition-colors hover:bg-royal-green/90 disabled:opacity-50"
                >
                  {saving ? t("common.saving") : t("common.save")}
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-charcoal"
                aria-label={t("a11y.close")}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Review content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <p className="text-sm text-warm-gray">{t("common.loading")}</p>
            ) : editing ? (
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t("movie.review_placeholder")}
                className="h-full w-full resize-none bg-transparent font-serif text-sm leading-relaxed text-charcoal placeholder:text-warm-gray/50 focus:outline-none"
                autoFocus
              />
            ) : review ? (
              <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-charcoal">
                {review}
              </div>
            ) : (
              <p className="text-sm italic text-warm-gray/60">
                {t("movie.no_review")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
