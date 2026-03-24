import PhotoGrid from "@/components/photo-grid";
import { photos } from "@/data/photos";

export const metadata = {
  title: "Photography — K. Wang",
  description: "Moments captured through the lens.",
};

export default function PhotographyPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-warm-gray uppercase">
          Photography
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-charcoal sm:text-5xl">
          Through the lens.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-light">
          Street, portrait, and landscape — moments I wanted to keep.
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-charcoal/8" />
      </div>

      {/* Photo grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <PhotoGrid photos={photos} />
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
