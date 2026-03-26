"use client";

import Link from "next/link";
import { useState } from "react";
import AdminLogin from "@/components/admin-login";

const navItems = [
  { label: "Photography", href: "/photography" },
  { label: "Videos", href: "/videos" },
  { label: "Reviews", href: "/reviews" },
  { label: "Music", href: "/music" },
  { label: "Fits", href: "/fits" },
  { label: "Projects", href: "/projects" },
  { label: "Culinary", href: "/culinary" },
  { label: "Arts", href: "/arts" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-charcoal/5">
      {/* Thin accent gradient bar at very top */}
      <div className="accent-top-bar h-[2px] w-full" />
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo / Name — double-click to open admin login */}
        <AdminLogin />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-medium tracking-wide text-charcoal-light transition-colors hover:text-royal-green"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
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
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
