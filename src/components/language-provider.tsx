"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale, TranslationKey } from "@/lib/i18n";
import { t as translate } from "@/lib/i18n";

type LanguageCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, ...args: string[]) => string;
};

const LanguageContext = createContext<LanguageCtx>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "zh") {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey, ...args: string[]) => translate(key, locale, ...args),
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
