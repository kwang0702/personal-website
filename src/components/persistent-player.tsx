"use client";

import Image from "next/image";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "@/components/admin-provider";
import { useMusicPlayer } from "@/components/music-player-provider";
import { useLanguage } from "@/components/language-provider";

export default function PersistentPlayer() {
  const { current, isMinimized, isModalOpen, minimize, expand, stop } = useMusicPlayer();
  const { isAdmin, token } = useAdmin();
  const { t } = useLanguage();
  const [removing, setRemoving] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isModalOpen]);

  // Escape key → minimize (not stop)
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") minimize();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isModalOpen, minimize]);

  const handleRemove = useCallback(async () => {
    if (!current) return;
    if (!confirm(t("music.confirm_remove", current.title))) return;
    setRemoving(true);
    const res = await fetch("/api/music", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ spotifyId: current.spotifyId }),
    });
    if (res.ok) {
      stop();
      window.location.reload();
    }
    setRemoving(false);
  }, [current, token, stop]);

  if (!current || !mounted) return null;

  const isVisible = isModalOpen || isMinimized;
  if (!isVisible) return null;

  const embedUrl = `https://open.spotify.com/embed/${current.type === "track" ? "track" : "album"}/${current.spotifyId}?utm_source=generator&theme=0`;

  // The iframe is ALWAYS rendered inside this component, we just change the wrapper styling
  const iframeElement = (
    <iframe
      ref={iframeRef}
      src={embedUrl}
      width="100%"
      height={isMinimized ? (current.type === "track" ? 80 : 152) : (current.type === "track" ? 152 : 352)}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className={isModalOpen ? "rounded-lg" : ""}
      style={{ border: 0 }}
    />
  );

  return createPortal(
    <>
      {/* Backdrop — only in modal mode */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-charcoal/80 backdrop-blur-sm"
          onClick={minimize}
        />
      )}

      {/* Container — morphs between modal and mini */}
      <div
        className={
          isModalOpen
            ? "fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
            : "fixed bottom-6 right-6 z-[61]"
        }
      >
        <div
          className={
            isModalOpen
              ? "relative flex w-full max-w-2xl flex-col overflow-hidden rounded-sm bg-cream shadow-2xl pointer-events-auto"
              : "flex w-80 flex-col overflow-hidden rounded-sm bg-cream shadow-2xl ring-1 ring-charcoal/10"
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header — different layout for modal vs mini */}
          {isModalOpen ? (
            <div className="flex items-start justify-between border-b border-royal-green/10 px-6 py-5">
              <div className="min-w-0">
                <h2 className="font-serif text-2xl font-medium tracking-tight text-charcoal">
                  {current.title}
                </h2>
                <p className="mt-1 text-sm text-warm-gray">
                  {current.artist} · {current.year}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                {isAdmin && (
                  <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="rounded-sm bg-burgundy/10 px-3 py-1.5 text-xs font-medium text-burgundy transition-colors hover:bg-burgundy/20 disabled:opacity-50"
                  >
                    {removing ? t("common.removing") : t("common.remove")}
                  </button>
                )}
                <button
                  onClick={minimize}
                  className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-royal-green"
                  aria-label={t("a11y.minimize_player")}
                  title={t("player.minimize")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                </button>
                <button
                  onClick={stop}
                  className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-charcoal"
                  aria-label={t("a11y.close_stop")}
                  title={t("player.close_stop")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                <Image
                  src={current.coverUrl}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-xs font-medium text-charcoal">
                  {current.title}
                </p>
                <p className="truncate text-[10px] text-warm-gray">
                  {current.artist}
                </p>
              </div>
              <button
                onClick={expand}
                className="shrink-0 rounded-sm p-1.5 text-charcoal-light transition-colors hover:text-charcoal"
                aria-label={t("a11y.expand_player")}
                title={t("player.expand")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </button>
              <button
                onClick={stop}
                className="shrink-0 rounded-sm p-1.5 text-charcoal-light transition-colors hover:text-charcoal"
                aria-label={t("a11y.stop_music")}
                title={t("player.close")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Spotify embed — single instance, never unmounted */}
          <div className={isModalOpen ? "p-6" : "border-t border-charcoal/5"}>
            {iframeElement}
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
