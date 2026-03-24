import Link from "next/link";

const sections = [
  {
    title: "Photography",
    description: "Moments captured through the lens — street, portrait, and landscape.",
    href: "/photography",
    accent: "royal-green",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
  {
    title: "Videos",
    description: "Moving images — short films, edits, and visual experiments.",
    href: "/videos",
    accent: "burgundy",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    title: "Movie Reviews",
    description: "Thoughts on cinema — what I watched, what stayed with me.",
    href: "/reviews",
    accent: "purple",
    accentBorder: "border-purple/20",
    accentText: "text-purple",
    accentHover: "group-hover:bg-purple",
  },
  {
    title: "Music",
    description: "What I listen to — playlists, albums, and sonic textures.",
    href: "/music",
    accent: "royal-green",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
  {
    title: "Fits",
    description: "Personal style documented — outfits and wardrobe notes.",
    href: "/fits",
    accent: "burgundy",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    title: "Projects",
    description: "Things I've built — code, tools, and technical explorations.",
    href: "/projects",
    accent: "purple",
    accentBorder: "border-purple/20",
    accentText: "text-purple",
    accentHover: "group-hover:bg-purple",
  },
  {
    title: "Culinary",
    description: "Dishes I make — recipes, plating, and kitchen experiments.",
    href: "/culinary",
    accent: "burgundy",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    title: "Arts",
    description: "Paintings, sketches, and visual work by hand.",
    href: "/arts",
    accent: "royal-green",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pt-32 pb-20">
        <p className="mb-4 text-sm font-medium tracking-widest text-warm-gray uppercase">
          Personal Archive
        </p>
        <h1 className="max-w-2xl font-serif text-5xl font-light leading-tight tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
          A quiet place for
          <br />
          <span className="text-royal-green">things I care about.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal-light">
          Photography, film, music, style, cooking, art, and code — collected
          in one place. Not for sale, just for keeping.
        </p>
      </section>

      {/* Divider */}
      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-charcoal/8" />
      </div>

      {/* Sections grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className={`group flex flex-col justify-between rounded-sm border ${section.accentBorder} bg-cream-dark/50 p-8 transition-all duration-300 hover:bg-cream-dark`}
            >
              <div>
                {/* Accent bar */}
                <div
                  className={`mb-6 h-px w-8 bg-charcoal/15 transition-all duration-300 ${section.accentHover}`}
                />
                <h2
                  className={`font-serif text-2xl font-medium tracking-tight text-charcoal transition-colors duration-300 group-hover:${section.accentText}`}
                >
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {section.description}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <span className={`text-xs font-medium tracking-wide ${section.accentText}`}>
                  Explore
                </span>
                <span
                  className={`text-xs ${section.accentText} transition-transform duration-300 group-hover:translate-x-1`}
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
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
