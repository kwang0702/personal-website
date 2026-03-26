"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

const sections: {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  href: string;
  accentBorder: string;
  accentText: string;
  accentHover: string;
}[] = [
  {
    titleKey: "nav.photography",
    descKey: "home.section.photography",
    href: "/photography",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
  {
    titleKey: "nav.videos",
    descKey: "home.section.videos",
    href: "/videos",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    titleKey: "nav.reviews",
    descKey: "home.section.reviews",
    href: "/reviews",
    accentBorder: "border-purple/20",
    accentText: "text-purple",
    accentHover: "group-hover:bg-purple",
  },
  {
    titleKey: "nav.music",
    descKey: "home.section.music",
    href: "/music",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
  {
    titleKey: "nav.fits",
    descKey: "home.section.fits",
    href: "/fits",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    titleKey: "nav.projects",
    descKey: "home.section.projects",
    href: "/projects",
    accentBorder: "border-purple/20",
    accentText: "text-purple",
    accentHover: "group-hover:bg-purple",
  },
  {
    titleKey: "nav.culinary",
    descKey: "home.section.culinary",
    href: "/culinary",
    accentBorder: "border-burgundy/20",
    accentText: "text-burgundy",
    accentHover: "group-hover:bg-burgundy",
  },
  {
    titleKey: "nav.arts",
    descKey: "home.section.arts",
    href: "/arts",
    accentBorder: "border-royal-green/20",
    accentText: "text-royal-green",
    accentHover: "group-hover:bg-royal-green",
  },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pt-32 pb-20">
        <p className="mb-4 text-sm font-medium tracking-widest text-warm-gray uppercase">
          {t("home.label")}
        </p>
        <h1 className="max-w-2xl font-serif text-5xl font-light leading-tight tracking-tight text-charcoal sm:text-6xl lg:text-7xl">
          {t("home.heading1")}
          <br />
          <span className="text-royal-green">{t("home.heading2")}</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-charcoal-light">
          {t("home.description")}
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
                  {t(section.titleKey)}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">
                  {t(section.descKey)}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2">
                <span className={`text-xs font-medium tracking-wide ${section.accentText}`}>
                  {t("home.explore")}
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
          <p className="font-serif text-sm text-warm-gray">{t("home.footer.name")}</p>
          <p className="text-xs text-warm-gray/60">{t("home.footer.tagline")}</p>
        </div>
      </footer>
    </main>
  );
}
