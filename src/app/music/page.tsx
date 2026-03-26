import AlbumGrid from "@/components/album-grid";

export const metadata = {
  title: "Music — K. Wang",
  description: "Albums and sounds that shape my taste.",
};

export const dynamic = "force-dynamic";

export default function MusicPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-burgundy uppercase">
          Music
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-charcoal sm:text-5xl">
          What I listen to.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-light">
          Albums that defined a moment, a mood, or just stayed on repeat.
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-burgundy/15" />
      </div>

      {/* Album grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <AlbumGrid />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal/5 bg-cream-dark/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="font-serif text-sm text-burgundy/60">K. Wang</p>
          <p className="text-xs text-warm-gray/60">A personal collection.</p>
        </div>
      </footer>
    </main>
  );
}
