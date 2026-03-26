"use client";

import { useState, useEffect, useCallback } from "react";
import PhotoGrid from "@/components/photo-grid";
import PhotoUpload from "@/components/photo-upload";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";
import type { Photo } from "@/data/photos";

export default function PhotographyPage() {
  const { t } = useLanguage();
  const { isAdmin, token } = useAdmin();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos");
      if (res.ok) {
        const data = await res.json();
        setPhotos(data.photos ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleAdded = useCallback((added: Photo[]) => {
    setPhotos((prev) => [...prev, ...added]);
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <main className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-royal-green uppercase">
          {t("photography.label")}
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-charcoal sm:text-5xl">
          {t("photography.heading")}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-light">
          {t("photography.description")}
        </p>

        {/* Admin upload */}
        {isAdmin && (
          <div className="mt-8">
            <PhotoUpload onAdded={handleAdded} />
          </div>
        )}
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-royal-green/15" />
      </div>

      {/* Photo grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        {loading ? (
          <p className="py-20 text-center text-sm text-warm-gray">{t("common.loading")}</p>
        ) : (
          <PhotoGrid photos={photos} isAdmin={isAdmin} token={token} onDeleted={handleDeleted} />
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal/5 bg-cream-dark/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="font-serif text-sm text-royal-green/60">{t("home.footer.name")}</p>
          <p className="text-xs text-warm-gray/60">{t("home.footer.tagline")}</p>
        </div>
      </footer>
    </main>
  );
}
