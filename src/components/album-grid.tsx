"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useMusicPlayer } from "@/components/music-player-provider";
import type { Album } from "@/data/albums";
import AlbumSearch from "@/components/album-search";

function AlbumCard({
  album,
  onClick,
  priority,
}: {
  album: Album;
  onClick: () => void;
  priority?: boolean;
}) {
  return (
    <button onClick={onClick} className="group flex flex-col text-left focus:outline-none">
      <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-cream-dark">
        <Image
          src={album.coverUrl}
          alt={`${album.title} by ${album.artist}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-xs font-medium tracking-wide text-cream/70">
            {album.year}
          </p>
          <p className="mt-1 text-sm font-medium text-cream">
            {album.artist}
          </p>
        </div>
      </div>
      <h3 className="mt-3 font-serif text-sm font-medium leading-snug tracking-tight text-charcoal transition-colors duration-300 group-hover:text-burgundy">
        {album.title}
      </h3>
      <p className="mt-0.5 text-xs text-warm-gray">
        {album.artist}{album.type === "track" ? <span className="text-burgundy/70"> · Single</span> : ""}
      </p>
    </button>
  );
}

export default function AlbumGrid() {
  const { isAdmin } = useAdmin();
  const { openModal } = useMusicPlayer();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then((data) => setAlbums(data.albums ?? []))
      .finally(() => setLoaded(true));
  }, []);

  const handleAlbumAdded = useCallback((album: Album) => {
    setAlbums((prev) => [...prev, album]);
  }, []);

  return (
    <>
      {isAdmin && (
        <div className="mb-8">
          <AlbumSearch onAdded={handleAlbumAdded} />
        </div>
      )}

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {albums.map((album, i) => (
            <AlbumCard
              key={album.spotifyId}
              album={album}
              onClick={() => openModal(album)}
              priority={i < 5}
            />
          ))}
        </div>
      ) : loaded ? (
        <p className="py-20 text-center text-sm text-warm-gray">
          No albums yet.
        </p>
      ) : (
        <p className="py-20 text-center text-sm text-warm-gray">
          Loading...
        </p>
      )}
    </>
  );
}
