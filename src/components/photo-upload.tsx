"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";
import type { Photo } from "@/data/photos";

export default function PhotoUpload({
  onAdded,
}: {
  onAdded: (photos: Photo[]) => void;
}) {
  const { token } = useAdmin();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [collection, setCollection] = useState("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [newCollection, setNewCollection] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [alts, setAlts] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch collections when opened
  useEffect(() => {
    if (!open) return;
    fetch("/api/photos/collections")
      .then((r) => r.json())
      .then((data) => {
        setCollections(data.collections ?? []);
        if (data.collections?.length && !collection) {
          setCollection(data.collections[0]);
        }
      })
      .catch(() => {});
  }, [open]);

  // Generate previews when files change
  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    setAlts(files.map(() => ""));
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setFiles(selected);
  }, []);

  const updateAlt = useCallback((index: number, value: string) => {
    setAlts((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const handleUpload = useCallback(async () => {
    const col = isNewCollection ? newCollection.trim().toLowerCase().replace(/\s+/g, "-") : collection;
    if (!col || files.length === 0) return;

    setUploading(true);
    setProgress(`0 / ${files.length}`);

    // Upload in batches of 5 to avoid timeout
    const batchSize = 5;
    const allAdded: Photo[] = [];

    for (let start = 0; start < files.length; start += batchSize) {
      const batch = files.slice(start, start + batchSize);
      const batchAlts = alts.slice(start, start + batchSize);

      const formData = new FormData();
      formData.append("collection", col);
      batch.forEach((f) => formData.append("files", f));
      formData.append("alts", JSON.stringify(batchAlts));

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        allAdded.push(...(data.added ?? []));
        setProgress(`${Math.min(start + batchSize, files.length)} / ${files.length}`);
      } else {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        setProgress(err.error || "Upload failed");
        setUploading(false);
        return;
      }
    }

    onAdded(allAdded);
    setUploading(false);
    setFiles([]);
    setPreviews([]);
    setAlts([]);
    setProgress("");
    setOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [files, alts, collection, newCollection, isNewCollection, token, onAdded]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setFiles([]);
    setPreviews([]);
    setAlts([]);
    setProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-sm border border-dashed border-charcoal/20 px-4 py-2.5 text-sm text-warm-gray transition-colors hover:border-royal-green/40 hover:text-royal-green"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {t("photography.add_button")}
      </button>
    );
  }

  const activeCollection = isNewCollection
    ? newCollection.trim().toLowerCase().replace(/\s+/g, "-")
    : collection;

  return (
    <div className="rounded-sm border border-charcoal/10 bg-cream-dark/30 p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-lg font-medium text-charcoal">
          {t("photography.upload_title")}
        </h3>
        <button
          onClick={handleClose}
          className="rounded-sm p-1 text-charcoal-light transition-colors hover:text-charcoal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Collection selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium tracking-wide text-charcoal-light">
          {t("photography.collection")}
        </label>
        <div className="flex items-center gap-2">
          {!isNewCollection ? (
            <>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="flex-1 rounded-sm border border-charcoal/10 bg-cream px-3 py-2 text-sm text-charcoal focus:border-royal-green/30 focus:outline-none"
              >
                {collections.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsNewCollection(true)}
                className="shrink-0 rounded-sm border border-charcoal/10 px-3 py-2 text-xs font-medium text-warm-gray transition-colors hover:border-royal-green/30 hover:text-royal-green"
              >
                + {t("photography.new_collection")}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
                placeholder={t("photography.collection_placeholder")}
                className="flex-1 rounded-sm border border-charcoal/10 bg-cream px-3 py-2 text-sm text-charcoal placeholder:text-warm-gray/50 focus:border-royal-green/30 focus:outline-none"
                autoFocus
              />
              {collections.length > 0 && (
                <button
                  onClick={() => setIsNewCollection(false)}
                  className="shrink-0 rounded-sm border border-charcoal/10 px-3 py-2 text-xs font-medium text-warm-gray transition-colors hover:text-charcoal"
                >
                  {t("common.cancel")}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* File picker */}
      <div className="mb-4">
        <label
          className="flex cursor-pointer flex-col items-center gap-2 rounded-sm border border-dashed border-charcoal/15 p-6 text-center transition-colors hover:border-royal-green/30"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-warm-gray">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span className="text-sm text-warm-gray">
            {files.length > 0
              ? t("photography.files_selected", String(files.length))
              : t("photography.select_files")}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Preview grid with alt text inputs */}
      {previews.length > 0 && (
        <div className="mb-4 max-h-80 overflow-y-auto space-y-3 pr-1">
          {previews.map((url, i) => (
            <div key={url} className="flex items-start gap-3 rounded-sm border border-charcoal/5 bg-cream p-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                <Image
                  src={url}
                  alt={`Preview ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-1 truncate text-xs text-warm-gray">
                  {files[i]?.name}
                </p>
                <input
                  type="text"
                  value={alts[i] ?? ""}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder={t("photography.alt_placeholder")}
                  className="w-full rounded-sm border border-charcoal/10 bg-transparent px-2 py-1.5 text-xs text-charcoal placeholder:text-warm-gray/40 focus:border-royal-green/30 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={uploading || !activeCollection}
          className="w-full rounded-sm bg-royal-green px-4 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-royal-green/90 disabled:opacity-50"
        >
          {uploading
            ? `${t("photography.uploading")} ${progress}`
            : `${t("photography.upload")} (${files.length})`}
        </button>
      )}
    </div>
  );
}
