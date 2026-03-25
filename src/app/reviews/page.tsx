import MovieGrid from "@/components/movie-grid";
import { movies } from "@/data/movies";

export const metadata = {
  title: "Movie Reviews — K. Wang",
  description: "Thoughts on cinema — what I watched, what stayed with me.",
};

export default function ReviewsPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-warm-gray uppercase">
          Movie Reviews
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-charcoal sm:text-5xl">
          What I watched.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-light">
          Films that stayed with me — the ones worth remembering.
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-charcoal/8" />
      </div>

      {/* Movie grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <MovieGrid movies={movies} />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal/5 bg-cream-dark/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="font-serif text-sm text-warm-gray">K. Wang</p>
          <p className="text-xs text-warm-gray/60">A personal collection.</p>
        </div>
      </footer>
    </main>
  );
}
