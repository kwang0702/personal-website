"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { useAdmin } from "@/components/admin-provider";
import type { FitPhoto } from "@/lib/r2-server";

const SLIDE_DURATION = 1800; // ms per photo
const TRANSITION_DURATION = 600; // crossfade ms

export default function FitRunway() {
  const { t, locale } = useLanguage();
  const { token } = useAdmin();
  const [fits, setFits] = useState<FitPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Fetch fits
  const fetchFits = useCallback(() => {
    fetch("/api/fits")
      .then((r) => r.json())
      .then((data) => {
        setFits(data.fits ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFits();
  }, [fetchFits]);

  // Auto-advance slideshow
  useEffect(() => {
    if (paused || fits.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % fits.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timerRef.current);
  }, [paused, fits.length]);

  // Keep current in bounds when fits change
  useEffect(() => {
    if (fits.length > 0 && current >= fits.length) {
      setCurrent(0);
    }
  }, [fits.length, current]);

  // Upload handler
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;
    setUploading(true);

    // Upload in batches of 5
    const batch = 5;
    for (let i = 0; i < files.length; i += batch) {
      const formData = new FormData();
      const slice = Array.from(files).slice(i, i + batch);
      slice.forEach((f) => formData.append("files", f));
      await fetch("/api/fits", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
    }

    if (fileRef.current) fileRef.current.value = "";
    setUploading(false);
    fetchFits();
  };

  // Remove handler
  const handleRemove = async (id: string) => {
    if (!token) return;
    const confirmed = window.confirm(
      locale === "zh"
        ? "确定移除这张穿搭照片吗？"
        : "Remove this fit photo?"
    );
    if (!confirmed) return;

    setRemoving(id);
    await fetch("/api/fits", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    setRemoving(null);
    fetchFits();
  };

  const goTo = (idx: number) => {
    setCurrent(idx);
    // Reset timer so it doesn't jump immediately
    clearInterval(timerRef.current);
    if (!paused && fits.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % fits.length);
      }, SLIDE_DURATION);
    }
  };

  const goPrev = () => goTo((current - 1 + fits.length) % fits.length);
  const goNext = () => goTo((current + 1) % fits.length);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="aspect-[3/4] w-full max-w-md animate-pulse rounded-sm bg-charcoal/5" />
      </div>
    );
  }

  // ── Empty state ──
  if (fits.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <p className="text-sm text-warm-gray">
          {t("fits.no_fits")}
        </p>
        {token && (
          <label className="cursor-pointer rounded-sm border border-burgundy/20 px-4 py-2 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy/5">
            {t("fits.upload")}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10">
      {/* ── Runway Display ── */}
      <div
        className="relative w-full max-w-md"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Main photo stage */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-charcoal/3">
          {fits.map((fit, i) => (
            <div
              key={fit.id}
              className="absolute inset-0"
              style={{
                opacity: i === current ? 1 : 0,
                transition: `opacity ${TRANSITION_DURATION}ms ease-in-out`,
                zIndex: i === current ? 1 : 0,
              }}
            >
              <Image
                src={fit.src}
                alt={fit.alt || `Fit ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 448px"
                priority={i === 0}
                unoptimized
              />
            </div>
          ))}

          {/* Gradient overlays for depth */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/10 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Counter badge */}
          <div className="absolute top-4 right-4 z-20 rounded-sm bg-black/40 px-2.5 py-1 text-xs font-medium tracking-wider text-white/90 backdrop-blur-sm">
            {current + 1} / {fits.length}
          </div>

          {/* Pause indicator */}
          {paused && fits.length > 1 && (
            <div className="absolute top-4 left-4 z-20 rounded-sm bg-black/40 px-2 py-1 backdrop-blur-sm">
              <svg className="h-3 w-3 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            </div>
          )}

          {/* Nav arrows (visible on hover) */}
          {fits.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50 group-hover:opacity-100"
                style={{ opacity: paused ? 1 : 0 }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/80 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/50"
                style={{ opacity: paused ? 1 : 0 }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Admin remove button */}
          {token && paused && (
            <button
              onClick={() => fits[current] && handleRemove(fits[current].id)}
              disabled={removing === fits[current]?.id}
              className="absolute bottom-4 right-4 z-20 rounded-sm bg-red-900/70 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-red-800/80 disabled:opacity-50"
            >
              {removing === fits[current]?.id ? t("common.removing") : t("common.remove")}
            </button>
          )}
        </div>

        {/* Progress bar */}
        {fits.length > 1 && (
          <div className="mt-3 flex gap-1">
            {fits.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-charcoal/8"
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-burgundy/60 transition-all"
                  style={{
                    width: i === current ? "100%" : i < current ? "100%" : "0%",
                    opacity: i === current ? 1 : i < current ? 0.3 : 0,
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Thumbnail strip ── */}
      {fits.length > 1 && (
        <div className="w-full max-w-2xl overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {fits.map((fit, i) => (
              <button
                key={fit.id}
                onClick={() => goTo(i)}
                className={`group relative flex-shrink-0 overflow-hidden rounded-sm transition-all duration-300 ${
                  i === current
                    ? "ring-2 ring-burgundy/40 ring-offset-2 ring-offset-cream"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={fit.thumb}
                  alt={fit.alt || `Fit ${i + 1}`}
                  width={64}
                  height={85}
                  className="h-[85px] w-16 object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Admin upload ── */}
      {token && (
        <label
          className={`cursor-pointer rounded-sm border border-burgundy/20 px-5 py-2.5 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy/5 ${
            uploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {uploading ? t("photography.uploading") : t("fits.upload")}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
