"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { vi } from "./dictionaries/vi";
import { en } from "./dictionaries/en";
import type { Dictionary, Locale } from "./types";

const STORAGE_KEY = "easybus-locale";

const DICTIONARIES: Record<Locale, Dictionary> = { vi, en };

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("vi");

  useEffect(() => {
    function syncFromStorage() {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "vi" || stored === "en") setLocaleState(stored);
    }
    syncFromStorage();
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: DICTIONARIES[locale],
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return { locale: ctx.locale, setLocale: ctx.setLocale };
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useTranslation must be used within LocaleProvider");
  return ctx.t;
}
