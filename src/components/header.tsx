"use client";

import Link from "next/link";
import { useState } from "react";
import AdminLogin from "@/components/admin-login";
import { useLanguage } from "@/components/language-provider";
import type { TranslationKey } from "@/lib/i18n";

const navItems: { key: TranslationKey; href: string }[] = [
  { key: "nav.photography", href: "/photography" },
  { key: "nav.videos", href: "/videos" },
  { key: "nav.reviews", href: "/reviews" },
  { key: "nav.music", href: "/music" },
  { key: "nav.fits", href: "/fits" },
  { key: "nav.projects", href: "/projects" },
  { key: "nav.culinary", href: "/culinary" },
  { key: "nav.arts", href: "/arts" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-charcoal/5">
      {/* Thin accent gradient bar at very top */}
      <div className="accent-top-bar h-[2px] w-full" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo / Name — double-click to open admin login */}
        <AdminLogin />

        {/* Desktop nav + language toggle */}
        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm font-medium tracking-wide text-charcoal-light transition-colors hover:text-royal-green"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Language toggle */}
          <button
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="ml-2 rounded-sm border border-charcoal/10 px-2.5 py-1 text-xs font-medium tracking-wide text-charcoal-light transition-colors hover:border-royal-green/30 hover:text-royal-green"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
        </div>

        {/* Mobile: language toggle + menu button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setLocale(locale === "en" ? "zh" : "en")}
            className="rounded-sm border border-charcoal/10 px-2 py-0.5 text-xs font-medium text-charcoal-light transition-colors hover:text-royal-green"
          >
            {locale === "en" ? "中文" : "EN"}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5"
            aria-label={t("a11y.toggle_menu")}
          >
            <span
              className={`block h-px w-6 bg-charcoal transition-all duration-300 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-charcoal transition-all duration-300 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-charcoal/5 bg-cream px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium tracking-wide text-charcoal-light transition-colors hover:text-royal-green"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
