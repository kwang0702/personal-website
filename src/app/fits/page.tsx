"use client";

import FitRunway from "@/components/fit-runway";
import { useLanguage } from "@/components/language-provider";

export default function FitsPage() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-burgundy uppercase">
          {t("fits.label")}
        </p>
        <h1 className="max-w-xl font-serif text-4xl font-light leading-tight tracking-tight text-charcoal sm:text-5xl">
          {t("fits.heading")}
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal-light">
          {t("fits.description")}
        </p>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6">
        <hr className="border-burgundy/15" />
      </div>

      {/* Runway showcase */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <FitRunway />
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal/5 bg-cream-dark/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <p className="font-serif text-sm text-burgundy/60">{t("home.footer.name")}</p>
          <p className="text-xs text-warm-gray/60">{t("home.footer.tagline")}</p>
        </div>
      </footer>
    </main>
  );
}
