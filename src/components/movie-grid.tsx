"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import type { Movie } from "@/data/movies";
import { useAdmin } from "@/components/admin-provider";
import MovieModal from "@/components/movie-modal";
import MovieSearch from "@/components/movie-search";

function MovieCard({ movie, onClick, priority }: { movie: Movie; onClick: () => void; priority?: boolean }) {
  return (
    <button onClick={onClick} className="group flex flex-col text-left focus:outline-none">
      {/* Poster with hover overlay */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-sm bg-cream-dark">
        <Image
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
        />

        {/* Hover overlay with details */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="text-xs font-medium tracking-wide text-cream/70">
            {movie.year}
          </p>
          <p className="mt-1 text-sm font-medium text-cream">
            {movie.director}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-cream/60">
            {movie.cast.slice(0, 3).join(", ")}
          </p>
        </div>
      </div>

      {/* Title below poster */}
      <h3 className="mt-3 font-serif text-sm font-medium leading-snug tracking-tight text-charcoal transition-colors duration-300 group-hover:text-purple">
        {movie.originalTitle}
      </h3>
    </button>
  );
}

export default function MovieGrid({ initialMovies }: { initialMovies: Movie[] }) {
  const { isAdmin } = useAdmin();
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Fetch latest from R2 on mount (in case catalog was updated)
  useEffect(() => {
    fetch("/api/movies")
      .then((r) => r.json())
      .then((data) => {
        if (data.movies?.length > 0) {
          setMovies(data.movies);
        }
      })
      .finally(() => setLoaded(true));
  }, []);

  const handleMovieAdded = useCallback((movie: Movie) => {
    setMovies((prev) => [...prev, movie]);
  }, []);

  const handleMovieRemoved = useCallback((movie: Movie) => {
    setMovies((prev) =>
      prev.filter((m) => !(m.title === movie.title && m.year === movie.year))
    );
    setSelected(null);
  }, []);

  return (
    <>
      {/* Admin search */}
      {isAdmin && <div className="mb-8"><MovieSearch onAdded={handleMovieAdded} /></div>}

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((movie, i) => (
            <MovieCard
              key={`${movie.title}-${movie.year}`}
              movie={movie}
              onClick={() => setSelected(movie)}
              priority={i < 5}
            />
          ))}
        </div>
      ) : loaded ? (
        <p className="py-20 text-center text-sm text-warm-gray">
          No movies yet.
        </p>
      ) : (
        <p className="py-20 text-center text-sm text-warm-gray">
          Loading...
        </p>
      )}

      {selected && (
        <MovieModal
          movie={selected}
          onClose={() => setSelected(null)}
          onRemove={handleMovieRemoved}
        />
      )}
    </>
  );
}
